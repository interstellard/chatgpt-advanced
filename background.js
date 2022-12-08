chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        num_web_results: 3,
        web_access: true,
    });
});

// open chatgpt website when clicking on the extension icon
chrome.action.onClicked.addListener(tab => {
    chrome.tabs.create({
        url: "https://chat.openai.com/chat"
    });
});