# 🛠 AuDherapy Troubleshooting & PWA Guide

### 1. Visual Symmetry (CSS Layout)
* **The Logic:** This app uses a "Measure Twice, Cut Once" CSS approach. 
* **The Fix:** If a category has an odd number of buttons, the CSS identifies the last item and forces it to span the full width (`grid-column: 1 / -1`). This prevents "hanging" buttons and maintains structural integrity.

### 2. PWA Installation (Vivaldi/Chrome)
* **The Logic:** Browsers require a Secure Context (HTTPS), a Service Worker, and high-res Icons to allow installation.
* **Steps:**
    1. Open DevTools (F12) -> Application -> Storage.
    2. Click **Clear Site Data**.
    3. Perform a **Hard Refresh** (Ctrl + F5).
    4. Click the "Install" icon in the address bar or right-click the Tab and select "Install."

### 3. Linux / Kubuntu Icon Mapping
* **The Issue:** KDE Plasma often defaults to the Vivaldi icon for web apps.
* **The Fix:** * Download the icon locally to `~/.local/share/icons/audherapy.svg`.
    * Create a **Window Rule** in System Settings -> Window Management.
    * Use "Detect Window Properties" on the AuDherapy window and **Force** the Icon and Desktop File Name properties.
    * Run `kbuildsycoca6 --noincremental` to refresh the cache.

### 4. Data Persistence & Privacy
* **The Logic:** All data is stored in your browser's `localStorage`. 
* **Warning:** Clearing "Cookies and Site Data" in your browser settings **will delete your logs.** Export your data regularly if you need a permanent record.
