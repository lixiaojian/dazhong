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

/**
 * 点击表格的行
 * @param table 表格或表格的tbody
 * @param checkName 复选框的name
 */
function ckilckTableRow(table,checkName) {
    table.on('click','tr',function () {
        var checkBox = $(this).find('input[name="'+checkName+'"]');
        var allCheckBox = table.find('input[name="'+checkName+'"]');
        if(checkBox.length>0){
            var tr = checkBox.parent().parent();
            if(!tr.hasClass('is-active')){
                for(var i=0,len=allCheckBox.length;i<len;i++){
                    var c = allCheckBox[i];
                    var tempTr = $(c).parent().parent();
                    c.checked = false;
                    tempTr.removeClass('is-active');
                }
                checkBox[0].checked = true;
                tr.addClass('is-active');
            }
        }
    })
}

;$(function () {
    //左边导航
    var pageNav = $('.left-link');
    //中间的主内容区域
    var pageContent = $('#main_content');
    //主内容面板
    var contentPanel = $('#app').layout('panel','center');
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
        var title = target.html();
        //重新加载新的内容
        pageContent.panel('refresh','./'+pageName+'_tpl.html');
        contentPanel.panel('setTitle','当前位置：'+title);
    })

    //初始化页面时加载用户管理的内容
    pageContent.panel('refresh','./userManagement_tpl.html');
    //点击用户名
    $('#current_user_name').on('click',function () {
        $('#updatePasswordDialog').dialog('open').dialog('center').dialog('setTitle','修改密码');
    })
    //点击修改密码
    $('#save_password_btn').on('click',function (e) {
        var form = document.getElementById('update_password_form');
        e.stopPropagation();
        var userName = form.userName.value;
        var oldPassword = form.oldPassword.value;
        var password = form.password.value;
        var rePassword = form.rePassword.value;

        if(!oldPassword){
            showError('旧密码不能为空！');
            return;
        }
        if(!password){
            showError('密码不能为空！');
            return;
        }
        if(!rePassword){
            showError('确认密码不能为空！');
            return;
        }
        if(password !== rePassword){
            showError('两次密码输入不一致！');
            return;
        }

        $.ajax({
            url:apiUrlBase+'ok.json',
            method:'POST',
            dataType:'json',
            data:{
                userName:userName,
                oldPassword:oldPassword,
                password:password
            }
        }).done(function (resp) {
            if(resp.code === successCode){
                showSuccess('修改密码成功！',function () {
                    $('#updatePasswordDialog').dialog('close');
                });
            }else{
                showError(resp.msg || '操作失败！');
            }
        }).fail(function () {
            showError('服务器错误！');
        })
    })
});