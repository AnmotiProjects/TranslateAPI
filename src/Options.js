function deepAssign(target, ...sources) {
    const copy = Object.create(target);
    sources.forEach((source) => {
        if (source === undefined || source === null) return;
        Object.keys(source).forEach((key) => {
            if (typeof source[key] === "object" && source[key] !== null) {
                if (!copy[key]) {
                    Object.assign(copy, { [key]: {} });
                }
                deepAssign(copy[key], source[key]);
            } else {
                Object.assign(copy, { [key]: source[key] });
            }
        });
    });
    return copy;
}

const Options = {
    TranslateOptions: {
        data: {
            default: {
                protocol: "https://",
                from: "auto",
                to: "en"
            },
            google: {
                base: "translate.google.com",
                endpoint: "/translate_a/single"
            },
            deepl: {
                base: "www2.deepl.com",
                endpoint: "/jsonrpc"
            },
            deeplapi: {
                apiKey: null,
                endpoint: "/v2/translate"
            },
            deeplapifree: {
                base: "api-free.deepl.com"
            },
            deeplapipro: {
                base: "api.deepl.com"
            }
        },
        google(...options) {
            return deepAssign(this.data.default, this.data.google, ...options);
        },
        deepl(...options) {
            return deepAssign(this.data.default, this.data.deepl, ...options);
        },
        deeplapifree(...options) {
            return deepAssign(this.data.default, this.data.deeplapi, this.data.deeplapifree, ...options);
        },
        deeplapipro(...options) {
            return deepAssign(this.data.default, this.data.deeplapi, this.data.deeplapipro, ...options);
        }
    }
};

module.exports = Options;