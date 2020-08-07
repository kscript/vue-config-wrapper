const sassLoader = require('./sassLoader.test')
const tests = [
    sassLoader
]
try {
    console.log(tests.map(function(func){
        return func()
    }))
} catch(e) {
    console.log(e)
}