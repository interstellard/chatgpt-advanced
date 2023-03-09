import { Readability } from "@mozilla/readability"
import { parseHTML } from "linkedom"
import Browser from "webextension-polyfill"
import { SearchResult } from "./ddg_search"


const cleanText = (text: string) =>
    text.trim()
        .replace(/(\n){4,}/g, "\n\n\n")
        // .replace(/\n\n/g, " ")
        .replace(/ {3,}/g, "  ")
        .replace(/\t/g, "")
        .replace(/\n+(\s*\n)*/g, "\n")

export async function getWebpageTitleAndText(url: string, html_str=''): Promise<SearchResult> {

    let html = html_str
    if (html === '') {
        const response = await fetch(url)
        html = await response.text()
    }

    const doc = parseHTML(html).document
    const parsed = new Readability(doc).parse()

    if (!parsed) {
        return { title: "Could not parse the page.", body: "", url }
    }

    const text = cleanText(parsed.textContent)
    return { title: parsed.title, body: text, url }
}

export async function apiExtractText(url: string): Promise<SearchResult[]> {
    const response = await Browser.runtime.sendMessage({
        type: "get_webpage_text",
        url
    })

    return [response]
}