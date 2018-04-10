/*
 * @Author: ylq 
 * @Date: 2018-01-27 17:29:00 
 * @Desc: 选择模板页面 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-15 11:45:47
 */
$(function () {
  var template = function () {
    this.init();
  }
  template.prototype = {
    init: function () {
      this.eventBind();
    },
    eventBind: function () {
      var self = this;
      //授权
      $('#userThisTemplateAuth').click(function (e) {
        e.preventDefault();
        var aid = $(this).attr('aid'),
          tid = $(this).attr('tid');
        self.authTemplate(aid, tid)
      });
      //选择
      $('#userThisTemplateSelect').click(function (e) {
        e.preventDefault();
        var aid = $(this).attr('aid'),
          tid = $(this).attr('tid'),
          isUser = $(this).attr('isuser');
        self.selectedTemplate(aid, tid,isUser)
      });
      //直接使用此模板
      $('#userThisTemplate').click(function (e) {
        e.preventDefault();
        var aid = $(this).attr('aid'),
          tid = $(this).attr('tid');
        self.useTemplate(aid, tid)
      });

    },
    //case1 前往授权
    authTemplate: function (aid, tid) {
      var self = this;
      layer.open({
        type: 1,
        title: '温馨提示', //不显示标题栏
        area: '420px;',
        shade: 0.3,
        move: false,
        id: 'LAY_ver1', //设定一个id，防止重复弹出
        resize: false,
        moveType: 1, //拖拽模式，0或者1
        btn: [],
        content: $('#templateCase1').html(),
        success: function (layero, index) {
          //取消
          $('#btnTplNo').off().on('click', function (e) {
            layer.close(index);
          })
        }
      })
    },
    //case2 多个选择
    selectedTemplate: function (aid, tid,isUse) {
      var self = this;
      if(isUse == 1){
        ND.Tool.reMarkPop(1,aid,function(){
          self.useTemplate(aid,tid)
        })
        return
      }
      layer.open({
        type: 1,
        title: '温馨提示', //不显示标题栏
        area: '420px;',
        shade: 0.3,
        move: false,
        id: 'LAY_ver1', //设定一个id，防止重复弹出
        resize: false,
        moveType: 1, //拖拽模式，0或者1
        btn: [],
        content: $('#templateCase2').html(),
        success: function (layero, index) {
          //默认选择点一个
          $('#tplAppList li input[name="applist"]').eq(0).trigger('click')
          //确定
          $('#btnTplSelectYes').off().on('click', function (e) {
            var appinfoId = $('#tplAppList li input[name="applist"]:checked').val()
            var isUse = $('#tplAppList li input[name="applist"]:checked').attr('isuse')
            if(isUse == 1){
              ND.Tool.reMarkPop(1,appinfoId,function(){
                self.useTemplate(appinfoId,tid)
              })
            } else {
              self.useTemplate(appinfoId,tid)
            }
          })
          //取消
          $('#btnTplSelectNo').off().on('click', function (e) {
            layer.close(index);
          })
        }
      })
    },
    useTemplate: function (aid, tid) {
      var index = layer.load(0, { shade: [0.5, '#393D49'] })
      var self = this,
        obj = {
          url: '/template/use',
          params: {
            id: tid,
            appInfoId: aid
          },
          success: function (data) {
            layer.close(index);
            if (!data.errCode) {
              window.location.href = data.url;
            } else {
              layer.msg(data.errMsg, { icon: 5 });
            }
          },
          error: function () {
            layer.close();
            layer.msg('网络异常', { icon: 5 });
          }
        }
      ND.ajax(obj);
    }
  }
  var mytemplate = new template();
});