$(function () {
    // 去注册
    $('#link_reg').click(function (e) {
        e.preventDefault();
        $('.reg-box').slideDown();
        $('.login-box').slideUp();
    });
    // 去登录
    $('#link_login').click(function (e) {
        e.preventDefault();
        $('.reg-box').slideUp();
        $('.login-box').slideDown();
    });
    //初始化layui组件
    const {
        form,
        layer
    } = layui;

    form.verify({
        //密码规则
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认密码
        repass: function (val) {
            let pwd = $('.reg-box input[name=password]').val();
            if (pwd !== val) {
                return '两次密码不一致，请重新输入！'
            }
        }
    });

    //监听注册表单提交事件
    $('#formReg').on('submit', function (e) {
        e.preventDefault();
        let username = $('#formReg input[name=username]').val();
        let password = $('#formReg input[name=password]').val();
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: username,
                password: password
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message || '注册失败了。 T^T');
                }
                layer.msg(res.message);
                $('#link_login').click();
                $('.login-box input[name=username]').val(username);
            }
        });
    });

    //监听登录表单提交事件
    $('#formLogin').submit(function (e) {
        e.preventDefault();
        let data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: data,
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg(res.message);
                layer.msg(res.message);
                console.log(res.token);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    });
})