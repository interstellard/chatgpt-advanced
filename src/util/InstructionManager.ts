import { SearchResult } from "src/content-scripts/api"
import Browser from "webextension-polyfill"

export class InstructionManager {
    DEFAULT_INSTRUCTION_KEY = 'default_instruction'
    CURRENT_INSTRUCTION_KEY = 'current_instruction'

    async getInstruction(results: SearchResult[], query: string) {
        const currentInstruction = await this.getCurrentInstruction()
        const formattedResults = this.formatWebResults(results)
        const currentDate = new Date().toLocaleDateString()
        const instruction = this.replaceVariables(currentInstruction, {
            '{web_results}': formattedResults,
            '{query}': query,
            '{current_date}': currentDate
        })
        return instruction
    }

    private async getCurrentInstruction(): Promise<string> {
        const defaultInstruction = Browser.i18n.getMessage(this.DEFAULT_INSTRUCTION_KEY)
        const data = await Browser.storage.sync.get([this.CURRENT_INSTRUCTION_KEY])
        return data[this.CURRENT_INSTRUCTION_KEY] || defaultInstruction
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
