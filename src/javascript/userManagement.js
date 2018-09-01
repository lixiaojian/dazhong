/**
 * Created by 872458899@qq.com on 2018/9/1.
 */
;$(function () {
    //搜索的表单
    var searchForm = $('#search_form');
    //搜索按钮
    var searchBtn = $('#search_btn');
    //表格
    var userListTable = $('#userListTable');
    //被选中的记录
    var selectedData = null;

    function getData(param) {
        var data = [
            {"id":1,"userName":"admin","name":"张三","company":"大众交通","dept":"总经理办公室","phone":"13818789098","acountStatus":"在用","creatTime":"2018-08-28 18:00:00","creater":"admin","updateTime":"2018-08-28 19:00:00","updater":"李四"},
            {"id":2,"userName":"test","name":"李四","company":"大众交通","dept":"总经理办公室","phone":"13818789098","acountStatus":"在用","creatTime":"2018-08-28 18:00:00","creater":"admin","updateTime":"2018-08-28 19:00:00","updater":"李四"},
            {"id":3,"userName":"user","name":"王五","company":"大众交通","dept":"总经理办公室","phone":"13818789098","acountStatus":"在用","creatTime":"2018-08-28 18:00:00","creater":"admin","updateTime":"2018-08-28 19:00:00","updater":"李四"},
            {"id":4,"userName":"gust","name":"赵六","company":"大众交通","dept":"总经理办公室","phone":"13818789098","acountStatus":"在用","creatTime":"2018-08-28 18:00:00","creater":"admin","updateTime":"2018-08-28 19:00:00","updater":"李四"}
        ];

        userListTable.datagrid({
            data:data,
            // idField:'id',
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
    }

    /**
     * 初始化表格的分页
     * @param pageSize
     * @param pageNumber
     * @param total
     */
    function initPagination(pageSize,pageNumber,total){
        $('#userlist_pagination').pagination({
            total:total,
            pageNumber:2,
            pageSize:pageSize,
            showPageList:false,
            showRefresh:false,
            beforePageText: '第',
            afterPageText: '页    共 {pages} 页',
            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        });
    }
    getData();
    initPagination(10,1,137);
});
