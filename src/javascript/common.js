/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
//请求返回的正确码
var successCode = 0;
//接口的基本路径
var apiUrlBase = '../mockData/';

/**
 * 显示错误信息
 * @param msg 信息内容
 */
function showError(msg) {
    $.messager.alert({
        title:'错误提示',
        msg:msg,
        icon:'error',
        ok:'确定'
    });
}
/**
 * 显示成功信息
 * @param msg 信息内容
 * @param callback 点确定后的回调
 */
function showSuccess(msg,callback) {
    $.messager.alert({
        title:'成功提示',
        msg:msg,
        icon:'info',
        ok:'确定',
        fn:callback||function () {}
    });
}


;$(function () {
    //左边导航
    var pageNav = $('.left-link');
    //中间的主内容区域
    var pageContent = $('#main_content');
    //点击导航
    pageNav.on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();
        var target = $(e.target);
        // 如果当前导航已是选中状态 直接返回
        if(target.hasClass('link-active')){
            return;
        }
        pageNav.removeClass('link-active');
        target.addClass('link-active');
        var pageName = target.data('page');
        //重新加载新的内容
        pageContent.panel('refresh','./'+pageName+'_tpl.html');
    })

    //初始化页面时加载用户管理的内容
    pageContent.panel('refresh','./userManagement_tpl.html');
});