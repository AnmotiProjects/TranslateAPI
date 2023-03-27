const axios = require("axios");
const config = require("./config.js");

/**
 * 翻訳APIクラス
 * @class
 */
class TranslateAPI {
    /**
     * 新しい翻訳APIインスタンスを作成します。
     * @constructor
     * @param {string} serviceName - 使用する翻訳APIサービスの名前。
     * @param {Object} [options] - オプションオブジェクト。
     * @param {string} [options.from="auto"] - 翻訳元の言語。
     * @param {string} [options.to="en"] - 翻訳先の言語。
     * @param {string} [options.apiKey] - APIキー。
     */
    constructor(service, options = {}) {
        this.service = service;
        this.serviceConfig = config.services[service];
        this.defaultOptions = config.default.translateOptions;
        this.options = {
            ...this.defaultOptions,
            ...options
        };
        this.apiKey = options.apiKey;
    }

    /**
     * 翻訳します。
     * @async
     * @param {string} text - 翻訳するテキスト。
     * @param {Object} [options] - オプションオブジェクト。
     * @param {string} [options.from="auto"] - 翻訳元の言語。
     * @param {string} [options.to="en"] - 翻訳先の言語。
     * @returns {Promise<string>} - 翻訳されたテキスト。
     */
    async translate(text, options = {}) {
        const { from, to } = Object.assign({}, config.defaultOptions, options);

        let url = `${config.protocol}${config.services[this.service].defaultBase}`;

        const params = new URLSearchParams({
            client: "gtx",
            sl: from,
            tl: to,
            hl: "en",
            dt: "t",
            ie: "UTF-8",
            oe: "UTF-8",
            q: text,
        });

        if (this.apiKey) {
            params.set("key", this.apiKey);
        }

        if (this.service === "google") {
            url += "/translate_a/single?" + params.toString();
            const response = await axios.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
                },
            });
            const translations = response.data[0];
            return translations.map((t) => t[0]).join("");
        } else if (this.service === "deepl") {
            url += "/jsonrpc";
            const response = await axios.post(
                url,
                {
                    jsonrpc: "2.0",
                    method: "LMT_handle_jobs",
                    params: {
                        jobs: [
                            {
                                kind: "default",
                                raw_en_sentence: text,
                            },
                        ],
                        lang: {
                            source_lang_user_selected: from,
                            target_lang: to,
                        },
                    },
                    id: 1,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const translations = response.data.result.translations;
            return translations.map((t) => t.beams[0].postprocessed_sentence).join("");
        }
    }
}

module.exports = TranslateAPI;