import "../style/base.css"
import { h, render } from "preact"
import { getUserConfig, updateUserConfig } from "src/util/userConfig"
import { useLayoutEffect, useState } from "preact/hooks"
import PromptEditor from "src/components/promptEditor"
import { getTranslation, localizationKeys, setLocaleLanguage } from "src/util/localization"
import NavBar from "src/components/navBar"

const Footer = () => (
    <div className="wcg-flex wcg-flex-col wcg-items-center wcg-p-4" >
        <p style={{ whiteSpace: "pre-line" }} className="wcg-m-0 wcg-p-1 wcg-text-center wcg-text-sm">
            {getTranslation(localizationKeys.UI.supportMe)}
        </p>
        <a className="wcg-p-4" href="https://www.buymeacoffee.com/anzorq?utm_source=webchatgpt&utm_medium=options_page" target="_blank" rel="noopener noreferrer">
            <img src="https://img.buymeacoffee.com/button-api/?text=Support this project&emoji=&slug=anzorq&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" />
        </a>
    </div>
)

// const SocialCard = ({ icon, text }: { icon: JSX.Element, text: string }) => (
//     <div className="wcg-btn wcg-btn-ghost wcg-h-28 wcg-w-36 wcg-p-2 wcg-rounded-xl wcg-flex wcg-flex-col">
//         {icon}
//         <p className="wcg-normal-case wcg-p-2">{text}</p>
//     </div>
// )


export default function OptionsPage() {

    const [language, setLanguage] = useState<string>(null)


    useLayoutEffect(() => {
        getUserConfig().then(config => {
            setLanguage(config.language)
            setLocaleLanguage(config.language)
        })
    }, [])

    const onLanguageChange = (language: string) => {
        setLanguage(language)
        updateUserConfig({ language })
        setLocaleLanguage(language)
    }

    if (!language) {
        return <div />
    }

    return (
        <div className="wcg-flex wcg-w-3/5 wcg-flex-col wcg-items-center">

            <NavBar
                language={language}
                onLanguageChange={onLanguageChange}
            />

            <PromptEditor
                language={language}
            />


            <div className="wcg-mt-28 wcg-flex wcg-flex-col wcg-items-center wcg-self-center">
                {/* <div className="wcg-flex wcg-flex-row wcg-gap-4">
                    <SocialCard icon={icons.twitter} text={getTranslation(localizationKeys.socialButtonTips.twitter)} />
                    <SocialCard icon={icons.discord} text={getTranslation(localizationKeys.socialButtonTips.discord)} />
                    <SocialCard icon={icons.github} text={getTranslation(localizationKeys.socialButtonTips.github)} />
                </div> */}
                <Footer />
            </div>

        </div >
    )
}


render(<OptionsPage />, document.getElementById("options"))
