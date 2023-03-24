const config = {
    supportService: ["google"],
    default: {
        google: {
            constructorOptions: {
                service: "google",
                base: "translate.google.com",
                ignoreDomains: ["translate.google.cn"]
            },
            translateOptions: {
                from: "auto",
                to: "ja"
            }
        }
    }
};
module.exports = config;