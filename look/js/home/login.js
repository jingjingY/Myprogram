/*
 * @Author: ylq 
 * @Date: 2018-03-01 14:49:36 
 * @Desc: 登录 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-02 10:55:12
 */

//登录
$(function() {

    //登录方法
    var login = function() {
        this.init();
    }
    login.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;
            $(".icon-close").click(function (e) {
                e.preventDefault();
                $(this).prev('.ipt').val("");
            });
            //手机号
            $("#loginName").blur(function() {
                self.username('#loginName');
                return;
            });
            $("#loginName").focus(function () {
                $(".login-error-tips").text("");
                $("#loginName,#loginPwd").css("border-color","#e8e8e8");
            });
            $("#loginPwd").focus(function () {
                $(".login-error-tips").text("");
                $("#loginName,#loginPwd").css("border-color","#e8e8e8");
            });
            //密码
            $("#loginPwd").blur(function() {
                self.password('#loginPwd');
                return;
            });

            //登录
            $('#loginSubmit').click(function(e){
                e.preventDefault()
                if (self.username('#loginName') && self.password('#loginPwd')) {
                    $("#loginSubmit").val("登录中").css("background-color","#df446a");
                    var validate_isok = true;
                    if (validate_isok == false) {
                        return false;
                    }
                    self.loginData();
                }
            })
        },
        username: function(id) {
            var _res = true,
                val = $(id).val(),
                isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                isPhone = /^1[3|4|5|6|7|8|9]\d{9}$/;
            if ($.trim(val) == '') {
                $(".login-error-tips").text("账户名不能为空");
                $(id).css("border-color","#f7362f");
                return false;
            } else if (!isEmail.test(val) && !isPhone.test(val)) {
                $(".login-error-tips").text("账户名是手机号或邮箱");
                $(id).css("border-color","#f7362f");
                _res = false;
            }
            if (_res) {
                $("#loginName").css("border-color","#e8e8e8");
            }
            return _res;
        },
        password: function(id) {
            var val = $(id).val();
            if ($.trim(val) == '') {
                $(".login-error-tips").text("请输入密码");
                $(id).css("border-color","#f7362f");
                return false;
            } else if($.trim(val).length<6){
                $(".login-error-tips").text("请输入不小于6位数的密码");
                $(id).css("border-color","#f7362f");
                return false;
            }else {
                $(id).css("border-color","#e8e8e8");
                return true;
            }
        },
        loginData: function() {
            var self = this,
                obj = {
                    url: '/login',
                    params: {
                        UserLogon:{
                            phone: $.trim($('#loginName').val()),
                            password: $('#loginPwd').val()
                        }
                    },
                    success: function(data) {
                        $(".login-error-tips").text("");
                        $("#loginSubmit").val("登  录").removeAttr('style');
                        if (!data.errCode) {
                            window.location.href = data.url;
                        } else {
                            $(".login-error-tips").text(data.errMsg);
                        }
                    },
                    error: function () {
                        $("#loginSubmit").val("登  录").removeAttr('style');
                    }
                }
            ND.ajax(obj);
        }
    }

    var myLogin = new login();
});