var PAGE_IDENTIFY={

    'statistics.dau':1,
    'statistics.retained':2,
    'statistics.dru':3,

    'statistics.retained.standard':21,
    'statistics.retained.customized':22
};

var DATATABLE_CONFIG={
    'statistics.retained.standard' : {
                "sAjaxSource": '/statistics/retained/table',
                "aoColumns": [
                    { sWidth: '100px', "mData": "datetime", "sTitle": "日期", "bSearchable": false, "bSortable": true, "bVisible": true,
                        mRender: function (data, type, row) {
                            return  data.slice(0,10) ;
                        }
                    },

                     { "mData": "new_user", "sTitle": '新增用户' ,'bSearchable':false,"bSortable": true,
                         mRender: function(data,type,row){
                            if(data===0){
                                return "-"
                            }
                            return data;
                         }
                     },

                    {  "mData": "retained_new_user_num", "sTitle": "<span class='title_replace_anchor'></span>用户",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            if(data===0){
                                return "-"
                            }
                            return data;
                        }
                    },

                    {  "mData": "retained_new_user_percent", "sTitle": "<span class='title_replace_anchor'></span>率",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            if(data===0){
                                return "-"
                            }
                            return Math.ForDight(data * 100,2) + "%";
                        }
                    }

                ]
    },
    'statistics.retained.customized':{
                "sAjaxSource": '/statistics/customized_retained/table',
                "aoColumns": [
                    { sWidth: '100px', "mData": "datetime", "sTitle": "日期", "bSearchable": false, "bSortable": true, "bVisible": true,
                        mRender: function (data, type, row) {
                            return  data.slice(0,10) ;
                        }
                    },

                     { "mData": "new_user", "sTitle": '当日新增用户' ,'bSearchable':false,"bSortable": true,
                         mRender: function(data,type,row){
                            if(data===0){
                                return "-"
                            }
                            return data;
                         }
                     },

                    {  "mData": "retain_per_list", "sTitle": "+1日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[0];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+2日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[1];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+3日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[2];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+4日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[3];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+5日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[4];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+6日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[5];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+7日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[6];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+15日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[7];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },

                    {  "mData": "retain_per_list", "sTitle": "+30日",'bSearchable':false,"bSortable": true,
                        mRender: function (data, type, row) {
                            var per = data[8];
                            if(per===0){
                                return "-"
                            }
                            return Math.ForDight(per * 100,2) + "%";
                        }
                    },
                ]
    },
    'statistics.dau' : {
                "sAjaxSource": '/statistics/dau/table',
                "aoColumns": [
                    { sWidth: '100px', "mData": "datetime", "sTitle": "日期", "bSearchable": false, "bSortable": true, "bVisible": true,
                        mRender: function (data, type, row) {
                            return  data.slice(0, 10);
                        }
                    },
                    {  "mData": "active_user", "sTitle": '活跃用户', 'bSearchable': false, "bSortable": true,
                        mRender: function (data, type, row) {
                            if (data === 0) {
                                return "-"
                            }
                            return data;
                        }
                    },

                    { "mData": "new_user", "sTitle": '新增用户', 'bSearchable': false, "bSortable": true,
                        mRender: function (data, type, row) {
                            if (data === 0) {
                                return "-"
                            }
                            return data;
                        }
                    },


                    {  "mData": "retained_active_user_num", "sTitle": '活跃留存用户', 'bSearchable': false, "bSortable": true,
                        mRender: function (data, type, row) {
                            if (data === 0) {
                                return "-"
                            }
                            return data;
                        }
                    }


                ]
    },
    'statistics.dru' : {
                "sAjaxSource": '/statistics/dru/table',
                "aoColumns": [
                    {  "mData": "datetime", "sTitle": "日期", "bSearchable": false, "bSortable": true, "bVisible": true,
                        mRender: function (data, type, row) {
                            return  data.slice(0, 10);
                        }
                    },
                    {  "mData": "recharge_user", "sTitle": '付费用户', 'bSearchable': false, "bSortable": true,
                        mRender: function (data, type, row) {
                            if (data === 0) {
                                return "-"
                            }
                            return data;
                        }
                    }
                ]
    }
};

var HIGHTCHARTS_CONFIG= {
    'statistics.retained.standard': {
        'url': "/statistics/retained/chart"
    },
    'statistics.retained.customized': {
        'url': "/statistics/customized_retained/chart"
    },
    'statistics.dau':{
        'url':"/statistics/dau/chart"
    },
    'statistics.dru':{
        'url':"/statistics/dru/chart"
    }
};

getPageKeyByValue = function(value){
    for (var k in PAGE_IDENTIFY){
        if (PAGE_IDENTIFY[k] === value ){
            return k;
        }
    }
}