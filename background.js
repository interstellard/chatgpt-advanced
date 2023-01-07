var manifest_version = chrome.runtime.getManifest().manifest_version;

function openChatGPTWebpage() {
  chrome.tabs.create({
    url: "https://chat.openai.com/chat",
  });
}

const default_prompt =
`
Web search results:

{$web_results}


Current date: {$current_date}
Instructions: Using the provided web search results, write a comprehensive reply to the given prompt. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.
Prompt: {$prompt}
`;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    num_web_results: 3,
    web_access: true,
    prompts: [default_prompt],
  });
  openChatGPTWebpage();
});

// open chatgpt webpage when extension icon is clicked
if (manifest_version == 2) {
  chrome.browserAction.onClicked.addListener(openChatGPTWebpage);
} else {
  chrome.action.onClicked.addListener(openChatGPTWebpage);
}
