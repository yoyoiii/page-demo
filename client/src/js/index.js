
var controller = {
    clientW: null,
    clienth: null,
    urlBuffer: [],
    $picCon: $("#picsets .columns"),
    
    init: function() {
        var _this = this;
        _this.clientW = document.documentElement.clientWidth || document.body.clientWidth;
        _this.clienth = document.documentElement.clientHeight || document.body.clientHeight;
        
        _this.preLoadImg();
        _this.firstScreen();
        _this.aplayerMode();
        _this.event();

    }, 

    firstScreen: function() {
        var _this = this;
        // 设置首页图高度
        $('.cover-bg').css("height", _this.clienth + "px");  

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

    reqImage: function($picCon, key="") {
        var _this = this;
        // 获取图片URL
        $.get({
            type : "GET",
            contentType: "application/json;charset=UTF-8",
            url : "http://localhost:8888/pic" + key,

            success : function(data) {
                var urls = data;
                urls.forEach(url => {
                    var urlBuffer = _this.urlBuffer;
                    if(urlBuffer.indexOf(url) !== -1) {
                        $("#more-btn").fadeOut();
                        return;
                    } 
                    urlBuffer.push(url);
                    // 图片预加载
                    var img = new Image();  
                    img.onload = function(){
                        $picCon.append("<figure><img /></figure>");
                        $picCon.children("figure:last-child").find("img").attr("src", url).addClass("hvr-grow");
                        // $picCon.find("figure").fadeIn();
                    };  
                    img.onerror = function(err){
                        console.log(err);
                    }; 
                    img.src = url;
                });
            },

            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    },

    preLoadImg: function() {
        var _this = this;
        _this.reqImage(_this.$picCon,"?code=0");
        $("#more-btn").fadeIn();
    },

    event: function() {
        var _this = this;
        $("#more-btn").click(function(){
            _this.reqImage(_this.$picCon);
        })

    }
}

$(function(){
    controller.init(); 
});

