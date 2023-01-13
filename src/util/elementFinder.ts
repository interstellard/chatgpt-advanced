export function getTextArea(): HTMLTextAreaElement {
    return document.querySelector('textarea')
}

export function getFooter(): HTMLElement {
    return document.querySelector("div[class*='absolute bottom-0']")
}

export function getRootElement(): HTMLElement {
    return document.querySelector('div[id="__next"]')
}

export function getWebChatGPTToolbar(): HTMLElement {
    return document.querySelector("div[class*='webchatgpt-toolbar']")
}
