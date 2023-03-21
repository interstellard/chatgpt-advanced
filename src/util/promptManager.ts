import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getCurrentLanguageName, getLocaleLanguage, getTranslation, localizationKeys } from "./localization"
import { getUserConfig } from "./userConfig"
import { SearchResult } from "src/content-scripts/ddg_search"

export const SAVED_PROMPTS_KEY = 'saved_prompts'

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
        results = results.filter(result => (result.url.includes("mayoclinic.org") || result.url.includes("medlineplus.gov") || result.url.includes("pubmed.ncbi.nlm.nih.gov") || result.url.includes("webmd.com") || result.url.includes("nih.gov") || result.url.includes("uptodate.com") || result.url.includes("medscape.com") || result.url.includes("cdc.gov") || result.url.includes("examine.com") || result.url.includes("nhs.uk") || result.url.includes("thefreedictionary.com") || result.url.includes("bestpractice.bmj.com") || result.url.includes("nejm.org") || result.url.includes("nice.org.uk") || result.url.includes("journals.plos.org") || result.url.includes("apa.org") || result.url.includes("cochranelibrary.com"))); // New code to check for credibility
    } else if (filterType === "Gov") {
        results = results.filter(result => (result.url.includes(".gov"))); // New code to check for credibility
    } else if (filterType === "Res") {
        results = results.filter(result => (result.url.includes("pubmed.ncbi.nlm.nih.gov") || result.url.includes("ahajournals.org") || result.url.includes("jcsm.aasm.org") || result.url.includes("ccjm.org"))); // New code to check for credibility
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
    const data = await Browser.storage.sync.get([SAVED_PROMPTS_KEY])
    const savedPrompts = data[SAVED_PROMPTS_KEY] || []

    if (addDefaults)
        return addDefaultPrompts(savedPrompts)

    return savedPrompts
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

    await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}

export const deletePrompt = async (prompt: Prompt) => {
    let savedPrompts = await getSavedPrompts()
    savedPrompts = savedPrompts.filter((i: Prompt) => i.uuid !== prompt.uuid)
    await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}
