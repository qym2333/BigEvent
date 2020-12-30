let {
    form
} = layui;

$(function () {
    initUserInfo();
    //表单验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    })
    //注册表单重置按钮点击事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });
    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})

/**
 * @description 初始化用户基本信息
 */
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            //layui：form.val 可以为表单快速赋值 
            form.val('formUserInfo', res.data)
        }
    });
}