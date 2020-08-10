const name = 'css'
const type = 'option'
const path = 'css'
const changelog = [
    {
        version: '4.0.0',
        replace: {
            modules: 'requireModuleExtension'
        }
    }
]
const handler = function (config, info, utils) {
    utils.updateConfig(config, info.version, changelog, function(type, config, item, k) {
    })
}
module.exports = {
    name,
    type,
    path,
    changelog,
    handler
}