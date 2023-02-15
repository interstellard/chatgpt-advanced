import { h } from 'preact'
import Browser from 'webextension-polyfill'

function Footer() {
  const extension_version = Browser.runtime.getManifest().version

  return (
    <div className="wcg-text-center wcg-text-xs wcg-text-gray-400">
      <a href='https://github.com/qunash/chatgpt-advanced' target='_blank' className='underline wcg-text-gray-400 wcg-underline' rel="noreferrer">
        WebChatGPT extension v.{extension_version}
      </a>.
      If you like the extension, please consider <a href='https://www.buymeacoffee.com/anzorq?utm_source=webchatgpt&utm_medium=toolbar' target='_blank' className='wcg-text-gray-400 wcg-underline' rel="noreferrer">supporting me</a>.
    </div>
  )
}

export default Footer
