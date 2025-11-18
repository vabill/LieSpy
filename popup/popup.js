// LieSpy Popup Script
// Displays current AI count + allows reset

function updateCount() {
    chrome.storage.local.get("count", data => {
        const val = data.count ?? 0;
        document.getElementById("count").textContent = val;
        console.log("[POPUP] Loaded count:", val);
    });
}

// Load count when popup opens
document.addEventListener("DOMContentLoaded", () => {
    updateCount();
});

// Update display live if new detections occur
chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === "COUNT_UPDATED") {
        document.getElementById("count").textContent = msg.count;
        console.log("[POPUP] Live update:", msg.count);
    }
});

// Rescan button resets count + reloads page
document.getElementById("rescan").addEventListener("click", () => {
    chrome.storage.local.set({ count: 0 });
    updateCount();

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => window.location.reload()
        });
    });
});
