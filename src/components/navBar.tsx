import { h } from 'preact'
import { icons } from 'src/util/icons'
import { getTranslation, Languages, localizationKeys } from 'src/util/localization'
import Browser from 'webextension-polyfill'
import IconButton from './socialIconButton'
import TooltipWrapper from './tooltipWrapper'


const NavBar = (
    props: {
        language: string,
        onLanguageChange: (language: string) => void,
    }
) => {

    const version = Browser.runtime.getManifest().version

    return (<div className="wcg-navbar wcg-sticky wcg-top-0 wcg-z-30 wcg-rounded-lg wcg-bg-base-200">
        <div className="wcg-flex-1 wcg-items-center wcg-gap-2">
            <img className="wcg-w-8 wcg-p-2" src="../icons/icon48.png" />
            <span className="wcg-text-xl wcg-font-bold">WebChatGPT</span>
            <span className="font-mono text-xs text-opacity-50 wcg-pt-1">{version}</span>
        </div>
        <div className="wcg-flex-none wcg-gap-3">
            <TooltipWrapper tip={getTranslation(localizationKeys.UI.chooseLanguage)}>
                <div className="wcg-dropdown-end wcg-dropdown">
                    <div tabIndex={0} className="wcg-btn-ghost wcg-btn wcg-p-2 wcg-px-4">
                        {icons.language}
                        {icons.expand}
                    </div>
                    <ul tabIndex={0} className="wcg-dropdown-content wcg-menu wcg-rounded-box wcg-w-52 wcg-bg-base-100 wcg-p-2 wcg-shadow">
                        {
                            Object.entries(Languages).map(([value, label]) => (
                                <li
                                    key={value} className="wcg-menu-item"
                                    onClick={() => props.onLanguageChange(value)}
                                >
                                    <a className={`wcg-text-base ${value === props.language ? 'wcg-active' : ''}`}>
                                        {label}
                                    </a>
                                </li>

                            ))
                        }
                    </ul>
                </div>

            </TooltipWrapper>
            <div className="wcg-divider" />
            <IconButton url="https://twitter.com/hahahahohohe" tip={getTranslation(localizationKeys.socialButtonTips.twitter)} icon={icons.twitter} />
            <IconButton url="https://github.com/qunash/chatgpt-advanced" tip={getTranslation(localizationKeys.socialButtonTips.github)} icon={icons.github} />
            <IconButton url="https://discord.gg/hjvAtVNtHa" tip={getTranslation(localizationKeys.socialButtonTips.discord)} icon={icons.discord} />
        </div>
    </div>)
}

export default NavBar
