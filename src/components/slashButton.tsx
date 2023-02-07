import { h } from 'preact'

function SlashButton(
    props: {
        show: boolean,
        onclick: () => void
    }
) {

    return (
        <div
            className={`cursor-pointer rounded-md border text-sm px-2 mr-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 ${!props.show ? 'invisible' : ''}`}
            onClick={props.onclick}>
            /
        </div>
    )
}

export default SlashButton
