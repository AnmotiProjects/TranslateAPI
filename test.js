const { TranslateAPI, SupportService } = require("./src/index.js");

(async function () {
    const service = SupportService.Google;
    const text = "こんにちは";


    const gTrans = new TranslateAPI(service);
    console.log(await gTrans.translate(text, { to: "en" }));

    console.log(await TranslateAPI.TranslateRaw(text, service, {
        from: "auto",
        to: "ru"
    }))
})();