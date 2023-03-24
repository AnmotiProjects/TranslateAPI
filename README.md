# TranslateAPI
TranslateAPI package.
```js
const translateAPI = require("@anmoti/translateapi");

const gTlans = new translateAPI("google");

async function main() {
    const translated = await gTlans.translate("こんにちは", {
        from: "auto",
        to: "en"
    });
    console.log(translated.sentences[0].trans)
}

main()
```