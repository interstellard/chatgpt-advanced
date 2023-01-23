import { h, options } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { icons } from 'src/util/icons'
import { getSavedPrompts, Prompt } from 'src/util/promptManager'
import { getUserConfig, updateUserConfig } from 'src/util/userConfig'
import timePeriodOptions from 'src/util/timePeriodOptions.json'
import regionOptions from 'src/util/regionOptions.json'
import Browser from 'webextension-polyfill'
import Dropdown from './dropdown'
import { getTranslation, localizationKeys, setLocaleLanguage } from 'src/util/localization'


const numResultsOptions = Array.from({ length: 10 }, (_, i) => i + 1).map((num) => ({
    value: num,
    label: `${num} result${num === 1 ? '' : 's'}`
}))

function Toolbar() {
    const [webAccess, setWebAccess] = useState(true)
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
        })
        getSavedPrompts().then((savedPrompts) => {
            setPrompts(savedPrompts)
        })
    }, [])

    const handlePromptClick = () => {
        getSavedPrompts().then((savedPrompts) => {
            setPrompts(savedPrompts)
        })
    }

    const handleWebAccessToggle = useCallback(() => {
        setWebAccess(!webAccess)
        updateUserConfig({ webAccess: !webAccess })
    }, [webAccess])

    const handleNumResultsChange = useCallback((e: { target: { value: string } }) => {
        const value = parseInt(e.target.value)
        setNumResults(value)
        updateUserConfig({ numWebResults: value })
    }, [numResults])

    const handleTimePeriodChange = useCallback((e: { target: { value: string } }) => {
        setTimePeriod(e.target.value)
        updateUserConfig({ timePeriod: e.target.value })
    }, [timePeriod])

    const handleRegionChange = useCallback((e: { target: { value: string } }) => {
        setRegion(e.target.value)
        updateUserConfig({ region: e.target.value })
    }, [region])

    const handlePromptChange = (uuid: string) => {
        const elem = document.activeElement
        if (elem) {
            (elem as HTMLElement)?.blur() // removes focus from current element
        }

        setPromptUUID(uuid)
        updateUserConfig({ promptUUID: uuid })
    }

    const webAccessToggle = <label className="wcg-relative wcg-inline-flex wcg-items-center wcg-cursor-pointer">
        <input type="checkbox" value="" className="wcg-sr-only wcg-peer" checked={webAccess} onChange={handleWebAccessToggle} />
        <div className="wcg-w-9 wcg-h-5 wcg-bg-gray-500 wcg-rounded-full wcg-peer peer-checked:after:wcg-translate-x-full peer-checked:after:wcg-border-white after:wcg-content-[''] after:wcg-absolute after:wcg-top-[2px] after:wcg-left-[2px] after:wcg-bg-white after:wcg-border-gray-300 after:wcg-border after:wcg-rounded-full after:wcg-h-4 after:wcg-w-4 after:wcg-transition-all dark:wcg-border-gray-600 peer-checked:wcg-bg-emerald-700" />
        <span className="wcg-ml-1 wcg-text-sm md:after:wcg-content-['Search_on_the_web'] after:wcg-content-['Web']" />
    </label>

    return (
        <div className="wcg-toolbar wcg-flex wcg-items-center wcg-gap-2 wcg-mt-0 wcg-p-0 wcg-px-1 wcg-rounded-md">

            <div className="wcg-btn wcg-btn-xs"
                onClick={() => Browser.runtime.sendMessage("show_options")}
            >
                {icons.tune}
            </div>
            {webAccessToggle}

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
            {/* <Dropdown
                value={promptUUID}
                onChange={handlePromptChange}
                onClick={handlePromptClick}
                options={prompts.map((prompt) => ({ value: prompt.uuid, label: prompt.name }))} /> */}
            <div className="wcg-dropdown wcg-dropdown-top"
                onClick={handlePromptClick}
            >
                <div tabIndex={0} className="wcg-flex wcg-items-center wcg-gap-0 wcg-flex-row wcg-cursor-pointer">
                    <label className="wcg-btn wcg-text-sm wcg-normal-case   wcg-pr-0 wcg-max-w-[7rem] wcg-truncate wcg-justify-start">
                        {prompts?.find((prompt) => prompt.uuid === promptUUID)?.name || 'Default prompt'}
                    </label>
                    {icons.expand}
                </div>
                <ul tabIndex={0} className="wcg-dropdown-content wcg-menu wcg-p-0 wcg-m-0 wcg-rounded-md wcg-w-52 wcg-bg-gray-800
                wcg-max-h-96 wcg-overflow-auto
                wcg-flex wcg-flex-col wcg-flex-nowrap"
                >
                    {prompts.map((prompt) =>
                        <li tabIndex={0} className="hover:wcg-bg-gray-700 wcg-text-sm wcg-text-white"
                            onClick={() => handlePromptChange(prompt.uuid)}
                        >
                            <a>{prompt.name}</a>
                        </li>
                    )
                    }
                    <li className="hover:wcg-bg-gray-700 wcg-text-sm wcg-text-white"
                        onClick={() => Browser.runtime.sendMessage("show_options")
                        }
                    >
                        <a>+ {getTranslation(localizationKeys.buttons.newPrompt)}</a>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default Toolbar
