/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
;$(function () {
    //表格
    var userListTable = $('#userListTable');
    //组织架构树
    var deptTree = $('#dept_tree');
    //当前选中的部门ID 点击组织架构中的部门时会更新该值
    var deptId = null;
    //添加的弹层
    var addDialog = $('#addDialog');
    //新增的表单
    var addForm = $('#add_user_form');
    /**
     * 去请求数据
     * @param pageNumber 页数
     */
    function getData(pageNumber) {
        //如果当前没有选中的部门  则不加载数据
        if(!deptId){
            return;
        }
        pageNumber = pageNumber?(pageNumber<1?1:pageNumber):1;
        $.ajax({
            url:apiUrlBase+'userList.json',
            method:'POST',
            dataType:'json',
            data:{
                pageNumber:pageNumber,
                //这里的参数根据实际情况修改
                deptId:deptId
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
        var data = respData.data;
        var page = respData.page;
        userListTable.datagrid({
            data:data,
            fitColumns:true,
            fit:true,
            striped:true,
            singleSelect:true,
            columns:[[
                {field:'id','title':'',checkbox:true},
                {field:'name',title:'姓名',align:'center'},
                {field:'position',title:'职位',align:'center'},
                {field:'phone',title:'手机号码',align:'center'},
                {field:'email',title:'邮箱',align:'center'}
            ]]
        });
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
            onSelectPage:function (pageNumber,pageSize) {
                getData(pageNumber);
            }
        });
    }
    /**
     * 初始公组织架构的树
     */
    function initDeptTree(){
        deptTree.tree({
            url:'../mockData/tree.json',
            method:'get',
            animate:true,
            lines:true,
            onClick:function (node) {
                //如果是叶子节点 就去加载对应有用户列表
                if(deptTree.tree('isLeaf', node.target)){
                    deptId = node.id;
                    //加载该部门下的第一页数据
                    getData(1);
                }
            }
        });
    }
    //点击同步按钮
    $('#synchronize_dept').on('click',function (e) {
        e.stopPropagation();
        //重新加载组织结构的数据
        deptTree.tree('reload');
    });
    //点击新增按钮
    $('#add_user_btn').on('click',function (e) {
        e.stopPropagation();
        if(!deptId){
            showError('请先选择部门！')
        }else{
            //显示弹层
            addDialog.dialog('open').dialog('center').dialog('setTitle','新增用户');
            //清空弹层的数据
            addForm.form('clear');
            //将部门ID的值赋给表单
            addForm[0].deptId.value = deptId;
        }
    });
    //点击保存按钮
    $('#save_user_btn').on('click',function (e) {
        e.stopPropagation();
        $.ajax({
            url:apiUrlBase+'ok.json',
            method:'POST',
            dataType:'json',
            data:addForm.serialize()
        }).done(function (resp) {
            if(resp.code === successCode){
                showSuccess('添加成功！',function () {
                    //关闭弹层
                    addDialog.dialog('close');
                })
            }else{
                showError(resp.msg || '操作失败！');
            }
        }).fail(function () {
            showError('服务器错误！');
        })
    });
    //点击删除按钮
    $('#delete_user_btn').on('click',function (e) {
        e.stopPropagation();
        if(!deptId){
            showError('请先选择需要删除的记录行!');
            return;
        }
        //获取选中的行
        var row = userListTable.datagrid('getSelected');
        if(row){
            $.messager.confirm('确认提示','您确定要删除该用户?',function(r){
                //如果点击了确定按钮
                if (r){
                    $.ajax({
                        url:apiUrlBase+'ok.json',
                        method: 'GET',
                        data:{
                            id:row.id
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
    })
    //进入页面后加载树
    initDeptTree();
});
