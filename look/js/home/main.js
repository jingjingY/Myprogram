/*
 * @Author: ylq 
 * @Date: 2018-01-18 15:27:33 
 * @Desc: 小鹿首页 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-14 14:38:59
 */
$(function () {
    var main = function () {
        this.init();
    }
    main.prototype = {
        init: function () {
            this.eventBind();
        },
        eventBind: function () {
            //手机点击事件
            var menuItems = jQuery('.all-menu-wrapper .nav-link');
            var menuIcon = jQuery('.menu-icon, #navMenuIcon');
            var menuBlock = jQuery('.all-menu-wrapper');
            var menuLinks = jQuery(".top-menu-links a, .main-menu a, .all-menu-wrapper a");
            // Menu icon clicked
            menuIcon.on('click', function () {
                console.log('menu clicked')
                menuIcon.toggleClass('menu-visible')
                menuBlock.toggleClass('menu-visible')
                menuItems.toggleClass('menu-visible');
                return false;
            });

            // Hide menu after a menu item clicked
            menuLinks.on('click', function () {
                if (menuItems.hasClass('menu-visible')) {
                    menuIcon.removeClass('menu-visible');
                    menuBlock.removeClass('menu-visible');
                    menuItems.removeClass('menu-visible');
                }
                return true;
            });

            //固定头部
            var contextWindow = jQuery(window);
            var scrollHeight = jQuery(document).height() - contextWindow.height();
            contextWindow.on('scroll', function () {
                var scrollpos = jQuery(this).scrollTop();
                //var siteHeaderFooter = jQuery('.page-header');
                // if (scrollpos > 10 && scrollpos < scrollHeight - 100) {
                if (scrollpos > 80) {
                    $('body').addClass("scrolled");
                }
                else {
                    $('body').removeClass("scrolled");
                }
            });
            //页面滚蛋
            if(ScrollReveal){
                window.sr = ScrollReveal({
                    origin: 'top',
                    scale: 1,
                });
                //main-brand-text
                // sr.reveal('.main-brand-text',{
                //     distance: '1rem'
                // });
                //text
                sr.reveal('.title-desc h2',{
                    delay: 500,
                    distance: '3rem'
                });
                sr.reveal('.title-desc h4',{
                    delay: 1000,
                    distance: '3rem'
                });
            }            

        }
    }
    var myMain = new main();
});