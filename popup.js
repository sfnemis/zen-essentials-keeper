// popup.js

const list = document.getElementById('tabList');
const statusMsg = document.getElementById('status');

async function render() {
    // Get saved config
    const data = await browser.storage.local.get('protectedUrls');
    const protectedUrls = data.protectedUrls || [];

    // Find our essentials (pinned tabs)
    const tabs = await browser.tabs.query({ pinned: true });

    list.innerHTML = '';
    if (!tabs.length) {
        list.innerHTML = '<div class="empty-state">No pinned tabs found yet.</div>';
        return;
    }

    tabs.forEach(tab => {
        const row = document.createElement('div');
        row.className = 'tab-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'tab-checkbox';
        checkbox.checked = protectedUrls.includes(tab.url);

        checkbox.addEventListener('change', (e) => toggle(tab.url, e.target.checked));

        const info = document.createElement('div');
        info.className = 'tab-info';

        const title = document.createElement('span');
        title.className = 'tab-title';
        title.innerText = tab.title;

        // Just show the domain to keep it clean
        const urlDisplay = document.createElement('span');
        urlDisplay.className = 'tab-url';
        try {
            urlDisplay.innerText = new URL(tab.url).hostname;
        } catch (e) {
            urlDisplay.innerText = tab.url;
        }

        info.append(title, urlDisplay);
        row.append(checkbox, info);
        list.appendChild(row);
    });
}

async function toggle(url, active) {
    let data = await browser.storage.local.get('protectedUrls');
    let urls = data.protectedUrls || [];

    if (active) {
        if (!urls.includes(url)) urls.push(url);
    } else {
        urls = urls.filter(u => u !== url);
    }

    await browser.storage.local.set({ protectedUrls: urls });

    // Let user know it saved
    statusMsg.innerText = 'Saved';
    setTimeout(() => statusMsg.innerText = '', 1000);

    // Sync with background
    browser.runtime.sendMessage({ type: 'sync' });
}

document.addEventListener('DOMContentLoaded', render);
