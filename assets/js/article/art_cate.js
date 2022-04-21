$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // template 会返回一个渲染好的字符串
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        //打开弹出层有返回值
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            //通过 jQuery 选择器拿到对应标签，通过 html() 方法拿到结构
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                //重新获取数据
                initArtCateList()
                layer.msg('新增分类成功！')
                //根据弹出层返回的索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            //通过 jQuery 选择器拿到对应标签，通过 html() 方法拿到结构
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为 form-edit 表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类信息失败！')
                }
                layer.msg('修改分类信息成功！')
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    //通过代理的形式，为 btn-delete 按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        var id = $(this).attr('data-id')
        //提示用户是否要删除
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
    
})