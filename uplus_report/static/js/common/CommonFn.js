$(function () {
    $.CommonFn = function () {

    }

    $.CommonFn.itemInArray = function(out2Item, out2Array){
         for(var i=0;i<out2Array.length;i++)
         {
            if(out2Item == out2Array[i]) return true; //是数组元素
         }
         return false; //不是数组的元素
    }

    /**
     * check whether array2 in array1 ,and return a object
     * @param array1
     * @param array2
     * @returns {Object}
     */
    $.CommonFn.switchCheckedObject = function(array1,array2){
            var resultObject = new Object();
            for (var i= 0; i<array1.length;i++){
                resultObject[array1[i]] = 0;
            }

            for (var i=0; i< array2.length; i++){
                resultObject[array2[i]] = 1;
            }

            return resultObject;
        };

    $.CommonFn.checkBoxVal=function(name){
        result = [];
        $("input:checkbox[name="+name+"]:checked").each(function(){
            result.push($(this).val());
        })
        return result;
    };

    $.CommonFn.hideAllPopover = function () {
            $('.form-control,.btn').on('click', function (e) {
                $('.form-control').popover('hide');
            });
    };

    $.CommonFn.removeAllErrorSpan = function () {
        $('.error-area').remove();
        $('.error-main-area').remove();
    };

    $.CommonFn.insertErrorSpan = function (obj) {
        var html = '<span class="error-area hide" id="span_error"></span>';
        $(obj + ' .modal-header').append(html);
    };

    $.CommonFn.insertMainErrorSpan = function () {
        var html = '<span class="error-main-area hide" id="span_error"></span>';
        $("#main").after(html);
    };

    $.CommonFn.errorLoadImage = function (obj, context) {
        obj.onerror = null;
        obj.src = "/static/img/default.png";
    };

    $.CommonFn.open = function(url, name){
        var iWidth = 1000;
        var iLeft = (window.screen.availWidth-10-iWidth)/2;
        window.open(url, name,"height=650,width=" + iWidth + ",left=" + iLeft + ",toolbar=no,menubar=0,scrollbars=1,resizable=no,location=no,status=no",true);
//        window.open(url, name);
    };

    $.CommonFn.MessageDialog = function (title, content) {
        var tmpl = doT.template($("#message_common_dialog_template").html());
        var html = tmpl({msg_title:title,
                        msg_content: content});
        $("#add").html(html);
        $("#CommonMessageDialogModal").modal();

    }

    $.CommonFn.DataTable = function (elm, config) {

    };

    $.extend($.CommonFn.DataTable, {
        fnSetKey: function (aoData, sKey, mValue) {
            for (var i = 0, iLen = aoData.length; i < iLen; i++) {
                if (aoData[i].name == sKey) {
                    aoData[i].value = mValue;
                }
            }
        },

        fnGetKey: function (aoData, sKey) {
            for (var i = 0, iLen = aoData.length; i < iLen; i++) {
                if (aoData[i].name == sKey) {
                    return aoData[i].value;
                }
            }
            return null;
        } ,
        getRowData: function (elem,datakey,selectedObj) {
            var dataTable = $(elem).data(datakey);
            dataTable.$('tr.row_selected').removeClass('row_selected');
            $(selectedObj).parent().parent().addClass('row_selected');
            var anSelected = dataTable.$('tr.row_selected');

            var row = dataTable.fnGetData(anSelected[0]);
            return row;

        },
        getsAjaxSource: function(page_id){
            var page_key = getPageKeyByValue(page_id);
            return DATATABLE_CONFIG[page_key]["sAjaxSource"]
        },

        getaoColumns: function(page_id){
            var page_key = getPageKeyByValue(page_id);
            return DATATABLE_CONFIG[page_key]["aoColumns"]
        },

        getsAjaxMethod: function (page_id) {
            var page_key = getPageKeyByValue(page_id);
            return DATATABLE_CONFIG[page_key]["method"]
        }

    })


    $.CommonFn.HighChars = function (elm, config) {

    }


    $.extend($.CommonFn.HighChars,{
        getUrl: function(page_id){
            var page_key = getPageKeyByValue(page_id);
            return HIGHTCHARTS_CONFIG[page_key]["url"]
        }
    })

})