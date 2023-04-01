const originalFetch = window.fetch

window.fetch = function (input, init) {

    console.log('fetch intercepted', input, init)

    // [
    //     "https://chat.openai.com/backend-api/conversation",
    //     {
    //         "method": "POST",
    //         "credentials": "include",
    //         "body": "{\"action\":\"next\",\"messages\":[{\"id\":\"d2441426-8634-4e5f-9558-e299c9a2e91d\",\"author\":{\"role\":\"user\"},\"content\":{\"content_type\":\"text\",\"parts\":[\"hey\"]}}],\"parent_message_id\":\"a0227dea-7897-46e4-9170-00c5614e3d4c\",\"model\":\"text-davinci-002-render-sha\",\"timezone_offset_min\":-180}",
    //         "headers": {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer xxx",
    //             "accept": "text/event-stream"
    //         },
    //         "signal": {}
    //     }
    // ]
    
    if (input === 'https://chat.openai.com/backend-api/conversation' && init) {
        const body = JSON.parse(init.body?.toString() || '{}')
        body.messages[0].content.parts[0] = "What's 2+2?"
        init.body = JSON.stringify(body)
    }

    return originalFetch(input, init)
}