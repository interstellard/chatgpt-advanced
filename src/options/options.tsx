import "../style/base.css"
import { h, render } from "preact"
import { getUserConfig, updateUserConfig } from "src/util/userConfig"
import { useCallback, useEffect, useState } from "preact/hooks"
import PromptEditor from "src/components/promptEditor"
import { getSystemLanguage, Languages, setLocaleLanguage } from "src/util/localization"
import NavBar from "src/components/navBar"


const buyMeACoffeeButton = (
    <div className="wcg-w-3/5 wcg-fixed wcg-bottom-0 wcg-flex wcg-flex-row-reverse">
        <a className="wcg-right-0 wcg-p-4" href="https://www.buymeacoffee.com/anzorq?utm_source=webchatgpt&utm_medium=options_page" target="_blank" rel="noopener noreferrer">
            <img src="https://img.buymeacoffee.com/button-api/?text=Support this project&emoji=&slug=anzorq&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" />
        </a>
    </div>
)


export default function OptionsPage() {

    const [language, setLanguage] = useState<string>(getSystemLanguage())

    useEffect(() => {
        getUserConfig().then(config => {
            setLanguage(config.language)
            setLocaleLanguage(config.language)
        })
    }, [])

    const onLanguageChange = useCallback((language: string) => {
        setLanguage(language)
        updateUserConfig({ language })
        setLocaleLanguage(language)
    }, [])


    return (
        <div className="wcg-w-3/5">

            <NavBar
                language={language}
                onLanguageChange={onLanguageChange}
            />

            <PromptEditor />

            {buyMeACoffeeButton}
        </div >
    )
}


render(<OptionsPage />, document.getElementById("options"))
