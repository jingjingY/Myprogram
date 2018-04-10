/*
 * @Author: ylq 
 * @Date: 2017-12-27 15:24:58 
 * @Desc: Tool  工具函数集合 
 * @Last Modified by: ylq
 * @Last Modified time: 2018-03-15 20:26:38
 */
ND.Tool = {
    //获取url中的参数
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null; //返回参数值
    },

    upLoader: function(id,trueOrFalse,imgSrc) {
        var $ = jQuery,
        $wrap = $(id),
        // 图片容器
        $queue = $wrap.find(".filelist"),
        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),
        // 文件总体选择信息。
        $info = $statusBar.find('.info'),
        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),
        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),
        // 添加的文件数量
        fileCount = 0,
        // 添加的文件总大小
        fileSize = 0,
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,
        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        supportTransition = (function(){
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;
        if ( !WebUploader.Uploader.support() ) {
            layer.msg('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器', {
                icon: 2,
                time: 3000
            });
            throw new Error( 'WebUploader does not support the browser you are using.' );
        }
        // 实例化
        uploader = WebUploader.create({
            pick: {
                id: id+'1',
                label: '点击选择图片',
                multiple: trueOrFalse
            },
            accept: {
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            formData: {
                _csrf: $('meta[name="csrf-token"]').attr("content")
            },
            swf: '/plugins/webuploader/Uploader.swf',

            disableGlobalDnd: true,

            chunked: true,
            server: '/upload/index',
            fileNumLimit: 300,
            fileSizeLimit: 5 * 1024 * 1024,    // 200 M
            fileSingleSizeLimit: 1 * 1024 * 1024    // 50 M
        });

        if(trueOrFalse) {
            // 添加“添加文件”的按钮，
            uploader.addButton({
                id: id+'2',
                label: '继续添加'
            });
        }

        // 当有文件添加进来时执行，负责view的创建
        function addFile( file ) {
            var $li = $( '<li id="' + file.id + '">' +
                '<p class="imgWrap"></p>'+
                '</li>' ),
            $btns = $('<div class="file-panel">' + '<span class="cancel">删除</span>' + '</div>').appendTo( $li ),
            $imgWrap = $li.find( 'p.imgWrap' ),
            $info = $('<p class="error"></p>'),
            showError = function( code ) {
                switch( code ) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text( text ).appendTo( $li );
            };
            if(!trueOrFalse) {
                $wrap.find(".file-li").remove()
            }
            if ( file.getStatus() === 'invalid' ) {
                showError( file.statusText );
            } else {
                uploader.makeThumb( file, function( error, src ) {
                    if ( error ) {
                        $imgWrap.text( '不能预览' );
                        return;
                    }
                    var img = $('<img src="'+src+'">');
                    $imgWrap.empty().append( img );
                }, thumbnailWidth, thumbnailHeight );
                file.rotation = 0;
        }

        file.on('statuschange', function( cur, prev ) {
                if ( prev === 'queued' ) {
                    $li.off( 'mouseenter mouseleave' );
                    $btns.remove();
                }
                if ( cur === 'error' || cur === 'invalid' ) {
                    showError( file.statusText );
                } else if ( cur === 'interrupt' ) {
                    showError( 'interrupt' );
                } else if ( cur === 'queued' ) {
                } else if ( cur === 'complete' ) {
                    $li.append( '<span class="success"></span>' );
                }
                $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
            });

                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });

                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });

                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;
                    switch ( index ) {
                        case 0:
                            uploader.removeFile( file );
                            return;
                    }
                });

                $li.appendTo( $queue );
            }

        // 负责view的销毁
        function removeFile( file ) {
            var $li = $('#'+file.id);
            $li.off().find('.file-panel').off().end().remove();
        }
        function updateStatus() {
            var text = '', stats;
            if ( state === 'ready' ) {
                text = '选中' + fileCount + '张图片，共' +
                        WebUploader.formatSize( fileSize ) + '。';
                        if(!trueOrFalse) {
                            uploader.upload();
                            $upload.hide();
                        }        
            } else if ( state === 'confirm' ) {
                stats = uploader.getStats();
                if(!trueOrFalse) {
                    uploader.stop();
                    $upload.hide();
                }   
                if ( stats.uploadFailNum ) {
                    text = '已成功上传' + stats.successNum+ '张照片至XX相册，'+
                        stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                }
            } else {
                stats = uploader.getStats();
                text = '共' + fileCount + '张（' +
                        WebUploader.formatSize( fileSize )  +
                        '），已上传' + stats.successNum + '张';

                if ( stats.uploadFailNum ) {
                    text += '，失败' + stats.uploadFailNum + '张';
                } 
            }
            $info.html( text );
            // if(!trueOrFalse) {
            //     if ( state === 'ready' ) {
            //         uploader.upload();
            //     } else if ( state === 'paused' ) {
            //         uploader.upload();
            //     } else if ( state === 'uploading' ) {
            //         uploader.stop();
            //     }
            //     $(".uploadBtn").hide()
            // }
        }
    
        function setState( val ) {
            var file, stats;
            if ( val === state ) {
                return;
            }
            $upload.removeClass( 'state-' + state );
            $upload.addClass( 'state-' + val );
            state = val;
            var ifFlag = true;
            uploader.on("uploadAccept", function( file, data){
                if(imgSrc && imgSrc.length) {
                    for(var i =0;i <imgSrc.length; i++) {
                        if(data.url != imgSrc[i]) {
                            imgSrc.push(data.url)
                        }
                    }
                }else {
                    imgSrc.push(data.url)
                }    
            });
            var result = [],
                len = imgSrc.length;
            for(i = 0; i < len; i++){
                for(j = i + 1; j < len; j++){
                if(imgSrc[i] === imgSrc[j]){
                        j = ++i;
                    }
                }
                if(!trueOrFalse) {
                    result.push(imgSrc[len - 1]);
                }else {
                    result.push(imgSrc[i]);
                }
            } 
            var rlen = result.length,
                lilen = $queue.find('.state-complete').length;
            if(result && rlen) {
                if(rlen > lilen) {
                    var star = rlen- lilen,
                        resArr = result.slice(star,rlen);
                        for(var j = 0;j < resArr.length; j++) {
                            $queue.find(".state-complete p img").each(function(i) {
                                $(this).attr('src',resArr[i])
                            }) 
                        }
                }else {
                    for(var j = 0;j < result.length; j++) {
                        $queue.find(".state-complete p img").each(function(i) {
                            $(this).attr('src',result[i])
                        }) 
                    }
                }
            }
            switch ( state ) {
                case 'pedding':
                    $placeHolder.removeClass( 'element-invisible' );
                    $queue.parent().removeClass('filled');
                    $queue.hide();
                    $statusBar.addClass( 'element-invisible' );
                    uploader.refresh();
                    break;

                case 'ready':
                    $placeHolder.addClass( 'element-invisible' );
                    if(trueOrFalse){
                        $(id+'2').removeClass( 'element-invisible');
                    }
                    $queue.parent().addClass('filled');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    uploader.refresh();
                    break;

                case 'uploading':
                    if(trueOrFalse){
                        $(id+'2').addClass( 'element-invisible' );
                    }
                    $upload.text( '暂停上传' );
                    break;

                case 'paused':
                    $upload.text( '继续上传' );
                    break;

                case 'confirm':
                    $upload.text( '开始上传' ).addClass( 'disabled' );
                    stats = uploader.getStats();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                        setState( 'finish' );
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if ( stats.successNum ) {
                        layer.msg("上传成功", {
                            icon: 1,
                            time: 3000
                        });
                    } else {
                        // 没有成功的图片，重设
                        state = 'done';
                        location.reload();
                    }
                    break;
            }
         updateStatus();
        }

        uploader.onUploadProgress = function( file, percentage ) {
            var $li = $('#'+file.id);
        };

        uploader.onFileQueued = function( file ) {
            fileCount++;
            fileSize += file.size;
            if ( fileCount === 1 ) {
                $placeHolder.addClass( 'element-invisible' );
                $statusBar.show();
            }
            addFile( file );
            setState( 'ready' );
        };
        uploader.onFileDequeued = function( file ) {
            fileCount--;
            fileSize -= file.size;

            if ( !fileCount ) {
                setState( 'pedding' );
            }

            removeFile( file );

        };

        uploader.on( 'all', function( type ) {
            var stats;
            switch( type ) {
                case 'uploadFinished':
                    setState( 'confirm' );
                    break;

                case 'startUpload':
                    setState( 'uploading' );
                    break;

                case 'stopUpload':
                    setState( 'paused' );
                    break;
            }
        });

        uploader.onError = function( code ) {
            layer.msg("请不要上传重复的图片", {
                icon: 2,
                time: 3000
            });
        };
        $upload.on('click', function() {
            if ( $(this).hasClass( 'disabled' ) ) {
                return false;
            }

            if ( state === 'ready' ) {
                uploader.upload();
            } else if ( state === 'paused' ) {
                uploader.upload();
            } else if ( state === 'uploading' ) {
                uploader.stop();
            }
        });    
  
        
        $info.on( 'click', '.retry', function() {
            uploader.retry();
        });

        $info.on( 'click', '.ignore', function() {
            alert( 'todo' );
        });

        $upload.addClass( 'state-' + state );
    },

    //重新制作弹窗
    //type 0/1 0是摧毁小程序，1是摧毁并重新制作
    reMarkPop: function(type,aid,cb) {
        layer.closeAll()
        var destroyModel = $('#destroyModelTpl').html();
        var self = this;
            layer.open({
                type: 1,
                title: '重新制作小程序', //不显示标题栏
                area: '470px;',
                shade: 0.3,
                move: false,
                id: 'LAY_reMark', //设定一个id，防止重复弹出
                resize: false,
                btnAlign: 'c',
                btn: ['提交','取消'],
                moveType: 1, //拖拽模式，0或者1
                content: destroyModel,
                success: function(layero, index) {},
                btn1: function(index) {
                    self.reMakeFun(index,aid,cb);
                },
                btn2: function(index) {
                    layer.closeAll('loading')
                    layer.close(index);
                }
            })
    },
    //重新制作api
    reMakeFun:function (index,aid,cb) {
        if(!$("#appidVal").val()) {
            layer.msg('请输入登录密码', {
                icon: 2,
                time: 2000
            });
            return;
        }
        layer.load(0, {shade: false});
        var self = this,
            url = '/console/center/del?appInfoId='+ aid ;
        ND.ajax({
            url: url,
            params: {token: $("#appidVal").val()},
            success: function (data) {
                layer.closeAll('loading')
                if(data.errCode == 0) {
                    layer.msg('操作成功', {
                        icon: 1,
                        time: 2000
                    });
                    if(cb && typeof cb === 'function'){
                        cb();
                    } else {
                        window.location.href = data.url;
                    }
                    layer.close(index)
                }else {
                    layer.msg(data.errMsg, {
                        icon: 2,
                        time: 2000
                    });
                }
            },
            error:function(data){
                layer.closeAll('loading')
                layer.msg(data.errMsg || '网络异常', {
                    icon: 2,
                    time: 2000
                });
            }
        })

    },
}
