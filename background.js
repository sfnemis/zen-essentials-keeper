// background.js

// --- Core Helper Functions ---

/**
 * Checks if a URL matches any of the user's protected URLs.
 * @param {string} url 
 * @param {string[]} protectedUrls 
 * @returns {boolean}
 */
function isProtected(url, protectedUrls) {
    if (!url || !protectedUrls) return false;
    return protectedUrls.includes(url);
}

/**
 * Enforces protection on a tab:
 * 1. Sets autoDiscardable to false (prevents unload).
 * 2. Force reloads if the tab is currently discarded (automates startup load).
 * @param {object} tab 
 * @param {boolean} forceLoad - Whether to reload if discarded (e.g. on startup)
 */
async function protectTab(tab, forceLoad = false) {
    try {
        // Prevent unloading
        await browser.tabs.update(tab.id, { autoDiscardable: false });
        console.log(`Protected tab: ${tab.id} - ${tab.url}`);

        // Force load if needed (e.g. on browser startup)
        // User requested explicit "refresh", so we reload even if not discarded.
        if (forceLoad) {
            console.log(`Force refreshing tab: ${tab.id}`);
            await browser.tabs.reload(tab.id);
        }
    } catch (err) {
        console.error(`Failed to protect tab ${tab.id}:`, err);
    }
}

/**
 * Main function to scan all tabs and apply protection based on preferences.
 * @param {boolean} forceLoad - Whether to force reload discarded tabs (true on startup).
 */
async function applyProtection(forceLoad = false) {
    const storage = await browser.storage.local.get('protectedUrls');
    const protectedUrls = storage.protectedUrls || [];

    // We only care about pinned tabs as a proxy for "Essentials"
    const tabs = await browser.tabs.query({ pinned: true });

    for (const tab of tabs) {
        if (isProtected(tab.url, protectedUrls)) {
            protectTab(tab, forceLoad);
        }
    }
}

// --- Event Listeners ---

// 0. Initialize Context Menu (Robust)
function createMenus() {
    browser.menus.removeAll().then(() => {
        browser.menus.create({
            id: "protect-tab",
            title: "Prevent Unload (Essential)",
            contexts: ["tab"],
            type: "checkbox",
            checked: false
        });
        console.log("Context menu (re)created.");
    });
}

browser.runtime.onInstalled.addListener(createMenus);
browser.runtime.onStartup.addListener(createMenus);

// Sync the checkbox state when the menu is shown
browser.menus.onShown.addListener(async (info, tab) => {
    // Note: 'tab' might be the active tab, but 'info.pageUrl' or similar could be reliable.
    // However, onShown gives us info.contexts but potentially not the tab ID if not clicked.
    // Actually, onShown doesn't pass the tab in all browsers reliably for updating the menu *item* specifically for that tab context before click.
    // But for a "tab" context menu, the `tab` parameter is the tab the menu was opened on.

    if (!tab) return; // specific to Firefox/Gecko

    const storage = await browser.storage.local.get('protectedUrls');
    const protectedUrls = storage.protectedUrls || [];
    const isProtectedUrl = isProtected(tab.url, protectedUrls);

    // Update the menu item to match the current tab's state
    browser.menus.update("protect-tab", {
        checked: isProtectedUrl
    });

    // Also refreshing the menu UI needs `browser.menus.refresh()` in some cases, but update usually works.
    browser.menus.refresh();
});


// Handle Context Menu Clicks
browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "protect-tab") {
        const isProtectedNow = info.checked; // The new state after click
        const url_to_toggle = tab.url;

        let storage = await browser.storage.local.get('protectedUrls');
        let protectedUrls = storage.protectedUrls || [];

        if (isProtectedNow) {
            // Add to protection
            if (!protectedUrls.includes(url_to_toggle)) {
                protectedUrls.push(url_to_toggle);
                protectTab(tab, false); // Apply immediate protection
            }
        } else {
            // Remove from protection
            protectedUrls = protectedUrls.filter(u => u !== url_to_toggle);
            // Note: We can't easily "un-protect" (set autoDiscardable back to true) without re-enabling discarding, 
            // but usually we just stop enforcing it. For completeness, let's allow it to be discardable again.
            browser.tabs.update(tab.id, { autoDiscardable: true });
        }

        await browser.storage.local.set({ protectedUrls });
        console.log(`Protection toggled for ${url_to_toggle}: ${isProtectedNow}`);
    }
});

// 1. On Startup: Force load protected tabs
browser.runtime.onStartup.addListener(() => {
    console.log("Extension started (browser startup). Applying protection and force-loading.");
    applyProtection(true);
});

// 3. Listen for checks from the Popup
browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'update_protection') {
        applyProtection(false);
    }
});

// 4. Listen for tab updates (navigation) to re-apply protection if URL matches
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.pinned) {
        const storage = await browser.storage.local.get('protectedUrls');
        const protectedUrls = storage.protectedUrls || [];

        if (isProtected(tab.url, protectedUrls)) {
            protectTab(tab, false);
        }
    }
});
