import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'
import { getSystemLanguage } from './localization'


const defaultConfig = {
    numWebResults: 3,
    webAccess: true,
    region: 'wt-wt',
    timePeriod: '',
    language: getSystemLanguage(),
    promptUUID: 'default',
}

export type UserConfig = typeof defaultConfig

export async function getUserConfig(): Promise<UserConfig> {
    const config = await Browser.storage.sync.get(defaultConfig)
    return defaults(config, defaultConfig)
}

export async function updateUserConfig(config: Partial<UserConfig>): Promise<void> {
    await Browser.storage.sync.set(config)
}
