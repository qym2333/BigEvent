$(function () {
    getUserInfo();
    //退出用户按钮点击事件
    $('.btnLogout').click(function (e) {
        e.preventDefault();
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //清空本地存储中的 token
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        })
    });
});

/**
 * @description 获取当前的登录用户信息
 */

function getUserInfo() {
    // let user = null;
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        //手动添加请求头，传入token
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        // async: false, 
        success: function (res) {
            if (res.status !== 0) return layer.msg('获取用户信息失败');
            renderAvatar(res.data);
            user = res.data;
            sessionStorage.setItem('user', JSON.stringify(res.data));
        }
    });
    // return user;
}

/**
 * @description 渲染用户头像
 * @param {*} user
 */
function renderAvatar(user) {
    //用户昵称或用户名
    let name = user.nickname || user.username;
    $('.name-box').html(name);
    //用户头像或文字头像
    if (user.user_pic) {
        $('.img-avatar').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.img-avatar').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }
}