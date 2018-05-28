$.dataService = $.dataService || {};
$.dataService.login = function (loginInfo, successFunc, errorFunc) {
    $.ajax({
        type: 'post',
        url: '/api/Authorize',//发送请求  
        data: JSON.stringify(loginInfo),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: successFunc,
        error: errorFunc
    });
}

var loginController = {
    getParams: function () {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }, login: function () {
        var user = uid;//loginController.getParams("uid");
        var loginData = { User: user, Password: 'Aa123456!' };
        $.dataService.login(loginData, function (data) {
            console.log('登录成功');
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        }, function (err) {
            console.log('登录失败');
        });
    }
}