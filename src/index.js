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
                    utils.getInnerObject(config, item.path, function(itemConfig, key) {
                        const itemInfo = {}
                        const moreInfo = {}
                        const cliInfo = utils.getModuleInfo('@vue/cli-service')
                        if (item.type === 'module') {
                            const moduleInfo = utils.getModuleInfo(item.name)
                            Object.assign(itemInfo, moduleInfo)
                            Object.assign(moreInfo, cliInfo)
                        } else {
                            Object.assign(itemInfo, cliInfo)
                        }
                        if (arguments.length > 1) {
                            const proxyConfig = {
                                [key]: itemConfig[key],
                                0: itemConfig[key]
                            }
                            item.handler(proxyConfig, itemInfo, utils, moreInfo)
                            itemConfig[key] = proxyConfig[key]
                        } else {
                            item.handler(itemConfig, itemInfo, utils, moreInfo)
                        }
                    })
                }
            })
        } catch (e) {
            i18n.log(e)
        }
        return config
    }
    return {}
}