const {
    layer
} = layui;

$(function () {

    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1, //正方形
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options);
    //初始化头像
    let currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser != null) {
        $image.cropper('destroy').attr('src', currentUser.user_pic).cropper(options);
    }
    //上传按钮点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });
    //文件控件change事件
    $('#file').change(function (e) {
        e.preventDefault();
        let fileList = e.target.files;
        if (fileList.length === 0) {
            return layer.msg('请选择图片！')
        }

        //拿到用户选择的文件
        let file = e.target.files[0];
        let imgUrl = URL.createObjectURL(file); //将文件转换为路径
        //重新初始化裁剪区域
        $image.cropper('destroy').attr('src', imgUrl).cropper(options);
    });
    //确认上传图片按钮点击事件
    $('#btnUploadAvatar').click(function (e) {
        e.preventDefault();
        //创建一个 Canvas 画布，将 Canvas 画布上的内容，转化为 `base64` 格式的字符串
        let dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png');

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo();
            }
        })
    });
});