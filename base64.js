#!/usr/bin/env node
const path = require("path")
const mimetype = require("mimetype")
const fs = require("fs")
const argvs = process.argv.slice(2)


function getBase64 (filepath) {
    let mime = mimetype.lookup(filepath)
    return mime ? `data:${mime};base64,${fs.readFileSync(filepath).toString("base64")}` : ""
}

function error () {
    console.error("usage: base64 filename")
    process.exit(0)
}

const pathname = path.resolve(process.cwd(), argvs[0])

if (argvs.length > 0 && fs.statSync(pathname).isFile()) {
    console.log(getBase64(pathname))
} else {
    error()
}