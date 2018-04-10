/*
 * @Author: ylq 
 * @Date: 2018-02-06 14:08:52 
 * @Desc: 首页 点击刷新小程序状态 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-20 16:13:41
 */

var authinfo = function () {
  this.init();
}
authinfo.prototype = {
  init: function () {
    this.eventBind();
  },
  eventBind: function () {
    var self = this;

    //tips
    var auto_icon = document.getElementById('autoIcon'),
      tis_tog = document.getElementById('tisTog'),
      auth_info = document.getElementById('authInfo'),
      shquan_div = document.getElementById('shquanDiv');
    auto_icon.onmouseover = function () {
      auth_info.classList.remove("auth-info")
      auto_icon.classList.add("auth-icon")
    }
    auto_icon.onmouseout = function () {
      auth_info.classList.add("auth-info")
      auto_icon.classList.remove("auth-icon")
    }
    shquan_div.onmouseover = function () {
      auth_info.classList.remove("auth-info")
      auto_icon.classList.add("auth-icon")
    }
    shquan_div.onmouseout = function () {
      auth_info.classList.add("auth-info")
      auto_icon.classList.remove("auth-icon")
    }
    //点击刷新
    $('.refresh-app').click(function (e) {
      e.preventDefault();
      var aid = $(this).attr('aid');
      self.refreshApp(aid);
    });
    //隐藏小程序
    $('.display-app').click(function (e) {
      e.preventDefault();
      var aid = $(this).attr('aid');
      layer.confirm('<div class="layer-cnt"><i></i>确定隐藏该小程序吗？</div>', {
        btn: ['确定', '取消'],
        btnAlign: 'c' //按钮
      }, function (index) {
        layer.close(index)
        self.displayApp(aid);
      }, function (index) {
        layer.close(index)
      })
    });
    //重新制作
    $(".reset-app").off().click(function (e) {
      e.preventDefault();
      var aid = $(this).attr('aid')
      ND.Tool.reMarkPop(0, aid)
    });

    //续费
    $(".shuj-buy").off().click(function (e) {
      e.preventDefault();
      var aid = $(this).attr('aid')
      //self.submitPayPopup(aid)
      self.getAppInfo(aid)
    });
  },
  //刷新app
  refreshApp: function (aid) {
    var index = layer.load(0, { shade: [0.5, '#393D49'] })
    var self = this,
      obj = {
        url: '/auth-info/synchro',
        params: {
          appInfoId: aid
        },
        success: function (data) {
          layer.close(index);
          if (!data.errCode) {
            layer.msg('刷新状态成功', { icon: 1 });
            setTimeout(function () {
              location.reload()
            }, 3000)
          } else {
            layer.msg(data.errMsg, { icon: 5 });
          }
        },
        error: function () {
          layer.close(index);
          layer.msg('网络异常', { icon: 5 });
        }
      }
    ND.ajax(obj);
  },
  //隐藏app
  displayApp: function (aid) {
    var index = layer.load(0, { shade: [0.5, '#393D49'] })
    var self = this,
      obj = {
        url: '/auth-info/state',
        params: {
          state: 0,
          appInfoId: aid
        },
        success: function (data) {
          layer.close(index);
          if (!data.errCode) {
            layer.msg('小程序已隐藏', { icon: 1 });
            setTimeout(function () {
              location.reload()
            }, 3000)
            $('a.display-app[aid=' + aid + ']').closest('.gl-item').remove();
          } else {
            layer.msg(data.errMsg, { icon: 5 });
          }
        },
        error: function () {
          layer.close(index);
          layer.msg('网络异常', { icon: 5 });
        }
      }
    ND.ajax(obj);
  },
  //获取小程序信息
  getAppInfo: function (aid) {
    var index = layer.load(0, { shade: [0.5, '#393D49'] })
    var self = this,
      obj = {
        url: '/auth-info/relevant',
        type: 'get',
        params: {
          appInfoId: aid
        },
        success: function (data) {
          layer.close(index);
          if (!data.errCode) {
            data.result.appInfoId = aid;
            self.submitPayPopup(data.result)
          } else {
            layer.msg(data.errMsg, { icon: 5 });
          }
        },
        error: function () {
          layer.close(index);
          layer.msg('网络异常', { icon: 5 });
        }
      }
    ND.ajax(obj);
  },
  //付款弹窗
  submitPayPopup: function (data) {
    var self = this;
    layer.open({
      type: 1,
      title: '购买模板', //不显示标题栏
      area: '700px;',
      shade: 0.3,
      move: false,
      id: 'LAY_version2', //设定一个id，防止重复弹出
      resize: false,
      moveType: 1, //拖拽模式，0或者1
      btn: [],
      content: $('#msgPayTPL').html(),
      success: function (layero, index) {
        var tpl = data.template
        //模板图片
        $('#payTemplateImg').attr({ src: tpl.ThumbUrl, alt: data.nick_name })
        $('#payAppName').text(data.nick_name)
        $('#payTemplateName').text(tpl.TemplateName)
        $('#payAppDate').text((data.begin_date ? data.begin_date : '-') + ' 至 ' + (data.end_date ? data.end_date : '-'))
        $('#buyTime a[price-type="2"] em').text(tpl.PriceMonth)
        $('#buyTime a[price-type="2"] del').text('原价：' + (tpl.OriginPriceM || '-') + '元/月')
        $('#buyTime a[price-type="1"] em').text(tpl.Price)
        $('#buyTime a[price-type="1"] del').text('原价：' + (tpl.OriginPriceY || '-') + '元/年')


        //购买时长
        $('#buyTime a').off('click').on('click', function (e) {
          e.preventDefault();
          $('#buyTime a').removeClass('cur')
          $(this).addClass('cur');
          self.createQrcode(data)
        })
        //支付方式
        $('#buyType a').off('click').on('click', function (e) {
          e.preventDefault();
          $('#buyType a').removeClass('cur')
          $(this).addClass('cur');
          self.createQrcode(data)
        })
        //默认点击一个二维码
        $('#buyType a.cur').trigger('click')
        //点击重新加载二维码
        $('#wxpayMask .img-mask-text').on('click', function (e) {
          e.preventDefault();
          var type = $(this).attr('type');
          //console.log(type)
          self.createQrcode(data);
        })
      }
    })
  },
  //生成二维码参数组合
  createQrcode: function (data) {
    var self = this;
    if (self.clearCode) {
      clearInterval(self.clearCode)
    };
    var priceType = $('#buyTime a.cur').attr('price-type'),
      payType = $('#buyType a.cur').attr('pay'),
      price = $('#buyTime a.cur em').text();
    var url = '/cashier/wechat';
    if (payType == 2) {
      url = '/cashier/alipay'
    }
    var templateId = data.TemplateId,
      appInfoId = data.appInfoId,
      userId = data.user_id
    var o = {
      TemplateId: templateId,
      AppInfoId: appInfoId,
      UserId: userId,
      IsUse: 1,
      Count: 1,
      PriceType: priceType,
      TotalMoney: price
    }
    this.qrcode(url, o)
  },
  //生成二维码
  qrcode: function (url, o) {
    var self = this
    $('#wxPay .img-loading').show();
    //清除之前的心跳检测
    if (self.orderCode) {
      clearInterval(self.orderCode)
    }
    var obj = {
      url: url,
      params: o,
      success: function (data) {
        $('#payBox .img-loading').hide();
        var status = data.errCode,
          maskText = $('#wxpayMask .img-mask-text'),
          result = data.code_url,
          trade_no = data.trade_no,
          vHtml = '';
        if (status == 0) {
          $('#wxpayMask').hide()
          $('#wxpayCanvas').html('').qrcode({
            width: 150,
            height: 150,
            text: result
          });
          //5分钟定时
          var clearCode = setInterval(function () {
            $('#wxpayMask').show();
            maskText.text('二维码失效，请点击重新获取');
          }, 5 * 60 * 1000)
          self['clearCode'] = clearCode;
          //心跳检测是否支付成功
          //5miao钟定时
          var orderCode = setInterval(function () {
            self.checkOrderStatus(trade_no)
          }, 5 * 1000)
          self['orderCode'] = orderCode;

        } else {
          $('#wxpayMask').show();
          maskText.text(data.message)
        }
      },
      error: function () {
        $('#payBox .img-loading').hide();
      }
    }
    ND.ajax(obj)
  },
  //检测支付状态
  checkOrderStatus: function (trade_no) {
    var self = this;
    if (!trade_no) {
      return
    }
    ND.ajax({
      url: '/cashier/check',
      params: {
        Trade: trade_no
      },
      success: function (data) {
        var status = data.errCode,
          vHtml = '';
        if (status == 0) {
          if (self.orderCode) {
            clearInterval(self.orderCode)
          }
          self.paySuccess(data.result)
        } else {
          //5miao钟定时
          // var orderCode = setInterval(function () {
          //     self.checkOrderStatus(trade_no)
          // }, 5 * 1000)
          // self['orderCode'] = orderCode;
        }
      },
      error: function () {
        layer.msg('支付状态异常，请稍后再试', {
          icon: 2,
          time: 2000
        });
      }

    })
  },
  //支付成功弹窗
  paySuccess:function(result){
    layer.closeAll()
    var self = this;
    layer.open({
      type: 1,
      title: '支付结果', //不显示标题栏
      area: '700px;',
      shade: 0.3,
      move: false,
      id: 'LAY_version435343', //设定一个id，防止重复弹出
      resize: false,
      moveType: 1, //拖拽模式，0或者1
      btn: [],
      content: $('#msgPayResultTPL').html(),
      success: function (layero, index) {
        $('#paySuccessMoney').text(result.PayMoney)
        $('#payOrderId').text(result.TradeNo)
        $('#paySuccessTemplateName').text(result.template.TemplateName)
      },
      cancel: function(index, layero){
        window.location.reload();
      }
    })
    
  }

}


$(function () {
  var myAuthInfo = new authinfo();
})