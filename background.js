var manifest_version = chrome.runtime.getManifest().manifest_version;

function openChatGPTWebpage() {
  chrome.tabs.create({
    url: "https://chat.openai.com/chat",
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    num_web_results: 3,
    web_access: true,
  });
  openChatGPTWebpage();
});

// open chatgpt webpage when extension icon is clicked
if (manifest_version == 2) {
  chrome.browserAction.onClicked.addListener(openChatGPTWebpage);
} else {
  chrome.action.onClicked.addListener(openChatGPTWebpage);
}
