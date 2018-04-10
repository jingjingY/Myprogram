/*
 * @Author: ylq 
 * @Date: 2017-12-19 10:20:08 
 * @Desc: 菜单 
 * @Last Modified by: ylq
 * @Last Modified time: 2017-12-25 13:39:26
 */

$(function() {
    var main = function() {
        this.init();
    }
    main.prototype = {
        init: function() {
            this.eventBind();
        },
        eventBind: function() {
            var self = this;
            $("#menu").metisMenu();
        }
    }
    var myMain = new main();
});