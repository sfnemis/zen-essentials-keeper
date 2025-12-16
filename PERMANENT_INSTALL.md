# How to Install Permanently (Fix for "Extension Disappears")

The "Temporary Add-on" method is creating the issue where the extension disappears (and thus stops working) when you restart the browser. To fix this, you must install it permanently.

## Step 1: Enable Unsigned Extensions
Since this mod is personal and not signed by Mozilla, you need to tell Zen Browser to allow it.
1.  Open a new tab and go to `about:config`.
2.  Click "Accept the Risk and Continue".
3.  Search for: `xpinstall.signatures.required`.
4.  Double-click it to set it to **false**.

## Step 2: Install the .xpi File
1.  I have created a package file for you: `zen-essentials-keeper.xpi`.
    *   Path: `/mnt/data/SynologyDrive/xCloud/Developments/Dev/zenmod/zen-essentials-keeper.xpi`
2.  In Zen Browser, go to the **Extensions/Add-ons Manager** (`Ctrl+Shift+A` or `about:addons`).
3.  Click the **Gear icon** (Settings) in the top right.
4.  Select **"Install Add-on From File..."**.
5.  Navigate to and select the `zen-essentials-keeper.xpi` file mentioned above.
6.  Click **Add** when prompted.

## Step 3: Verify
1.  Now that it is installed, select your tabs to protect using the **Right-Click** menu.
2.  Restart Zen Browser.
3.  The extension should still be there, and your tabs should auto-load!
