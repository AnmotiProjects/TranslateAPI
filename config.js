module.exports = {
    supportService: {
        GoogleTranslate: "google",
        GoogleCloudTranslation: "googlecloud",
        DeepLWeb: "deepl",
        DeepLAPIFree: "deeplapifree",
        DeepLAPIPro: "deeplapipro"
    },
    translateOptions: {
        default: {
            protocol: "https://",
            from: "auto",
            to: "en",
            text: null
        },
        google: {
            base: "translate.google.com",
            endpoint: "/translate_a/single"
        },
        googlecloud: {
            apiKey: null,
            base: "translation.googleapis.com",
            endpoint: "/language/translate/v2"
        },
        deepl: {
            defaultBase: "www2.deepl.com",
            endpoints: "/jsonrpc"
        },
        deeplapi: {

        }
    }
};