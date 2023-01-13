import '../style/base.css'
import { h, render } from 'preact'
import { getUserConfig } from '../util/userConfig'
import * as elementFinder from '../util/elementFinder'
import Toolbar from '../components/toolbar'

async function getDefaultParams() {

    const userConfig = await getUserConfig()

    console.log(userConfig)
}

async function run() {
    await getDefaultParams()
    const textarea = elementFinder.getTextArea()
    if (textarea) {
        render(<Toolbar />, textarea.parentElement.parentElement)
    }
}

run()
