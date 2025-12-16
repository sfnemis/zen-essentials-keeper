# Zen Essentials Keeper

Simple Mod for [Zen Browser](https://zen-browser.app/) that keeps your Essential (Pinned) tabs alive.

### Why?
Zen Browser (like Firefox) automatically unloads tabs to save memory. This is usually great, but annoying for "Essential" tabs like Spotify, WhatsApp, or your Dashboard that you want ready instantly.

This extension locks selected tabs so they **never unload** and **automatically refresh** when you restart the browser.

### Usage
Two ways to use it:

1. **Right Click (Easiest)**: Right-click any Pinned/Essential tab and toggle **"Prevent Unload (Essential)"**.
2. **Popup**: Click the extension icon to manage all your essentials in one list.

### Installation
Currently, you need to load this manually or allow unsigned extensions.

1. Go to `about:config` and set `xpinstall.signatures.required` to `false`.
2. Go to `about:addons` -> **Gear Icon** -> **Install Add-on From File...**
3. Select `zen-essentials-keeper.xpi` from the releases (or build it yourself).

### Build It
```bash
zip -r zen-keeper.xpi . -x "*.git*"
```
