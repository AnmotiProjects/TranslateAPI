const axios = require("axios");
const Options = require("./Options");
const SupportService = require("./SupportService");

class TranslateAPI {
    /**
     * @typedef {Object} TranslateOptions
     * @property {String} from - 翻訳前の言語
     * @property {String} to - 翻訳後の言語
     * @property {String} [apiKey] - 翻訳に用いるapiKey(必要な場合)
     */

    /**
     * 新しい翻訳APIインスタンスを作成します。
     * @constructor
     * @param {String} service - サービスの名前
     * @param {TranslateOptions} options
     */
    constructor(service, options) {
        this.service = service;
        this.options = options;
    }

    /**
     * SupportServiceオブジェクトに指定されたサービス対応しているかどうか
     *
     * @param {String} service - サービス名
     * @returns {Boolean} - 利用可能な場合はtrue利用不可な場合はfalseを返します。
     */
    static isSupportedService(service) {
        return Object.values(SupportService).includes(service);
    }

    /**
     * 翻訳する関数です。
     * @param {String} text - 翻訳するテキスト
     * @param {...TranslateOptions} options
     * @returns {Promise<Object>}
     */
    static TranslateRaw(text, service, ...options) {
        if (!this.isSupportedService(service)) throw new Error("Invaild service.");
        const option = Options.TranslateOptions[service](...options);
        let { from, to, apiKey, protocol, base, endpoint } = option;

        const requestOption = {
            url: protocol + base + endpoint,
        };

        let transformResponse;

        if (service === SupportService.Google) {
            Object.assign(requestOption, {
                method: "get",
                params: {
                    client: "gtx",
                    sl: from,
                    tl: to,
                    dt: "t",
                    q: text
                }
            });
            transformResponse = (response) => {
                const { data } = response;
                if (data[0] === null) throw new Error("Invaild request.");
                return {
                    from: data[2],
                    to,
                    text: data[0][0][0]
                };
            };
        } else if (service === SupportService.DeepLWeb) {
            if (from !== "auto") from = from.toUpperCase();
            to = to.toUpperCase();
        } else if (service === SupportService.DeepLAPIFree || service === SupportService.DeepLAPIPro) {

        }

        return axios(requestOption)
            .then(transformResponse)
            .then((data) => {
                data.service = service;
                data.TranslateAPI = this;
                return data;
            })
    }
    /**
     * 翻訳関数
     * @param {String} text
     * @param {...TranslateOptions} option
     * @returns {Promise<Object>}
     */
    translate(text, option) {
        return TranslateAPI.TranslateRaw(text, this.service, this.option, option);
    }
}

module.exports = TranslateAPI;