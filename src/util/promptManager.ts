import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getCurrentLanguageName, getLocaleLanguage, getTranslation, localizationKeys } from "./localization"
import { getUserConfig } from "./userConfig"
import { SearchResult } from "src/content-scripts/web_search"

export const SAVED_PROMPTS_KEY = 'saved_prompts'
export const SAVED_PROMPTS_MOVED_KEY = 'saved_prompts_moved_to_local'

export interface Prompt {
    uuid?: string,
    name: string,
    text: string
}

const removeCommands = (query: string) => query.replace(/\/page:(\S+)\s*/g, '').replace(/\/site:(\S+)\s*/g, '')

export const promptContainsWebResults = async () => {
    const currentPrompt = await getCurrentPrompt()
    return currentPrompt.text.includes('{web_results}')
}

export const compilePrompt = async (results: SearchResult[] | undefined, query: string) => {
    const currentPrompt = await getCurrentPrompt()
    const prompt = replaceVariables(currentPrompt.text, {
        '{web_results}': formatWebResults(results),
        '{query}': removeCommands(query),
        '{current_date}': new Date().toLocaleDateString()
    })
    return prompt
}

const formatWebResults = (results: SearchResult[] | undefined) => {
    if (!results) {
        return ""
    }

    if (results.length === 0) {
        return "No results found.\n"
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
    const { [SAVED_PROMPTS_KEY]: localPrompts, [SAVED_PROMPTS_MOVED_KEY]: promptsMoved } = await Browser.storage.local.get({ [SAVED_PROMPTS_KEY]: [], [SAVED_PROMPTS_MOVED_KEY]: false })

    let savedPrompts = localPrompts

    if (!promptsMoved) {
        const syncStorage = await Browser.storage.sync.get({ [SAVED_PROMPTS_KEY]: [] })
        const syncPrompts = syncStorage?.[SAVED_PROMPTS_KEY] ?? []

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
