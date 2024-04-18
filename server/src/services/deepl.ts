import {Translator, TargetLanguageCode, SourceLanguageCode, TextResult} from 'deepl-node';

const KEY: string | undefined = process.env["DEEPL-KEY"];

export interface TranslateConfig
{
    texts: string | string[],
    source_lang?: SourceLanguageCode | null,
    target_lang?: TargetLanguageCode
};

export class DLTranslator
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

    async translate({texts, source_lang = null, target_lang = "en-US"}: TranslateConfig) : Promise<TextResult | TextResult[]>
    {
        try {
            return this.client.translateText(texts, source_lang, target_lang);
        } catch (error: any) {
            console.error("Error when translating: ", error);
            throw Error(error);
        }
    }
};
