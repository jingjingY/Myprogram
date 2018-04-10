
$(function() {
    var proFile = function() {
        this.init();
    }
    proFile.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;
            $("#profileBtn").click(function(e) {
                e.preventDefault();
                self.formSubmitFun();
            })
        },
        formSubmitFun() {
           
            ND.ajax({
                url: '/user/profile/update',
                method: 'post',
                params: {
                    ssCompany: $(".own-company").val(),
                    ssIndustry: $(".own-industry").val()    
                },
                success: function (data) {
                    if(data.errCode == 0) {
                        layer.msg(data.errMsg, {
                            icon: 1,
                            time: 2000
                        });
                        location.reload();  
                    }else {
                        layer.msg(data.errMsg, {
                            icon: 2,
                            time: 2000
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
    var myproFile = new proFile();
});
