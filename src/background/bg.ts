import Browser from 'webextension-polyfill'
import { getHtml } from 'src/content-scripts/web_search'
import { getWebpageTitleAndText } from 'src/content-scripts/api'


const manifest_version = Browser.runtime.getManifest().manifest_version


Browser.runtime.onInstalled.addListener(async () => openChatGPTWebpage())

function openChatGPTWebpage() {
    Browser.tabs.create({
        url: "https://chat.openai.com/chat",
    })
}

if (manifest_version == 2) {
    Browser.browserAction.onClicked.addListener(openChatGPTWebpage)
} else {
    Browser.action.onClicked.addListener(openChatGPTWebpage)
}

Browser.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-web-access") {
        Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const tab = tabs[0]
            if (tab.url && tab.id && tab.url.startsWith("https://chat.openai.com/")) {
                Browser.tabs.sendMessage(tab.id, "toggle-web-access")
            }
        })
    }
})

Browser.runtime.onMessage.addListener((request) => {
    if (request === "show_options") {
        Browser.runtime.openOptionsPage()
    }

})

Browser.runtime.onMessage.addListener((message) => {
    if (message.type === "get_search_results") {
        return getHtml(message.search)
    }

    if (message.type === "get_webpage_text") {
        return getWebpageTitleAndText(message.url, message.html)
    }
})
