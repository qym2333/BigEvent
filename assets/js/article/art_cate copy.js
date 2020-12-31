const {
    table
} = layui;
const options = {
    elem: '#cateList',
    url: '/my/article/cates',
    // limit: 5,
    page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页布局
        groups: 1, //只显示 1 个连续页码
        first: false, //不显示首页
        last: false, //不显示尾页,
        limit: 10,
        limits: [5, 10, 15]
    },
    parseData: function (res) { //res 即为原始返回的数据
        let result;
        if (this.page.curr) {
            result = res.data.slice(this.limit * (this.page.curr - 1), this.limit * this.page.curr);
        } else {
            result = res.data.slice(0, this.limit);
        }
        return {
            "code": res.status, //解析接口状态
            "msg": res.message, //解析提示文本
            "count": res.data.length, //解析数据长度
            "data": result //解析数据列表
        };
    },
    cellMinWidth: 80, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
    cols: [
        [{
            type: 'checkbox',
            fixed: 'left'
        }, {
            field: 'Id',
            title: 'ID',
            sort: false,
        }, {
            field: 'name',
            title: '类别名称',
            sort: true,
            width: 300,
            edit: 'text'
        }, {
            field: 'alias',
            title: '分类别名',
            sort: true,
            edit: 'text'
        }, {
            fixed: 'right',
            title: '<button type="button" class="layui-btn layui-btn-normal layui-btn-sm delCK">删除选中</button>',
            toolbar: '#optBar',
            width: 200,
            align: 'center'
        }]
    ],
}
$(function () {
    table.render(options);
    //监听行工具事件
    table.on('tool(cateList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {

            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
                $.ajax({
                    type: "GET",
                    url: '/my/article/deletecate/' + obj.data.Id,
                    success: function (res) {
                        console.log(res);
                    }
                });
            });
        } else if (obj.event === 'edit') {
            layer.prompt({
                formType: 2,
                value: data.email
            }, function (value, index) {
                obj.update({
                    email: value
                });
                layer.close(index);
            });
        }
        $.ajax({
            type: "GET",
            url: '/my/article/deletecate/' + obj.data.Id,
            success: function (res) {
                console.log(res);
            }
        });
    });
    //监听单元格编辑
    table.on('edit(cateList)', function (obj) {
        // let value = obj.value; //得到修改后的值
        // let data = obj.data; //得到所在行所有键值
        // let field = obj.field; //得到字段
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: obj.data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                initArtCateList();
            }
        });
    });

    //删除选中行按钮
    $('.delCK').click(function (e) {
        e.preventDefault();
        // let delList = [];
        let ckData = [];
        var checkStatus = table.checkStatus('cateList');
        ckData = checkStatus.data; //选中数据；
        ckData.forEach(element => {
            // delList.push(element.Id);
            $.ajax({
                type: "GET",
                // url: '/my/article/deletecate/' + obj.data.Id,
                url: '/my/article/deletecate/' + element.Id,
                success: function (res) {
                    layer.msg(res.message);
                    table.reload('cateList', options);
                }
            });
        });
    });

});