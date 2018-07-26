const http = require('http');
const https = require('https');
const urlMd = require('url');
module.exports = function (url, callback){
    let urlInfo = urlMd.parse(url);
    let fetcher = urlInfo.protocol === 'http:' ? http : https;
    let req = fetcher.request({
        hostname: urlInfo.hostname,
        path: urlInfo.path,
    }, (res) => {
        console.log(`状态码: ${res.statusCode}`);
        if (res.statusCode === 200) {
            let content = [];
            res.on('data', (chunk) => {
                content.push(chunk);
            })

            res.on('end', () => {
                let b = Buffer.concat(content);
                callback && callback(null,b.toString());
            })
        } else {
            callback(new Error(`状态码:${res.statusCode}`));
        }
    })

    req.end();
    req.on('error', (err) => {
        callback(err);
    })
}