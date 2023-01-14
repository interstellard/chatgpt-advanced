// preact MessageError, that displays an error message for 5 seconds
// and then hides it again

import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'


const MessageError = ({ message }) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false)
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    return show && (
        <div class="web-chatgpt-error absolute bottom-0 right-1 dark:text-white bg-red-500 p-4 rounded-lg mb-4 mr-4 text-sm">
            <b>An error occurred</b><br />
            {message}<br /><br />
            Check the console for more details.
        </div>
    )
}

export default MessageError
