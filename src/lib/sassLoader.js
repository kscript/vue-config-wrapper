const name = 'sass-loader'
const type = 'module'
const path = 'css.loaderOptions.sass'
const changelog = [
    {
        version: '8.0.0',
        replace: {
            data: 'prependData'
        }
    },
    {
        version: '9.0.0',
        replace: {
            prependData: 'additionalData'
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