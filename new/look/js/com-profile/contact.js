/*
 * @Author: ylq 
 * @Date: 2017-12-28 15:15:55 
 * @Desc: 创建商品/编辑商品 
 * @Last Modified by: ylq
 * @Last Modified time: 2017-12-28 15:57:51
 */
$(function() {
    var editContact = function() {
        this.init();
    }
    editContact.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this,
                imgSrc = [];
            ND.Tool.upLoader("#conLoader",false,imgSrc);
            if($(".file-li img").attr('src')) {
                if($(".file-li img").attr('src').indexOf('http') == -1) {
                    $(".file-li").addClass("fileLi");
                }
            }
            $("#contactSbt").off().click(function(e) {
                e.preventDefault();
                self.formSubmitFun()
            })

        },
        formSubmitFun() {
            var appinfoId = ND.Tool.getUrlParam("appInfoId"),
                menuId = ND.Tool.getUrlParam("menuId");
                if(!$("#datacomprofile-comname").val()) {
                    layer.msg("公司名称不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#datacomprofile-address").val()) {
                    layer.msg("公司地址不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#datacomprofile-email").val()) {
                    layer.msg("邮箱不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#datacomprofile-contacttel").val()) {
                    layer.msg("联系电话不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if($(".imgWrap img") && $(".imgWrap img").length) {
                    var ShowImgStr = '';
                    $(".imgWrap img").each(function(i) {
                        if($(this).attr('src').indexOf('http') != -1) {
                            if(i == $(".imgWrap img").length - 1) {
                                ShowImgStr += $(this).attr('src')
                            }else {
                                ShowImgStr += $(this).attr('src')+','
                            }
                        }
                    })
                    if(!ShowImgStr) {
                        layer.msg("请先将图片上传", {
                            icon: 2,
                            time: 3000
                        });
                        return;    
                    }
                }else {
                    layer.msg("请先选择产品图片", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                } 
                var url = '/console/com-profile/contact?appInfoId='+appinfoId+'&menuId='+menuId;
            ND.ajax({
                url: url,
                method: 'post',
                params: {
                    DataComProfile:{
                        ComName: $("#datacomprofile-comname").val(),
                        Address: $("#datacomprofile-address").val(),
                        Email: $("#datacomprofile-email").val(),
                        ContactTel: $("#datacomprofile-contacttel").val(),
                        ContactImg: ShowImgStr
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
    var myEditContact = new editContact();
});
