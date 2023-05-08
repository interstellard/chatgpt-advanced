[link-chrome]: https://chrome.google.com/webstore/detail/chatgpt-advanced/lpfemeioodjbpieminkklglpmhlngfcn 'Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/web-chatgpt/ 'Firefox Add-ons'
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/arxivutils/flahobhjikkpnpohomeckhdjjkkkkmoc/ 'Edge Add-ons'

<div align="center">
<h1>WebChatGPT</h1>


[Inggris](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; Indonesia  
  
  
[![Discord](https://img.shields.io/discord/1060110102188797992?color=green&label=Gabung%20server&logo=discord)](https://discord.gg/nmCjvyVpnB) [![Twitter Follow](https://img.shields.io/twitter/follow/hahahahohohe?label=ikuti%20saya&style=social)](https://twitter.com/hahahahohohe)

  
Ekstensi browser ini `menambahkan kemampuan akses web` ke [ChatGPT](https://chat.openai.com/). Dapatkan jawaban yang lebih relevan dan terbaru dari chatbot!

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


## Instalasi manual

  ℹ️ Jangan lupa untuk menonaktifkan ekstensi yang diinstal dari Web Store saat Anda menguji versi yang diinstal secara manual.
  
  ### Chrome, Microsoft Edge, dll.
  1. Unduh file zip chrome yang sudah dibuat dari [sini](build).
  2. Ekstrak file.
  3. Buka `chrome://extensions` di Chrome / `edge://extensions` di Microsoft Edge.
  4. Aktifkan mode pengembang (sudut kanan atas).
  5. Klik pada `Load unpacked` dan pilih folder yang sudah diekstrak.
  6. Buka [ChatGPT](https://chat.openai.com/chat/) dan nikmati!

  ### Firefox
  1. Unduh file zip firefox yang sudah dibuat dari [sini](build).
  
  #### Instalasi sementara, di Release atau Beta resmi
  1. Buka `about:debugging#/runtime/this-firefox`.
  2. Klik tombol `Load Temporary Add-on`, kemudian pilih file zip yang sudah diekstrak.

  #### Instalasi permanen, di Nightly atau Developer Edition
  1. Buka Firefox, buka `about:config` dan set `xpinstall.signatures.required` ke `false`.
  2. Buka `about:addons`
  3. Klik ikon roda gigi di sudut kanan atas halaman Add-ons dan pilih `Install Add-on From File`.
  4. Pilih file zip dan klik buka.
  5. Firefox akan meminta Anda untuk mengonfirmasi instalasi add-on. Klik Install.
  6. Add-on akan diinstal dan akan muncul dalam daftar add-on yang diinstal pada halaman Add-ons.
  7. Buka [ChatGPT](https://chat.openai.com/chat/) dan nikmati!


## Bangun dari sumber

1. `git clone https://github.com/qunash/chatgpt-advanced.git`
2. `npm install`
3. `npm run build-prod`
4. Ambil file ekstensi zip Anda dari folder `build/`

<br>

## FAQ

### Mengapa ekstensi ini meminta izin `akses ke semua situs web`?
Ekstensi ini memerlukan akses ke semua situs web karena tidak ada server backend untuk memproses permintaan web, dan semuanya terjadi secara lokal di browser. Ada dua mode: pencarian web, dan mengekstraksi teks halaman web dari URL. Pencarian web memerlukan akses ke internet, sedangkan ekstraksi teks URL memerlukan akses ke semua situs web. Oleh karena itu, izin `akses ke semua situs web` diperlukan.

### Ekstensi ini tidak berfungsi, toolbar tidak muncul. Apa yang bisa saya lakukan?
Beberapa ekstensi ChatGPT lain diketahui mengganggu WebChatGPT. Jika Anda mengalami masalah dengan toolbar tidak muncul, silakan coba nonaktifkan ekstensi ChatGPT lain yang telah Anda instal dan muat ulang halaman. Jika Anda terus mengalami masalah, jangan ragu untuk menghubungi kami di [server Discord kami](https://discord.gg/nmCjvyVpnB) untuk bantuan.

### Apakah Anda mengumpulkan data apa pun?
Tidak, ekstensi ini tidak mengumpulkan data pengguna atau analitik.

<br>

## Berkontribusi

Kontribusi sangat dihargai! Silakan kirim pull request ke cabang `dev`.

<br><br><br>


Suka proyek gratis ini? Pertimbangkan untuk [mendukung saya](https://www.buymeacoffee.com/anzorq) agar tetap berjalan.

[<a href="https://www.buymeacoffee.com/anzorq" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="45px" width="162px" alt="Buy Me A Coffee"></a>](https://www.buymeacoffee.com/anzorq)

[![visitors](https://visitor-badge.glitch.me/badge?page_id=qunash/chatgpt-advanced)](https://visitor-badge.glitch.me) [![Discord](https://img.shields.io/discord/1060110102188797992?color=green&label=Gabung%20server&logo=discord)](https://discord.gg/nmCjvyVpnB) [![Twitter Follow](https://img.shields.io/twitter/follow/hahahahohohe?label=ikuti%20saya&style=social)](https://twitter.com/hahahahohohe)
