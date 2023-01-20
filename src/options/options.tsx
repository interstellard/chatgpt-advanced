import "../style/base.css"
import { h, render } from "preact"
import { getUserConfig, updateUserConfig } from "src/util/userConfig"
import { useCallback, useEffect, useState } from "preact/hooks"
import PromptEditor from "src/components/promptEditor"
import { getCurrentLanguage as getSystemLanguage, Languages, LocalizationKeys, LocalizationManager } from "src/util/localization"
import NavBar from "src/components/navBar"


const buyMeACoffeeButton = (
    <div className="wcg-w-3/5 wcg-fixed wcg-bottom-0 wcg-flex wcg-flex-row-reverse">
        <a className="wcg-right-0 wcg-p-4" href="https://www.buymeacoffee.com/anzorq?utm_source=webchatgpt&utm_medium=options_page" target="_blank" rel="noopener noreferrer">
            <img src="https://img.buymeacoffee.com/button-api/?text=Support this project&emoji=&slug=anzorq&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" />
        </a>
    </div>
)


export default function OptionsPage() {

    const [language, setLanguage] = useState<string>(Object.keys(Languages)[0])
    const [localizationManager, setLocalizationManager] = useState<LocalizationManager>(new LocalizationManager(getSystemLanguage()))

    useEffect(() => {
        getUserConfig().then(config => {
            setLocalizationManager(new LocalizationManager(config.language))
            setLanguage(config.language)
        })
    }, [])

    const onLanguageChange = useCallback((language: string) => {
        setLanguage(language)
        updateUserConfig({ language })
        setLocalizationManager(new LocalizationManager(language))
    }, [])


    return (
        <div className="wcg-w-3/5">

            <NavBar
                language={language}
                onLanguageChange={onLanguageChange}
                localizationManager={localizationManager}
            />

            <PromptEditor
                localizationManager={localizationManager}
            />

            {buyMeACoffeeButton}
        </div >
    )
}


render(<OptionsPage />, document.getElementById("options"))
