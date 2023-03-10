import { h, render } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { getTranslation, localizationKeys } from 'src/util/localization'
import SlashButton from './slashButton'

interface Command {
    name: string
    description: string
}

const slashCommands: Command[] = [
    {
        name: "/site:",
        description: "Restrict search results to a specific website, e.g. /site:google.com"
    },
    {
        name: "/page:",
        description: "Get the content of a specific page, e.g. /page:buymeacoffee.com/anzorq"
    }
]


const SlashCommandItem = (props: {
    command: Command,
    onclick: (command: Command) => void
    active?: boolean
}) => {
    return (
        <div className={`flex-col p-3 gap-3 hover:bg-[#2A2B32] cursor-pointer text-white
                        ${props.active ? 'bg-gray-800' : ''}`}
            onClick={() => props.onclick(props.command)}
        >
            <div className="text-sm font-bold">{props.command.name}</div>
            <div className="text-sm">{props.command.description}</div>
        </div>
    )
}

const renderSlashButton = (textarea: HTMLTextAreaElement, show: boolean, onClick: () => void) => {
    let div = document.querySelector('wcg-slash-button-div')
    if (div) div.remove()

    div = document.createElement('wcg-slash-button-div')
    div.className = "self-center"
    textarea.parentElement.insertBefore(div, textarea.parentElement.firstChild)
    render(<SlashButton show={show} onclick={onClick} />, div)
}

function SlashCommandsMenu(
    props: {
        textarea: HTMLTextAreaElement | null,
    }
) {

    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [activeElementIndex, setActiveElementIndex] = useState<number>(0)
    const [filter, setFilter] = useState<string>('')
    const [filteredCommands, setFilteredCommands] = useState<Command[]>(slashCommands)


    const onTextAreaInput = (e: InputEvent) => updateFilter(e)

    const onTextAreaKeyDown = (e: KeyboardEvent) => {

        if (!showMenu) return

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveElementIndex(prevIndex => Math.max(prevIndex - 1, 0))
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveElementIndex(prevIndex => Math.min(prevIndex + 1, filteredCommands.length - 1))
        }

        if (e.key === 'Tab') {
            e.preventDefault()
            const command = filteredCommands[activeElementIndex]
            if (command) {
                onCommandClick(command)
            }
        }
    }

    function updateFilter(e: Event) {
        const text = (e.target as HTMLTextAreaElement).value
        if (text.startsWith('/')) {
            setFilter(text)
        } else {
            setFilter('')
        }
        setActiveElementIndex(0)
    }

    const onCommandClick = (command: Command) => {
        setTextAreaValue(command.name, false)
        setShowMenu(false)
    }

    function setTextAreaValue(value: string, dispatchEvent = true) {
        props.textarea.value = value
        if (dispatchEvent)
            props.textarea.dispatchEvent(new Event('input', { bubbles: true }))
        props.textarea.focus()
    }


    useEffect(() => {
        props.textarea?.addEventListener('input', onTextAreaInput)
        props.textarea?.addEventListener('keydown', onTextAreaKeyDown)

        return function cleanup() {
            props.textarea?.removeEventListener('input', onTextAreaInput)
            props.textarea?.removeEventListener('keydown', onTextAreaKeyDown)
        }
    })

    useEffect(() => {
        if (filter === '') {
            setShowMenu(false)
            return
        }

        const newFilteredCommands = slashCommands.filter((command) => command.name.startsWith(filter))
        setFilteredCommands(newFilteredCommands)

        setShowMenu(newFilteredCommands.length > 0)

    }, [filter])

    // useEffect(() => {
    //     renderSlashButton(props.textarea, !showMenu,
    //         onclick = () => {
    //             setTextAreaValue('/')
    //         })
    // }, [showMenu])


    if (!showMenu) return null

    return (
        <ul className={`flex-col flex-1 overflow-y-auto border border-white/20 rounded-md bg-gray-900 shadow-[0_0_10px_rgba(0,0,0,0.10)]`}>
            <div className='px-3 p-2 text-xs text-white b-2 border-b border-white/20'>WebChatGPT Commands</div>

            {filteredCommands.map((command) => {
                return (
                    <li key={command.name}>
                        <SlashCommandItem
                            command={command}
                            onclick={onCommandClick}
                            active={activeElementIndex === filteredCommands.indexOf(command)}
                        />
                    </li>
                )
            })}
            <div className='px-3 p-2 text-xs text-white b-2 border-t border-white/20'>{
                getTranslation(localizationKeys.UI.youCanUseDuckDuckGoBangs)
            }
            <a href="https://duckduckgo.com/bang" target="_blank" rel="noreferrer" className="text-blue-500"> DuckDuckGo Bangs</a>
            </div>
        </ul>
    )
}

export default SlashCommandsMenu
