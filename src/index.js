const lib = require('./lib')
const utils = require('./utils')
const { i18n } = require('./utils')
module.exports = function(config, options) {
    options = options instanceof Object ? options : {}
    const myLib = options.lib || lib
    if (options.noconsole) {
        global.noconsole = options.noconsole
    }
    if (config instanceof Object) {
        try {
            myLib.map(function(item) {
                if (item instanceof Object && typeof item.handler === 'function') {
                    const itemInfo = utils.getModuleInfo(item.name)
                    const itemConfig = utils.getInnerObject(config, item.path)
                    item.handler(itemConfig, itemInfo, utils);
                }
            })
        } catch (e) {
            i18n.log(e)
        }
        return config
    }
    return {}
}