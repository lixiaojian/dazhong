/**
 * Created by 872458899@qq.com on 2018/9/1.
 */
;$(function () {
    //请求返回的正确码
    var successCode = 0;
    //接口的基本路径
    var apiUrlBase = '../mockData/';
    //form
    var loginForm = $('#login_form');
    //登录按钮
    var loginBtn = $('#login_btn');
    //验证码图片
    var verifycodeImg = $('#verifycode_img');

    //显示错误信息
    function showError(msg) {
        $.messager.alert({
            title:'错误提示',
            msg:msg,
            icon:'error',
            ok:'确定'
        });
    }

    //绑定点击事件
    loginForm.on('click',function (e) {
        //阻止事件冒泡
        e.stopPropagation();
        //获取点击对象
        var target = $(e.target);
        if(target.hasClass('verifycode-img')){
            //如果点击的是验证码图片
            changeVerifyCode(target[0]);
        }else if(target.hasClass('submit-btn')){
            //如果点击的是登录按钮
            doLogin(loginForm[0]);
        }
    });

    //更换验证码
    function changeVerifyCode(imgDom){
        $.ajax({url: apiUrlBase + 'verifycodeimg.json',dataType:'json'}).done(function(resp){
            //请求成功
            if(resp.code === successCode){
                imgDom.src = resp.data;
            }else{
                showError('获取新的验证码错误!');
            }
        }).fail(function (err){
            //请求失败
            showError('服务器错误!');
        });
    }

    function doLogin(form) {
        var userName = form.userName.value;
        var password = form.passWord.value;
        var verifyCode = form.verifyCode.value;
        if(!userName){
            showError('用户名不能为空!');
            return;
        }
        if(!password){
            showError('密码不能为空!');
            return;
        }
        if(!verifyCode){
            showError('验证码不能为空!');
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
                password:password,
                verifyCode:verifyCode
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
