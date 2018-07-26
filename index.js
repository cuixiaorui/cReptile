const util = require('util');
const fetch = util.promisify(require('./fetch.js'));
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const config = require('./config.json');

(function () {
    Promise.all(fetchHandler())
        .then(d => parseHTML(d))
        .then(d => saveToFile(d));
})()

function fetchHandler(){
    let promiseList = [];
    for (let i = 1; i <= config.pageMaxNum; i++) {
        promiseList.push(fetch(getSourceURL(i)));
    }
    return promiseList;
}

function getSourceURL(index) {
    return `http://list.iqiyi.com/www/1/-------------11-${index}-1-iqiyi--.html`
}

function parseHTML(html) {
    const dom = new JSDOM(html);
    let aList = dom.window.document.querySelectorAll('div.site-piclist_pic > a');
    aList = Array.from(aList);
    return aList.map((a) => {
        return {
            source: a.href,
            title: a.title,
            url: `${config.parseURL}${a.href}`
        }
    });
}

function saveToFile(data) {
    let str = JSON.stringify(data);
    fs.writeFile('./data.json', str, { flag: 'w+' }, (err) => {
        if (err) console.log(err);
    })
}



