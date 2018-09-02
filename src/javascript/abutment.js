/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
;$(function () {
    //请求返回的正确码
    var successCode = 0;
    //接口的基本路径
    var apiUrlBase = '../mockData/';
    //搜索的表单
    var searchForm = document.getElementById('search_form');
    //表格
    var systemListTable = $('#systemListTable');
    //编辑和添加系统的form
    var editSystemForm = $('#edit_system_form');
    //编辑和添加用户的弹层
    var editDialog = $('#editDialog');


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

        systemListTable.datagrid({
            data:data,
            fitColumns:true,
            fit:true,
            striped:true,
            singleSelect:true,
            columns:[[
                {field:'',checkbox:true,align:'center'},
                {field:'id',title:'系统ID',align:'center'},
                {field:'name',title:'系统名称',align:'center'},
                {field:'dept',title:'使用部门',align:'center'},
                {field:'createTime',title:'创建时间',align:'center'},
                {field:'creater',title:'创建者',align:'center'},
                {field:'updateTime',title:'修改时间',align:'center'},
                {field:'updater',title:'修改者',align:'center'}
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
    $('#search_btn').on('click',function () {
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    });
    //点击新增账户按钮
    $('#add_sys_btn').on('click',function (e) {
        e.stopPropagation();
        //显示弹层
        editDialog.dialog('open').dialog('center').dialog('setTitle','添加用户');
        //清空弹层的数据
        editSystemForm.form('clear');
    });
    //进入页面时加载一次数据
    getData(1);
});