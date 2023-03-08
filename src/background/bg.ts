import Browser from 'webextension-polyfill'
import { getHtml } from 'src/content-scripts/ddg_search'
import { getWebpageTitleAndText } from 'src/content-scripts/api'


const manifest_version = Browser.runtime.getManifest().manifest_version


Browser.runtime.onInstalled.addListener(async () => openChatGPTWebpage())

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
        return getWebpageTitleAndText(message.url)
    }
})

Browser.declarativeNetRequest.updateDynamicRules({
    addRules: [
        {
            id: 1,
            priority: 1,
            action: {
                type: "modifyHeaders",
                requestHeaders: [
                    {
                        header: "Origin",
                        operation: "set",
                        value: "https://html.duckduckgo.com"
                    },
                ],
            },

            condition: {
                urlFilter: "https://html.duckduckgo.com/*",
                resourceTypes: ["xmlhttprequest"],
            },
        },
    ],
    removeRuleIds: [1],
})
