/**
 * Created by 872458899@qq.com on 2018/9/1.
 */
;$(function () {
    //请求返回的正确码
    var successCode = 0;
    //接口的基本路径
    var apiUrlBase = '../mockData/';
    //搜索的表单
    var searchForm = $('#search_form');
    //所属公司的下拉框
    var companySelect = $('#company');
    //用户状态的下拉框
    var accountStatusSelect = $('#accountStatus');
    //搜索按钮
    var searchBtn = $('#search_btn');
    //表格
    var userListTable = $('#userListTable');
    //被选中的记录
    var selectedData = null;

    //显示错误信息
    function showError(msg) {
        $.messager.alert({
            title:'错误提示',
            msg:msg,
            icon:'error',
            ok:'确定'
        });
    }

    /**
     * 去请求数据
     * @param pageNumber 页数
     */
    function getData(pageNumber) {
        pageNumber = pageNumber?(pageNumber<1?1:pageNumber):1;
        var form = searchForm[0];
        $.ajax({
            url:apiUrlBase+'userList.json',
            method:'POST',
            dataType:'json',
            data:{
                pageNumber:pageNumber,
                userName:form.userName.value,
                phone:form.phone.value,
                name:form.name.value,
                company:companySelect.val(),
                accountStatus:accountStatusSelect.val()
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
                {field:'userName',title:'用户名',align:'center',width:'10%'},
                {field:'name',title:'姓名',align:'center',width:'10%'},
                {field:'company',title:'所属公司',align:'center',width:'10%'},
                {field:'dept',title:'所属部门',align:'center',width:'10%'},
                {field:'phone',title:'手机号码',align:'center',width:'10%'},
                {field:'acountStatus',title:'账户状态',align:'center',width:'10%'},
                {field:'creatTime',title:'创建时间',align:'center',width:'10%'},
                {field:'creater',title:'创建者',align:'center',width:'10%'},
                {field:'updateTime',title:'修改时间',align:'center',width:'10%'},
                {field:'updater',title:'修改者',align:'center',width:'10%'}
            ]],
            onSelect:function (index,data) {
                selectedData = data;
            }
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
            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
            onSelectPage:function (pageNumber,pageSize) {
                getData(pageNumber);
            }
        });
    }
    //点击搜索按钮
    searchBtn.on('click',function () {
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    })

    //页面刚开始进来时加载一次数据
    getData(1);
});
