/**
 * Created by 872458899@qq.com on 2018/9/2.
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
    var allUsers = [];

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
                allUsers = resp.data;
                renderTable(resp);
            }else{
                showError(resp.msg || '获取数据失败');
            }
        }).fail(function (err){
            //请求失败
            showError('服务器错误!');
        });
    };

    /**
     * 渲染数据
     * @param data 数据
     */
    function renderTable(respData) {
        var data = respData.data;
        var page = respData.page;

        var trTemplate = '<tr><td><input type="checkbox" name="userChecked" value="${id}"></td><td>${company}</td><td>${name}</td><td>${phone}</td><td>${userName}</td><td>${accountStatus}</td><td>${updateTime}</td><td>${updater}</td></tr>';
        var usersTr = [];
        data.map(function (system) {
            var tr = trTemplate.replace(/\${[a-zA-Z]*}/g,function (keyWarpper) {
                var key = keyWarpper.substring(2, keyWarpper.length - 1);
                if('accountStatus' === key){
                    return system[key] == 2?'停用':'在用';
                }
                return system[key];
            })
            usersTr.push(tr);
        })
        userListTable.html(usersTr.join(''));
        initPagination(page.pageSize,page.pageNumber,page.total);
    }
    //点击行
    ckilckTableRow(userListTable,'userChecked');

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
            onSelectPage:function (pageNumber,pageSize) {
                getData(pageNumber);
            }
        });
    }
    //点击搜索按钮
    $('#search_btn').on('click',function () {
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    });
    //点击新增账户按钮
    $('#add_user_btn').on('click',function (e) {
        e.stopPropagation();
        //显示弹层
        editDialog.dialog('open').dialog('center').dialog('setTitle','添加用户');
        //清空弹层的数据
        editUserForm.form('clear');
    });
    //点击编辑按钮
    $('#edit_user_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checkeBox = userListTable.find('input[name="userChecked"]:checked')[0];
        if(checkeBox){
            //数据回填 如果列表数据不全，这里可以先取记录id 然后通过id再去加载一次详情
            var user = allUsers.filter(function (u) {
                return u.id == checkeBox.value;
            });
            if(user[0]){
                editDialog.dialog('open').dialog('center').dialog('setTitle','设置用户');
                editUserForm.form('load',user[0]);
            }
        }else{
            showError('请先选择需要编辑的记录行!');
        }
    });
    //点击保存按钮
    $('#save_user_btn').on('click',function (e) {
        e.stopPropagation();
        // todo 参考userManagement.js 的保存方法
    })
    //点击停用按钮
    $('#disable_user_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checkeBox = userListTable.find('input[name="userChecked"]:checked')[0];
        if(checkeBox){
            $.messager.confirm('确认提示','您确定要停用该用户?',function(r){
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
                            showSuccess('停用成功！');
                        }else{
                            showError(resp.msg || '操作失败！')
                        }
                    }).fail(function () {
                        showError('系统错误！')
                    })
                }
            });
        }else{
            showError('请先选择需要停用的记录行!');
        }
    });
    //点击恢复按钮
    $('#undisable_user_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checkeBox = userListTable.find('input[name="userChecked"]:checked')[0];
        if(checkeBox){
            $.messager.confirm('确认提示','您确定要恢复该用户?',function(r){
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
                            showSuccess('恢复成功！');
                        }else{
                            showError(resp.msg || '操作失败！')
                        }
                    }).fail(function () {
                        showError('系统错误！')
                    })
                }
            });
        }else{
            showError('请先选择需要恢复的记录行!');
        }
    })
    //页面加载时去加载一次数据
    getData(1);
});
