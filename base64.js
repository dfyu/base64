const path = require('path')
const mimetype = require('mimetype')
const fs = require('fs')
function getBase64 (filepath) {
    let mime = mimetype.lookup(filepath)
    return mime ? `data:${mimetype.lookup(filepath)};base64,${fs.readFileSync(filepath).toString('base64')}` : ''
}

function error () {
    console.error('usage: base64 filename/dirname')
    process.exit(0)
}

function changeName (name) {
    let arr = name.split('/')
    arr[arr.length - 1] = `${arr[arr.length - 1]}_base64`
    return arr.join('/')
}

let argvs = process.argv.slice(2)
let pathname = argvs[0]
function run (pathname, isFirst = false) {
    if (!pathname) {
        error()
        return
    }
    try {
        pathname = path.resolve(process.cwd(), pathname)
        if (fs.statSync(pathname).isFile()) {
            if (isFirst) {
                console.log(getBase64(
                    path.resolve(process.cwd(), argvs[0])
                ))
                process.exit(0)
            } else {
                let base64 = getBase64(pathname)
                base64 && fs.writeFileSync(changeName(pathname), base64)
            }
            return
        }
        fs.readdirSync(pathname).map(item => run(
            path.resolve(pathname, item)
        ))
    } catch (e) {
        console.log(e.toString())
        error(e)
    }
}
run(pathname, true)

