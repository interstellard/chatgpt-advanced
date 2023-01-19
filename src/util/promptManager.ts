import { SearchResult } from "src/content-scripts/api"
import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'


export const DEFAULT_PROMPT_KEY = 'default_prompt'
export const CURRENT_PROMPT_UUID_KEY = 'promptUUID'
export const SAVED_PROMPTS_KEY = 'saved_prompts'

export interface Prompt {
    uuid?: string,
    name: string,
    text: string
}


export class PromptManager {

    async compilePrompt(results: SearchResult[], query: string) {
        const currentPrompt = await this.getCurrentPrompt()
        const formattedResults = this.formatWebResults(results)
        const currentDate = new Date().toLocaleDateString()
        const prompt = this.replaceVariables(currentPrompt.text, {
            '{web_results}': formattedResults,
            '{query}': query,
            '{current_date}': currentDate
        })
        return prompt
    }

    private formatWebResults(results: SearchResult[]) {
        let counter = 1
        let formattedResults = results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.href}\n\n`, "")
        return formattedResults
    }

    private replaceVariables(prompt: string, variables: { [key: string]: string }) {
        let newPrompt = prompt
        for (const key in variables) {
            try {
                newPrompt = newPrompt.replaceAll(key, variables[key])
            } catch (error) {
            }
        }
        return newPrompt
    }

    getDefaultPrompt(): Prompt {
        return { name: 'Default prompt', text: Browser.i18n.getMessage(DEFAULT_PROMPT_KEY), uuid: 'default' }
    }

    async getCurrentPrompt(): Promise<Prompt> {
        const defaultPrompt = this.getDefaultPrompt()
        const data = await Browser.storage.sync.get()
        const currentPromptUuid = data[CURRENT_PROMPT_UUID_KEY]
        const savedPrompts = data[SAVED_PROMPTS_KEY]
        if (!savedPrompts) {
            return defaultPrompt
        }
        const currentPrompt = savedPrompts.find((i: Prompt) => i.uuid === currentPromptUuid)
        return currentPrompt || defaultPrompt
    }

    async getSavedPrompts(): Promise<Prompt[]> {
        const data = await Browser.storage.sync.get([SAVED_PROMPTS_KEY])
        return data[SAVED_PROMPTS_KEY] || []
    }

    async savePrompt(prompt: Prompt) {
        let savedPrompts = await this.getSavedPrompts()
        const index = savedPrompts.findIndex(i => i.uuid === prompt.uuid)
        if (index >= 0) {
            savedPrompts[index] = prompt
        } else {
            prompt.uuid = uuidv4()
            savedPrompts.push(prompt)
        }
        await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
    }

    async deletePrompt(prompt: Prompt) {
        let savedPrompts = await this.getSavedPrompts()
        savedPrompts = savedPrompts.filter(i => i.uuid !== prompt.uuid)
        await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
    }
}

