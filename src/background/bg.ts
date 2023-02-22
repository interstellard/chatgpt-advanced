import Browser from 'webextension-polyfill'

import { Readability } from '@mozilla/readability'
import {parseHTML} from 'linkedom'


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

Browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "get_article_text") {
        const text = getArticleText(request.url)
        console.log("text", text)
        return text
    }
})


const cleanSourceText = (text: string) => {
    return text
        .trim()
        .replace(/(\n){4,}/g, "\n\n\n")
        .replace(/\n\n/g, " ")
        .replace(/ {3,}/g, "  ")
        .replace(/\t/g, "")
        .replace(/\n+(\s*\n)*/g, "\n")
}

async function getArticleText(link: string) {
    const response = await fetch(link)
    // console.log("response", response)

    const html = await response.text()
    const doc = parseHTML(html).document
    const parsed = new Readability(doc).parse()
    console.log("parsed", parsed)

    if (parsed) {
        const sourceText = cleanSourceText(parsed.textContent)

        return { title: parsed.title, text: sourceText }
    }

    return { url: link, text: "Could not parse the page." }
}
