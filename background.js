// background.js

function isProtected(url, list) {
    if (!url || !list) return false;
    return list.includes(url);
}

// Locks a tab in memory and forces a refresh if needed
async function lockTab(tab, forceReload = false) {
    try {
        await browser.tabs.update(tab.id, { autoDiscardable: false });
        // If we're starting up, give it a kick to make sure it loads
        if (forceReload) {
            await browser.tabs.reload(tab.id);
        }
        console.log(`Locked tab ${tab.id} (${tab.title})`);
    } catch (e) {
        console.error("Tab lock failed:", e);
    }
}

async function scanTabs(forceReload = false) {
    const data = await browser.storage.local.get('protectedUrls');
    const urls = data.protectedUrls || [];

    // We only care about pinned tabs since Zen essentials are pinned
    const tabs = await browser.tabs.query({ pinned: true });

    for (const tab of tabs) {
        if (isProtected(tab.url, urls)) {
            lockTab(tab, forceReload);
        }
    }
}

// Setup the context menu
function initMenu() {
    browser.menus.removeAll().then(() => {
        browser.menus.create({
            id: "toggle-lock",
            title: "Prevent Unload (Essential)",
            contexts: ["tab"],
            type: "checkbox",
            checked: false
        });
    });
}

browser.runtime.onInstalled.addListener(initMenu);
browser.runtime.onStartup.addListener(() => {
    initMenu();
    // On browser start, we want to force refresh anything that's protected
    scanTabs(true);
});

// Update menu state when opening context menu
browser.menus.onShown.addListener(async (info, tab) => {
    if (!tab) return;

    const data = await browser.storage.local.get('protectedUrls');
    const urls = data.protectedUrls || [];
    const isActive = isProtected(tab.url, urls);

    browser.menus.update("toggle-lock", { checked: isActive });
    browser.menus.refresh();
});

// Handle menu clicks
browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "toggle-lock") return;

    const shouldLock = info.checked;
    const url = tab.url;

    let data = await browser.storage.local.get('protectedUrls');
    let urls = data.protectedUrls || [];

    if (shouldLock) {
        if (!urls.includes(url)) {
            urls.push(url);
            lockTab(tab, false);
        }
    } else {
        urls = urls.filter(u => u !== url);
        // Release the lock
        browser.tabs.update(tab.id, { autoDiscardable: true });
    }

    await browser.storage.local.set({ protectedUrls: urls });
});

browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'sync') scanTabs(false);
});

// Watch for navigation on pinned tabs to re-apply locks
browser.tabs.onUpdated.addListener(async (id, change, tab) => {
    if (change.status === 'complete' && tab.pinned) {
        const data = await browser.storage.local.get('protectedUrls');
        if (isProtected(tab.url, data.protectedUrls || [])) {
            lockTab(tab, false);
        }
    }
});
