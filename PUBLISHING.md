# Publishing to Mozilla Add-ons (AMO)

## Prerequisites
- A Firefox Account.

## Steps

1.  **Go to the Developer Hub**
    - Visit [https://addons.mozilla.org/en-US/developers/](https://addons.mozilla.org/en-US/developers/)
    - Log in and click **"Submit a New Add-on"**.

2.  **Select Distribution**
    - Choose **"On this site"**. (This allows everyone to find it on the store).

3.  **Upload the File**
    - Click **"Select a file..."**
    - Upload the `zen-essentials-keeper-amo.zip` file I created in your folder.
    - *Note: Do not upload the .xpi or the source folder. Use the clean zip file.*

4.  **Review & Validation**
    - AMO will automatically check the file for errors.
    - If it passes (which it should), continue.

5.  **Source Code?**
    - Since we have readable code (not minified), you usually select **"No"** when asked "Do you submit source code?".
    - However, if asked, you can just link to your GitHub repo.

6.  **Listing Details**
    - **Name**: Zen Essentials Keeper
    - **Summary**: Prevents essential tabs from unloading and forces them to reload on startup.
    - **Description**: (You can copy the "Why?" section from the README).
    - **Category**: Tabs, Productivity.

7.  **Submit!**
    - Once submitted, it will go into review. It is usually "Pending" for a few minutes to hours.

## Updates
- When you want to update the extension, increment the `version` in `manifest.json`, create a new zip, and upload it as a new version on the same page.
