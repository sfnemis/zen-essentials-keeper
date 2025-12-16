// popup.js

const tabList = document.getElementById('tabList');
const status = document.getElementById('status');

// Helper to get domain/url key
function getTabKey(url) {
    // We use the full URL to be specific, but strip hash/query for better stability if needed.
    // For now, let's use the full URL as that's most reliable for "specific page" requirements.
    return url;
}

async function init() {
    // 1. Get currently stored protected URLs
    let storage = await browser.storage.local.get('protectedUrls');
    let protectedUrls = storage.protectedUrls || [];

    // 2. Query all pinned tabs (Assuming Essentials are Pinned)
    let tabs = await browser.tabs.query({ pinned: true });

    if (tabs.length === 0) {
        tabList.innerHTML = '<div class="empty-state">No pinned/essential tabs found.</div>';
        return;
    }

    // 3. Render list
    tabs.forEach(tab => {
        const item = document.createElement('div');
        item.className = 'tab-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'tab-checkbox';

        // Check if currently protected
        if (protectedUrls.includes(tab.url)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', (e) => toggleProtection(tab.url, e.target.checked));

        const info = document.createElement('div');
        info.className = 'tab-info';

        const title = document.createElement('span');
        title.className = 'tab-title';
        title.textContent = tab.title;

        const url = document.createElement('span');
        url.className = 'tab-url';
        url.textContent = tab.url;

        info.appendChild(title);
        info.appendChild(url);
        item.appendChild(checkbox);
        item.appendChild(info);
        tabList.appendChild(item);
    });
}

async function toggleProtection(url, isProtected) {
    let storage = await browser.storage.local.get('protectedUrls');
    let protectedUrls = storage.protectedUrls || [];

    if (isProtected) {
        if (!protectedUrls.includes(url)) {
            protectedUrls.push(url);
        }
    } else {
        protectedUrls = protectedUrls.filter(u => u !== url);
    }

    await browser.storage.local.set({ protectedUrls });

    // Feedback
    status.textContent = 'Saved!';
    setTimeout(() => status.textContent = '', 1500);

    // Notify background to update immediately
    browser.runtime.sendMessage({ type: 'update_protection' });
}

document.addEventListener('DOMContentLoaded', init);
