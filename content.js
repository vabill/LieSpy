// scans all images on the page and checks for AI gen

const images = document.querySelectorAll('img');
console.log(`[AI Detector] Found ${images.length} images on this page`);

images.forEach(img => {
    if (!img.src) return;

    chrome.runtime.sendMessage({ type: 'CHECK_IMAGE', imageUrl: img.src }, result => {
        if (!result) {
            console.warn('[AI Detector] No response for: ', img.src);
            return;
        }

        if (result.error) {
            console.error('[AI Detector] API Error: ', result.error);
            return;
        }

        if (result.isAi) {
            img.style.outline = `8px solid red`;
            img.title = `AI Detected! (${(result.aiScore * 100).toFixed(1)}%)`;
        } else {
            img.style.outline = `8px solid green`;
            img.title = `Real Image! (${(result.aiScore * 100).toFixed(1)}%)`;
        }
    });
});