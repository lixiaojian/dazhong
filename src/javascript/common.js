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
        icon:'ok',
        ok:'确定',
        fn:callback||function () {}
    });
}