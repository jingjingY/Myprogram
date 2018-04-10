

$(function () {
    var activeClass = function () {
        this.init();
    }
    activeClass.prototype = {
        init: function () {
            this.eventBind();
        },
        eventBind: function () {
            var self = this;

            $(".opera-a .btn-active-del").off().click(function(e) {
                e.preventDefault();
                self.deleteActPop($(this).attr('href'))
            })
            $(".search-icon").off().click(function (e) {
                e.preventDefault();
                self.searchResult($(this).data('url'));
            })
        },

        searchResult: function(url,index){
            var ProName = $('input[name=ProName]').val();
            url =  url + '&ProName='+ ProName;
            window.location.href = url;
        },


        deleteActPop: function(url,index) {
            var self = this;
                layer.open({
                    type: 1,
                    title: '确认删除提醒', //不显示标题栏
                    area: '400px;',
                    shade: 0.3,
                    move: false,
                    id: 'LAY_Delete', //设定一个id，防止重复弹出
                    resize: false,
                    btnAlign: 'c',
                    btn: ['确认','取消'],
                    moveType: 1, //拖拽模式，0或者1
                    content: $('#deleteActive').html(),
                    success: function() {
                        
                    },
                    btn1: function(index) {
                        self.deleteActFun(url,index);
                    },
                    btn2: function(index) {
                        layer.close(index);
                    }
                })
        },

        deleteActFun: function(url,index){
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

    var myActive = new activeClass();

});
