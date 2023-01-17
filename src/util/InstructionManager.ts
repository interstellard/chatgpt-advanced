import { SearchResult } from "src/content-scripts/api"
import Browser from "webextension-polyfill"

export const DEFAULT_INSTRUCTION_KEY = 'default_instruction'
export const CURRENT_INSTRUCTION_NAME_KEY = 'current_instruction_name'
export const SAVED_INSTRUCTIONS_KEY = 'saved_instructions'

export interface Instruction {
    name: string,
    text: string
}


export class InstructionManager {

    async compilePrompt(results: SearchResult[], query: string) {
        const currentInstruction = await this.getCurrentInstruction()
        const formattedResults = this.formatWebResults(results)
        const currentDate = new Date().toLocaleDateString()
        const instruction = this.replaceVariables(currentInstruction.text, {
            '{web_results}': formattedResults,
            '{query}': query,
            '{current_date}': currentDate
        })
        return instruction
    }

    getDefaultInstruction() {
        return { name: 'default', text: Browser.i18n.getMessage(DEFAULT_INSTRUCTION_KEY) }
    }

    async getCurrentInstruction(): Promise<Instruction> {
        const defaultInstruction = this.getDefaultInstruction()
        const data = await Browser.storage.sync.get([CURRENT_INSTRUCTION_NAME_KEY, SAVED_INSTRUCTIONS_KEY])
        const currentInstruction = data[SAVED_INSTRUCTIONS_KEY].find((i: Instruction) => i.name === data[CURRENT_INSTRUCTION_NAME_KEY])
        return currentInstruction || defaultInstruction
    }

    async getSavedInstructions(): Promise<Instruction[]> {
        const data = await Browser.storage.sync.get([SAVED_INSTRUCTIONS_KEY])
        return data[SAVED_INSTRUCTIONS_KEY] || []
    }

    async saveInstruction(instruction: Instruction) {
        let savedInstructions = await this.getSavedInstructions()
        const index = savedInstructions.findIndex(i => i.name === instruction.name)
        if (index >= 0) {
            savedInstructions[index] = instruction
        } else {
            savedInstructions.push(instruction)
        }
        await Browser.storage.sync.set({ [SAVED_INSTRUCTIONS_KEY]: savedInstructions })
    }

    private formatWebResults(results: SearchResult[]) {
        let counter = 1
        let formattedResults = results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.href}\n\n`, "")
        return formattedResults
    }

    private replaceVariables(instruction: string, variables: { [key: string]: string }) {
        let newInstruction = instruction
        for (const key in variables) {
            try {
                newInstruction = newInstruction.replace(key, variables[key])
            } catch (error) {
            }
        }
        return newInstruction
    }
}

