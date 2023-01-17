import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { InstructionManager, Instruction } from 'src/util/InstructionManager'

const InstructionsEditor = () => {
    const [instructionManager] = useState(new InstructionManager())
    const [savedInstructions, setSavedInstructions] = useState<Instruction[]>([])
    const [defaultInstruction] = useState(instructionManager.getDefaultInstruction())
    const [instruction, setInstruction] = useState<Instruction>(defaultInstruction)

    useEffect(() => {
        updateList()
    }, [])

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
        await instructionManager.saveInstruction(instruction);
        updateList()
    }

    const nameInputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="instructions-editor wcg-border wcg-border-base-200 wcg-rounded-box wcg-py-4 wcg-flex wcg-flex-row wcg-gap-4 wcg-h-96">
            <div className="wcg-w-1/3">
                <button
                    className="wcg-btn"
                    onClick={handleAdd}>
                    Add New Instruction
                </button>
                <ul className="wcg-menu wcg-w-full wcg-bg-base-100 wcg-p-0">
                    {savedInstructions.map((inst) => (
                        <li
                            key={inst.name}
                            onClick={() => handleSelect(inst)}
                        >
                            <a className={`wcg-text-base ${inst.name === instruction.name ? 'wcg-active' : ''}`}>{inst.name}</a>                        </li>
                    ))}
                </ul>
            </div>
            <div className="wcg-flex wcg-flex-col wcg-w-2/3">
                <input
                    ref={nameInputRef}
                    className="wcg-input wcg-w-full wcg-text-base"
                    type="text"
                    placeholder="Name"
                    value={instruction.name} onChange={(e: Event) => setInstruction({ ...instruction, name: (e.target as HTMLInputElement).value })}
                    disabled={instruction.name === defaultInstruction.name}
                >
                </input>
                <br />
                <textarea
                    className="wcg-textarea wcg-w-full wcg-h-screen wcg-min-w-full wcg-resize-none wcg-text-base"
                    value={instruction.text}
                    onChange={(e) => setInstruction({ ...instruction, text: (e.target as HTMLInputElement).value })}
                    disabled={instruction.name === defaultInstruction.name}
                />

                {instruction.name !== defaultInstruction.name && (
                    <button onClick={handleSave}>Save</button>
                )}
            </div>
        </div>
    )
}

export default InstructionsEditor
