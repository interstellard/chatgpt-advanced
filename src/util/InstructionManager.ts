import { SearchResult } from "src/content-scripts/api"
import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getUserConfig } from "./userConfig"


export const DEFAULT_INSTRUCTION_KEY = 'default_instruction'
export const CURRENT_INSTRUCTION_UUID_KEY = 'instructionUUID'
export const SAVED_INSTRUCTIONS_KEY = 'saved_instructions'

export interface Instruction {
    uuid?: string,
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

    private formatWebResults(results: SearchResult[]) {
        let counter = 1
        let formattedResults = results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.href}\n\n`, "")
        return formattedResults
    }

    private replaceVariables(instruction: string, variables: { [key: string]: string }) {
        let newInstruction = instruction
        for (const key in variables) {
            try {
                newInstruction = newInstruction.replaceAll(key, variables[key])
            } catch (error) {
            }
        }
        return newInstruction
    }

    getDefaultInstruction(): Instruction {
        return { name: 'Default prompt', text: Browser.i18n.getMessage(DEFAULT_INSTRUCTION_KEY), uuid: 'default' }
    }

    async getCurrentInstruction(): Promise<Instruction> {
        const defaultInstruction = this.getDefaultInstruction()
        const data = await Browser.storage.sync.get()
        const currentInstructionUuid = data[CURRENT_INSTRUCTION_UUID_KEY]
        const savedInstructions = data[SAVED_INSTRUCTIONS_KEY]
        if (!savedInstructions) {
            return defaultInstruction
        }
        const currentInstruction = savedInstructions.find((i: Instruction) => i.uuid === currentInstructionUuid)
        return currentInstruction || defaultInstruction
    }

    async getSavedInstructions(): Promise<Instruction[]> {
        const data = await Browser.storage.sync.get([SAVED_INSTRUCTIONS_KEY])
        return data[SAVED_INSTRUCTIONS_KEY] || []
    }

    async saveInstruction(instruction: Instruction) {
        let savedInstructions = await this.getSavedInstructions()
        const index = savedInstructions.findIndex(i => i.uuid === instruction.uuid)
        if (index >= 0) {
            savedInstructions[index] = instruction
        } else {
            instruction.uuid = uuidv4()
            savedInstructions.push(instruction)
        }
        await Browser.storage.sync.set({ [SAVED_INSTRUCTIONS_KEY]: savedInstructions })
    }

    async deleteInstruction(instruction: Instruction) {
        let savedInstructions = await this.getSavedInstructions()
        savedInstructions = savedInstructions.filter(i => i.uuid !== instruction.uuid)
        await Browser.storage.sync.set({ [SAVED_INSTRUCTIONS_KEY]: savedInstructions })
    }
}

