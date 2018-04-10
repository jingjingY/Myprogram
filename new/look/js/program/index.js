
$(function() {
    var proGram = function() {
        this.init();
    }
    proGram.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;
            $(".renew-show").click(function(e) {
                e.preventDefault();
                layer.confirm('<div class="layer-cnt"><i></i>确定展示该小程序吗？</div>',{
                    btn: ['是','否'],
                    btnAlign: 'c' 
                },function() {
                    self.formSubmitFun();
                },function(index) {
                    layer.close(index)
                })
            })
        },
        formSubmitFun() {
           var aid = $(".renew-show").attr('aid'),
               index = layer.load(0,{shade: [0.5, '#393D49']});
            ND.ajax({
                url: 'auth-info/state',
                method: 'post',
                params: {
                    appInfoId: aid,
                    state: 1    
                },
                success: function (data) {
                    layer.close(index);
                    if(data.errCode == 0) {
                        layer.msg(data.errMsg, {
                            icon: 1,
                            time: 2000
                        });
                        // $(".renew-show").addClass("is-show")
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
    var myproGram = new proGram();
});
