/*
 * @Author: ylq 
 * @Date: 2017-12-22 17:35:28 
 * @Desc: 全局设置 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-16 17:50:12
 */

$(function () {
    var allSetting = function () {
        this.init();
    }
    allSetting.prototype = {
        init: function () {
            this.eventBind();
        },
        eventBind: function () {
            var self = this;
            //背景色
            $('#navBarBg span.navbar-bgc').off('click').on('click', function (e) {
                e.preventDefault();
                $('#navBarBg span.navbar-bgc').removeClass('nbgc-selected')
                $(this).addClass('nbgc-selected')
                var bgc = $(this).attr('bgc');
                $('.app-wrap-hd,.app-wrap-ft').css('background-color',bgc)
            })
            //导航标题色
            $('#navBarTitle span.navbar-bgc').off('click').on('click', function (e) {
                e.preventDefault();
                $('#navBarTitle span.navbar-bgc').removeClass('nbgc-selected')
                $(this).addClass('nbgc-selected')
                var bgc = $(this).attr('navigationbartextstyle');
                $('.app-wrap-hd').css('color',bgc)

            })

            // $('#dropdownBg input[name="backgroundTextStyle"]').click(function(e){

            // })
            // $('#checkCategory').on('change',function () {
            //     var el = $(this).find("option:selected");
            //     console.log(el);
            //     $('#FirstClass').val(el.attr('first_class'));
            //     $('#SecondClass').val(el.attr('second_class'));
            //     $('#SecondId').val(el.attr('second_id'));
            //     if(typeof(el.attr("third_class"))!="undefined"){
            //         $('#ThirdClass').val(el.attr('third_class'));
            //         $('#ThirdId').val(el.attr('third_id'));
            //     } else {
            //         $('#ThirdClass').val('');
            //         $('#ThirdId').val('');
            //     }
            // })
            //阻止默认
            $('#allSetForm').submit(function (e) {
                e.preventDefault();
                console.log(1)
                return false;
            })
            //tags 处理
            // var tags = $('#tags').val();
            // var myTags = tags.replace(/\ +/g, ',')
            // $('#tags').val(myTags)
            
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

            //保存
            $('#saveAllSet').click(function (e) {
                e.preventDefault();
                self.allSetFn()

            })
            //保存下一步
            $('#saveAllSetNext').click(function (e) {
                e.preventDefault();
                self.allSetFn(1)
            })
            //blur
            $('#navigationBarTitleText').blur(function(){
                $(this).next('.error-tips').text('')
                $('#wxTitle').text(this.value)
            });
            //change
            $('#checkCategory').change(function(){
                if(!this.value) {
                    $(this).next('.error-tips').text('请选择一个服务类目')
                } else{
                    $(this).next('.error-tips').text('')
                }
            })

        },
        allSetFn: function (next) {
            //表单
            var formId = $('#allSetForm');
            //url+方法+params
            var url = formId.attr('action'),
                method = formId.attr('method'),
                params = {};
            //AppDevWindowModel
            var nbtt = $.trim($('#navigationBarTitleText').val()),
                nbbc = $('#navBarBg span.nbgc-selected').attr('bgc'),
                nbts = $('#navBarTitle span.nbgc-selected').attr('navigationbartextstyle'),
                bts = $('#dropdownBg input[type="radio"]:checked').val();
            //AppAuditSetting
            var ccs = $('#checkCategory option:selected');
            var tags = $('#tags').val();
            //var myTags = tags.replace(/,/g, '\n')
            var myTags = tags.replace(/,/g, ' ')
            //list
            var list = [];
            $('.fnbm').each(function (i, item) {
                var sip = $(item).find('input[name="selectedIconPath"]').val();
                //sip = sip.split('/')
                //sip[3] = nbbc.replace('#', '')
                //sip = sip.join('/')
                var temp = {
                    iconPath: $(item).find('input[name="iconPath"]').val(),
                    pagePath: $(item).find('input[name="pagePath"]').val(),
                    selectedIconPath: sip,
                    text: $(item).find('input[name="text"]').val()
                };
                list.push(temp)
            })
            //参数
            params = {
                //_csrf:'',
                AppDevWindowModel: {
                    //首页标题
                    navigationBarTitleText: nbtt,
                    //导航背景色：
                    navigationBarBackgroundColor: nbbc,
                    //导航标题色：
                    navigationBarTextStyle: nbts,
                    //下拉背景样式：
                    backgroundTextStyle: bts
                },
                AppAuditSetting: {
                    FirstId: ccs.val(),
                    FirstClass: ccs.attr('n1'),
                    SecondId: ccs.attr('v2'),
                    SecondClass: ccs.attr('n2'),
                    ThirdId: ccs.attr('v3'),
                    ThirdClass: ccs.attr('n3'),
                    Tag: myTags
                },
                list: list
            };
            //首页标题
            if(nbtt == ''){
                $('#navigationBarTitleText').next('.error-tips').text('首页标题不能为空')
                return
            }
            if(nbtt.length > 10){
                $('#navigationBarTitleText').next('.error-tips').text('首页标题不能不能超过10个字符')
                return
            }

            //服务类目
            if(ccs.val() == ''){
                $('#checkCategory').next('.error-tips').text('请选择服务类目')
                return
            }
            //标签
            //console.log(myTags)
            if(myTags == ''){
                $('#tagsTips').text('标签不能为空')
                return
            }
            ND.ajax({
                url: url,
                params: params,
                success: function (data) {
                    console.log(data)
                    if(data.errCode == 0){
                        layer.msg('设置成功，体验预览 页面扫码即可体验', {
                            icon: 1,
                            time: 2000
                        });
                        if (next) {
                            var href = $('.sub-side .sub-menu-ul').eq(0).find('li:first-child a').attr('href')
                            setTimeout(function() {
                                window.location.href = href;
                            }, 2000);
                        }
                    } else {
                        layer.msg(data.errMsg, {
                            icon: 2,
                            time: 2000
                        });
                    }
                }
            })


        }





    }

    var myAllSetting = new allSetting();

});