import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { InstructionManager, Instruction } from 'src/util/InstructionManager'

const InstructionsEditor = () => {
    const [instructionManager] = useState(new InstructionManager())
    const [savedInstructions, setSavedInstructions] = useState<Instruction[]>([])
    const [defaultInstruction] = useState(instructionManager.getDefaultInstruction())
    const [instruction, setInstruction] = useState<Instruction>(defaultInstruction)
    const [hasWebResultsPlaceholder, setHasWebResultsPlaceholder] = useState(false)
    const [hasQueryPlaceholder, setHasQueryPlaceholder] = useState(false)


    useEffect(() => {
        updateList()
    }, [])

    useEffect(() => {
        updatePlaceholderButtons(instruction.text)
    }, [instruction.text])

    async function updateList() {
        const savedInstructions = await instructionManager.getSavedInstructions()
        savedInstructions.unshift(defaultInstruction)
        setSavedInstructions(savedInstructions)
    }

    const handleSelect = (instruction: Instruction) => {
        setInstruction(instruction)
    }

    const handleAdd = () => {
        setInstruction({ name: '', text: '' })
        if (nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }

    const handleSave = async () => {
        await instructionManager.saveInstruction(instruction)
        updateList()
    }

    const nameInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleInsertText = (text: string) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart
            const end = textareaRef.current.selectionEnd
            const currentText = textareaRef.current.value
            const newText = currentText.substring(0, start) + text + currentText.substring(end, currentText.length)
            textareaRef.current.setSelectionRange(start + text.length, start + text.length)
            textareaRef.current.focus()

            setInstruction({ ...instruction, text: newText })
        }
    }

    const handleTextareaChange = (e: Event) => {
        let text = (e.target as HTMLTextAreaElement).value
        if (text !== instruction.text) {
            setInstruction({ ...instruction, text: text })
        }
    }

    const updatePlaceholderButtons = (text: string) => {
        setHasWebResultsPlaceholder(text.includes("{web_results}"))
        setHasQueryPlaceholder(text.includes("{query}"))
    }

    const actionToolbar = (
        <div className="wcg-flex wcg-flex-row wcg-justify-between wcg-mt-4">
            <div className="wcg-flex wcg-flex-row wcg-gap-4">
                <button
                    className={`wcg-btn ${hasWebResultsPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"} wcg-text-sm wcg-lowercase wcg-p-1`}
                    onClick={() => handleInsertText('{web_results}')}
                >
                    &#123;web_results&#125;
                </button>
                <button
                    className={`wcg-btn ${hasQueryPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"} wcg-text-sm wcg-lowercase wcg-p-1`}
                    onClick={() => handleInsertText('{query}')}
                >
                    &#123;query&#125;
                </button>
            </div>

            <button
                className="wcg-btn wcg-btn-primary wcg-text-base"
                onClick={handleSave}
            >
                Save
            </button>
        </div>
    )


    return (
        <div className="wcg-w-4/5 wcg-border wcg-rounded-box wcg-py-4 wcg-flex wcg-flex-row wcg-gap-4 wcg-h-96">
            <div className="wcg-w-1/3">
                <button
                    className="wcg-btn wcg-btn-primary wcg-w-full wcg-text-base"
                    onClick={handleAdd}>
                    <span class="material-symbols-outlined wcg-mr-2">
                        add_circle
                    </span>
                    Add New Instruction
                </button>
                <ul className="wcg-menu wcg-p-0 wcg-max-h-96 wcg-scroll-m-0 wcg-scroll-y wcg-overflow-auto wcg-mt-4
                wcg-flex wcg-flex-col wcg-flex-nowrap
                wcg-border-solid wcg-border-2 wcg-border-white/20">
                    {savedInstructions.map((inst) => (
                        <li
                            key={inst.name}
                            onClick={() => handleSelect(inst)}
                        >
                            <a className={`wcg-text-base ${inst.name === instruction.name ? 'wcg-active' : ''}`}>
                                📝 {inst.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="wcg-flex wcg-flex-col wcg-w-2/3">
                <div className="wcg-flex wcg-flex-row wcg-gap-2 wcg-items-center">

                    <input
                        ref={nameInputRef}
                        className="wcg-input wcg-input-bordered wcg-flex-1"
                        type="text"
                        placeholder="Name"
                        value={instruction.name}
                        onChange={(e: Event) =>
                            setInstruction({ ...instruction, name: (e.target as HTMLInputElement).value })
                        }
                        disabled={instruction.name === defaultInstruction.name}
                    >
                    </input>
                    <button
                        className={"wcg-btn wcg-btn-primary wcg-text-base" + (instruction.name === defaultInstruction.name ? " wcg-hidden" : "")}
                        onClick={handleSave}
                        hidden={instruction.name === defaultInstruction.name}
                    >
                        <span class="material-symbols-outlined">
                            delete
                        </span>
                    </button>
                </div>
                <br />
                <textarea
                    ref={textareaRef}
                    className="wcg-input wcg-input-bordered wcg-h-96 wcg-resize-none wcg-text-base"
                    value={instruction.text}
                    onChange={(e: Event) =>
                        setInstruction({ ...instruction, text: (e.target as HTMLInputElement).value })
                    }
                    onInput={handleTextareaChange}
                    disabled={instruction.name === defaultInstruction.name}
                />

                {instruction.name !== defaultInstruction.name && (
                    actionToolbar
                )}
            </div>
        </div >
    )
}

export default InstructionsEditor
