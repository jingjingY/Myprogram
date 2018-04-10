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
                 //tags
            $('#tags').tagsInput({
                'height': '100px',
                'width': '80%',
                defaultText: '输入标签',
                onChange:function(){
                    $('#tagsTips').text('');
                },
                minChars: 1,
                maxChars: 10
            });
            //顶部图片
            ND.Tool.upLoader("#toppLoader",false,imgSrc);
            //公司图片
            ND.Tool.upLoader("#cmnpLoader",true,imgSrc);
            //删除原因的图片
            $(".file-li").each(function() {
                $(this).removeClass("fileLi");
                $(this).on( 'mouseenter', function() {
                    $(this).find(".file-panel").stop().animate({height: 30});
                    $(this).find(".file-panel").click(function(e) {
                        e.preventDefault();
                        $(this).parent().remove()
                    })
                });
                $(this).on( 'mouseleave', function() {
                    $(this).find(".file-panel").stop().animate({height: 0});
                });
            })
            if($(".file-li img").attr('src')) {
                if($(".file-li img").attr('src').indexOf('http') == -1) {
                    $(".file-li").addClass("fileLi");
                }
            }
            $("#introduceSbt").off().click(function(e) {
                e.preventDefault();
                self.formSubmitFun()
            })

        },
        //提交数据
        formSubmitFun() {
            var myTags = $('#tags').val();
            // var myTags = tags.replace(/,/g, ' ')
            var appinfoId = ND.Tool.getUrlParam("appInfoId"),
                menuId = ND.Tool.getUrlParam("menuId");
                if(!$("#introduceCmname").val()) {
                    layer.msg("公司名称不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#tags").val()) {
                    layer.msg("标签不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!UE.getEditor('datacomprofile-summary').getContent()) {
                    layer.msg("简介不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                var AboutImg = $("#toppLoader").find("img").attr("src");
                if(AboutImg.indexOf('http') == -1) {
                    layer.msg("请先将图片上传", {
                        icon: 2,
                        time: 3000
                    });
                    return;        
                }
                var imgWrapImg = $(cmnpLoader).find(".imgWrap img")
                if(imgWrapImg && imgWrapImg.length) {
                    var ShowImgStr = '';
                    imgWrapImg.each(function(i) {
                        if($(this).attr('src').indexOf('http') != -1) {
                            if(i == imgWrapImg.length - 1) {
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
                var url = '/console/com-profile/introduce?appInfoId='+appinfoId+'&menuId='+menuId;
            ND.ajax({
                url: url,
                method: 'post',
                params: {
                    DataComProfile:{
                        AboutImg : AboutImg,
                        ComName: $("#introduceCmname").val(),
                        Tarde: $("#introduceTarde option:selected").attr('value'),
                        Tag: myTags,
                        Summary : UE.getEditor('datacomprofile-summary').getContent(),
                        ComPhoto: ShowImgStr
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
