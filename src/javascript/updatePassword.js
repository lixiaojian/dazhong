/**
 * Created by 872458899@qq.com on 2018/9/2.
 */
;$(function () {
    var form = document.getElementById('update_form');
    $('#update_btn').on('click',function (e) {
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
                showSuccess('修改密码成功！');
            }else{
                showError(resp.msg || '操作失败！');
            }
        }).fail(function () {
            showError('服务器错误！');
        })

    })
});
