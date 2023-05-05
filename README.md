[link-chrome]: https://chrome.google.com/webstore/detail/chatgpt-advanced/lpfemeioodjbpieminkklglpmhlngfcn 'Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/web-chatgpt/ 'Firefox Add-ons'
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/arxivutils/flahobhjikkpnpohomeckhdjjkkkkmoc/ 'Edge Add-ons'

<div align="center">
<h1>WebChatGPT</h1>


English &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md)  
  
  
[![Discord](https://img.shields.io/discord/1060110102188797992?color=green&label=Join%20server&logo=discord)](https://discord.gg/nmCjvyVpnB) [![Twitter Follow](https://img.shields.io/twitter/follow/hahahahohohe?label=follow%20me&style=social)](https://twitter.com/hahahahohohe)


This browser extension `adds web access` capability to [ChatGPT](https://chat.openai.com/). Get much more relevant and up-to-date answers from the chatbot!

![image](https://user-images.githubusercontent.com/3750161/214144292-4fb34667-015a-43f3-906d-1d2d065d67f0.png)


<br>

[<img src="https://user-images.githubusercontent.com/3750161/214147732-c75e96a4-48a4-4b64-b407-c2402e899a75.PNG" height="67" alt="Chrome" valign="middle">][link-chrome] [<img src="https://user-images.githubusercontent.com/3750161/214148610-acdef778-753e-470e-8765-6cc97bca85ed.png" height="67" alt="Firefox" valign="middle">][link-firefox] [<img src="https://user-images.githubusercontent.com/3750161/233201810-d1026855-0482-44c8-b1ec-c7247134473e.png" height="67" alt="Chrome" valign="middle">][link-edge]


[<img valign="middle" src="https://img.shields.io/chrome-web-store/v/lpfemeioodjbpieminkklglpmhlngfcn.svg">][link-chrome] [<img valign="middle" alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/users/lpfemeioodjbpieminkklglpmhlngfcn?color=blue">][link-chrome]
<br>
[<img valign="middle" src="https://img.shields.io/amo/v/web-chatgpt">][link-firefox]
[<img valign="middle" alt="Mozilla Add-on" src="https://img.shields.io/amo/users/web-chatgpt">][link-firefox]
<br>
[<img valign="middle" src="https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fflahobhjikkpnpohomeckhdjjkkkkmoc">][link-edge]
[<img valign="middle" alt="Edge Add-on" src="https://img.shields.io/badge/dynamic/json?label=users&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fflahobhjikkpnpohomeckhdjjkkkkmoc">][link-edge]
</div>
<br>

https://user-images.githubusercontent.com/3750161/214155508-5c1ad4d8-b565-4fe0-9ce7-e68aed11e73d.mp4


## Manual installation

  ℹ️ Don't forget to disable the extension installed from the Web Store while you're testing manually installed version.
  
  ### Chrome, Microsoft Edge, etc.
  1. Download the prebuilt chrome zip file from [here](build).
  2. Unzip the file.
  3. Open `chrome://extensions` in Chrome / `edge://extensions` in Microsoft Edge.
  4. Enable developer mode (top right corner).
  5. Click on `Load unpacked` and select the unzipped folder.
  6. Go to [ChatGPT](https://chat.openai.com/chat/) and enjoy!

  ### Firefox
  1. Download prebuilt firefox zip file from [here](build).
  
  #### Temporary installation, in official Release or Beta
  1. Go to `about:debugging#/runtime/this-firefox`.
  2. Click `Load Temporary Add-on` button, then select the zip file you re-zipped.

  #### Persistent installation, in Nightly or Developer Edition
  1. Open Firefox, go to `about:config` and set `xpinstall.signatures.required` to `false`.
  2. Go to `about:addons`
  3. Click on the gear icon in the top right corner of the Add-ons page and select `Install Add-on From File`.
  4. Select the zip file and click open.
  5. Firefox will prompt you to confirm the installation of the addon. Click Install.
  6. The addon will be installed and will appear in the list of installed addons on the Add-ons page.
  7. Go to [ChatGPT](https://chat.openai.com/chat/) and enjoy!


## Build from source

1. `git clone https://github.com/qunash/chatgpt-advanced.git`
2. `npm install`
3. `npm run build-prod`
4. Grab your zip extension from `build/` folder

<br>

## FAQ

### Why is the extension asking for `access to all websites` permission?
The extension requires access to all websites because there is no backend server to process web requests, and everything happens locally in the browser. There are two modes: web searching, and extracting webpage text from URLs. Web searching requires access to the search engine, while URL text extraction requires access to any website. This is why the `access to all websites` permission is required.

### The extension does not work, the toolbar does not show up. What can I do?
Some other ChatGPT extensions are known to interfere with WebChatGPT. If you are experiencing issues with the toolbar not showing up, please try disabling any other ChatGPT extensions that you have installed and reloading the page. If you continue to experience issues, feel free to reach out to us on our [Discord server](https://discord.gg/nmCjvyVpnB) for assistance.

### Do you collect any data?
No, the extension does not collect any user data or analytics.

<br>

## Contributing

Contributions are welcome! Please submit pull requests to the `dev` branch.

<br><br><br>


Like this free project? Please consider [supporting me](https://www.buymeacoffee.com/anzorq) to keep it running.

[<a href="https://www.buymeacoffee.com/anzorq" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="45px" width="162px" alt="Buy Me A Coffee"></a>](https://www.buymeacoffee.com/anzorq)

[![visitors](https://visitor-badge.glitch.me/badge?page_id=qunash/chatgpt-advanced)](https://visitor-badge.glitch.me) [![Discord](https://img.shields.io/discord/1060110102188797992?color=green&label=Join%20server&logo=discord)](https://discord.gg/nmCjvyVpnB) [![Twitter Follow](https://img.shields.io/twitter/follow/hahahahohohe?label=follow%20me&style=social)](https://twitter.com/hahahahohohe)
