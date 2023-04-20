import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { icons } from 'src/util/icons'
import { getSavedPrompts, Prompt } from 'src/util/promptManager'
import { getUserConfig, updateUserConfig } from 'src/util/userConfig'
import timePeriodOptions from 'src/util/timePeriodOptions.json'
import regionOptions from 'src/util/regionOptions.json'
import Browser from 'webextension-polyfill'
import Dropdown from './dropdown'
import { getTranslation, localizationKeys, setLocaleLanguage } from 'src/util/localization'
import Footer from './footer'

type DropdownItem = {
    target: {
        value: string
    }
}

const numResultsOptions = Array.from({ length: 10 }, (_, i) => i + 1).map((num) => ({
    value: num,
    label: `${num} result${num === 1 ? '' : 's'}`
}))

numResultsOptions.push({
    value: 100,
    label: 'Max results'
})

interface ToolbarProps {
    textarea: HTMLTextAreaElement | null
}
const Toolbar = ({ textarea }: ToolbarProps) => {
    const [webAccess, setWebAccess] = useState(false)
    const [numResults, setNumResults] = useState(3)
    const [timePeriod, setTimePeriod] = useState('')
    const [region, setRegion] = useState('wt-wt')
    const [promptUUID, setPromptUUID] = useState<string>('')
    const [prompts, setPrompts] = useState<Prompt[]>([])

    useEffect(() => {
        getUserConfig().then((userConfig) => {
            setWebAccess(userConfig.webAccess)
            setNumResults(userConfig.numWebResults)
            setTimePeriod(userConfig.timePeriod)
            setRegion(userConfig.region)
            setPromptUUID(userConfig.promptUUID)

            setLocaleLanguage(userConfig.language)
            updateTextAreaPlaceholder(userConfig.webAccess)
        })
        updatePrompts()
    }, [])

    useEffect(() => {
        const handleMessage = async (request: string) => {
            if (request === "toggle-web-access") {
                handleWebAccessToggle()
            }
        }

        Browser.runtime.onMessage.addListener(handleMessage)

        return () => Browser.runtime.onMessage.removeListener(handleMessage)
    }, [])

    useEffect(() => {
        updateUserConfig({ webAccess })
        updateTextAreaPlaceholder(webAccess)
        textarea?.focus()
    }, [webAccess])

    const handlePromptClick = () => updatePrompts()

    const updatePrompts = () => {
        getSavedPrompts().then((savedPrompts) => {
            setPrompts(savedPrompts)
        })
    }

    const updateTextAreaPlaceholder = (show: boolean) => {
        textarea?.setAttribute('placeholder', show ? getTranslation(localizationKeys.UI.textareaPlaceholder) : '')
    }

    const handleWebAccessToggle = () => setWebAccess((prev) => !prev)

    const handleNumResultsChange = (e: DropdownItem) => {
        const value = parseInt(e.target.value, 10)
        setNumResults(value)
        updateUserConfig({ numWebResults: value })
    }

    const handleTimePeriodChange = (e: DropdownItem) => {
        setTimePeriod(e.target.value)
        updateUserConfig({ timePeriod: e.target.value })
    }

    const handleRegionChange = (e: DropdownItem) => {
        setRegion(e.target.value)
        updateUserConfig({ region: e.target.value })
    }

    const handlePromptChange = (e: DropdownItem) => {

        const uuid = e.target.value

        if (uuid === 'wcg-new-prompt') {
            Browser.runtime.sendMessage("show_options")
            e.target.value = promptUUID
            return
        }

        removeFocusFromCurrentElement()

        setPromptUUID(uuid)
        updateUserConfig({ promptUUID: uuid })
    }

    const removeFocusFromCurrentElement = () => (document.activeElement as HTMLElement)?.blur()


    const webAccessToggle =
        <div className="wcg-group wcg-relative wcg-flex">
            <label className="wcg-relative wcg-inline-flex wcg-cursor-pointer wcg-items-center">
                <input type="checkbox" value="" className="wcg-peer wcg-sr-only" checked={webAccess} onChange={handleWebAccessToggle} title="Web access" />
                <div className="wcg-peer wcg-h-5 wcg-w-9 wcg-rounded-full wcg-bg-gray-500 after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-h-4 after:wcg-w-4 after:wcg-rounded-full after:wcg-border after:wcg-border-gray-300 after:wcg-bg-white after:wcg-transition-all after:wcg-content-[''] peer-checked:wcg-bg-emerald-700 peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white peer-focus:wcg-ring-2 peer-focus:wcg-ring-white dark:wcg-border-gray-600" />
                <span className="wcg-ml-1 wcg-pl-1 wcg-text-sm wcg-font-semibold after:wcg-content-['Web'] md:after:wcg-content-['Web_access']"
                    style="inline-size: max-content;"
                />
            </label>
            <span class="wcg-absolute wcg-left-1/2 wcg-m-4 wcg-mx-auto -wcg-translate-x-6 wcg-translate-y-3 wcg-rounded-md wcg-bg-gray-800 wcg-p-1 
            wcg-text-xs wcg-text-gray-100 wcg-opacity-0 wcg-transition-opacity group-hover:wcg-opacity-100">Alt+W</span>
        </div>

    return (
        <div className="wcg-flex wcg-flex-col wcg-gap-0">
            <div className="wcg-toolbar wcg-flex wcg-items-center wcg-gap-2 wcg-rounded-md wcg-px-1">
                <div className="wcg-btn-xs wcg-btn focus:wcg-ring-2 focus:wcg-ring-white"
                    tabIndex={0}
                    onClick={() => Browser.runtime.sendMessage("show_options")}
                >
                    {icons.tune}
                </div>
                {webAccessToggle}
                {/* <div className={`wcg-flex ${webAccess ? '' : 'wcg-hidden'} wcg-w-full wcg-justify-between wcg-gap-1`}> */}

                <div class="wcg-scrollbar-hidden wcg-flex wcg-items-center wcg-justify-between wcg-gap-2 wcg-overflow-x-scroll wcg-px-1 lg:wcg-overflow-x-hidden">
                    <Dropdown
                        value={numResults}
                        onChange={handleNumResultsChange}
                        options={numResultsOptions} />
                    <Dropdown
                        value={timePeriod}
                        onChange={handleTimePeriodChange}
                        options={timePeriodOptions} />
                    <Dropdown
                        value={region}
                        onChange={handleRegionChange}
                        options={regionOptions} />
                    <Dropdown
                        value={promptUUID}
                        onChange={handlePromptChange}
                        options={
                            prompts.map((prompt) => ({ value: prompt.uuid ?? 'undefin', label: prompt.name })).concat({ value: 'wcg-new-prompt', label: `+ ${getTranslation(localizationKeys.buttons.newPrompt)}` })
                        }
                        onClick={handlePromptClick}
                    />
                </div>
                {/* </div> */}
            </div>
            <Footer />
        </div>
    )
}

export default Toolbar