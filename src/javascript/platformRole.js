/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
;$(function () {
    //搜索的表单
    var searchForm = document.getElementById('search_form');
    //表格
    var roleListTable = $('#roleListTableBody');
    //编辑和添加系统的form
    var editRoleForm = $('#edit_role_form');
    //编辑和添加用户的弹层
    var editDialog = $('#editDialog');
    var rolesTree = $('#roles_tree');
    var roles = [];
    //所有的权限列表
    var powers = null;

    /**
     * 去请求数据
     * @param pageNumber 页数
     */
    function getData(pageNumber) {
        pageNumber = pageNumber?(pageNumber<1?1:pageNumber):1;
        $.ajax({
            url:apiUrlBase+'roleList.json',
            method:'POST',
            dataType:'json',
            data:{
                pageNumber:pageNumber,
                roleName:searchForm.roleName.value
            }
        }).done(function (resp) {
            if(resp.code === successCode){
                roles = resp.data;
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

        var trTemplate = '<tr><td><input type="checkbox" name="roleChecked" value="${id}"></td><td>${id}</td><td>${roleName}</td><td>${desc}</td></tr>>';
        var roleTrs = [];
        data.map(function (system) {
            var tr = trTemplate.replace(/\${[a-zA-Z]*}/g,function (keyWarpper) {
                var key = keyWarpper.substring(2, keyWarpper.length - 1);
                return system[key];
            })
            roleTrs.push(tr);
        })
        roleListTable.html(roleTrs.join(''));
        initPagination(page.pageSize,page.pageNumber,page.total);
    }
    //点击行
    ckilckTableRow(roleListTable,'roleChecked');
    /**
     * 初始化表格的分页
     * @param pageSize
     * @param pageNumber
     * @param total
     */
    function initPagination(pageSize,pageNumber,total){
        pageSize = pageSize || 10;
        $('#rolelist_pagination').pagination({
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
    };

    /**
     * 初始化权限树
     * @param callback 完成后的回调
     */
    function initPowerTree(callback){
        $.ajax({
            url: apiUrlBase+'powers.json',
            method: 'get',
            dataType: 'json'
        }).done(function (resp) {
            if(resp.code === successCode){
                powers = resp.data;
                //初始化权限树
                rolesTree.tree({
                    animate:true,
                    checkbox:true,
                    lines:true,
                    data:powers
                });
                callback && callback();
            }else{
                showError(resp.msg || '获取权限列表错误！');
            }
        }).fail(function () {
            showError('服务器错误！')
        });
    }
    //点击搜索按钮
    $('#search_btn').on('click',function (e) {
        e.stopPropagation();
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    });

    //点击新增角色按钮
    $('#add_role_btn').on('click',function (e) {
        e.stopPropagation();
        //如果权限列表不存在就去加载一次权限列表
        if(!powers){
            initPowerTree();
        }else{
            //获取根节点
            var root = rolesTree.tree('getRoot');
            //取消根节点的选中状态  就相当于取消了所有节点的选中状态
            rolesTree.tree('uncheck',root.target);
        }
        //显示弹层
        editDialog.dialog('open').dialog('center').dialog('setTitle','添加角色');
        //清空弹层的数据
        editRoleForm.form('clear');
    });
    //点击编辑
    $('#edit_role_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checkeBox = roleListTable.find('input[name="roleChecked"]:checked')[0];
        if(checkeBox){
            var role = roles.filter(function (r) {
                return r.id == checkeBox.value;
            })
            if(role[0]){
                //选中用户的权限
                var currPowers = role[0].powers;
                //如果权限列表不存在就去加载一次权限列表
                if(!powers){
                    initPowerTree(function () {
                        currPowers.map(function (powerId) {
                            //取出对应的权限节点
                            var pw = rolesTree.tree('find',powerId);
                            //将对应的节点设置为选中
                            rolesTree.tree('check',pw.target);
                        })
                    });
                }else{
                    //获取根节点
                    var root = rolesTree.tree('getRoot');
                    //取消根节点的选中状态  就相当于取消了所有节点的选中状态
                    rolesTree.tree('uncheck',root.target);
                    //上面是清空所有选中状态 下面为选中对应的状态
                    currPowers.map(function (powerId) {
                        //取出对应的权限节点
                        var pw = rolesTree.tree('find',powerId);
                        //将对应的节点设置为选中
                        rolesTree.tree('check',pw.target);
                    });
                }
                editDialog.dialog('open').dialog('center').dialog('setTitle','修改角色');
                //数据回填 如果列表数据不全，这里可以先取记录id 然后通过id再去加载一次详情
                editRoleForm.form('load',role[0]);
            }
        }else{
            showError('请先选择需要修改的记录行!');
        }
    });
    //点击保存按钮
    $('#save_role_btn').on('click',function (e) {
        e.stopPropagation();
        //获取所有被选中的节点
        var ckeckeds = rolesTree.tree('getChecked');
        //提取出所有被选中的id
        var checkedIds = ckeckeds.map(function (item) {
            return item.id;
        });
        //取出form的dom节点
        var form = editRoleForm[0];
        //提交数据
        $.ajax({
            url:apiUrlBase+'ok.json',
            method:'POST',
            dataType:'json',
            data:{
                id:form.id.value,
                roleName:form.roleName.value,
                desc:form.desc.value,
                powers:checkedIds
            }
        }).done(function (resp) {
            if(resp.code === successCode){
                showSuccess('保存成功',function () {
                    editDialog.dialog('close');
                });
            }else{
                showError(resp.msg || '保存失败！');
            }
        }).fail(function () {
            showError('服务器错误！');
        })
    });
    //点击删除按钮
    $('#delete_role_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var checked = roleListTable.find('input[name="roleChecked"]:checked')[0];
        if(checked){
            $.messager.confirm('确认提示','您确定要删除该角色?',function(r){
                //如果点击了确定按钮
                if (r){
                    $.ajax({
                        url:apiUrlBase+'ok.json',
                        method: 'GET',
                        data:{
                            id:checked.value
                        }
                    }).done(function (resp) {
                        if(resp.code === successCode){
                            showSuccess('删除成功！');
                        }else{
                            showError(resp.msg || '操作失败！')
                        }
                    }).fail(function () {
                        showError('系统错误！')
                    })
                }
            });
        }else{
            showError('请先选择需要删除的记录行!');
        }
    });
    //初始化页面时 加载一次数据
    getData(1);
});