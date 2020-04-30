/*
 * @Author: Zhang Youyi
 * @Date: 2020-04-27 17:25:22
 * @LastEditTime: 2020-04-30 16:24:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\repository\page\yoyoiii.github.io\server\server.js
 */

var express = require('express');
var app = express();

var qiniu = require("qiniu");
var accessKey = 'BTyW1Y3lKqKUYMqM4AInG6lC4ZB-cRc4vNuycKvm';
var secretKey = 'FFZry1x07R-0no-NqXrcVXh-u6kBUI5eGOFOoHwG';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://qiniu.yoyoiii.top';
var bucket = 'store4ue';
var options = {
    limit: 10,
    prefix: 'page/photos/',
};

// 跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 请求图片地址
app.get('/pic', function (req, res) {
    
    new Promise(function(resolve, reject) {
        var data = req.query;
        if(data.code) {
            options.marker = null;
        }
        bucketManager.listPrefix(bucket, options, function(err, respBody, respInfo){
            if (err) {
                console.log(err);
                reject(err);
            }
            
            if (respInfo.statusCode == 200) {
                console.log("successful!");
                
                //若文件列表未列举完，下次调用listPrefix的时候，指定options里面的marker为respBody.marker
                //若列表列举完毕，则循环列举
                options.marker = respBody.marker;
                var pictures = respBody.items;
                resolve(pictures)
        
            } else {
                console.log("failed!");
                console.log(respInfo.statusCode);
            }
        });
    }).then(function(pictures){
        var urls = []
        pictures.forEach(pic => {
            urls.push(bucketManager.publicDownloadUrl(publicBucketDomain, pic.key)); 
        })
        res.send(urls); 
        res.end();
    })
    
})

app.listen(8888);

    
   

    
  
    


/* 
var publicBucketDomain = 'http://qiniu.yoyoiii.top';

// 公开空间访问链接
var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(publicDownloadUrl);

 */