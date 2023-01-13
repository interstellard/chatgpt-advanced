import '../style/base.css'
import Browser from 'webextension-polyfill'

let isWebAccessOn = true;
var numWebResults = 1
var region = ""

async function getDefaultParams() {

    ({ num_web_results: numWebResults, web_access: isWebAccessOn, region } = await Browser.storage.sync.get(['num_web_results', 'web_access', 'region']))

    console.log(numWebResults, isWebAccessOn, region)
}

async function run() {
    await getDefaultParams()
}

run()
