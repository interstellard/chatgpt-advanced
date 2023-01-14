import '../style/base.css'
import { h, render } from 'preact'
import { getTextArea, getFooter, getRootElement, getSubmitButton, getWebChatGPTToolbar } from '../util/elementFinder'
import Toolbar from 'src/components/toolbar'
import Footer from 'src/components/footer'
import ErrorMessage from 'src/components/errorMessage'
import { getUserConfig } from 'src/util/userConfig'
import { apiSearch, SearchResult } from './api'

var isProcessing = false

var btnSubmit: HTMLButtonElement
var textarea: HTMLTextAreaElement
var footer: HTMLDivElement

async function onSubmit(event: any) {

    if (event.shiftKey && event.key === 'Enter') {
        return
    }

    if ((event.type === "click" || event.key === 'Enter') && !isProcessing) {

        let query = textarea.value.trim()

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
            pasteWebResultsToTextArea(results, query)
            pressEnter()
            isProcessing = false

        } catch (error) {
            isProcessing = false
            showErrorMessage(error)
        }
    }
}

function pasteWebResultsToTextArea(results: SearchResult[], query: string) {
    let counter = 1
    let formattedResults = "Web search results:\n\n"
    formattedResults = formattedResults + results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nSource: ${result.href}\n\n`, "")

    formattedResults = formattedResults + `\nCurrent date: ${new Date().toLocaleDateString()}`
    formattedResults = formattedResults + `\nInstructions: Using the provided web search results, write a comprehensive reply to the given prompt. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.`
    formattedResults = formattedResults + `\nPrompt: ${query}`

    textarea.value = formattedResults
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

function showErrorMessage(error: any) {
    console.log("WebChatGPT error --> API error: ", error)
    let div = document.createElement('div')
    document.body.appendChild(div)
    render(<ErrorMessage message={error} />, div)
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

        let div = document.createElement('div')
        textareaParent.appendChild(div)
        render(<Toolbar />, div)
    }

    if (footer) {
        let div = document.createElement('div')
        footer.lastElementChild.appendChild(div)
        render(<Footer />, div)
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
