

$(function () {
    var centerInd = function () {
        this.init();
    }
    centerInd.prototype = {
        init: function () {
            this.eventBind();
        },
        eventBind: function () {
            var self = this;
            $(".destroy-icon").off().click(function(e) {
                e.preventDefault();
                var aid = $(this).attr('aid')
                ND.Tool.reMarkPop(0,aid)
            });
        },


    }

    var centerIndex = new centerInd();

});