/*
 * @Author: ylq 
 * @Date: 2017-12-28 15:15:55 
 * @Desc: 创建商品/编辑商品 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-02-01 16:06:20
 */
$(function() {
    var editProduct = function() {
        this.init();
    }
    editProduct.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this,
                prdId = ND.Tool.getUrlParam("id"),
                imgSrc = [];
            var path_array = window.location.pathname.split('/');
            $('ul.sub-menu-ul > li').find('a[href^="/' + path_array[1] + '/' + path_array[2] + '/"]').addClass('active');

            if(prdId) {
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
            }else {
                // $(".file-li").addClass("fileLi")
            }
            ND.Tool.upLoader("#proLoader",true,imgSrc);
            $('a.fine-product').click(function(e){
                e.preventDefault();
                var hasCla = $(this).hasClass('active-product'),
                    ipt = $(this).next('input.fine-product-checkbox');
                if (hasCla) {
                    $(this).removeClass('active-product');
                    ipt.prop('checked',false)
                } else {
                    $(this).addClass('active-product');
                    ipt.prop('checked',true)
                }
            })
            
            //如果客户只有一个默认分类，添加数据的时候，默认给选中第一个分类
            if($('a.fine-product').length ==1  && !prdId){
                $('a.fine-product').trigger('click')
            }
            
            //提交保存
            $("#saveAllSet").off().click(function(e) {
                e.preventDefault();
                self.formSubmitFun()
            })
        },
        //保存提交
        formSubmitFun() {
            var appinfoId = ND.Tool.getUrlParam("appInfoId"),
                DataProductCateId = [],
                proId = ND.Tool.getUrlParam("id");
                $(".fine-product").each(function() {
                    if($(this).hasClass('active-product')) {
                        DataProductCateId.push($(this).attr("cid"))
                    }
                })
                if(!$("#dataproduct-proname").val()) {
                    layer.msg("产品名称不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#SubTitle").val()) {
                    layer.msg("副标题不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!$("#dataproduct-price").val()) {
                    layer.msg("产品价格不能为空", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!DataProductCateId.length) {
                    layer.msg("请选择产品分类", {
                        icon: 2,
                        time: 3000
                    });
                    return;
                }
                if(!UE.getEditor('dataproduct-details').getContent()) {
                    layer.msg("产品详情不能为空", {
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
                
                if(proId){
                    var url = "/console/product/update?id="+proId+"&appInfoId="+ appinfoId
                } else {
                    var url = "/console/product/create?appInfoId="+ appinfoId
                }  
            ND.ajax({
                url: url,
                method: 'post',
                params: {
                    RelationDataProductDataProductCate:{
                        DataProductCateId:DataProductCateId
                    },
                    DataProduct:{
                        ProName: $("#dataproduct-proname").val(),
                        SubTitle: $("#SubTitle").val(),
                        Price: $("#dataproduct-price").val(),
                        Details: UE.getEditor('dataproduct-details').getContent(),
                        ShowImg:ShowImgStr,
                        Status: inpVal
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
    var myEditProduct = new editProduct();
});
