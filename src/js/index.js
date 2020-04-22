
var controller = {
    clientW: null,
    clienth: null,
    
    init: function() {
        var _this = this;
        _this.clientW = document.documentElement.clientWidth || document.body.clientWidth;
        _this.clienth = document.documentElement.clientHeight || document.body.clientHeight;
        
        _this.firstScreen();
        _this.aplayerMode();

    }, 

    firstScreen: function() {
        var _this = this;
        // 设置首页图高度
        $('.cover-bg').css("height", _this.clienth + "px");  

        // 图片hover效果
        $('figure img').addClass("hvr-grow");

        // 联系信息弹出框
        $('[data-toggle="popover"]').popover({
            container: 'body',
            html: true,
            trigger: 'focus',
            content: function(){
                var title = this.getAttribute("data-v");
                return `<img src="src/images/${title}.jpg" alt=${title} width="150" height="150">`
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

    event: function() {
        
    }
}

$(function(){
    controller.init(); 
});

