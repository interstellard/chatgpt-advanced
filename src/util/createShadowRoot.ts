import Browser from "webextension-polyfill"

async function createShadowRoot(pathToCSS: string) {
    const shadowRootDiv = document.createElement('div')
    const shadowRoot = shadowRootDiv.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = await fetch(Browser.runtime.getURL(pathToCSS)).then(response => response.text())
    shadowRoot.append(style)
    return { shadowRootDiv, shadowRoot }
}

export default createShadowRoot
