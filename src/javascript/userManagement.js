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
    var editDialog = $('#editDialog')
    var allUser = null;

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
                allUser = resp.data;
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

        var trTemplate = '<tr><td><input type="checkbox" name="userChecked" value="${id}"></td><td>${userName}</td><td>${name}</td><td>${company}</td><td>${dept}</td><td>${phone}</td><td>${accountStatus}</td><td>${creatTime}</td><td>${creater}</td><td>${updateTime}</td><td>${updater}</td></tr>'
        var users = [];
        data.map(function (user) {
            var tr = trTemplate.replace(/\${[a-zA-Z]*}/g,function (keyWarpper) {
                var key = keyWarpper.substring(2, keyWarpper.length - 1);
                return user[key];
            })
            users.push(tr);
        })
        userListTable.html(users.join(''));
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

    //获取编辑时的可用系统
    $.ajax({
        url:apiUrlBase+'systemList.json',
        method:'POST',
        dataType:'json'
    }).done(function (resp) {
        var systems = resp.data;
        var systemsHtmls = ['<label class="textbox-label textbox-label-before" style="text-align: right; height: 30px; line-height: 30px;">可用系统:</label>'];
        systems.map(function (sys) {
            systemsHtmls.push('<input class="easyui-checkbox" name="systems" value="'+sys.id+'" label="'+sys.name+':" labelAlign="right">')
        })
        //将后台获取的数据回填到页面
        $('#user_management_system_list').html(systemsHtmls.join(''));
        //重新初始化checkbox
        $('.easyui-checkbox').checkbox();

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
            var checkeBox = userListTable.find('input[name="userChecked"]:checked')[0];
            if(checkeBox && checkeBox.value){
                editDialog.dialog('open').dialog('center').dialog('setTitle','设置用户');
                //数据回填 如果列表数据不全，这里可以先取记录id 然后通过id再去加载一次详情
                var user = allUser.filter(function (user) {
                    return user.id == checkeBox.value;
                })
                editUserForm.form('load',user[0]);
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

    }).fail(function (err){
        //请求失败
        showError('服务器错误!');
    });

    //页面刚开始进来时加载一次数据
    getData(1);

    //点击行
    ckilckTableRow(userListTable,'userChecked');
});
