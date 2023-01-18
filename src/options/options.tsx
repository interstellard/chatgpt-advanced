import "../style/base.css"
import { h, JSX, render } from "preact"
import { getUserConfig, Languages as Language, updateUserConfig } from "src/util/userConfig"
import { useCallback, useEffect, useState } from "preact/hooks"
import { capitalize } from 'lodash-es'
import { icons } from 'src/util/icons'
import InstructionsEditor from "src/components/InstructionEditor"
import SocialIconButton from "src/components/socialIconButton"

const buyMeACoffeeButton = (
    <div className="wcg-w-3/5 wcg-fixed wcg-bottom-0 wcg-flex wcg-flex-row-reverse">
        <a className="wcg-right-0 wcg-p-4" href="https://www.buymeacoffee.com/anzorq?utm_source=webchatgpt&utm_medium=options_page" target="_blank" rel="noopener noreferrer">
            <img src="https://img.buymeacoffee.com/button-api/?text=Support this project&emoji=&slug=anzorq&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" />
        </a>
    </div>
)


const navBar = <div className="wcg-sticky wcg-top-0 wcg-z-30 wcg-navbar wcg-bg-base-200 wcg-rounded-lg">
    <div className="wcg-flex-1">
        <img className="wcg-w-8 wcg-p-2" src="../icons/icon48.png" />
        <span className="wcg-font-bold wcg-text-xl">WebChatGPT</span>
    </div>
    <div className="wcg-flex-none wcg-gap-3">
        <SocialIconButton url="https://twitter.com/hahahahohohe" tip="Follow me on Twitter" icon={icons.twitter} />
        <SocialIconButton url="https://github.com/qunash/chatgpt-advanced" tip="View source code on GitHub" icon={icons.github} />
        <SocialIconButton url="https://discord.gg/hjvAtVNtHa" tip="Join our Discord server" icon={icons.discord} />
    </div>
</div>


export default function App() {

    const [language, setLanguage] = useState<Language>(Language.Auto)

    useEffect(() => {
        getUserConfig().then(config => {
            setLanguage(config.language)
        })
    })

    const onLanguageChange = useCallback((language: Language) => {
        updateUserConfig({ language })
    }, [])

    return (
        <div className="wcg-w-3/5">
            {navBar}
            <div className="wcg-container wcg-mx-auto wcg-p-4 wcg-h-screen">
                <div className="wcg-flex wcg-flex-row wcg-items-center wcg-gap-2">
                    <span className="wcg-card-title">Language</span>
                    <select className="wcg-select wcg-select-bordered w-full max-w-xs"
                        value={language}
                        onChange={(e) => onLanguageChange((e.target as HTMLSelectElement).value as Language)}
                    >
                        {
                            Object.values(Language).map(lang => {
                                return <option value={lang}>{capitalize(lang)}</option>
                            })
                        }
                    </select>
                </div>

                <div className="wcg-divider wcg-my-4"></div>

                {InstructionsEditor()}


                {buyMeACoffeeButton}
            </div>
        </div >
    )
}


render(<App />, document.getElementById("options"))