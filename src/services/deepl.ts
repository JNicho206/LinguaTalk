import {Translator, TargetLanguageCode, SourceLanguageCode, TextResult} from 'deepl-node';

const KEY: string | undefined = process.env["DEEPL-KEY"];

class DLTranslator
{
    lang: TargetLanguageCode;
    client: Translator;
    constructor(lang_code: TargetLanguageCode)
    {
        if (!KEY)
        {
            throw new Error("Authentication Key does not exist.");
        }

        this.lang = lang_code;
        this.client = new Translator(KEY);
    }

    async translate(texts: string | string[], source_lang: SourceLanguageCode | null = null, target_lang: TargetLanguageCode = this.lang) : Promise<TextResult | TextResult[]>
    {
        return this.client.translateText(texts, source_lang, target_lang);
    }
};

module.exports = {DLTranslator};