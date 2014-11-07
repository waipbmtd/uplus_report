/**
 * Created by Devin on 14-7-2.
 */

$(function () {
    $.ImageMessageController = function (elm, config) {

    };

    $.extend($.ImageMessageController, {

        initImageMesPage: function()  {
            $.ImageMessageController.initTypeEnum();
            $.ImageMessageController.initModEnum();
            $.ImageMessageController.initPunishEnum();
            $.ImageMessageController.initNextData();
//            $.ImageMessageController.bindEvent();
        },


        initTypeEnum: function () {
            $.ajax({
                type: "GET",
                url: "/enum/type",
                dataType : "json",
                async: true,
                cache: true,
                success: function (data) {
                    $("body").data("types",data)
                    }
            });
        },

        initModEnum: function () {
            $.ajax({
                type: "GET",
                url: "/enum/mod",
                dataType : "json",
                async: true,
                cache: true,
                success: function (data) {
                    $("body").data("mods",data)
                    }
            });
        },

        initPunishEnum: function () {
            $.ajax({
                type: "GET",
                url: "/enum/punish",
                dataType : "json",
                async: true,
                cache: true,
                success: function (data) {
                    $("body").data("punishes",data)
                    }
            });
        },

        initNextData : function(){
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

                    $container.imagesLoaded(function () {
                        $container.masonry({
                                itemSelector: '.box'
                            }).fadeIn();

                        $(".box > img").on('click',
                            function () {
                                var $parent = $(this).parent();
                                if ($parent.hasClass("box_select")){
                                    $parent.removeClass("box_select");
                                    $parent.children("input[type=checkbox]").attr("checked",false)
                                }else{
                                    $parent.addClass("box_select");
                                    $parent.children("input[type=checkbox]").attr("checked",true)
                                }
                            })
                    });

                    }
            });
        },

        getTypeEnums: function () {
            return $("body").data("types");
        },

        getModEnums: function () {
            return $("body").data("mods")
        },

        getPunishEnums: function () {
            return $("body").data("punishes")
        },

        NextImageMessageList: function () {
            var $container = $("#image_masonry_content");
            if ($container.children(".box").length > 0){
                $.CommonFn.MessageDialog('提醒', '请先处理完当前举报再申请新任务！');
                return
            }

            $container.masonry('destroy');
            $container.empty();
            $.ImageMessageController.initNextData()
        },

        SelecAllImages: function () {
            $(".box").each(function(){
                if (!$(this).hasClass("box_select")){
                    $(this).addClass("box_select");
                    $(this).children("input[type=checkbox]").attr("checked",true)
                }
            })
        },

        UnselectAllImages: function () {
            $(".box").each(function(){
                if ($(this).hasClass("box_select")){
                    $(this).removeClass("box_select");
                    $(this).children("input[type=checkbox]").attr("checked",false)
                }
            })
        },

        ShowConformDialog: function (passed) {
            var ids = $.ImageMessageController.GetAllCheckImage();
            if (ids.length === 0){
                $.CommonFn.MessageDialog('提醒', '请先至少选取一个图片！');
                return
            }

            if (!passed){
                var tmp = doT.template($("#confirm_report_template").html());
                var html =tmp({
                    all_types: $.ImageMessageController.getTypeEnums(),
                    all_mods: $.ImageMessageController.getModEnums(),
                    all_punishes: $.ImageMessageController.getPunishEnums()
                });
                $("#add").html(html);
                $("#confirmReportModal").modal();

                $.ImageMessageController.bindEvent()
            }

//            alert(ids);
            $.ImageMessageController.RemoveAllCheckImage()

        },

        GetAllCheckImage: function () {
            var ids = [];
            $("input[name=select_report_image_ids]:checkbox").each(function () {
                if($(this).attr("checked")) {
                    ids.push(parseInt($(this).val()));
                }
            });
            return ids;
        },

        RemoveAllCheckImage: function(){
            var $container = $("#image_masonry_content");
            $container.masonry('remove', $(".box_select") );
//            $container.masonry();
        },

        handlerReport: function () {

        },


        bindEvent: function () {

            $(".form-control").tooltip({"placement":'top'});

//            $.validator.addMethod("validThreadUrl",
//                function (value, element) {
//                    if (value) {
//                        return $.TaskController.checkValidthreadUrl(value);
//                    } else {
//                        return true;
//                    }
//                },
//                "帖子地址无法访问");

            $('#add_report_form').validate({

                submitHandler: function (form) {

                    $.ImageMessageController.handlerReport();
                },

                rules: {
                    illegal_type: {
                        required: true
                    },
                    punish_mode: {
                        required: true
                    },
                    punish_type: {
                        required: true
                    },
                    punish_time: {
                        min:-1,
                        number:true,
                        required: true,
                        max:720
                    },
                    content:{
                        required:true
                    }
                },

                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        var $parent = $(element).parent('.input-group');
                        if($parent.parent().children("div").length>1){
                            error.appendTo($parent.parent().children("div:first"))
                        }else{
                            error.insertAfter(element.parent());
                        }
                    } else {
                        error.insertAfter(element);
                    }
                }
            });

        }

    });

});