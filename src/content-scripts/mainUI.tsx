import '../style/base.css'
import { h, render } from 'preact'
import { getTextArea, getFooter, getRootElement, getSubmitButton, getWebChatGPTToolbar } from '../util/elementFinder'
import Toolbar from 'src/components/toolbar'
import ErrorMessage from 'src/components/errorMessage'
import { getUserConfig, UserConfig } from 'src/util/userConfig'
import { SearchRequest, SearchResult, webSearch } from './ddg_search'

import createShadowRoot from 'src/util/createShadowRoot'
import { compilePrompt, promptContainsWebResults } from 'src/util/promptManager'
import SlashCommandsMenu, { slashCommands } from 'src/components/slashCommandsMenu'
import { apiExtractText } from './api'

let isProcessing = false

let btnSubmit: HTMLButtonElement | null | undefined
let textarea: HTMLTextAreaElement | null
let chatGptFooter: HTMLDivElement | null


function renderSlashCommandsMenu() {

    let div = document.querySelector('wcg-slash-commands-menu')
    if (div) div.remove()

    div = document.createElement('wcg-slash-commands-menu')
    const textareaParentParent = textarea?.parentElement?.parentElement

    textareaParentParent?.insertBefore(div, textareaParentParent.firstChild)
    render(<SlashCommandsMenu textarea={textarea} />, div)
}

async function processQuery(query: string, userConfig: UserConfig) {

    const containsWebResults = await promptContainsWebResults()
    if (!containsWebResults) {
        return undefined
    }

    let results: SearchResult[]

    const pageCommandMatch = query.match(/page:(\S+)/)
    if (pageCommandMatch) {
        const url = pageCommandMatch[1]
        results = await apiExtractText(url)
    } else {
        const searchRequest: SearchRequest = {
            query,
            timerange: userConfig.timePeriod,
            region: userConfig.region,
        }

        results = await webSearch(searchRequest, userConfig.numWebResults)
    }

    return results
}

async function handleSubmit(query: string) {

    if (!textarea) return

    const userConfig = await getUserConfig()

    if (!userConfig.webAccess) {
        textarea.value = query
        pressEnter()
        return
    }

    try {
        const results = await processQuery(query, userConfig)
        // console.info("WebChatGPT results --> ", results)
        const compiledPrompt = await compilePrompt(results, query)
        // console.info("WebChatGPT compiledPrompt --> ", compiledPrompt)
        textarea.value = compiledPrompt
        pressEnter()
    } catch (error) {
        if (error instanceof Error) {
            showErrorMessage(error)
        }
    }
}

async function onSubmit(event: MouseEvent | KeyboardEvent) {

    if (!textarea) return

    const isKeyEvent = event instanceof KeyboardEvent

    if (isKeyEvent && event.shiftKey && event.key === 'Enter') return

    if (isKeyEvent && event.key === 'Enter' && event.isComposing) return

    if (!isProcessing && (event.type === "click" || (isKeyEvent && event.key === 'Enter'))) {
        const query = textarea?.value.trim()

        // if query is empty or undefined, return
        if (!query) return

        textarea.value = ""

        const isPartialCommand = slashCommands.some(command => command.name.startsWith(query) && query.length <= command.name.length)
        if (isPartialCommand) {
            return
        }

        isProcessing = true
        await handleSubmit(query)
        isProcessing = false
    }
}

function pressEnter() {
    textarea?.focus()
    const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter'
    })
    textarea?.dispatchEvent(enterEvent)
}

function showErrorMessage(error: Error) {
    console.info("WebChatGPT error --> API error: ", error)
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<ErrorMessage message={error.message} />, div)
}


async function updateUI() {

    formChild = document.querySelector('form')?.children[0] as HTMLElement
    textarea = getTextArea()
    // console.info("UpdateUI textarea: ", textarea)

    const toolbar = getWebChatGPTToolbar()
    if (!textarea) {
        toolbar?.remove()
        return
    }

    if (toolbar) return

    console.info("WebChatGPT: Updating UI")

    btnSubmit = getSubmitButton()
    btnSubmit?.addEventListener("click", onSubmit)

    textarea?.addEventListener("keydown", onSubmit)

    await renderToolbar()

    renderSlashCommandsMenu()

    // textarea.parentElement.style.flexDirection = 'row'

    chatGptFooter = getFooter()
    if (chatGptFooter) {
        const lastChild = chatGptFooter.lastElementChild as HTMLElement
        if (lastChild) lastChild.style.padding = '0 0 0.5em 0'
    }
}

async function renderToolbar() {

    try {
        const textareaParentParent = textarea?.parentElement?.parentElement
        // const textareaParentParent = formChild
        // if (textareaParentParent && textareaParentParent.parentElement) {
        //     textareaParentParent.style.flexDirection = 'column'
        //     textareaParentParent.parentElement.style.flexDirection = 'column'
        //     textareaParentParent.parentElement.style.gap = '0px'
        //     textareaParentParent.parentElement.style.marginBottom = '0.5em'
        // }

        const { shadowRootDiv, shadowRoot } = await createShadowRoot('content-scripts/mainUI.css')
        shadowRootDiv.classList.add('wcg-toolbar')
        textareaParentParent?.appendChild(shadowRootDiv)
        render(<Toolbar textarea={textarea} />, shadowRoot)

    } catch (e) {
        if (e instanceof Error) {
            showErrorMessage(Error(`Error loading WebChatGPT toolbar: ${e.message}. Please reload the page (F5).`))
        }
    }
}

const form = document.querySelector('form')
const formParent = form?.parentElement

const rootEl = getRootElement()
let formChild = document.querySelector('form')?.children[0] as HTMLElement
const mutationObserver = new MutationObserver(() => {
    try {
        updateUI()
    } catch (e) {
        if (e instanceof Error) {
            showErrorMessage(e)
        }
    }
})

window.onload = function () {
    updateUI()

    if (formChild) {
        mutationObserver.observe(formChild, { childList: true })
    }

    if (rootEl) {
        mutationObserver.observe(rootEl, { childList: true })
    }

    if (formParent) {
        mutationObserver.observe(formParent, { childList: true })
    }
}

window.onunload = function () {
    mutationObserver.disconnect()
}
