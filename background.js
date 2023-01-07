var manifest_version = chrome.runtime.getManifest().manifest_version;


async function fetchDefaultPrompt() {
  const defaultPromptURL = chrome.runtime.getURL('data/default_prompt.txt');
  const response = await fetch(defaultPromptURL);
  const defaultPrompt = await response.text();
  return defaultPrompt;
}

chrome.runtime.onInstalled.addListener(async () => {
  const defaultPrompt = await fetchDefaultPrompt();
  chrome.storage.sync.set({
    num_web_results: 3,
    web_access: true,
    prompts: [defaultPrompt],
  });
  openChatGPTWebpage();
  console.log(defaultPrompt);
});

function openChatGPTWebpage() {
  chrome.tabs.create({
    url: "https://chat.openai.com/chat",
  });
}

// open chatgpt webpage when extension icon is clicked
if (manifest_version == 2) {
  chrome.browserAction.onClicked.addListener(openChatGPTWebpage);
} else {
  chrome.action.onClicked.addListener(openChatGPTWebpage);
}
