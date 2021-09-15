import en from '../../translate/en';
import pt from '../../translate/pt';
import es from '../../translate/es';

export const multiLanguage = {
    en,
    pt,
    es,
};

class Language {
    static config(req) {
        return new Language(
            req.headers['accept-language']
        );
    }

    getCurrentLanguage() {
        if (this._languages === '*' || !this._languages) {
            return this._default;
        }

        for (const language of this._languages.split(',')) {
            if (this._acceptLanguages.includes(language)) {
                return language;
            }
        }

        return this._default;
    }

    constructor(languages) {
        this._languages = languages;
        this._acceptLanguages = Object.keys(multiLanguage);
        this._default = 'pt';
    }
}

export default Language;
