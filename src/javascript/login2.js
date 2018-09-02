/**
 * Created by 872458899@qq.com on 2018/9/1.
 */
;$(function () {
    //请求返回的正确码
    var successCode = 0;
    //接口的基本路径
    var apiUrlBase = '../mockData/';

    //显示错误信息
    function showError(msg) {
        $.messager.alert({
            title:'错误提示',
            msg:msg,
            icon:'error',
            ok:'确定'
        });
    }
    //点击登录
    $('#login_btn').on('click',function (e) {
        e.stopPropagation();
        doLogin();
    })
    //登录
    function doLogin() {
        var form = document.getElementById('login_form');
        var userName = form.userName.value;
        var password = form.passWord.value;
        if(!userName){
            showError('用户名不能为空!');
            return;
        }
        if(!password){
            showError('密码不能为空!');
            return;
        }
        $.ajax({
            //成功示例
            url:apiUrlBase+'loginSuccess.json',
            //错误示例
            // url:apiUrlBase+'loginError.json',
            method:'POST',
            dataType:'json',
            data:{
                userName:userName,
                password:password
            }
        }).done(function (resp) {
            if(resp.code === successCode){
                location.href = './userManagement.html'
            }else{
                showError(resp.msg || '登录失败');
            }
        }).fail(function (err) {
            showError('服务器错误!');
        })
    }
});
