
var controller = {
    clientW: null,
    clientH: null,
    urlBuffer: [],
    $picCon: $("#picsets .columns"),
    
    init: function() {
        var _this = this;
        _this.clientW = document.documentElement.clientWidth || document.body.clientWidth;
        _this.clientH = document.documentElement.clientHeight || document.body.clientHeight;
        
        _this.preLoadImg();
        _this.firstScreen();
        _this.aplayerMode();
        _this.event();

    }, 

    firstScreen: function() {
        var _this = this;
        // 设置首页图高度
        $('.cover-bg').css("height", _this.clientH + "px");  

        // 联系信息弹出框
        $('[data-toggle="popover"]').popover({
            container: 'body',
            html: true,
            trigger: 'focus',
            placement: 'left',
            content: function(){
                var title = this.getAttribute("data-v");
                return `<img src="images/${title}.jpg" alt=${title} width="150" height="150">`
            }
        })
    },

    aplayerMode: function() {
        var _this = this;
        var $aplayer = $('.cover-bg meting-js');
    
        if(_this.clientW <= 768) {
            $aplayer.hide()
        } 
    },

    
    /**
     * @description: 
     * @param {key} 区分首屏加载请求or下划时的图片请求 
     * @return: 
     */    
    reqImage: function(key="") {
        var _this = this;
        var $picCon = $("#picsets .columns");
        // 获取图片URL
        $.get({
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            url: "http://localhost:8888/pic" + key,

            success: function(data) {
                var flag = false;
                var urls = data;
                // let 使得异步事件依次进行
                for(let i=0; i<urls.length; i++) {
                    let url = urls[i];
                    if(_this.urlBuffer.indexOf(url) != -1) {
                        flag = true;
                        break;
                    } 
                    _this.urlBuffer.push(url);
                    // 图片预加载
                    let img = new Image();  
                    img.onload = setTimeout(() => {
                        $picCon.append(`<figure style="display:none"><img src=${url}></figure>`);
                        $picCon.find("img").addClass("hvr-grow");
                        $picCon.find("figure").fadeIn(1000);
                    }, i*200); 
                    img.onerror = function(err){
                        console.log(err);
                    }; 
                    img.src = url;
                }

                flag ? $("#more").hide() : null;
            },

            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    },

    preLoadImg: function() {
        var _this = this;
        _this.reqImage("?code=1");
        $("#more").fadeIn();
    },

    lazyLoad: function($target) {
        var _this = this;
        function watchscroll () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
            var windowHeight = window.innerHeight;  // 视窗高度
            var targetH = $target.offsetTop;
            if( targetH < windowHeight + scrollHeight ){
                _this.reqImage();
            }
        }

        return watchscroll;  
        
    },

    event: function() {
        var _this = this;
        var $loadingImg = document.getElementById('more');

        // 节流函数
        function throttle(fn, threshold) {
            var prev = Date.now();
            return function() {
                var now = Date.now();
                if(now - prev > threshold) {
                    prev = now;
                    fn.apply(this, arguments);
                }
            }
        }

        // 滑动滚轮，图片懒加载
        window.onscroll = throttle(_this.lazyLoad($loadingImg), 200);
    }
}

$(function(){
    controller.init(); 
});

