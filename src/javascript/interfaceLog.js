/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
;$(function () {
    //搜索的表单
    var searchForm = document.getElementById('search_form');
    //表格
    var interfaceLogListTable = $('#interfaceLogListTable');
    //编辑和添加用户的弹层
    var detailDialog = $('#detailDialog');

    //设置导航的选中状态
    setActive('interfaceLog');
    /**
     * 去请求数据
     * @param pageNumber 页数
     */
    function getData(pageNumber) {
        pageNumber = pageNumber?(pageNumber<1?1:pageNumber):1;
        $.ajax({
            url:apiUrlBase+'interfaceLogList.json',
            method:'POST',
            dataType:'json',
            data:{
                pageNumber:pageNumber,
                name:searchForm.name.value,
                handlers:searchForm.handlers.value,
                date:searchForm.date.value
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
    };
    /**
     * 渲染数据
     * @param data 数据
     */
    function renderTable(respData) {
        var data = respData.data;
        var page = respData.page;
        interfaceLogListTable.datagrid({
            data:data,
            fitColumns:true,
            fit:true,
            striped:true,
            singleSelect:true,
            columns:[[
                {field:'',checkbox:true,align:'center'},
                {field:'id',title:'主键ID',align:'center'},
                {field:'name',title:'操作数据项名称',align:'center'},
                {field:'type',title:'操作类型',align:'center'},
                {field:'company',title:'来源公司',align:'center'},
                {field:'ip',title:'操作人IP',align:'center'},
                {field:'dateTime',title:'操作时间',align:'center'}
            ]]
        });
        initPagination(page.pageSize,page.pageNumber,page.total);
    };
    /**
     * 初始化表格的分页
     * @param pageSize
     * @param pageNumber
     * @param total
     */
    function initPagination(pageSize,pageNumber,total){
        pageSize = pageSize || 10;
        $('#interfaceLogListPagination').pagination({
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
    //点击搜索按钮
    $('#search_btn').on('click',function (e) {
        e.stopPropagation();
        //只要是点击按钮就去搜索第一页的数据，所以这里固定传1
        getData(1);
    });

    //点击查看操作详情按钮
    $('#show_detail_btn').on('click',function (e) {
        e.stopPropagation();
        //获取选中的行
        var row = interfaceLogListTable.datagrid('getSelected');
        if(row){
            $.ajax({
                url: apiUrlBase+'interfaceLogDetail.json',
                method: 'GET',
                dataType: 'json',
                data:{
                    id:row.id
                }
            }).done(function (resp) {
                if(resp.code === successCode){
                    var data = resp.data;
                    var dataArray = [];
                    for (var key in data){
                        dataArray.push('<div class="detail-item">'+key+' : '+data[key]+'</div>');
                    }
                    $('#datail_data').html(dataArray.join(''));
                    detailDialog.dialog('open').dialog('center').dialog('setTitle','数据详情');
                }else{
                    showError(resp.msg || '获取数据失败！');
                }
            }).fail(function () {
                showError('服务器错误！');
            })
        }else{
            showError('请选择需要查看的记录行！')
        }
    });
    //初始化页面时加载数据
    getData(1);
});
