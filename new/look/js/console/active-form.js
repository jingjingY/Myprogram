/*
 * @Author: ylq 
 * @Date: 2018-2-7
 * @Desc: 创建活动/编辑活动
 * @Last Modified by: ylq
 * @Last Modified time:
 */
$(function() {
    var editActive = function() {
        this.init();
    }
    editActive.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this,
                prdId = ND.Tool.getUrlParam("id"),
                imgSrc = [];

            
            //提交保存
            $("#activeSet").off().click(function(e) {
                e.preventDefault();
                self.formSubmitFun()
            })
        },
        //保存提交
        formSubmitFun() {
            var appinfoId = ND.Tool.getUrlParam("appInfoId"),
                proId = ND.Tool.getUrlParam("id");
                if(!$("#dataactive-name").val()) {
                    layer.msg("活动名称不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#dataactive-remark").val()) {
                    layer.msg("活动备注不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!UE.getEditor('dataactive-active').getContent()) {
                    layer.msg("活动详情不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if($(".radio-item input").prop("checked")){
                    var inpVal = $(".radio-item input").val()
                }else {
                    var inpVal = '0'
                }
                if(proId){
                    var url = "/console/active/update?id="+proId+"&appInfoId="+ appinfoId
                } else {
                    var url = "/console/active/create?appInfoId="+ appinfoId
                }  
            ND.ajax({
                url: url,
                method: 'post',
                params: {
                    DataActive:{
                        Name: $("#dataactive-name").val(),
                        Remark: $("#dataactive-remark").val(),
                        Active: UE.getEditor('dataactive-active').getContent(),
                        State: inpVal
                    }
                },
                success: function (data) {
                    if(data.errCode == 0) {
                        layer.msg(data.errMsg, {
                            icon: 1,
                            time: 2000
                        });
                        window.location.href = data.url    
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
    var myEditActive = new editActive();
});
