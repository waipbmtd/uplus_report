$(function () {
    $.RightPageController = function (elm, config) {

    }

    $.extend($.RightPageController, {

        getListPage: function (pageDir,paras) {
            var data = paras ? paras : {};
            $.ajax({
                type: "GET",
                url: pageDir,
                cache:false,
                async:false,
                data :data,
                success: function (mainpage) {
                    $("#right").html(mainpage);
                }

            })
        },

        showDauViews:function(obj){
            $('.list-group a').removeClass('activated');
            $(obj).addClass('activated');
            $.RightPageController.getListPage("/statistics/dau")
        },
        showRetainedViews:function(obj){
            $('.list-group a').removeClass('activated');
            $(obj).addClass('activated');
            $.RightPageController.getListPage("/statistics/retained")
        },
        showDruViews:function(obj){
            $('.list-group a').removeClass('activated');
            $(obj).addClass('activated');
            $.RightPageController.getListPage("/statistics/dru")
        }

    });
})