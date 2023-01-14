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
        <div class="wcg-error absolute wcg-bottom-0 wcg-right-1 dark:wcg-text-white wcg-bg-red-500 wcg-p-4 wcg-rounded-lg wcg-mb-4 wcg-mr-4 wcg-text-sm">
            <b>An error occurred</b><br />
            {message}<br /><br />
            Check the console for more details.
        </div>
    )
}

export default MessageError
