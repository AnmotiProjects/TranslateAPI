# TranslateAPI
TranslateAPI package.
```js
const { TranslateAPI, SupportService } = require("@anmoti/translateapi");

const gTlans = new translateAPI(SupportService.Google);

async function main() {
    const translated = await gTlans.translate("こんにちは", {
        from: "auto",
        to: "en"
    });
    console.log(translated.text)
}

main()
```