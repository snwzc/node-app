const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
http.globalAgent.keepAlive = true
https.globalAgent.keepAlive = true

// let filePath = './data/小鹏汽车/'
let filePath = './data/白羊工场/'

// url 正则
var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;

// 下载图片
function download(url) {
    let filename = url.split('?')[0].split('/').pop()
    let option = {
        url,
        header: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
            "content-length": '999999'
        },
        timeout: 600000
    }

    if (url.indexOf('https') >= 0) {
        https.get(url, option, (res) => {
            var imgData = "";
            res.setEncoding("binary");

            res.on('data', (chunk) => {
                imgData += chunk;
            });

            res.on('end', () => {
                fs.writeFileSync(`./images/${filename}`, imgData, "binary");
            });

        }).on('error', err => {
            console.log(`出现错误:${err.message}+----${filename}`);
        })

    } else {
        http.get(url, option, (res) => {
            var imgData = "";
            res.setEncoding("binary");

            res.on('data', (chunk) => {
                imgData += chunk;
            });
            res.on('end', () => {
                fs.writeFileSync(`./images/${filename}`, imgData, "binary");
            });

        }).on('error', err => {
            console.log(`出现错误:${err.message}+----${filename}`);
        })

    }

}

// 替换网络图片
function replaceImg(url) {
    let u = url.split('?')[0]
    let nurl = url.replace(url, '/images/' + url.split('?')[0].split('/').pop())
    return nurl
}

let data = fs.readdirSync(filePath)

data.forEach(item => {
    let cdata = fs.readFileSync(filePath + item, 'utf-8')

    let contentImg = cdata.match(reg)
    let udata = Array.from(new Set(contentImg))
    udata.forEach(item => {
        download(item)
        cdata = cdata.replace(item, replaceImg);
    })
    fs.writeFileSync(filePath + item, cdata, 'utf8')
})


// download('https://oss-customrender.biyao.com/af0a2dac274e4030a55573a67b2758bc.png_16001600.png')







