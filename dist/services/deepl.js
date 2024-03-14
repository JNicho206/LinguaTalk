"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepl_node_1 = require("deepl-node");
const KEY = process.env["DEEPL-KEY"];
class DLTranslator {
    constructor(lang_code) {
        if (!KEY) {
            throw new Error("Authentication Key does not exist.");
        }
        this.lang = lang_code;
        this.client = new deepl_node_1.Translator(KEY);
    }
    translate(texts, source_lang = null, target_lang = this.lang) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.translateText(texts, source_lang, target_lang);
        });
    }
}
;
module.exports = { DLTranslator };
