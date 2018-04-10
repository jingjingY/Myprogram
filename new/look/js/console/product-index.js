

$(function () {
    var productClass = function () {
        this.init();
    }
    productClass.prototype = {
        init: function () {
            this.eventBind();
        },
        eventBind: function () {
            var self = this;
            $('.switchStar').off().click(function(e){
                e.preventDefault();
                var id = $(this).data('id'),
                    url = $(this).data('url'),
                    dom = $(this);
                self.checkStarFun(id,url,dom)
            });
            $(".product-class a").off().click(function(e) {
                e.preventDefault();
                // $(this).addClass('active').parent().siblings().children().removeClass('active');
                var ProName = '',
                    CateId = '',
                    Status = '',
                    IsTop = '';
                    ProName = $.trim($(".searchinput").val());
                        if($(this).attr('cateid')){
                            CateId = $(this).attr('cateid')
                        }else {
                            CateId = ''
                        }
                        $(".product-tuij a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr("istop")){
                                    IsTop = $(this).attr("istop")
                                }else {
                                    IsTop = ''
                                }
                            }
                        })
        
                        $(".product-status a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr("status")){
                                    Status = $(this).attr("status")
                                }else {
                                    Status = ''
                                }
                            }
                        })
                    self.getNewData(ProName,CateId,Status,IsTop)
            })

            $(".product-tuij a").off().click(function(e) {
                e.preventDefault();
                var ProName = '',
                    CateId = '',
                    Status = '',
                    IsTop = '';
                    ProName = $.trim($(".searchinput").val());
                        if($(this).attr("istop")){
                            IsTop = $(this).attr("istop")
                        }else {
                            IsTop = ''
                        }
                        $(".product-class a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr('cateid')){
                                    CateId = $(this).attr('cateid')
                                }else {
                                    CateId = ''
                                }
                            }
                        })
        
                        $(".product-status a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr("status")){
                                    Status = $(this).attr("status")
                                }else {
                                    Status = ''
                                }
                            }
                        })
                    self.getNewData(ProName,CateId,Status,IsTop)
            })

            $(".product-status a").off().click(function(e) {
                e.preventDefault();
                var ProName = '',
                    CateId = '',
                    Status = '',
                    IsTop = '';
                    ProName = $.trim($(".searchinput").val());
                        if($(this).attr("status")){
                            Status = $(this).attr("status")
                        }else {
                            Status = ''
                        }
                        $(".product-class a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr('cateid')){
                                    CateId = $(this).attr('cateid')
                                }else {
                                    CateId = ''
                                }
                            }
                        })
                        $(".product-tuij a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr("istop")){
                                    IsTop = $(this).attr("istop")
                                }else {
                                    IsTop = ''
                                }
                            }
                        })
                    self.getNewData(ProName,CateId,Status,IsTop)
            })
            $(".search-icon").off().click(function(e) {
                e.preventDefault();
                var ProName = '',
                    CateId = '',
                    Status = '',
                    IsTop = '';
                    ProName = $.trim($(".searchinput").val())
                    if($(".product-class a").hasClass('active')){
                        $(".product-class a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr('cateid')){
                                    CateId = $(this).attr('cateid')
                                }else {
                                    CateId = ''
                                }
                            }
                        })
                    }
        
                    if($(".product-tuij a").hasClass('active')){
                        $(".product-tuij a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr("istop")){
                                    IsTop = $(this).attr("istop")
                                }else {
                                    IsTop = ''
                                }
                            }
                        })
                    }
        
                    if($(".product-status a").hasClass('active')){
                        $(".product-status a").each(function() {
                            if($(this).hasClass('active')) {
                                if($(this).attr("status")){
                                    Status = $(this).attr("status")
                                }else {
                                    Status = ''
                                }
                            }
                        })
                    }
                    self.getNewData(ProName,CateId,Status,IsTop)
            })
            $(".opera-a .del").off().click(function(e) {
                e.preventDefault();
                self.deleteProPop($(this).attr('href'))
            })
        },
        
        checkStarFun: function(id,url,dom){
            ND.ajax({
                url: url,
                params: {id: id},
                success: function (data) {
                    if(data.errCode == 0) {
                        if(dom.hasClass("star-selected")) {
                            dom.removeClass("star-selected")
                            layer.msg('取消推荐', {
                                icon: 1,
                                time: 2000
                            });
                        }else {
                            dom.addClass("star-selected")
                            layer.msg('推荐成功', {
                                icon: 1,
                                time: 2000
                            });
                        }
                        //dom.toggleClass("star-selected")
                    }else {
                        layer.msg(data.errMsg, {
                            icon: 2,
                            time: 2000
                        });
                    }
                }
            })
        },

        getNewData: function(ProName,CateId,Status,IsTop){
            layer.load(0, {shade: false});
            var appInfoId = ND.Tool.getUrlParam('appInfoId'),
                menuId = ND.Tool.getUrlParam('menuId'),
                pathname = window.location.pathname;
                if(menuId) {
                    window.location.href = pathname+'?appInfoId='+appInfoId+'&menuId='+menuId+'&DataProductSearch[ProName]='+ProName+'&DataProductSearch[CateId]='+CateId+'&DataProductSearch[IsTop]='+IsTop+'&DataProductSearch[Status]='+Status
                }else {
                    window.location.href = pathname+'?appInfoId='+appInfoId+'&DataProductSearch[ProName]='+ProName+'&DataProductSearch[CateId]='+CateId+'&DataProductSearch[IsTop]='+IsTop+'&DataProductSearch[Status]='+Status
                }
        },

        deleteProPop: function(url,index) {
            var self = this;
            layer.confirm('<div class="layer-cnt"><i></i>产品删除后将不再显示且不可恢复。确定删除？</div>', {
                btn: ['确定','取消'],
                title: '确认删除提醒', //不显示标题栏
                btnAlign: 'c' //按钮
              }, function(index){
                //layer.close(index)  
                self.deleteProFun(url,index);
              },function(index) {
                layer.close(index)
              })
        },

        deleteProFun: function(url,index){
            ND.ajax({
                url: url,
                success: function (data) {
                    if(data.errCode == 0) {
                        layer.msg('删除成功', {
                            icon: 1,
                            time: 2000
                        });
                        layer.close(index);
                        location.reload()
                    }else {
                        layer.msg(data.errMsg, {
                            icon: 2,
                            time: 2000
                        });
                    }
                }
            })
        },

    }

    var myProduct = new productClass();

});
