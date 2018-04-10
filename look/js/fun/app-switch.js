/*
 * @Author: ylq 
 * @Date: 2017-12-27 15:55:36 
 * @Desc: 应用开关 
 * @Last Modified by: ylq
 * @Last Modified time: 2017-12-28 10:57:34
 */
$(function() {
    var appSwitch = function() {
        this.init();
    }
    appSwitch.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;
            
            $('input[name="tgl-IsRelative"]').click(function(e){
                e.preventDefault();
                var my = this;
                var iv = this.value,
                    aid = $(this).attr('aid'),
                    o = {iv:iv,aid:aid};
                if (iv == 'close') {
                    layer.confirm('确定要关闭小程序吗？暂停服务后，用户将不可以正常访问线上版本小程序。', {icon: 3, title:'提示'}, function(index){
                        o.i = index
                        self.accounStatus(o,my);
                    }, function(index){
                        layer.close(index);
                    });
                } else {
                    self.accounStatus(o,my);
                }
                //return false;
            })
        },
        accounStatus:function(o,ipt){
            var iv = o && o.iv,
                index = o.i,
                aid = o && o.aid
            ND.ajax({
                url: "/console/version/switch-status?appInfoId="+ aid,
                params: {action: iv},
                success: function (data) {
                    layer.close(index)
                    if(data.errCode == 0) {
                        $(ipt).prop('checked',(iv == 'close' ? false : true)).val(iv == 'close' ? 'open' : 'close' )
                        layer.msg('操作成功', {
                            icon: 1,
                            time: 2000
                        });
                        return true;
                        //window.location.reload();
                    }else {
                        layer.msg(data.errMsg, {
                            icon: 2,
                            time: 2000
                        });
                        return false;
                    }
                },
                error:function(data){
                    layer.close(index)
                    layer.msg(data.errMsg || '网络异常', {
                        icon: 2,
                        time: 2000
                    });
                    return false;
                }
            })
        },

    }
    var myAppSwitch = new appSwitch();
});