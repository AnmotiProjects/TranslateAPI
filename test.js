const translateAPI = require("./index.js");

const gTlans = new translateAPI("google");

async function main() {
    const translated = await gTlans.translate("こんにちは", {
        from: "auto",
        to: "en"
    });
    console.log(translated.sentences[0].trans)
}

main()