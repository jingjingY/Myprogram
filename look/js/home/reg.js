/*
 * @Author: ylq 
 * @Date: 2017-12-08 16:50:10 
 * @Desc: 注册 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-02 16:48:03
 */
function sendmsg(count) {
    var self = this;
    var scmin = count*60
    for (var i = scmin; i >= 1; i--) {
        setTimeout('updateMsg(' + (scmin - i) + ')', i * 1000);
    }
}
function updateMsg(i) {
    if (i == 0) {
        $('#getPhoneCode').text('重新获取短信');
        $('#getPhoneCode').removeClass("code-disabled");
    } else {
        $('#getPhoneCode').text(i + '秒后重新获取');
        $('#getPhoneCode').addClass("code-disabled");
    }
}
function removefun(){
    window.onbeforeunload=null;
}

$(function() {
    var reg = function() {
        this.init();
    }
    reg.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;

            //去掉离开提示
            $('.quick-select-list a').on('click',function(){
                removefun()
            })


            //手机
            $('#regPhone').blur(function(e){
                self.validatePhone($(this))
            })
            //获得焦点
            $('#regPhone').focus(function(){
                var errTips = $('#signStep1 .invalid-feedback');
                errTips.text('')
                $(this).removeClass('ipt-err');
            });
            //图片验证码
            $('#regYzm').blur(function(e){
                self.validateIMG($(this))
            })
            //获得焦点
            $('#regYzm').focus(function(){
                var errTips = $('#signStep1 .invalid-feedback');
                errTips.text('')
                $(this).removeClass('ipt-err');
            });
            
            //图片更换
            $('#imgyzm').off().on('click', function(e) {
                e.preventDefault();
                self.getVerify()
            });
            //下一步
            $('#regNext').off().on('click',function(e){
                e.preventDefault();
                var pv = self.validatePhone($('#regPhone'))
                var yv = self.validateIMG($('#regYzm'))
                //sendNum = 0;
                if(!pv){
                    $('#regPhone').blur()
                    return
                }
                if(!yv){
                    $('#regYzm').blur()
                    return
                }
                if(pv && yv){
                    self.isReg()
                }
                return false
            });

            //手机验证码
            $('#regCode').blur(function(e){
                self.validatePhoneCode($(this))
            })
            //手机验证码-获得焦点
            $('#regCode').focus(function(){
                var errTips = $('#signStep2 .invalid-feedback');
                errTips.text('')
                $(this).removeClass('ipt-err');
            });
            //手机验证码切换
            $('#getPhoneCode').off().on('click', function(e) {
                e.preventDefault();
                var hasDis = $(this).hasClass('code-disabled');
                if (hasDis) {
                    return;
                };
                self.sendCode();
            });
            //密码
            $('#regPwd').blur(function(e){
                self.validatePassword($(this))
            })
            //密码-获得焦点
            $('#regPwd').focus(function(){
                var errTips = $('#signStep2 .invalid-feedback');
                errTips.text('')
                $(this).removeClass('ipt-err');
            });
            //立即注册
            $('#regSuccess').off().on('click',function(e){
                e.preventDefault();
                var cv = self.validatePhoneCode($('#regCode'))
                var pwdv = self.validatePassword($('#regPwd'))
                console.log(cv,pwdv)
                if(!cv){
                    $('#regCode').blur()
                    return false
                }
                if(!pwdv){
                    $('#regPwd').blur()
                    return false
                }
                if(cv && pwdv){
                    self.saveData();
                }
                return false
            });




            //密码
            $('#loginPwd').blur(function(e){
                self.validatePassword($(this),3)
            })
            //密码-获得焦点
            $('#loginPwd').focus(function(){
                var errTips = $('#signStep3 .invalid-feedback');
                errTips.text('')
                $(this).removeClass('ipt-err');
            });
            //立即登录
            $('#regLogin').off().on('click',function(e){
                e.preventDefault();
                var pwdv = self.validatePassword($('#loginPwd'),3)
                if(!pwdv){
                    $('#loginPwd').blur()
                    return false
                }
                if(pwdv){
                    self.loginForm();
                }
                return false
            });
            

            //登录页面事件
            //this.agentUserLoginEventBind();


        },
        //登录页面的事件
        agentUserLoginEventBind: function(){
            var self = this;
            //密码
            $('#regPwd').blur(function(e){
                self.validatePassword($(this),1)
            })
            //密码-获得焦点
            $('#regPwd').focus(function(){
                var errTips = $('#signStep1 .invalid-feedback');
                errTips.text('')
                $(this).removeClass('ipt-err');
            });
            //立即登录
            $('#loginSubmit').off().on('click',function(e){
                e.preventDefault();
                var pv = self.validatePhone($('#regPhone')),
                    pwdv = self.validatePassword($('#regPwd'),1);
                //console.log(cv,pwdv)
                //手机验证码
                if(!pv){
                    $('#regCode').blur()
                    return false
                }
                //密码
                if(!pwdv){
                    $('#regPwd').blur()
                    return false
                }
                if(pv && pwdv){
                    self.agentUserLoginForm();
                }
                return false
            });
        },
        //验证手机
        validatePhone: function(id){
            var self = this,
                errTips = $('#signStep1 .invalid-feedback'),
                o = [
                    {require:1,tipsText:'手机号不能为空'},
                    {regex:1,regexp:/^1[3|4|5|6|7|8|9]\d{9}$/,tipsText:'请输入正确的手机号'}
                ];
            //离开
            var rq = o[0],
                rr = o[1],
                val = $.trim(id.val());
            if(rq.require && !val){
                errTips.text(rq.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            if(rr.regex && !(rr.regexp.test(val))) {
                errTips.text(rr.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            id.removeClass('ipt-err');
            id.attr('validate',1)
            return true
        },
        //验证图片
        validateIMG: function(id){
            var errTips = $('#signStep1 .invalid-feedback'),
                self = this,
                o = [
                    {require:1,tipsText:'验证码不能为空'},
                    {require:1,lt:5,tipsText:'请输入正确的验证码'}
                ];
            //离开
            var rq = o[0],
                rr = o[1],
                val = $.trim(id.val());
            if(rq.require && !val){
                errTips.text(rq.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            if(rr.require && val.length !== rr.lt) {
                errTips.text(rr.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            id.removeClass('ipt-err');
            id.attr('validate',1)
            return true
        },
        //验证手机验证码
        validatePhoneCode: function(id){
            var errTips = $('#signStep2 .invalid-feedback'),
                self = this,
                o = [
                    {require:1,tipsText:'手机验证码不能为空'},
                    {require:1,lt:6,tipsText:'请输入正确的手机验证码'}
                ];
            //离开
            var rq = o[0],
                rr = o[1],
                val = $.trim(id.val());
            if(rq.require && !val){
                errTips.text(rq.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            if(rr.require && val.length !== rr.lt) {
                errTips.text(rr.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            id.removeClass('ipt-err');
            id.attr('validate',1)
            return true
        },
        //验证密码 
        validatePassword: function(id,isLogin){
            var errTips = $('#signStep2 .invalid-feedback'),
            self = this,
            o = [
                {require:1,tipsText:'密码不能为空'},
                {require:1,lt:6,tipsText:'密码最少6位'}
            ];
            if(isLogin == 1){
                errTips = $('#signStep1 .invalid-feedback')
            }
            if(isLogin == 3){
                errTips = $('#signStep3 .invalid-feedback')
            }
            //离开
            var rq = o[0],
                rr = o[1],
                val = $.trim(id.val());
            if(rq.require && !val){
                errTips.text(rq.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            if(rr.require && val.length < rr.lt) {
                errTips.text(rr.tipsText)
                id.addClass('ipt-err');
                id.attr('validate',0)
                return false
            }
            id.removeClass('ipt-err');
            id.attr('validate',1)
            return true
        },
        //获取图片验证码
        getVerify: function(){
            ND.ajax({
                url: '/sms/captcha',
                type:'GET',
                params: {
                    refresh: 1
                },
                success: function(data) {
                    if (data && data.url) {
                        //console.log(location.origin)
                        $('#imgyzm')[0].src = location.origin + data.url;                        
                    } else {
    
                    }
                },
                error: function() {
                    return false;
                }
            });
        },
        //验证是否已经注册过
        isReg: function() {
            var self = this;
            var errTips = $('#signStep1 .invalid-feedback');
            //var dom = $('#regPhone');
            //var val = dom.val()
            //errTips.text('')
            //dom.attr('validate',1)
            //$('#userPhone').text(val);
            self.sendCode(1)
            // ND.ajax({
            //     url: '/register/unique',
            //     params: {
            //         phone: dom.val()
            //     },
            //     success: function(data) {
            //         if (data.errCode == 0) {
            //             //true 不可以注册，直接跳到登录
            //             if(data.result){
            //                 //离开 提示
            //                 window.onbeforeunload = function(){
            //                     return '确定离开此页面吗？';
            //                 };
            //                 errTips.text('');
            //                 $('#signStep1').hide();
            //                 $('#loginPhone').text(val);
            //                 $('#signStep3').show();
            //             } else {
            //                 //可以注册，去注册
                            
            //             }
            //         } else {
            //             errTips.text(data.errMsg)
            //             dom.addClass('ipt-err');
            //             dom.attr('validate',0)
            //         }
            //     },
            //     error: function() {

            //     }
            // });
        },
        //获取手机验证码
        sendCode: function(ty) {
            var self = this,
                dom = $('#regPhone'),
                val = dom.val(),
                errTips = $('#signStep2 .invalid-feedback'),
                obj = {
                    url: '/sms/register',
                    params: {
                        verify:$.trim($('#regYzm').val()),
                        page:ty,
                        phone: $.trim($('#regPhone').val())
                    },
                    success: function(data) {
                        var status = data.errCode;
                        if (status == 0) {
                            if(ty){
                                //离开 提示
                                window.onbeforeunload = function(){
                                    return '确定离开此页面吗？';
                                };
                            }
                            //true 说明用户已经注册过网站 直接登录
                            if(data.result){
                                errTips.text('');
                                $('#signStep1').hide();
                                $('#loginPhone').text(val);
                                $('#signStep3').show();
                            } else {
                                //未注册用户，发短信
                                errTips.text('');
                                $('#userPhone').text(val);
                                $('#signStep1').hide();
                                $('#signStep2').show();
                                $('#getPhoneCode').addClass('code-disabled').text('已发送');
                                sendmsg(data.count);
                            }
                        } else {
                            if(ty){
                                $('#signStep1 .invalid-feedback').text(data.errMsg)
                                //重新加载验证码
                                self.getVerify()
                            } else {
                                errTips.text(data.errMsg);
                            }
                            $('#getPhoneCode').text('请点击重试');
                        };
                    },
                    error: function() {
                        layer.msg("网络异常,请稍候再试!",{icon:2,time:2000});
                    }
                }
            ND.ajax(obj);
        },
        saveData: function() {
            var self = this,
                obj = {
                    url: '/register/index',
                    params: {
                        phone: $.trim($('#regPhone').val()),
                        VerifyCode: $.trim($('#regCode').val()),
                        pwd: $('#regPwd').val()
                    },
                    success: function(data) {
                        if (data.errCode == 0) {
                            removefun()
                            layer.msg(data.errMsg, {
                                icon: 1,
                                time: 2000
                            } );
                            setTimeout(function() {
                                window.location.href = data.url;
                            }, 2000);
                        } else {
                            $("#signStep2 .invalid-feedback").text(data.errMsg);
                            //$("#regCode").addClass('ipt-err');
                            return;
                        }
                    },
                    error: function() {

                    }
                }
            ND.ajax(obj);
        },
        loginForm: function() {
            var self = this,
                obj = {
                    url: '/login',
                    params: {
                        UserLogon:{
                            phone: $.trim($('#regPhone').val()),
                            password: $('#loginPwd').val()
                        }
                    },
                    success: function(data) {
                        if (data.errCode == 0) {
                            removefun()
                            layer.msg(data.errMsg, {
                                icon: 1,
                                time: 2000
                            } );
                            setTimeout(function() {
                                window.location.href = data.url;
                            }, 2000);
                        } else {
                            $("#signStep3 .invalid-feedback").text(data.errMsg);
                            //$("#regCode").addClass('ipt-err');
                            return;
                        }
                    },
                    error: function() {

                    }
                }
            ND.ajax(obj);
        }
        //代理商下用户登录
        // agentUserLoginForm: function() {
        //     var self = this,
        //         obj = {
        //             url: '/signin/agent',
        //             params: {
        //                 phone: $.trim($('#regPhone').val()),
        //                 //validate: $.trim($('#regCode').val()),
        //                 password: $('#regPwd').val()
        //             },
        //             success: function(data) {
        //                 if (data.errCode == 0) {
        //                     removefun()
        //                     layer.msg(data.errMsg, {
        //                         icon: 1,
        //                         time: 2000
        //                     } );
        //                     setTimeout(function() {
        //                         window.location.href = data.url;
        //                     }, 2000);
        //                 } else {
        //                     $("#signStep1 .invalid-feedback").text(data.errMsg);
        //                     //$("#regCode").addClass('ipt-err');
        //                     return;
        //                 }
        //             },
        //             error: function() {

        //             }
        //         }
        //     ND.ajax(obj);
        // }

    }

    var myReg = new reg();
});