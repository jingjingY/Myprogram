
$(function() {
    var resetPwd = function() {
        this.init();
    }
    resetPwd.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this,
                reg = /^.{6,}$/,
                nowFlag = 0,
                newFlag = 0,
                newReFlag = 0;
            $("#nowpwd").focus(function() {
                $(this).next().text("")
                $(this).removeClass("ipt-error")
            })
            $("#newPassword").focus(function() {
                $(this).next().text("")
                $(this).removeClass("ipt-error")
            })
            $("#newPasswordRe").focus(function() {
                $(this).next().text("")
                $(this).removeClass("ipt-error")
            })
            $("#nowpwd").blur(function() {
                var val = $("#nowpwd").val();
                if(!val) {
                    $(this).next().text("请输入原密码")
                    $(this).addClass("ipt-error")
                    nowFlag = 0
                    return
                }else {
                    nowFlag = 1;
                }
                if(!reg.test(val)) {
                    $(this).next().text("请输入正确的原密码")
                    $(this).addClass("ipt-error")
                    nowFlag = 0
                    return
                }else {
                    nowFlag = 1;
                }
                if($("#newPassword").val() && $("#newPassword").val() == val){
                    $(this).next().text("新密码不能和原始密码一致")
                    $(this).addClass("ipt-error")
                    nowFlag = 0
                    return
                }else {
                    nowFlag = 1;
                }
                
            })
            $("#newPassword").blur(function() {
                var val = $("#newPassword").val();
                if(!val) {
                    $(this).next().text("请输入新密码")
                    $(this).addClass("ipt-error")
                    newFlag = 0
                    return
                }else {
                    newFlag = 1
                }
                if(!reg.test(val)) {
                    $(this).next().text("请输入大于6位数的密码")
                    $(this).addClass("ipt-error")
                    newFlag = 0
                    return
                }else {
                    newFlag = 1
                }
                if($("#nowpwd").val() == val){
                    $(this).next().text("新密码不能和原始密码一致")
                    $(this).addClass("ipt-error")
                    newFlag = 0
                    return
                }else {
                    newFlag = 1
                }
                if($("#newPasswordRe").val() && $("#newPasswordRe").val() != val) {
                    $(this).next().text("两次输入密码不一致")
                    $(this).addClass("ipt-error")
                    newFlag = 0
                    return
                }else {
                    newFlag = 1
                }
                
                
            })
            $("#newPasswordRe").blur(function() {
                var val = $("#newPasswordRe").val();
                if(!val) {
                    $(this).next().text("请再次输入新密码")
                    $(this).addClass("ipt-error")
                    newReFlag = 0
                    return
                }else {
                    newReFlag = 1
                }
                if(!reg.test(val)) {
                    $(this).next().text("请输入大于6位数的密码")
                    $(this).addClass("ipt-error")
                    newReFlag = 0
                    return
                }else {
                    newReFlag = 1
                }
                if($("#newPassword").val() && $("#newPassword").val() != val) {
                    $(this).next().text("两次输入密码不一致")
                    $(this).addClass("ipt-error")
                    newReFlag = 0
                    return
                    
                }else {
                    newReFlag = 1
                }
                
            })
            $("#ucPasswordBtn").click(function(e) {
                e.preventDefault();
                self.passwordFun(nowFlag,newFlag,newReFlag);
            })
        },
        passwordFun(nowFlag,newFlag,newReFlag) {
            if(!nowFlag) {
                $("#nowpwd").trigger("blur")
                return;
            }
            if(!newFlag) {
                $("#newPassword").trigger("blur")
                return;
            }
            if(!newReFlag) {
                $("#newPasswordRe").trigger("blur")
                return;
            }
           var  oldpwd = $("#nowpwd").val(),
                newpwd = $("#newPassword").val(),
                repeat_newpwd = $("#newPasswordRe").val();
            ND.ajax({
                url: '/user/safe/reset-password',
                method: 'post',
                params: {
                    oldpwd: oldpwd,
                    newpwd: newpwd,
                    repeat_newpwd: repeat_newpwd    
                },
                success: function (data) {
                    if(data.errCode == 0) {
                        layer.msg(data.errMsg, {
                            icon: 1,
                            time: 3000
                        }); 
                        function jump () {
                            window.location.href = data.url
                        }
                        setTimeout(jump,3000);  
                    }else if(data.errCode == 15) {
                        layer.msg('原始密码错误', {
                            icon: 2,
                            time: 3000
                        });  
                    }else{
                        layer.msg(data.errMsg, {
                            icon: 2,
                            time: 3000
                        });
                    }
                    
                },
                error:function(data){
                    layer.msg(data.errMsg || '网络异常', {
                        icon: 2,
                        time: 2000
                    });
                }
            })
        }
    }
    var myresetPwd = new resetPwd();
});
