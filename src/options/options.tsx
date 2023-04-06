import { h, render } from "preact"
import { getTranslation, localizationKeys, setLocaleLanguage } from "src/util/localization"
import { useLayoutEffect, useState } from "preact/hooks"
import PromptEditor from "src/components/promptEditor"
import NavBar from "src/components/navBar"
import { getUserConfig, updateUserConfig } from "src/util/userConfig"
import "../style/base.css"
import OptionsEditor from "src/components/optionsEditor"


const Footer = () => (
    <div className="wcg-flex wcg-flex-col wcg-items-center wcg-p-4" >
        <p style={{ whiteSpace: "pre-line" }} className="wcg-m-0 wcg-p-1 wcg-text-center wcg-text-lg">
            {getTranslation(localizationKeys.UI.supportMe)}
        </p>
        <div className="wcg-flex wcg-flex-row wcg-items-center wcg-gap-4">
            <a className="wcg-p-4" href="https://www.buymeacoffee.com/anzorq?utm_source=webchatgpt&utm_medium=options_page" target="_blank" rel="noopener noreferrer">
                <img src="https://img.buymeacoffee.com/button-api/?text=Support this project&slug=anzorq&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" alt="Buy Me A Coffee" />
            </a>
            <a className="wcg-p-4" href="https://chrome.google.com/webstore/detail/webchatgpt-chatgpt-with-i/lpfemeioodjbpieminkklglpmhlngfcn/reviews" target="_blank" rel="noopener noreferrer">
                <img src="../leave_review.png" alt="Review on Chrome Web Store" className="wcg-h-[4.25em] wcg-rounded-lg" />
            </a>
        </div>
    </div>
)

// const SocialCard = ({ icon, text, url }: { icon: JSX.Element, text: string, url: string }) => (
//     <a href={url} target="_blank" rel="noopener noreferrer">
//         <div className="wcg-btn-ghost wcg-btn wcg-flex wcg-h-28 wcg-w-36 wcg-flex-col wcg-rounded-xl wcg-p-2">
//             {icon}
//             <p className="wcg-p-2 wcg-normal-case wcg-text-current wcg-no-underline">{text}</p>
//         </div>
//     </a>
// )


export default function OptionsPage() {

    const [language, setLanguage] = useState<string | null>(null)


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
        <div className="wcg-flex wcg-w-5/6 wcg-flex-col wcg-items-center">

            <NavBar
                language={language}
                onLanguageChange={onLanguageChange}
            />
            <div className="wcg-flex wcg-w-full wcg-flex-col wcg-items-center wcg-gap-4 md:wcg-w-4/5">

                <PromptEditor
                    language={language}
                />

                <div className="wcg-divider wcg-m-0 wcg-w-4/5 wcg-self-center" />

                <OptionsEditor />

                <div className="wcg-divider wcg-m-0 wcg-w-4/5 wcg-self-center" />

                <div className="wcg-flex wcg-flex-col wcg-items-center wcg-self-center">
                    {/* <div className="wcg-flex wcg-flex-row wcg-gap-4">
                        <SocialCard icon={icons.twitter} text={getTranslation(localizationKeys.socialButtonTips.twitter)} url="https://twitter.com/hahahahohohe" />
                        <SocialCard icon={icons.discord} text={getTranslation(localizationKeys.socialButtonTips.discord)} url="https://discord.gg/hjvAtVNtHa" />
                        <SocialCard icon={icons.github} text={getTranslation(localizationKeys.socialButtonTips.github)} url="https://github.com/qunash/chatgpt-advanced" />
                    </div> */}
                    <Footer />
                </div>
            </div>

        </div >
    )
}


render(<OptionsPage />, document.getElementById("options") as Element)
