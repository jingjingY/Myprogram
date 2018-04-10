/*
 * @Author: ylq 
 * @Date: 2018-02-05 11:48:58 
 * @Desc: help 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-14 14:10:58
 */

$(function () {
    var help = function () {
        this.init();
    }
    help.prototype = {
        init: function () {
            this.eventBind();
        },
        eventBind: function () {
            if (typeof $.fn.slimscroll !== 'undefined') {
                $(".col-xs-3 .panel-scroll").slimscroll({
                    height: 450,
                    alwaysVisible: false,
                }).css("width", "100%");
    
                $('.col-xs-9 .active .panel-scroll').slimscroll({
                    height: 460,
                    alwaysVisible: false,
                }).css("width", "100%");

                $('.help-menu-list a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    // 获取已激活的标签页的名称
                    var activeTab = $(e.target).parent('li').index();
                    $(".col-xs-9 .tab-panel-lk").eq(activeTab).find('.panel-scroll').slimscroll({
                        height: 460,
                        alwaysVisible: false,
                    }).css("width", "100%");
                });
            }


            //固定左侧
            if(jQuery('#helpSidebar').length){
                var contextWindow = jQuery(window);
                var scrollHeight = jQuery(document).height() - contextWindow.height();
                var sidebarTop = jQuery('#helpSidebar').offset().top; 
                var helpEntry = jQuery('#helpEntry').offset().top + jQuery('#helpEntry').height() - 499; 
                console.log(jQuery('#helpEntry').height())
                contextWindow.on('scroll', function () {
                    var scrollpos = jQuery(this).scrollTop();
                    //var siteHeaderFooter = jQuery('.page-header');
                    // if (scrollpos > 10 && scrollpos < scrollHeight - 100) {
                    if (scrollpos > sidebarTop && scrollpos < helpEntry) {
                        $('body').addClass("scrolled-help");
                    } else {
                        $('body').removeClass("scrolled-help");
                    }
                });
            }
        }
    }
    var myhelp = new help();
});