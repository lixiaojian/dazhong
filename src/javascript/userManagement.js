/**
 * Created by 872458899@qq.com on 2018/9/1.
 */
;$(function () {
    //搜索的表单
    var searchForm = document.getElementById('search_form');
    //表格
    var userListTable = $('#userListTableBody');
    //编辑和添加用户的form
    var editUserForm = $('#edit_user_form');
    //编辑和添加用户的弹层
    var editDialog = $('#editDialog');

    /**
     * 去请求数据
     * @param pageNumber 页数
     */
    function getData(pageNumber) {
        pageNumber = pageNumber?(pageNumber<1?1:pageNumber):1;
        $.ajax({
            url:apiUrlBase+'userList.json',
            method:'POST',
            dataType:'json',
            data:{
                pageNumber:pageNumber,
                userName:searchForm.userName.value,
                phone:searchForm.phone.value,
                name:searchForm.name.value,
                company:searchForm.company.value,
                accountStatus:searchForm.accountStatus.value
            }
        }).done(function (resp) {
            if(resp.code === successCode){
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
        var data = respData.data || [];
        var page = respData.page;

        // userListTable.datagrid({
        //     data:data,
        //     fitColumns:true,
        //     fit:true,
        //     striped:true,
        //     singleSelect:true,
        //     columns:[[
        //         {field:'id','title':'',checkbox:true},
        //         {field:'userName',title:'用户名',align:'center',width:'10%'},
        //         {field:'name',title:'姓名',align:'center',width:'10%'},
        //         {field:'company',title:'所属公司',align:'center',width:'10%'},
        //         {field:'dept',title:'所属部门',align:'center',width:'10%'},
        //         {field:'phone',title:'手机号码',align:'center',width:'10%'},
        //         {field:'accountStatus',title:'账户状态',align:'center',width:'10%',
        //             formatter: function(value,row,index){
        //                 return value == 2?'停用':'在用';
        //                 add_user_btn      }
        //         },
        //         {field:'creatTime',title:'创建时间',align:'center',width:'10%'},
        //         {field:'creater',title:'创建者',align:'center',width:'10%'},
        //         {field:'updateTime',title:'修改时间',align:'center',width:'10%'},
        //         {field:'updater',title:'修改者',align:'center',width:'10%'}
        //     ]]
        // });
        var trTemplate = '<tr><td><input type="checkbox" name="userChecked" value="${id}"></td><td>${userName}</td><td>${name}</td><td>${company}</td><td>${dept}</td><td>${phone}</td><td>${accountStatus}</td><td>${creatTime}</td><td>${creater}</td><td>${updateTime}</td><td>${updater}</td></tr>>'
        var users = [];
        data.map(function (user) {
            var tr = trTemplate.replace(/\${[a-zA-Z]*}/g,function (keyWarpper) {
                var key = keyWarpper.substring(2, keyWarpper.length - 1);
                return user[key];
            })
            users.push(tr);
        })
        $('#userListTableBody').html(users.join(''));
        initPagination(page.pageSize,page.pageNumber,page.total);
    }
    /**
     * 初始化表格的分页
     * @param pageSize
     * @param pageNumber
     * @param total
     */
    function initPagination(pageSize,pageNumber,total){
        pageSize = pageSize || 10;
        $('#userlist_pagination').pagination({
            total:total,
            pageNumber:pageNumber,
            pageSize:pageSize,
            showPageList:false,
            showRefresh:false,
            beforePageText: '第',
            afterPageText: '页    共 {pages} 页',
            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
            onSelectPage:function (pageNumber,pageSize) {
                getData(pageNumber);
            }
        });
    }
    //点击搜索按钮
    $('#search_btn').on('click',function () {
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    })

    //点击新增账户按钮
    $('#add_user_btn').on('click',function (e) {
        e.stopPropagation();
        //显示弹层
        editDialog.dialog('open').dialog('center').dialog('setTitle','添加用户');
        //清空弹层的数据
        editUserForm.form('clear');
    });
    //点击设置账户按钮
    $('#edit_user_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var row = userListTable.datagrid('getSelected');
        if(row){
            editDialog.dialog('open').dialog('center').dialog('setTitle','设置用户');
            //数据回填 如果列表数据不全，这里可以先取记录id 然后通过id再去加载一次详情
            editUserForm.form('load',row);
        }else{
            showError('请先选择需要设置的记录行!');
        }
    });
    //点击保存按钮
    $('#save_user_btn').on('click',function (e) {
        e.stopPropagation();
        // todo 这里记得提交前做验证
        $.ajax({
            url: apiUrlBase+'ok.json',
            method: 'POST',
            dataType: 'json',
            //todo 这里用表单序列化需要注意 复选框的值，如果取值有问题请单独取所有的值(参考上面的搜索取值)
            data:editUserForm.serialize()
        }).done(function (resp) {
            if(resp.code === successCode){
                showSuccess('保存成功',function () {
                    //关闭弹层 这里也可以关闭后重新加载数据做到数据实时更新的效果
                    editDialog.dialog('close');
                })
            }else{
                showError(resp.msg || '操作失败');
            }
        }).fail(function () {
            showError('服务器错误！');
        });
    })
    //页面刚开始进来时加载一次数据
    getData(1);

    //点击行
    $('#userListTableBody').on('click','tr',function () {
        var checkBox = $(this).find('input[name="userChecked"]');
        var all checkBox = userListTable.find('input[name="userChecked"]');
        console.log(checkBox);
    })
});
