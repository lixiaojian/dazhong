/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
;$(function () {
    //搜索的表单
    var searchForm = document.getElementById('search_form');
    //表格
    var systemListTable = $('#systemListTableBody');
    //编辑和添加系统的form
    var editSystemForm = $('#edit_system_form');
    //编辑和添加用户的弹层
    var editDialog = $('#editDialog');
    var systems = [];
    /**
     * 去请求数据
     * @param pageNumber 页数
     */
    function getData(pageNumber) {
        pageNumber = pageNumber?(pageNumber<1?1:pageNumber):1;
        $.ajax({
            url:apiUrlBase+'systemList.json',
            method:'POST',
            dataType:'json',
            data:{
                pageNumber:pageNumber,
                systemName:searchForm.systemName.value,
                useDept:searchForm.useDept.value,
                startDate:searchForm.startDate.value,
                endDate:searchForm.endDate.value
            }
        }).done(function (resp) {
            if(resp.code === successCode){
                systems = resp.data;
                renderTable(resp);
            }else{
                showError(resp.msg || '获取数据失败');
            }
        }).fail(function (err){
            //请求失败
            showError('服务器错误!');
        });
    }

    /**
     * 渲染数据
     * @param data 数据
     */
    function renderTable(respData) {
        var data = respData.data;
        var page = respData.page;

        var trTemplate = '<tr><td><input type="checkbox" name="systemChecked" value="${id}"></td><td>${id}</td><td>${name}</td><td>${dept}</td><td>${createTime}</td><td>${creater}</td><td>${updateTime}</td><td>${updater}</td></tr>';
        var systems = [];
        data.map(function (system) {
            var tr = trTemplate.replace(/\${[a-zA-Z]*}/g,function (keyWarpper) {
                var key = keyWarpper.substring(2, keyWarpper.length - 1);
                return system[key];
            })
            systems.push(tr);
        })
        systemListTable.html(systems.join(''));
        initPagination(page.pageSize,page.pageNumber,page.total);
    }
    //点击行
    ckilckTableRow(systemListTable,'systemChecked');
    /**
     * 初始化表格的分页
     * @param pageSize
     * @param pageNumber
     * @param total
     */
    function initPagination(pageSize,pageNumber,total){
        pageSize = pageSize || 10;
        $('#systemlist_pagination').pagination({
            total:total,
            pageNumber:pageNumber,
            pageSize:pageSize,
            showPageList:false,
            showRefresh:false,
            beforePageText: '第',
            afterPageText: '页    共 {pages} 页',
            onSelectPage:function (pageNumber,pageSize) {
                getData(pageNumber);
            }
        });
    }
    //点击搜索按钮
    $('#search_btn').on('click',function (e) {
        e.stopPropagation();
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    });
    //点击新增系统按钮按钮
    $('#add_sys_btn').on('click',function (e) {
        e.stopPropagation();
        //显示弹层
        editDialog.dialog('open').dialog('center').dialog('setTitle','添加系统');
        //清空弹层的数据
        editSystemForm.form('clear');
    });

    //点击修改系统按钮
    $('#edit_sys_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checkeBox = systemListTable.find('input[name="systemChecked"]:checked')[0];
        if(checkeBox && checkeBox.value){
            var system = systems.filter(function (sys) {
                return sys.id == checkeBox.value;
            });
            if(system[0]){
                editDialog.dialog('open').dialog('center').dialog('setTitle','修改系统');
                //数据回填 如果列表数据不全，这里可以先取记录id 然后通过id再去加载一次详情
                editSystemForm.form('load',system[0]);
            }
        }else{
            showError('请先选择需要设置的记录行!');
        }
    });
    //点击保存按钮
    $('#save_sys_btn').on('click',function (e) {
        e.stopPropagation();
        // todo 参考userManagement.js 的保存方法
    });

    //点击禁用按钮
    $('#disabled_sys_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checkeBox = systemListTable.find('input[name="systemChecked"]:checked')[0];
        if(checkeBox && checkeBox.value){
            $.messager.confirm('确认提示','您确定要禁用该系统?',function(r){
                //如果点击了确定按钮
                if (r){
                    $.ajax({
                        url:apiUrlBase+'ok.json',
                        method: 'GET',
                        data:{
                            id:checkeBox.value
                        }
                    }).done(function (resp) {
                        if(resp.code === successCode){
                            showSuccess('禁用成功！');
                        }else{
                            showError(resp.msg || '操作失败！')
                        }
                    }).fail(function () {
                        showError('系统错误！')
                    })
                }
            });
        }else{
            showError('请先选择需要禁用的记录行!');
        }
    });
    //进入页面时加载一次数据
    getData(1);
});