const main = require('../src/')
const utils = require('../src/utils')
const sassLoader = require('../src/lib/sassLoader')
const sassConfig = function(config = {}) {
    return {
        css: {
            loaderOptions: {
                sass: Object.assign({}, {
                    prependData: 'additionalData'
                }, config)
            }
        }
    }
}
const sassVersion = function(version, config = {}, loaderConfig = {}, lib = []) {
    return function() {
        loaderConfig =  Object.assign({}, sassLoader, {
            handler: function (config, info, utils) {
                info.version = info.version || version
                utils.updateConfig(config, info.version, sassLoader.changelog, function(type, config, item, k) {
                    console.log(
                        '安装版本号: ' + info.version, 
                        '变更记录:' + item.version + ' [' + k + '调整为' + item.replace[k] + ']', 
                        '当前配置: ', config,
                        item,
                        type
                    )
                })
            }
        }, loaderConfig)
        lib.push(loaderConfig)
        const result = main(sassConfig(config), {
            noconsole: true,
            lib
        })
        return JSON.stringify(utils.getInnerObject(result, sassLoader.path))
    }
}
const test = function(title, expect, exec){
    return function () {
        const result = exec()
        console.log('-------- ' + title + ' --------')
        console.log([expect, result])
        console.log()
        return expect === result
    }
}
const message = function(title) {
    return function() {
        console.log()
        console.log(title)
        return title
    }
}
module.exports = function() {
    return [
        message('低于最低版本时'),
        // Q: 第三个测试例子中, data 为什么是 additionalData?
        // A: prependData 覆盖了 additionalData
        // 配置降级时, 如果安装版本低于changelog里最低的版本, 这时候默认使用已知的最早的配置
        test(
            '合并后的配置中包含 prependData 和 data', 
            '{"data":"0.0.1"}', 
            sassVersion('0.0.1', {
                data: '0.0.1'
            })
        ),
        test(
            '合并后的配置中只包含 prependData', 
            '{"data":"0.0.1"}', 
            sassVersion('0.0.1', {
                prependData: '0.0.1'
            })
        ),
        test(
            '合并后的配置中包含 prependData 和 additionalData', 
            '{"data":"additionalData"}', 
            sassVersion('0.0.1', {
                additionalData: '0.0.1'
            })
        ),

        message('等于最低版本时'),
        // 第一个测试例子 data 无效 原因同上
        test(
            '合并后的配置中包含 prependData 和 data', 
            '{"prependData":"additionalData"}', 
            sassVersion('8.0.0', {
                data: '8.0.0'
            })
        ),
        test(
            '合并后的配置中只包含 prependData', 
            '{"prependData":"8.0.0"}', 
            sassVersion('8.0.0', {
                prependData: '8.0.0'
            })
        ),
        test(
            '合并后的配置中包含 prependData 和 additionalData', 
            '{"prependData":"8.0.0"}', 
            sassVersion('8.0.0', {
                additionalData: '8.0.0'
            })
        ),

        message('高于最低版本时'),
        test(
            '合并后的配置中包含 prependData 和 data', 
            '{"prependData":"additionalData"}', 
            sassVersion('8.0.1', {
                data: '8.0.1'
            })
        ),
        test(
            '合并后的配置中只包含 prependData', 
            '{"prependData":"8.0.1"}', 
            sassVersion('8.0.1', {
                prependData: '8.0.1'
            })
        ),
        test(
            '合并后的配置中包含 prependData 和 additionalData', 
            '{"prependData":"8.0.1"}', 
            sassVersion('8.0.1', {
                additionalData: '8.0.1'
            })
        ),

        message('低于最高版本时'),
        test(
            '合并后的配置中包含 prependData 和 data', 
            '{"additionalData":"additionalData"}', 
            sassVersion('9.0.0', {
                data: '9.0.0'
            })
        ),
        test(
            '合并后的配置中只包含 prependData', 
            '{"additionalData":"9.0.0"}', 
            sassVersion('9.0.0', {
                prependData: '9.0.0'
            })
        ),
        test(
            '合并后的配置中包含 prependData 和 additionalData', 
            '{"additionalData":"9.0.0"}', 
            sassVersion('9.0.0', {
                additionalData: '9.0.0'
            })
        ),

        message('等于最高版本时'),
        test(
            '合并后的配置中包含 prependData 和 data', 
            '{"additionalData":"additionalData"}', 
            sassVersion('9.0.0', {
                data: '9.0.0'
            })
        ),
        test(
            '合并后的配置中只包含 prependData', 
            '{"additionalData":"9.0.0"}', 
            sassVersion('9.0.0', {
                prependData: '9.0.0'
            })
        ),
        test(
            '合并后的配置中包含 prependData 和 additionalData', 
            '{"additionalData":"9.0.0"}', 
            sassVersion('9.0.0', {
                additionalData: '9.0.0'
            })
        ),

        message('高于最高版本时'),
        test(
            '合并后的配置中包含 prependData 和 data', 
            '{"additionalData":"additionalData"}', 
            sassVersion('9.0.1', {
                data: '9.0.1'
            })
        ),
        test(
            '合并后的配置中只包含 prependData', 
            '{"additionalData":"9.0.1"}', 
            sassVersion('9.0.1', {
                prependData: '9.0.1'
            })
        ),
        test(
            '合并后的配置中包含 prependData 和 additionalData', 
            '{"additionalData":"9.0.1"}', 
            sassVersion('9.0.1', {
                additionalData: '9.0.1'
            })
        )
    ].map(function(item){
        return item()
    }).filter(function(item) {
        return item !== void 0
    })
}