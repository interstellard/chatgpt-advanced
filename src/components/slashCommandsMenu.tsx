import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

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
        <div className={`flex-col p-3 gap-3 rounded-md hover:bg-[#2A2B32] cursor-pointer text-white
                        ${props.active ? 'bg-gray-800' : ''}`}
            onClick={() => props.onclick(props.command)}
        >
            <div className="text-sm font-bold">{props.command.name}</div>
            <div className="text-sm">{props.command.description}</div>
        </div>
    )
}

function SlashCommandsMenu(
    props: {
        textarea: HTMLTextAreaElement | null,
    }
) {

    const [show, setShow] = useState<boolean>(false)
    const [activeElementIndex, setActiveElementIndex] = useState<number>(0)
    const [filter, setFilter] = useState<string>('')
    const [filteredCommands, setFilteredCommands] = useState<Command[]>(slashCommands)


    const onTextAreaInput = (e: InputEvent) => updateFilter(e)

    const onTextAreaKeyDown = (e: KeyboardEvent) => {

        if (!show) return

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
            setShow(false)
        }
    }

    function updateFilter(e: Event) {
        const text = (e.target as HTMLTextAreaElement).value
        if (text.startsWith('/')) {
            setFilter(text)
        } else {
            setFilter('')
            setActiveElementIndex(0)
        }
    }

    const onCommandClick = (command: Command) => {
        props.textarea.value = command.name
        setShow(false)
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
            setShow(false)
            return
        }
        
        const newFilteredCommands = slashCommands.filter((command) => command.name.startsWith(filter))
        setFilteredCommands(newFilteredCommands)

        setShow(newFilteredCommands.length > 0)

    }, [filter])


    if (!show) return null

    return (
        <ul className={`flex-col flex-1 overflow-y-auto border border-white/20 rounded-md bg-gray-900`}>

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
        </ul>
    )
}

export default SlashCommandsMenu
