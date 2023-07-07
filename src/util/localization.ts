import Browser from "webextension-polyfill"
import * as localizedStrings from './localizedStrings.json'

export const getSystemLanguage = () => Browser.i18n.getUILanguage().split("-")[0]

export const Languages = {
    auto: "Auto",
    en: "English",
    de: "Deutsch",
    es: "Español",
    fa: "Persian (فارسی)",
    fr: "Français",
    id: "Indonesia",
    it: "Italiano",
    ja: "日本語",
    ko: "한국어",
    pl: "Polski",
    pt: "Português",
    ru: "Русский",
    zh: "中文",
    "zh-TW": "中文（臺灣）",
    he: "עברית",
    bg: "Български"
}

const DEFAULT_LANGUAGE = 'en'


let language = getSystemLanguage()

export const getLocaleLanguage = () => language

export const getCurrentLanguageName = () => language === Languages.auto ? Languages.en : Languages[language]

export const setLocaleLanguage = (newLanguage: string) => {
    language = newLanguage === 'auto' ? getSystemLanguage() : newLanguage
}

export const getTranslation = (key: string, lang?: string) => {
    if (lang) {
        return localizedStrings[key][lang]
    }
    if (language in localizedStrings[key]) {
        return localizedStrings[key][language]
    }
    return localizedStrings[key][DEFAULT_LANGUAGE]
}


export const localizationKeys = {
    defaultPrompt: 'default_prompt',
    UI: {
        language: 'language',
        options: 'options',
        trimLongText: 'trim_long_text',
        supportThisProject: 'support_this_project',
        supportMe: 'support_me',
        chooseLanguage: 'choose_language',
        textareaPlaceholder: 'textarea_placeholder',
    },
    slashCommandsMenu: {
        siteCommandDescription: 'site_command_description',
        pageCommandDescription: 'page_command_description',
    },
    placeholders: {
        namePlaceholder: 'name_placeholder',
    },
    buttons: {
        save: 'save',
        newPrompt: 'new_prompt',
    },
    placeHolderTips: {
        currentDate: 'current_date_placeholder_tip',
        webResults: 'web_results_placeholder_tip',
        query: 'query_placeholder_tip',
    },
    socialButtonTips: {
        twitter: 'twitter_button_tip',
        github: 'github_button_tip',
        discord: 'discord_button_tip',
    }
}
