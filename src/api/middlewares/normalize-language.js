import Language from '../utils/Language';

export default (req, res, next) => {
    const language = Language.config(req);
    const lang = language.getCurrentLanguage();
    req.headers['accept-language'] = lang;
    res.set('Content-Language', lang);
    next();
};
