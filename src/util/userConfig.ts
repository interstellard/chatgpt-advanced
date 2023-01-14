import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

const defaultConfig = {
    numWebResults: 3,
    webAccess: true,
    region: 'wt-wt',
    timePeriod: '',
}


export type UserConfig = typeof defaultConfig

export async function getUserConfig(): Promise<UserConfig> {
    const config = await Browser.storage.sync.get(defaultConfig)
    return defaults(config, defaultConfig)
}

export async function updateUserConfig(config: Partial<UserConfig>): Promise<void> {
    await Browser.storage.sync.set(config)
}


export const timePeriodOptions = [
    { value: "", label: "Any time" },
    { value: "d", label: "Past day" },
    { value: "w", label: "Past week" },
    { value: "m", label: "Past month" },
    { value: "y", label: "Past year" }
]

export const regionOptions = [
    { "value": "wt-wt", "label": "Any region" },
    { "value": "xa-ar", "label": "Saudi Arabia" },
    { "value": "xa-en", "label": "Saudi Arabia (en)" },
    { "value": "ar-es", "label": "Argentina" },
    { "value": "au-en", "label": "Australia" },
    { "value": "at-de", "label": "Austria" },
    { "value": "be-fr", "label": "Belgium (fr)" },
    { "value": "be-nl", "label": "Belgium (nl)" },
    { "value": "br-pt", "label": "Brazil" },
    { "value": "bg-bg", "label": "Bulgaria" },
    { "value": "ca-en", "label": "Canada" },
    { "value": "ca-fr", "label": "Canada (fr)" },
    { "value": "ct-ca", "label": "Catalan" },
    { "value": "cl-es", "label": "Chile" },
    { "value": "cn-zh", "label": "China" },
    { "value": "co-es", "label": "Colombia" },
    { "value": "hr-hr", "label": "Croatia" },
    { "value": "cz-cs", "label": "Czech Republic" },
    { "value": "dk-da", "label": "Denmark" },
    { "value": "ee-et", "label": "Estonia" },
    { "value": "fi-fi", "label": "Finland" },
    { "value": "fr-fr", "label": "France" },
    { "value": "de-de", "label": "Germany" },
    { "value": "gr-el", "label": "Greece" },
    { "value": "hk-tzh", "label": "Hong Kong" },
    { "value": "hu-hu", "label": "Hungary" },
    { "value": "in-en", "label": "India" },
    { "value": "id-id", "label": "Indonesia" },
    { "value": "id-en", "label": "Indonesia (en)" },
    { "value": "ie-en", "label": "Ireland" },
    { "value": "il-he", "label": "Israel" },
    { "value": "it-it", "label": "Italy" },
    { "value": "jp-jp", "label": "Japan" },
    { "value": "kr-kr", "label": "Korea" },
    { "value": "lv-lv", "label": "Latvia" },
    { "value": "lt-lt", "label": "Lithuania" },
    { "value": "xl-es", "label": "Latin America" },
    { "value": "my-ms", "label": "Malaysia" },
    { "value": "my-en", "label": "Malaysia (en)" },
    { "value": "mx-es", "label": "Mexico" },
    { "value": "nl-nl", "label": "Netherlands" },
    { "value": "nz-en", "label": "New Zealand" },
    { "value": "no-no", "label": "Norway" },
    { "value": "pe-es", "label": "Peru" },
    { "value": "ph-en", "label": "Philippines" },
    { "value": "ph-tl", "label": "Philippines (tl)" },
    { "value": "pl-pl", "label": "Poland" },
    { "value": "pt-pt", "label": "Portugal" },
    { "value": "ro-ro", "label": "Romania" },
    { "value": "ru-ru", "label": "Russia" },
    { "value": "sg-en", "label": "Singapore" },
    { "value": "sk-sk", "label": "Slovak Republic" },
    { "value": "sl-sl", "label": "Slovenia" },
    { "value": "za-en", "label": "South Africa" },
    { "value": "es-es", "label": "Spain" },
    { "value": "se-sv", "label": "Sweden" },
    { "value": "ch-de", "label": "Switzerland (de)" },
    { "value": "ch-fr", "label": "Switzerland (fr)" },
    { "value": "ch-it", "label": "Switzerland (it)" },
    { "value": "tw-tzh", "label": "Taiwan" },
    { "value": "th-th", "label": "Thailand" },
    { "value": "tr-tr", "label": "Turkey" },
    { "value": "ua-uk", "label": "Ukraine" },
    { "value": "uk-en", "label": "United Kingdom" },
    { "value": "us-en", "label": "United States" },
    { "value": "ue-es", "label": "United States (es)" },
    { "value": "ve-es", "label": "Venezuela" },
    { "value": "vn-vi", "label": "Vietnam" }
]