import Browser from 'webextension-polyfill'


var manifest_version = Browser.runtime.getManifest().manifest_version


Browser.runtime.onInstalled.addListener(async () => {
    Browser.storage.sync.set({
        num_web_results: 3,
        web_access: true,
        region: "wt-wt",
    })
    openChatGPTWebpage()
})

function openChatGPTWebpage() {
    Browser.tabs.create({
        url: "https://chat.openai.com/chat",
    })
}

// open chatgpt webpage when extension icon is clicked
if (manifest_version == 2) {
    Browser.browserAction.onClicked.addListener(openChatGPTWebpage)
} else {
    Browser.action.onClicked.addListener(openChatGPTWebpage)
}
