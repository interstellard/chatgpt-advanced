import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getCurrentLanguageName, getLocaleLanguage, getTranslation, localizationKeys } from "./localization"
import { getUserConfig } from "./userConfig"
import { SearchResult } from "src/content-scripts/ddg_search"

export const SAVED_PROMPTS_KEY = 'saved_prompts'
export const SAVED_PROMPTS_MOVED_KEY = 'saved_prompts_moved_to_local'

export interface Prompt {
    uuid?: string,
    name: string,
    text: string
}

const removeCommands = (query: string) => query.replace(/\/page:(\S+)\s+/g, '').replace(/\/site:(\S+)\s+/g, '')

export const compilePrompt = async (results: SearchResult[], query: string, filterType: string) => {
    const currentPrompt = await getCurrentPrompt()
    const formattedResults = formatWebResults(results, filterType)
    const currentDate = new Date().toLocaleDateString()
    const prompt = replaceVariables(currentPrompt.text, {
        '{web_results}': formattedResults,
        '{query}': removeCommands(query),
        '{current_date}': currentDate
    })
    return prompt
}

const formatWebResults = (results: SearchResult[], filterType: string) => {
    if (results.length === 0) {
        return "No results found.\n"
    }
    if (filterType === "Med") {
        results = results.filter(result => (result.url.includes("mayoclinic.org") || result.url.includes("medlineplus.gov") || result.url.includes("merckmanuals.com") || result.url.includes("pubmed.ncbi.nlm.nih.gov") || result.url.includes("webmd.com") || result.url.includes("nih.gov") || result.url.includes("womenshealth.gov") || result.url.includes("healthline.com") || result.url.includes("uptodate.com") || result.url.includes("diabetes.org") || result.url.includes("familydoctor.org") || result.url.includes("heart.org") || result.url.includes("fda.gov") || result.url.includes("medscape.com") || result.url.includes("cdc.gov") || result.url.includes("examine.com") || result.url.includes("nhs.uk") || result.url.includes("thefreedictionary.com") || result.url.includes("bestpractice.bmj.com") || result.url.includes("nejm.org") || result.url.includes("samhsa.gov") || result.url.includes("cancer.gov") || result.url.includes("nice.org.uk") || result.url.includes("journals.plos.org") || result.url.includes("apa.org") || result.url.includes("cochranelibrary.com"))); // New code to check for credibility
    } else if (filterType === "Gov") {
        results = results.filter(result => (result.url.includes(".gov"))); // New code to check for credibility
    } else if (filterType === "Res") {
        results = results.filter(result => (result.url.includes("doi") || result.url.includes("sciencedirect.com") || result.url.includes("academic.oup.com") || result.url.includes("journal") || result.url.includes("article") || result.url.includes("abstract") || result.url.includes("publication") || result.url.includes("mdpi.com"))); // New code to check for credibility
    }
    let counter = 1
    return results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.url}\n\n`, "")
}

const replaceVariables = (prompt: string, variables: { [key: string]: string }) => {
    let newPrompt = prompt
    for (const key in variables) {
        try {
            newPrompt = newPrompt.replaceAll(key, variables[key])
        } catch (error) {
            console.info("WebChatGPT error --> API error: ", error)
        }
    }
    return newPrompt
}

export const getDefaultPrompt = () => {
    return {
        name: 'Default prompt',
        text: getTranslation(localizationKeys.defaultPrompt, 'en') + (getLocaleLanguage() !== 'en' ? `\nReply in ${getCurrentLanguageName()}` : ''),
        uuid: 'default'
    }
}

const getDefaultEnglishPrompt = () => {
    return { name: 'Default English', text: getTranslation(localizationKeys.defaultPrompt, 'en'), uuid: 'default_en' }
}

export const getCurrentPrompt = async () => {
    const userConfig = await getUserConfig()
    const currentPromptUuid = userConfig.promptUUID
    const savedPrompts = await getSavedPrompts()
    return savedPrompts.find((i: Prompt) => i.uuid === currentPromptUuid) || getDefaultPrompt()
}

export const getSavedPrompts = async (addDefaults = true) => {
    const { [SAVED_PROMPTS_KEY]: localPrompts, [SAVED_PROMPTS_MOVED_KEY]: promptsMoved } = await Browser.storage.local.get([SAVED_PROMPTS_KEY, SAVED_PROMPTS_MOVED_KEY])

    let savedPrompts = localPrompts

    if (!promptsMoved) {
        const syncPrompts = await Browser.storage.sync.get({ [SAVED_PROMPTS_KEY]: [] })[SAVED_PROMPTS_KEY] || []

        savedPrompts = localPrompts.reduce((prompts: Prompt[], prompt: Prompt) => {
            if (!prompts.some(({ uuid }) => uuid === prompt.uuid)) prompts.push(prompt);
            return prompts
        }, syncPrompts)

        await Browser.storage.local.set({ [SAVED_PROMPTS_KEY]: savedPrompts, [SAVED_PROMPTS_MOVED_KEY]: true })
        await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: [] })
    }

    return addDefaults ? addDefaultPrompts(savedPrompts) : savedPrompts 
}

function addDefaultPrompts(prompts: Prompt[]) {

    if (getLocaleLanguage() !== 'en') {
        addPrompt(prompts, getDefaultEnglishPrompt())
    }
    addPrompt(prompts, getDefaultPrompt())
    return prompts

    function addPrompt(prompts: Prompt[], prompt: Prompt) {
        const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
        if (index >= 0) {
            prompts[index] = prompt
        } else {
            prompts.unshift(prompt)
        }
    }
}

export const savePrompt = async (prompt: Prompt) => {
    const savedPrompts = await getSavedPrompts(false)
    const index = savedPrompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
    if (index >= 0) {
        savedPrompts[index] = prompt
    } else {
        prompt.uuid = uuidv4()
        savedPrompts.push(prompt)
    }

    await Browser.storage.local.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}

export const deletePrompt = async (prompt: Prompt) => {
    let savedPrompts = await getSavedPrompts()
    savedPrompts = savedPrompts.filter((i: Prompt) => i.uuid !== prompt.uuid)
    await Browser.storage.local.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}
