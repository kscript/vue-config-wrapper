const fs = require('fs')
const path = require('path')
const i18n = require('./i18n')
/**
 * 读取模块的package.json信息
 * @param {string} name 模块名
 * @returns {object}
 */
const getModuleInfo = function(name) {
    try {
        const filePath = path.join(process.cwd(), 'node_modules', name, 'package.json')
        if (fs.existsSync(filePath)) {
            return require(filePath)
        } else {
            i18n.log('module-not-exist', {
                name
            })
            return {}
        }
    } catch(e) {
        i18n.log(e)
        return {}
    }
}
/**
 * 获取对象内部某一块对象
 * @param {object} obj 数据源
 * @param {string} path 访问路径,使用.分割
 * @returns {object} 未获取到或不符合要求时, 返回空对象
 */
const getInnerObject = function(obj, path) {
    if (typeof path === 'string') {
        let res = obj
        let keys = path.split('.')
        while(keys.length) {
            const key = keys.shift()
            if (res[key] instanceof Object) {
                res = res[key]
            } else {
                return {}
            }
        }
        return res
    }
    return {}
}
/**
 * 
 * @param {string} version 
 * @param {number=} len 
 */
const splitVersion = function(version, len = 3) {
    if (typeof version === 'string') {
        return (version.match(/(\d+)/g) || []).slice(0, len)
    }
    return [];
}

/**
 * 比较版本大小
 * @param {string} a 版本a
 * @param {string} b 版本b
 * @param {number} len 比较长度
 * @returns {number} 0: a大 1: 相等 2: b大 -1版本格式有误
 */
const compareVersion = function(a, b, len = 3) {
    if (a === b) {
        return 1
    } else {
        const aryA = splitVersion(a)
        const aryB = splitVersion(b)
        if (aryA.length === len && aryB.length === len) {
            let num = 1;
            aryA.forEach(function(item, index){
                // 不等于1说明已经有比较结果了
                if (num === 1) {
                    if (item > aryB[index]) {
                        num = 0
                    } else if (item < aryB[index]){
                        num = 2
                    }
                }
            })
            return num
        }
    }
    return -1
}


/**
 * 批量更新配置
 * @param {object} config 
 * @param {string} version 
 * @param {object[]} changelog 
 * @param {function=} cb 
 */
const updateConfig = function(config, version, changelog, cb) {
    cb = typeof cb === 'function' ? cb : function(){}
    let reverseIndex = -1
    const list = changelog.slice(0).sort(function(a, b) {
        let va = Array.isArray(a.version) ? a.version[0] : a.version
        let vb = Array.isArray(b.version) ? b.version[0] : b.version
        let num = compareVersion(va, vb)
        return 1 - (num < 0 ? 1 : num)
    })
    let valid = false
    let nums = []
    list.some(function(item, index) {
        // if (Array.isArray(item.version)) {
        //     valid = compareVersion(version, item.version[0]) < 2
        // } else 
        if (typeof item.version === 'string'){
            valid = (nums[index] = compareVersion(version, item.version)) < 2
        }
        if (!valid) {
            return true
        }
        reverseIndex = index
    })
    if (valid) {
        reverseIndex = changelog.length
    }
    const newList = reverseIndex < 0 ? list.reverse() : list.slice(0, reverseIndex + 1).concat(list.slice(reverseIndex + 1).reverse())
    newList.some(function(item, index) {
        if (item instanceof Object) {
            if (typeof item.update !== 'function' || item.update(config, item, index < reverseIndex) === true) {
                if (item.replace instanceof Object) {
                    for(let k in item.replace) {
                        if (reverseIndex < 0) {
                            if (config[item.replace[k]]) {
                                cb(0, config, item, k)
                                config[k] = config[k] || config[item.replace[k]]
                                delete config[item.replace[k]]
                            }
                        } else if (index <= reverseIndex) {
                            cb(1, config, item, k)
                            if (!config[item.replace[k]]) {
                                config[item.replace[k]] = config[k]
                            }
                            delete config[k]
                        } else {
                            if (config[item.replace[k]]) {
                                cb(2, config, item, k)
                                config[k] = config[item.replace[k]]
                                delete config[item.replace[k]]
                            }
                        }
                    }
                }
            }
        }
    })
}
const utils = {
    i18n,
    getModuleInfo,
    getInnerObject,
    updateConfig,
    compareVersion
}
module.exports = utils