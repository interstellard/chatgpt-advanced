import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { icons } from 'src/util/icons'
import { getTranslation, Languages, localizationKeys } from 'src/util/localization'
import IconButton from './socialIconButton'
import TooltipWrapper from './tooltipWrapper'


const NavBar = (
    props: {
        language: string,
        onLanguageChange: (language: string) => void,
    }
) => {
    console.log(props.language)

    return (<div className="wcg-sticky wcg-top-0 wcg-z-30 wcg-navbar wcg-bg-base-200 wcg-rounded-lg">
        <div className="wcg-flex-1">
            <img className="wcg-w-8 wcg-p-2" src="../icons/icon48.png" />
            <span className="wcg-font-bold wcg-text-xl">WebChatGPT</span>
        </div>
        <div className="wcg-flex-none wcg-gap-3">
            <TooltipWrapper tip={getTranslation(localizationKeys.UI.chooseLanguage)}>
                <div className="wcg-dropdown wcg-dropdown-end">
                    <div tabIndex={0} className="wcg-btn wcg-btn-ghost wcg-p-2 wcg-px-4">
                        {icons.language}
                        {icons.expand}
                    </div>
                    <ul tabIndex={0} className="wcg-dropdown-content wcg-menu wcg-p-2 wcg-shadow wcg-bg-base-100 wcg-rounded-box wcg-w-52">
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
            <IconButton url="https://twitter.com/hahahahohohe" tip={getTranslation(localizationKeys.socialButtonTips.twitter)} icon={icons.twitter} />
            <IconButton url="https://github.com/qunash/chatgpt-advanced" tip={getTranslation(localizationKeys.socialButtonTips.github)} icon={icons.github} />
            <IconButton url="https://discord.gg/hjvAtVNtHa" tip={getTranslation(localizationKeys.socialButtonTips.discord)} icon={icons.discord} />
        </div>
    </div>)
}

export default NavBar
