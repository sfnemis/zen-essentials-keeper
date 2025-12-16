# Zen Essentials Keeper

This is a Zen Browser Mod (WebExtension) that gives you control over your "Essential" (Pinned) tabs. It ensures they are:
1.  **Protected from Unloading**: Never discarded from memory when resources are low.
2.  **Force-Loaded on Startup**: Automatically reloaded when you start the browser, so you don't have to wait for them to load.

## How to use
**Method 1: Right-Click (Recommended)**
1.  **Right-click** on any tab (especially your "Essential" tabs).
2.  Click **"Prevent Unload (Essential)"** in the context menu.
3.  **Done!** A checkmark will appear, and the tab is now protected.

**Method 2: Popup Manager**
1.  Click the **Zen Essentials Keeper icon** in the toolbar.
2.  Check/Uncheck boxes to manage multiple tabs at once.

**What happens next?**
*   **Prevent Unload**: These tabs will never be discarded to save memory.
*   **Startup Force-Load**: When you restart Zen Browser, these tabs will automatically reload immediately, so they are ready for you.

## Installation

### Temporary (for testing)
1.  Open Zen Browser.
2.  Go to `about:debugging`.
3.  Click on "This Firefox" (or "This Zen").
4.  Click "Load Temporary Add-on...".
5.  Navigate to this directory and select `manifest.json`.

### Permanent
To install permanently, you would typically need to sign the extension or use a developer edition browser that allows unsigned extensions.
