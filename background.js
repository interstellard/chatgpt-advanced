chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        num_web_results: 3,
        web_access: true,
    });
});