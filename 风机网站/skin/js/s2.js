
        
        $(function(){
            var image = new Image();
            image.onload = function() {
                var imgWidth=$('.ty-banner-1 img').width();
               var windowWidth=$(window).width();
               var length = (imgWidth-windowWidth)/2;
               if(length>0){
                    //$('.ty-banner-1 img').attr('style','margin-left:'+ (-length) + 'px');
               }
               $('.ty-banner-1 img').addClass('show');
            }
            image.src = $('.ty-banner-1 img').attr('src');
           
        });
    

        $("[navcrumbs]").find("dd a").last().addClass('cur');
    

        $(function() {
            var time;
            //var winHeight = top.window.document.body.clientHeight || $(window.parent).height();
            $('.client-2').css({
                'marginTop': -($('.client-2').height() / 2)
            });
            $('#client-2 li').on({
                'mouseenter': function() {
                    var scope = this;
                    time = setTimeout(function() {
                        var divDom = $(scope).children('div');
                        var maxWidth = divDom.width();
                        $(scope).stop().animate({
                            left: 77-maxWidth}, 'normal', function() {
                            var pic = $(scope).find('.my-kefu-weixin-pic');
                            if (pic.length > 0) {
                                pic.show();
                            }
                        });
                    }, 100)
                },
                'mouseleave': function() {
                    var pic = $(this).find('.my-kefu-weixin-pic');
                    var divDom = $(this).children('div');
                    var maxWidth = divDom.width();
                    if (pic.length > 0) {
                        pic.hide();
                    }
                    clearTimeout(time);
                    var divDom = $(this).children('div');
                    $(this).stop().animate({
                        left: 0
                    }, "normal", function() {});
                }
            });
            //返回顶部
            $(window).scroll(function() {
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                var eltop = $("#client-2").find(".my-kefu-ftop");
                if (scrollTop > 0) {
                    eltop.show();
                } else {
                    eltop.hide();
                }
            });
            $("#client-2").find(".my-kefu-ftop").click(function() {
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if (scrollTop > 0) {
                    $("html,body").animate({
                        scrollTop: 0
                    }, "slow");
                }
            });
        });
    
