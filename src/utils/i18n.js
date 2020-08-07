
const langs = require('../lang')
/**
 * 国际化
 * @param {string} key 指定使用用户语言的哪一条语句
 * @param {object=} data 该条语句包含 ${} 时的数据源
 * @param {object|null=} myLangs 要使用的语言包
 * @param {string=} lang 要使用的语言
 * @example i18n('hello', {name: 'world'}, {local: 'zh', en: {hello: 'hello ${name}'}, zh: {hello: '你好 ${name}'}}, 'en')
 */
const i18n = function(key, data, myLangs, lang) {
    myLangs = myLangs || langs
    lang = lang || myLangs.local
    data = data instanceof Object ? data : {}
    const text = (myLangs[lang] || {})[key]
    if (typeof text === 'string') {
        return text.replace(/\$\{\s*(.*?)\s*\}/g, function(s, $1){
            return data[$1] || ''
        })
    }
    return key
}
i18n.log = function(key) {
    if (!global.noconsole) {
        if (typeof key !== 'string') {
            console.log.apply(console, arguments)
        } else {
            console.log(i18n.apply(i18n, arguments))
        }
    }
}
module.exports = i18n