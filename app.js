const fs = require('fs')
const path = require('path')
const axios = require('axios')
const qs = require('qs');
// 请求路径
const tagsUrl = 'https://apiplus.biyao.com/friend/getCategoryList.do',
    listUrl = 'https://apiplus.biyao.com/friend/customizationList.do',
    detailUrl = 'https://apiplus.biyao.com/production/info/rasterEditor.do'

// 导处文件
function exportFile(fileName, data) {
    let file = path.resolve(__dirname, `./json/${fileName}.json`)
    fs.writeFile(file, JSON.stringify(data, null, 4), { encoding: 'utf8' }, err => { console.log(err); })
}
axios.defaults.headers = {
    'uuid': '2210105102954r2hhpbbhdp48jzik0000000',
    'Content-Type': 'application/x-www-form-urlencoded'
}

function request({ url, data }) {
    return new Promise((resolve, reject) => {
        axios({
            url,
            data: qs.stringify(data),
            method: 'post'
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
// 白羊
let targetUid = '14043432', identity = 1
// 小鹏
// let targetUid = '17904864', identity = 3

request({ url: tagsUrl, data: { targetUid, identity } }).then(res => {
    let { navList } = res.data
    navList.forEach(item => {
        request({
            url: listUrl, data: {
                pageIndex: 1,
                pageSize: 20,
                targetUid,
                categoryId: item.categoryId,
                identity,
                tabIdx: 3,
            }
        }).then(res => {
            let listData = res.data.productList
            listData.forEach(item2 => {
                let data = {
                    suId: item2.suId,
                }
                let json = { listTitle: item2.title, listImg: item2.image }
                request({ url: detailUrl, data }).then(res => {
                    json.detail = res.data
                    let fileName = item2.title.replace(/\/|\//, '-')
                    exportFile(fileName, json)
                })
            });
        })
    });
})
















