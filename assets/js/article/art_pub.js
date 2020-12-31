const {
    form,
    layer
} = layui;
let art_state = '已发布'; //
$(function () {
    initial();
    // 图片裁剪
    let $image = $('#image');
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    $image.cropper(options);

    // 选择封面点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    //监听coverFile控件change事件,,获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        let files = e.target.files;
        if (files.length === 0) return;
        //根据文件,创建对应的URL地址
        let newImgUrl = URL.createObjectURL(files[0]);
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
    });
    //存为草稿按钮点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    //监听表单提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //将表单域转成formdata对象
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将文件对象，存储到 fd 中
            fd.append('cover_img', blob);
            // 发起 ajax 数据请求
            publishArticle(fd);
        });
    });
});

/**
 * @description 页面初始化
 */
function initial() {
    initCate();
    initEditor(); // 初始化富文本编辑器
}
/**
 * @description 初始化文章分类
 */
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取分类数据失败！');
            }
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr);
            // 通过 layui 重新渲染表单区域的UI结构
            form.render();
        }
    })
}

/**
 * @description 发布文章请求
 * @param {*} fd formData对象
 */
function publishArticle(fd) {
    $.ajax({
        type: "POST",
        url: "/my/article/add",
        data: fd,
        //向服务器提交formdata格式的数据,必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败!');
            }
            layer.msg('发布文章成功!');
            location.href = '/article/art_list.html'
        }
    });
}