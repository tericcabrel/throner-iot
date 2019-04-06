define([
  '/apidoc/locales/ca.js',
  '/apidoc/locales/cs.js',
  '/apidoc/locales/de.js',
  '/apidoc/locales/es.js',
  '/apidoc/locales/fr.js',
  '/apidoc/locales/it.js',
  '/apidoc/locales/nl.js',
  '/apidoc/locales/pl.js',
  '/apidoc/locales/pt_br.js',
  '/apidoc/locales/ro.js',
  '/apidoc/locales/ru.js',
  '/apidoc/locales/tr.js',
  '/apidoc/locales/vi.js',
  '/apidoc/locales/zh.js',
  '/apidoc/locales/zh_cn.js'
], function() {
    var langId = (navigator.language || navigator.userLanguage).toLowerCase().replace('-', '_');
    var language = langId.substr(0, 2);
    var locales = {};

    for (index in arguments) {
        for (property in arguments[index])
            locales[property] = arguments[index][property];
    }
    if ( ! locales['en'])
        locales['en'] = {};

    if ( ! locales[langId] && ! locales[language])
        language = 'en';

    var locale = (locales[langId] ? locales[langId] : locales[language]);

    function __(text) {
        var index = locale[text];
        if (index === undefined)
            return text;
        return index;
    };

    function setLanguage(language) {
        locale = locales[language];
    }

    return {
        __         : __,
        locales    : locales,
        locale     : locale,
        setLanguage: setLanguage
    };
});
