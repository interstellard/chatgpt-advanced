import '../style/base.css'
import { h, render } from 'preact'
import { getTextArea, getFooter, getRootElement, getSubmitButton, getWebChatGPTToolbar } from '../util/elementFinder'
import Toolbar from 'src/components/toolbar'
import ErrorMessage from 'src/components/errorMessage'
import { getUserConfig } from 'src/util/userConfig'
import { apiSearch, SearchResult } from './api'
import createShadowRoot from 'src/util/createShadowRoot'
import { compilePrompt } from 'src/util/promptManager'

let isProcessing = false

let btnSubmit: HTMLButtonElement
let textarea: HTMLTextAreaElement
let footer: HTMLDivElement

async function onSubmit(event: MouseEvent | KeyboardEvent) {

    if (event instanceof KeyboardEvent && event.shiftKey && event.key === 'Enter')
        return

    if ((event.type === "click" || (event instanceof KeyboardEvent && event.key === 'Enter')) && !isProcessing) {

        const query = textarea.value.trim()

        if (query === "") return

        textarea.value = ""

        const userConfig = await getUserConfig()

        isProcessing = true

        if (!userConfig.webAccess) {
            textarea.value = query
            pressEnter()
            isProcessing = false
            return
        }

        textarea.value = ""

        try {
            const results = await apiSearch(query, userConfig.numWebResults, userConfig.timePeriod, userConfig.region)
            await pasteWebResultsToTextArea(results, query)
            pressEnter()
            isProcessing = false

        } catch (error) {
            isProcessing = false
            showErrorMessage(error)
        }
    }
}

async function pasteWebResultsToTextArea(results: SearchResult[], query: string) {

    textarea.value = await compilePrompt(results, query)
}

function pressEnter() {
    textarea.focus()
    const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter'
    })
    textarea.dispatchEvent(enterEvent)
}

function showErrorMessage(error: Error) {
    console.log("WebChatGPT error --> API error: ", error)
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<ErrorMessage message={error.message} />, div)
}


async function updateUI() {

    if (getWebChatGPTToolbar()) return

    btnSubmit = getSubmitButton()
    textarea = getTextArea()
    footer = getFooter()

    if (textarea && btnSubmit) {

        textarea.addEventListener("keydown", onSubmit)
        btnSubmit.addEventListener("click", onSubmit)

        const textareaParent = textarea.parentElement.parentElement
        textareaParent.style.flexDirection = 'column'
        textareaParent.parentElement.style.flexDirection = 'column'
        textareaParent.parentElement.style.gap = '0px'
        textareaParent.parentElement.style.marginBottom = '0.5em'

        const { shadowRootDiv, shadowRoot } = await createShadowRoot('content-scripts/mainUI.css')
        textareaParent.appendChild(shadowRootDiv)
        render(<Toolbar />, shadowRoot)
    }

    if (footer) {
        const lastChild = footer.lastElementChild as HTMLElement
        if (lastChild)
            lastChild.style.padding = '0 0 0.5em 0'
    }
}

const rootEl = getRootElement()
window.onload = function () {
    updateUI()

    try {
        new MutationObserver(() => {
            updateUI()
        }).observe(rootEl, { childList: true })
    } catch (e) {
        console.info("WebChatGPT error --> Could not update UI:\n", e.stack)
    }
}
