import '../style/base.css'
import { h, render } from 'preact'
import { getTextArea, getFooter, getRootElement } from '../util/elementFinder'
import Toolbar from '../components/toolbar'
import Footer from 'src/components/footer'

async function updateUI() {
    // console.log('run mainUI.tsx content script')
    const textarea = getTextArea()
    if (textarea) {
        
        const textareaParent = textarea.parentElement.parentElement
        textareaParent.style.flexDirection = 'column'

        // render(<Toolbar />, textareaParent)
        let div = document.createElement('div')
        textareaParent.appendChild(div)
        render(<Toolbar />, div)
    }

    const footer = getFooter()
    if (footer) {
        let div = document.createElement('div')
        footer.lastElementChild.appendChild(div)
        render(<Footer />, div)
    }
}

const rootEl = getRootElement()
window.onload = function () {
    updateUI()

    try {
        new MutationObserver(() => {
            updateUI()
        }).observe(rootEl, { childList: true })
    } catch (e) {
        console.info("WebChatGPT error --> Could not update UI:\n", e.stack)
    }
}
