// handles API calls + keeps detection count synced

// alastyr's codes :D
const userAPI = "1572531113"
const secAPI = "BxhzjHut7oL4SMSo5zoTiB5twNvnUSpC"

// threshold of 80%
const threshold = 0.8;

// listens for image checks from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == 'CHECK_IMAGE') {
        console.log('[Background] Checking Image: ', message.imageUrl);

        checkAI(message.imageUrl)
            .then(async (result) => {

                // updates counter if image is AI
                if (result.isAi) {
                    const stored = await chrome.storage.local.get("count");
                    const current = stored.count ?? 0;

                    const newValue = current + 1;
                    await chrome.storage.local.set ({ count: newValue });

                    console.log("[COUNT UPDATED]", newValue);

                    chrome.runtime.sendMessage({ type: "COUNT_UPDATED", count: newValue });
                }
                sendResponse(result);
            })
            .catch(err => {
                console.error("[Background] Error: ", err);
                sendResponse({ error: err.message });
            });
        return true;
    }

    if (message.type === "resetCount") {
        chrome.storage.local.set({ count: 0 });
        chrome.runtime.sendMessage({ type: "COUNT_UPDATED", count: 0 });
    }
});

// function to call to API
async function checkAI(imageUrl) {
    const apiUrl = 'https://api.sightengine.com/1.0/check.json';
    const params = new URLSearchParams({
        models: 'genai',
        url: imageUrl,
        api_user: userAPI,
        api_secret: secAPI,
    });

    const res = await fetch(`${apiUrl}?${params.toString()}`);
    const data = await res.json();

    console.log('[Background] Raw API Response ', data);
    
    const aiScore = data.type.ai_generated;
    return { imageUrl, aiScore, isAi: aiScore >= threshold};
}