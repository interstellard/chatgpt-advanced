import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { PromptManager, Prompt } from 'src/util/promptManager'
import TooltipWrapper from './tooltipWrapper'

const PromptEditor = () => {
    const [promptManager] = useState(new PromptManager())
    const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([])
    const [defaultPrompt] = useState(promptManager.getDefaultPrompt())
    const [prompt, setPrompt] = useState<Prompt>(defaultPrompt)
    const [hasWebResultsPlaceholder, setHasWebResultsPlaceholder] = useState(false)
    const [hasQueryPlaceholder, setHasQueryPlaceholder] = useState(false)
    const [deleteBtnText, setDeleteBtnText] = useState("delete")

    const [showErrors, setShowErrors] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [textError, setTextError] = useState(false)
    const [webResultsError, setWebResultsError] = useState(false)
    const [queryError, setQueryError] = useState(false)


    useEffect(() => {
        updateList()
    }, [])

    useEffect(() => {
        updatePlaceholderButtons(prompt.text)
    }, [prompt.text])

    useEffect(() => {
        setNameError(prompt.name.trim() === '')
        setTextError(prompt.text.trim() === '')
        setWebResultsError(!prompt.text.includes('{web_results}'))
        setQueryError(!prompt.text.includes('{query}'))
    }, [prompt])

    async function updateList() {
        const savedPrompts = await promptManager.getSavedPrompts()
        savedPrompts.unshift(defaultPrompt)
        setSavedPrompts(savedPrompts)
    }

    const handleSelect = (prompt: Prompt) => {
        setShowErrors(false)
        setPrompt(prompt)
        setDeleteBtnText("delete")
    }


    const handleAdd = () => {
        setShowErrors(false)
        setPrompt({ name: '', text: '' })
        setDeleteBtnText("delete")
        if (nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }

    const handleSave = async () => {
        setShowErrors(true)
        if (nameError || textError || webResultsError || queryError) {
            return
        }

        await promptManager.savePrompt(prompt)
        updateList()
    }

    const handleDeleteBtnClick = () => {
        if (deleteBtnText === "delete") {
            setDeleteBtnText("check");
        } else {
            handleDelete();
        }
    }

    const handleDelete = async () => {
        await promptManager.deletePrompt(prompt)
        updateList()
        handleAdd()
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

            setPrompt({ ...prompt, text: newText })
        }
    }

    const handleTextareaChange = (e: Event) => {
        let text = (e.target as HTMLTextAreaElement).value
        if (text !== prompt.text) {
            setTextError(false)
            setPrompt({ ...prompt, text: text })
        }
    }

    const updatePlaceholderButtons = (text: string) => {
        setHasWebResultsPlaceholder(text.includes("{web_results}"))
        setHasQueryPlaceholder(text.includes("{query}"))
    }

    const actionToolbar = (
        <div className="wcg-flex wcg-flex-row wcg-justify-between wcg-mt-4">
            <div className="wcg-flex wcg-flex-row wcg-gap-4">
                <TooltipWrapper tip={showErrors ? "Insert placeholder for web results (required)" : ""}>
                    <button
                        className={`wcg-btn
                        ${showErrors && webResultsError ? "wcg-btn-error" : hasWebResultsPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        wcg-lowercase wcg-p-1`}
                        onClick={() => {
                            setWebResultsError(false)
                            handleInsertText('{web_results}')
                        }}
                    >
                        &#123;web_results&#125;
                    </button>
                </TooltipWrapper>
                <TooltipWrapper tip={showErrors ? "Insert placeholder for the current query (required)" : ""}>
                    <button
                        className={`wcg-btn
                        ${showErrors && queryError ? "wcg-btn-error" : hasQueryPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        wcg-lowercase wcg-p-1`}
                        onClick={() => {
                            setQueryError(false)
                            handleInsertText('{query}')
                        }}
                    >
                        &#123;query&#125;
                    </button>
                </TooltipWrapper>
                <button
                    className="wcg-btn wcg-btn-success wcg-lowercase wcg-p-1"
                    onClick={() => handleInsertText('{current_date}')}
                >
                    &#123;current_date&#125;
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

    const PromptList = (
        <div>
            <button
                className="wcg-btn wcg-btn-primary wcg-w-full wcg-text-base"
                onClick={handleAdd}>
                <span class="material-symbols-outlined wcg-mr-2">
                    add_circle
                </span>
                Add New Prompt
            </button>
            <ul className="wcg-menu wcg-p-0 wcg-max-h-96 wcg-scroll-m-0 wcg-scroll-y wcg-overflow-auto wcg-mt-4
                    wcg-flex wcg-flex-col wcg-flex-nowrap
                    wcg-border-solid wcg-border-2 wcg-border-white/20">
                {savedPrompts.map((inst) => (
                    <li
                        key={inst.name}
                        onClick={() => handleSelect(inst)}
                    >
                        <a className={`wcg-text-base ${inst.uuid === prompt.uuid ? 'wcg-active' : ''}`}>
                            📝 {inst.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )

    const nameInput = (
        <input
            ref={nameInputRef}
            className={`wcg-input wcg-input-bordered
                            ${showErrors && nameError ? "wcg-input-error" : ""}
                            wcg-flex-1`}
            placeholder="Name"
            value={prompt.name}
            onInput={(e: Event) => {
                setNameError(false)
                setPrompt({ ...prompt, name: (e.target as HTMLInputElement).value })
            }}
            disabled={prompt.name === defaultPrompt.name} />)

    const btnDelete = (
        <button
            className={`wcg-btn
                            ${deleteBtnText === "check" ? "wcg-btn-error" : "wcg-btn-primary"}
                            wcg-text-base
                            ${prompt.name === defaultPrompt.name ? "wcg-hidden" : ""}`}
            onClick={handleDeleteBtnClick}
            hidden={prompt.name === defaultPrompt.name}
        >
            <span class="material-symbols-outlined">
                {deleteBtnText}
            </span>
        </button>
    )

    const textArea = (
        <textarea
            ref={textareaRef}
            className={`wcg-textarea wcg-textarea-bordered
                        ${showErrors && textError ? "wcg-textarea-error" : ""}
                        wcg-h-96 wcg-resize-none wcg-text-base wcg-mt-2`}
            value={prompt.text}
            onInput={handleTextareaChange}
            disabled={prompt.name === defaultPrompt.name} />
    )

    return (
        <div className="wcg-w-4/5 wcg-border wcg-rounded-box wcg-py-4 wcg-flex wcg-flex-row wcg-gap-4 wcg-h-96">
            <div className="wcg-w-1/3">
                {PromptList}
            </div>

            <div className="wcg-flex wcg-flex-col wcg-w-2/3">
                <div className="wcg-flex wcg-flex-row wcg-gap-2 wcg-items-center">
                    {nameInput}
                    {btnDelete}
                </div>
                {textArea}

                {prompt.name !== defaultPrompt.name && (
                    actionToolbar
                )}
            </div>
        </div >
    )
}

export default PromptEditor
