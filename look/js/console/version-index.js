$(function () {
  var version = function () {
    this.isUse = 0
    this.init();
  }
  version.prototype = {
    init: function () {
      this.eventBind();
    },
    eventBind: function () {
      var self = this;
      //提交审核
      $(".tij-submit").off().click(function (e) {
        e.preventDefault();
        self.isUse = 0;
        self.submitPop()
      });
      //提交发布
      $('#auditBtn').off().click(function (e) {
        e.preventDefault();
        self.isUse = 1;
        //self.checkPayStatus();
        self.submitAudit()
      })
      //暂停小程序 
      $(".sever-btn").off().click(function (e) {
        e.preventDefault();
        var action = $(".sever-btn").attr('action');
        if (action == 'close') {
          layer.confirm('确定要关闭小程序吗？暂停服务后，用户将不可以正常访问线上版本小程序。', { icon: 3, title: '提示' }, function (index) {
            self.serverPop()
          }, function (index) {
            layer.close(index);
          });
        } else {
          self.serverPop()
        }
      })

      //弹弹弹
      //self.newTrySuccessPop();

    },
    //提交审核第一步
    submitPop: function (index) {
      var self = this;
      layer.open({
        type: 1,
        title: '提交审核', //不显示标题栏
        area: '700px;',
        shade: 0.3,
        move: false,
        id: 'LAY_version', //设定一个id，防止重复弹出
        resize: false,
        btnAlign: 'c',
        moveType: 1, //拖拽模式，0或者1
        btn: [],
        content: $('#submitShTem').html(),
        success: function (layero, index) {
          //下一步
          $('#btnYes').off().on('click', function (e) {
            if ($(".check-role input").is(':checked')) {
              layer.close(index);
              self.submitSurePop()
            } else {
              layer.msg('请阅读并了解平台审核规则', { icon: 2 });
            }
          })
          //取消
          $('#btnNo').off().on('click', function (e) {
            layer.close(index);
          })
        }
      })
    },
    //提交审核第二步
    submitSurePop: function (index) {
      var self = this;
      layer.open({
        type: 1,
        title: '提交信息确认', //不显示标题栏
        area: '700px;',
        shade: 0.3,
        move: false,
        id: 'LAY_version_sure', //设定一个id，防止重复弹出
        resize: false,
        btnAlign: 'c',
        btn: [],
        moveType: 1, //拖拽模式，0或者1
        content: $('#msgSureTem').html(),
        success: function (layero, index) {
          //确定
          $('#btnSureYes').off().on('click', function (e) {
            e.preventDefault();
            self.submitFun(index)
          })
          //下一步
          $('#btnSureNext').off().on('click', function (e) {
            e.preventDefault();
            self.submitFun(index,1)
          })
          //取消
          $('#btnSureNo').off().on('click', function (e) {
            layer.close(index);
          })


          //隐藏下一步
          $('.layui-layer-btn1').show();
          $('#autoSubmit').change(function (e) {
            if (this.checked) {
              $('#btnSureYes').hide();
              $('#btnSureNext').show();
            } else {
              $('#btnSureYes').show();
              $('#btnSureNext').hide();
            }
          })
        }
      })
    },
    //提交审核
    submitFun: function (index) {
      var self = this,
        devId = $("#dev-id").val(),
        appinfoId = $("#appInfoId").val(),
        index = index || 0;
      var auto = 0;
      if ($('#autoSubmit').is(':checked')) {
        auto = 1
      }
      ND.ajax({
        url: "/console/version/submit-audit?appDevId=" + devId + "&" + "appInfoId=" + appinfoId,
        params: { Auto: auto },
        success: function (data) {
          layer.closeAll();
          if (data.errCode == 0) {
            var dr = data.result;
            if(dr && dr.is_new && dr.is_new == 1){
              //新用户
              self.newTrySuccessPop();
            } else {
              layer.msg('提交成功')
            }
            //window.location.reload();
          } else if (data.errCode == 60001) {
            //自动发布
            self.submitPayPopup()
          } else {
            layer.msg(data.errMsg, {
              icon: 2,
              time: 2000
            });
          }
        }
      })
    },
    //新用户试用7天框
    newTrySuccessPop:function(submit){
      var self = this;
      layer.open({
        type: 1,
        title: '提交信息确认', //不显示标题栏
        area: '700px;',
        shade: 0.3,
        move: false,
        id: 'LAY_version_34e', //设定一个id，防止重复弹出
        resize: false,
        btnAlign: 'c',
        btn: [],
        moveType: 1, //拖拽模式，0或者1
        content: $('#auditSubmitSuccessTPL').html(),
        success: function (layero, index) {
          //显示
          $('.nass-new-tips').show()
          if(submit){
            $('.nass-new-tips').hide()
          }
          //取消
          $('#btnSureNo').off().on('click', function (e) {
            layer.close(index);
            window.location.reload();
          })
        }
      })
    },
    //提交发布
    submitAudit: function () {
      var self = this,
        appInfoId = $('#appInfoId').val(),
        auditId = $('#auditId').val();
      var self = this,
        obj = {
          url: '/console/version/submit-online?appInfoId='+appInfoId,
          params: {
            auditId:auditId 
          },
          success: function (data) {
            var status = data.errCode,
              trade_no = data.trade_no,
              vHtml = '';
            if (status == 0) {
              var dr = data.result;
              if(dr && dr.is_new && dr.is_new == 1){
                //新用户
                self.newTrySuccessPop(true);
              } else {
                layer.msg('发布成功')
              }
            } else if (data.errCode == 60001) {
              //自动发布
              self.submitPayPopup()

            } else {
              layer.msg(data.errMsg, {
                icon: 2,
                time: 2000
              });
            }
          },
          error: function () {}
        }
      ND.ajax(obj)
    },
    //付款弹窗
    submitPayPopup: function (index) {
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
          //购买时长
          $('#buyTime a').off('click').on('click', function (e) {
            e.preventDefault();
            $('#buyTime a').removeClass('cur')
            $(this).addClass('cur');
            self.createQrcode()
          })
          //支付方式
          $('#buyType a').off('click').on('click', function (e) {
            e.preventDefault();
            $('#buyType a').removeClass('cur')
            $(this).addClass('cur');
            self.createQrcode()
          })
          //默认点击一个二维码
          $('#buyType a.cur').trigger('click')
          //点击重新加载二维码
          $('#wxpayMask .img-mask-text').on('click', function (e) {
            e.preventDefault();
            var type = $(this).attr('type');
            //console.log(type)
            self.createQrcode();
          })
        }
      })
    },
    //生成二维码参数组合
    createQrcode: function () {
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
      var o = this.getPayParams(priceType, price, 1)
      this.qrcode(url, o)
    },
    //获取支付参数
    getPayParams: function (priceType, price, count) {
      var self = this,
        templateId = $('#templateId').val(),
        appInfoId = $('#appInfoId').val(),
        userId = $('#userId').val();
      return {
        TemplateId: templateId,
        AppInfoId: appInfoId,
        UserId: userId,
        IsUse: self.isUse || 0,
        Count: count,
        PriceType: priceType,
        TotalMoney: price
      }
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
            //window.location.reload()
            self.submitFun()
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
    //暂停小程序额
    serverPop: function () {
      var self = this,
        action = $(".sever-btn").attr('action'),
        appinfoId = $(".sever-btn").attr('appinfo-id'),
        auditId = $(".sever-btn").attr('audit-id');
      ND.ajax({
        url: "/console/version/switch-status?appInfoId=" + appinfoId,
        params: { action: action, auditId: auditId },
        success: function (data) {
          if (data.errCode == 0) {
            //window.location.reload();
            if (action == 'open') {
              $('.sever-btn').attr('action', 'close').text('暂停服务').removeClass('open-sever-btn').addClass('close-sever-btn')
            } else {
              $('.sever-btn').attr('action', 'open').text('开启服务').removeClass('close-sever-btn').addClass('open-sever-btn')
            }
            layer.msg('操作成功', {
              icon: 1,
              time: 2000
            });
            layer.close()
          } else {
            layer.msg(data.errMsg, {
              icon: 2,
              time: 2000
            });
          }
        },
        error: function (data) {
          layer.close(index)
          layer.msg(data.errMsg || '网络异常', {
            icon: 2,
            time: 2000
          });
        }
      })

    }


  }

  var tijVersion = new version();

});