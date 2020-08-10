const lib = require('./lib')
const utils = require('./utils')
const { i18n } = require('./utils')
module.exports = function(config, options) {
    options = options instanceof Object ? options : {}
    const myLib = options.lib || lib
    global.noconsole = options.hasOwnProperty('noconsole') ? !!options.noconsole : true
    if (config instanceof Object) {
        try {
            myLib.map(function(item) {
                if (item instanceof Object && typeof item.handler === 'function') {
                    const itemConfig = utils.getInnerObject(config, item.path)
                    if (itemConfig) {
                        const itemInfo = utils.getModuleInfo(item.type === 'module' ? item.name : '@vue/cli-service')
                        itemInfo.version && item.handler(itemConfig, itemInfo, utils)
                    }
                }
            })
        } catch (e) {
            i18n.log(e)
        }
        return config
    }
    return {}
}