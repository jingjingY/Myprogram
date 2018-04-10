/*
 * @Author: ylq 
 * @Date: 2017-12-28 15:15:55 
 * @Desc: 创建商品/编辑商品 
 * @Last Modified by: ylq
 * @Last Modified time: 2017-12-28 15:57:51
 */
$(function() {
    var editService = function() {
        this.init();
    }
    editService.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;
            $("#serviceSbt").off().click(function(e) {
                e.preventDefault();
                self.formSubmitFun()
            })
        },
        formSubmitFun() {
            var appinfoId = ND.Tool.getUrlParam("appInfoId"),
                menuId = ND.Tool.getUrlParam("menuId");
                if(!$("#datacomprofile-subscribetel").val()) {
                    layer.msg("产品详情不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                var url = '/console/com-profile/service?appInfoId='+appinfoId+'&menuId='+menuId;
            ND.ajax({
                url: url,
                method: 'post',
                params: {
                    DataComProfile:{
                        SubscribeTel: $("#datacomprofile-subscribetel").val(),
                    }
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
    var myEditService = new editService();
});
