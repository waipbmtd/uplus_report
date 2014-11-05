$(function () {
    $.LogOutController = function (elm, config) {

    }

    $.extend($.LogOutController, {
        showLogout: function () {
            $("#Logout").modal({});
        },
        cancel: function () {
            $("#Logout").modal('hide');
        },
        logout: function () {
            location.href = "/logout?_=" + (new Date()).valueOf();
            $("#Logout").modal('hide');

        }

    })
});