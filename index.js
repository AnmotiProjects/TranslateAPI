const axios = require("axios");
const config = require("./config.js");

function deleteDuplicate(arr) {
    return arr.filter((value, index) => index === arr.indexOf(value));
}

class translateAPI {
    /**
     * translateAPI - constructor
     * @param {translateAPIConstructorOptions(string|object)} options - translateAPIConstructorOptions 
     */
    constructor(_options) {
        let options;
        if (typeof _options === "string") {
            options = {
                service: _options
            };
        } else if (typeof _options === "object") {
            options = _options;
        } else {
            throw new Error("translateAPIConstructorOptions must be string or object.");
        }

        this.service = options.service;
        this.default = config.default[this.service];
        if (!config.supportService.includes(this.service)) throw new Error("Invaild service.");

        options = Object.assign(this.default.constructorOptions, options);
        this.base = options.base;
        this.readyPromise = new Promise((resolve) => resolve());
        switch (this.service) {
            case "google":
                this.ignoreDomains = deleteDuplicate(options.ignoreDomains);
                this.setGoogleTranslateDomains();
        }
        return;
    }
    /**
     * @returns {Promise<Array>} google translate domains Array
     */
    setGoogleTranslateDomains() {
        return this.readyPromise = new Promise((resolve, reject) => {
            axios.get("https://www.google.com/supported_domains")
                .then((response) => {
                    if (!response.statusText === "OK") throw new Error("Failed to fetch GoogleDomainsList.");
                    this.domains = response.data.split("\n")
                        .filter((domain) => {
                            return !this.ignoreDomains.includes(domain);
                        })
                        .map((domain) => {
                            return "translate" + domain;
                        });
                    
                    resolve(this.domains);
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }
    /**
     * 
     * @param {String} text - translate text 
     * @param {Object} options - translate options 
     * @returns {Promise<Object>} translate info
     */
    translate(text, options = {}) {
        return new Promise((resolve, reject) => {
            this.readyPromise
                .then(() => {
                    const { from, to } = Object.assign(this.default.translateOptions, options);
                    switch (this.service) {
                        case "google":
                            axios({
                                method: "post",
                                url: `https://${this.base}/translate_a/single?client=at&dt=t&dt=rm&dj=1`,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                data: new URLSearchParams({
                                    sl: from,
                                    tl: to,
                                    q: text
                                }).toString()
                            })
                                .then((response) => {
                                    if (!response.statusText === "OK") throw new Error("Failed to fetch GoogleTranslate.");
                                    resolve(response.data);
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                    }
                });
        });
    }
}

module.exports = translateAPI;