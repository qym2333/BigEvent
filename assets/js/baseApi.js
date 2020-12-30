$.ajaxPrefilter(function (opt) {
    //配置请求头
    if (opt.url.indexOf('/my/') !== -1) {
        opt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    //全局服务器地址
    opt.url = 'http://ajax.frontend.itheima.net' + opt.url;
    //统一权限控制，配置complete回调
    opt.complete = function (res) {
        if (res.responseJSON.status === 1 &&
            res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
});