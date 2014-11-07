/**
 * Created by Devin on 14-7-2.
 */

$(function () {
    $.ImageMessageController = function (elm, config) {

    };


    $.extend($.ImageMessageController, {

        initImageMesPage: function()  {
            $.ImageMessageController.initData();
            $.ImageMessageController.bindEvent();
//            $.ImageMessageController.initValue();
        },

        initValue: function(){
            $("#new_active_btns>button:first").click();
            $.ChartTableController.initStatTable($("body").data("page_id"));
        },

        initData : function(form){
            $.ajax({
                type: "POST",
                url: "/comm_msg/image/list",
                dataType : "json",
                async: true,
                cache: true,
                success: function (data) {
                    var tmp = doT.template($("#message_list_image_template").html());
                    var html = tmp({"images":data});
                    var $container = $('#image_masonry_content');

                    $container.html(html);



                    var imgload = $container.imagesLoaded(function () {
                        $container.masonry({
                                itemSelector: '.box'
                            }).fadeIn();
                    });

                    imgload.on( 'always', function () {
                        alert(222);
                    } );

                    $(".box > img").on('click',
                        function () {
                            var $parent = $(this).parent();
                            if ($parent.hasClass("box_select")){
                                $parent.removeClass("box_select")
                            }else{
                                $parent.addClass("box_select")
                            }
                        })
                    }
            });
        },

        bindEvent: function () {
            $(".box > img").on('click',
                function () {
                    $(this).parent().addClass("box_select")
                })
        }

    });

});