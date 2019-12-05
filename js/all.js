var all = {
  serverUrl: '',
  onoff: true,
  timer: function () {
    this.second = 60;
  },
  time: function (o, t) {
    if (t.second == 0) {
      o.prop('disabled', false);
      o.html('获取验证码');
      t.second = 60;
    } else {
      o.prop('disabled', true);
      o.html(t.second + '秒后重发');
      t.second--;
      setTimeout(function () {
        all.time(o, t);
      }, 1000);
    }
  },
  GetQueryString: function (key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
  },
  addnum: function (e) {
    var num = e.html();
    if (num.match(/^\d+$/)) {
      e.html(Number(num) + 1);
    }
  },
  subnum: function (e) {
    var num = e.html();
    if (num.match(/^\d+$/) && num >= 1) {
      e.html(Number(num) - 1);
    }
  },
  alertmessage: function (text) {
    if ($('.my-alert').length == 0) {
      $('body').prepend('<p class="my-alert"><button class="my-alert-btn"></button></p>');
    }
    $('.my-alert').show().find('.my-alert-btn').html(text);
    var alert = setTimeout(function () {
      $('.my-alert').hide();
    }, 2000);
    $('.my-alert-btn').click(function () {
      $('.my-alert').hide();
      clearTimeout(alert);
      return false;
    });
  },
  download: function () {
    var u = navigator.userAgent;
    if (u.indexOf('MicroMessenger') > -1) {
      if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        window.location.href = 'hgtk://';
        window.setTimeout(function () {
          window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.heiguang.meitu&fromcase=40002&from=singlemessage';//安卓下载地址
        }, 500);
      } else {
        if ($('.browser').length == 0) {
          $('body').prepend('<div class="browser"></div>');
          $('.browser').click(function () {
            $(this).fadeOut('fast');
          });
        }
        $('.browser').fadeIn('fast');
      }
    } else {
      if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        window.location.href = 'hgtk://';
        window.setTimeout(function () {
          window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.heiguang.meitu&fromcase=40002&from=singlemessage';//安卓下载地址
        }, 500);
      } else {
        window.location.href = 'hgtk://';
        window.setTimeout(function () {
          window.location.href = 'https://itunes.apple.com/cn/app/%E9%BB%91%E5%85%89%E5%9B%BE%E5%BA%93/id1006566548?mt=8';//苹果下载地址
        }, 500);
      }
    }
  },
  setCookie: function (name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
  },
  getCookie: function (name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  delCookie: function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
  },
  lockBtn: function (ele) {
    if (typeof (ele) == 'undefined') {
      ele = $(this);
    }
    ele.prop('disabled', true);
    window.setTimeout(function () {
      ele.prop('disabled', false);
    }, 500);
  }
};
$(function () {
  (function () {
    $('html').css('font-size', $(window).width() / 375 * 100 + 'px');
    $(window).resize(function () {
      $('html').css('font-size', $(window).width() / 375 * 100 + 'px');
    });
    $.ajaxSetup({
      datatype: 'json',
      beforeSend: function () {
        all.onoff = false;
      },
      complete: function () {
        window.setTimeout(function () {
          all.onoff = true;
        }, 500);
      },
      error: function (e) {
        if (e.status == 429) {
          all.alertmessage('操作过于频繁，请稍后重试');
        } else {
          all.alertmessage('系统繁忙，请稍后重试');
        }
      }
    });
  })();
  //backpwd.html
  if ($('[class^=backpwd]').length > 0) {
    (function () {
      $('.my-title-back').click(function () {
        if ($('#phone').is(':hidden')) {
          $('.backpwd-mode-1').show();
          $('.backpwd-mode-2').hide();
        } else {
          window.location.href = 'login';
        }
      });
      $('#phone,#code').bind('input propertychange', function () {
        var phone = $('#phone').val();
        var code = $('#code').val();
        if (phone.length > 0 && code.length > 0) {
          $('#stepone').addClass('active');
        } else {
          $('#stepone').removeClass('active');
        }
      });
      $('#password').bind('input propertychange', function () {
        var password = $('#password').val();
        if (password.length > 0) {
          $('#steptwo').addClass('active');
        } else {
          $('#steptwo').removeClass('active');
        }
      });
      $('.backpwd-form-show').click(function () {
        if ($('#password').attr('type') == 'password') {
          $('#password').attr('type', 'text');
        } else {
          $('#password').attr('type', 'password');
        }
        return false;
      });
      $('.backpwd-form-code').click(function () {
        if ($(this).html() == '获取验证码') {
          var phone = $('#phone').val();
          if (phone.match(/^(1)\d{10}$/)) {
            var self = $(this);
            $.ajax({
              type: 'post',
              url: all.serverUrl + '/m/default/sms-code',
              data: {mobile: phone},
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  all.alertmessage('验证码发送成功');
                  all.time(self, new all.timer());
                } else if (data.code == 400) {
                  all.alertmessage(data.msg);
                }
              }
            });
          } else {
            all.alertmessage('手机号不正确');
          }
        }
        return false;
      });
      $('#stepone').click(function () {
        if (all.onoff) {
          if ($(this).is('.active')) {
            var phone = $.trim($('#phone').val());
            var code = $.trim($('#code').val());
            if (!phone.match(/^(1)\d{10}$/)) {
              all.alertmessage('手机号不正确');
            } else if (code == '') {
              all.alertmessage('请输入验证码');
            } else {
              $.ajax({
                type: 'post',
                url: all.serverUrl + '/m/site/forgot-password',
                data: {account: phone, code: code},
                datatype: 'json',
                success: function (data) {
                  if (data.code == 200) {
                    $('.backpwd-mode-1').hide();
                    $('.backpwd-mode-2').show();
                  } else {
                    all.alertmessage(data.msg);
                  }
                }
              });
            }
          }
        }
        return false;
      });
      $('#steptwo').click(function () {
        if (all.onoff) {
          if ($(this).is('.active')) {
            var phone = $.trim($('#phone').val());
            var password = $.trim($('#password').val());
            if (password == '') {
              all.alertmessage('请输入密码');
            } else {
              $.ajax({
                type: 'post',
                url: all.serverUrl + 'reset-password',
                data: {password: password},
                datatype: 'json',
                success: function (data) {
                  if (data.code == 200) {
                    all.alertmessage('修改密码成功');
                    setTimeout(function () {
                      window.location.href = data.data.rurl;
                    }, 1000);
                  } else {
                    all.alertmessage(data.msg);
                  }
                }
              });
            }
          }
        }
        return false;
      });
    })();
  }
  //daren.html
  if ($('[class^=daren]').length > 0) {
    (function () {
      if (result == 1) {
        all.alertmessage('资料修改成功');
      }
      $('.my-app-btn').click(all.download);
      //2018-5-21
      $('.daren-num-num:gt(0),.daren-num-name:gt(0)').click(all.download);
      $('.daren-info-focus').click(all.download);
      //2018-5-21
      $('.daren-info-logout').click(function () {
        if (all.onoff) {
          $.ajax({
            type: 'post',
            url: all.serverUrl + '/m/site/logout',
            data: {},
            datatype: 'json',
            success: function (data) {
              if (data.code == 200) {
                window.location.href = all.serverUrl + '/m/';
              } else if (data.code == 400) {
                all.alertmessage(data.msg);
              }
            }
          });
        }
      });
      var mescroll = new MeScroll('body', {
        down: {
          use: false
        },
        up: {
          callback: getListData,
          isBounce: false,
          clearEmptyId: 'dataList',
          page: {size: 6},
          toTop: {
            src: '/static/m/images/mescroll-totop.png'
          },
          htmlNodata: '<p class="upwarp-nodata">没有更多数据</p>',
          offset: 100
        }
      });
      function getListData(page) {
        getListDataFromNet(page.num, function (curPageData) {
          mescroll.endSuccess(curPageData.length);
          setListData(curPageData);
        }, function () {
          mescroll.endErr();
        });
      }
      function setListData(curPageData) {
        var html = '';
        for (var i = 0; i < curPageData.length; i++) {
          var pd = curPageData[i];
          html += '<a href="' + pd.url + '"><img class="lazy" data-original="' + pd.cover + '" /></a>';
        }
        html = $(html);
        $('#dataList').append(html);
        html.find('.lazy').lazyload({effect: 'fadeIn'});
      }
      function getListDataFromNet(pageNum, successCallback, errorCallback) {
        $.ajax({
          type: 'get',
          url: all.serverUrl + '/m/user/works?page=' + pageNum + '&id=' + id,
          datatype: 'json',
          success: function (data) {
            successCallback(data.data.list);
          },
          error: errorCallback
        });
      }
    })();
  }
  //index.html
  if ($('[class^=index]').length > 0) {
    (function () {
      var swiper1 = new Swiper('.index-banner', {
        speed: 1000,
        //2015-5-21
        loop: true,
        autoplay: {
          delay: 2000
        }
      });
      var swiper2 = new Swiper('.index-types', {
        slidesPerView: 3,
        slidesPerGroup: 3,
        slidesPerColumn: 2,
        //2015-5-22
        spaceBetween: 10,
        watchOverflow: true,
        //2015-5-22
        observer: true,
        observeParents: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        //2015-5-22
        on: {
          init: function () {
            $('.index-types').show();
          }
        }
      });
      $('.my-app-btn').click(all.download);
      $(window).scroll(function () {
        var h = $(this).scrollTop();
        if (h > 0) {
          $('.my-app').slideUp();
        } else {
          $('.my-app').slideDown('fast');
        }
      });
      var mescroll = new MeScroll('body', {
        down: {
          use: false
        },
        up: {
          callback: getListData,
          isBounce: false,
          clearEmptyId: 'dataList',
          page: {size: 4},
          toTop: {
            src: '/static/m/images/mescroll-totop.png'
          },
          htmlNodata: '<p class="upwarp-nodata">没有更多数据</p>',
          offset: 100
        }
      });
      function getListData(page) {
        getListDataFromNet(page.num, function (curPageData) {
          mescroll.endSuccess(curPageData.length);
          setListData(curPageData);
        }, function () {
          mescroll.endErr();
        });
      }
      function setListData(curPageData) {
        var html = '';
        for (var i = 0; i < curPageData.length; i++) {
          var pd = curPageData[i];
          html += '<li><a href="' + pd.url + '"><img class="index-list-img lazy" data-original="' + pd.cover + '" /></a>';
          html += '<p class="index-list-title">' + pd.title + '</p>';
          html += '<div class="index-list-cnt">';
          html += '<span class="index-list-author">' + pd.vusername + '</span>';
          html += '<span class="index-list-num">' + pd.like_num + '</span>';
          html += '</div></li>';
        }
        html = $(html);
        $('#dataList').append(html);
        html.find('.lazy').lazyload({effect: 'fadeIn'});
      }
      function getListDataFromNet(pageNum, successCallback, errorCallback) {
        $.ajax({
          type: "get",
          url: all.serverUrl + '/m/works/heat-view?page=' + pageNum,
          datatype: "json",
          success: function (data) {
            if (data.code == 200) {
              successCallback(data.data.list);
            } else if (data.code == 400) {
              all.alertmessage(data.msg);
            }
          },
          error: errorCallback
        });
      }
    })();
  }
  //login.html
  if ($('[class^=login]').length > 0) {
    (function () {
      $('.my-title-back').click(function () {
        window.history.go(-1);
      });
    })();
    (function () {
      $('.login-mode').click(function () {
        var text = $(this).text();
        if (text == '验证码登录') {
          $(this).html('密码登录');
          $('.login-mode-name').hide();
          $('.login-mode-phone').show();
        } else {
          $(this).html('验证码登录');
          $('.login-mode-name').show();
          $('.login-mode-phone').hide();
        }
      });
      $('#username,#password').bind('input propertychange', function () {
        var username = $('#username').val();
        var password = $('#password').val();
        if (username.length > 0 && password.length > 0) {
          $('#namebtn').addClass('active');
        } else {
          $('#namebtn').removeClass('active');
        }
      });
      $('#phone,#code').bind('input propertychange', function () {
        var phone = $('#phone').val();
        var code = $('#code').val();
        if (phone.length > 0 && code.length > 0) {
          $('#phonebtn').addClass('active');
        } else {
          $('#phonebtn').removeClass('active');
        }
      });
      $('.login-form-code').click(function () {
        if ($(this).html() == '获取验证码') {
          var phone = $('#phone').val();
          if (phone.match(/^(1)\d{10}$/)) {
            var self = $(this);
            $.ajax({
              type: 'post',
              url: all.serverUrl + '/m/site/sms-code',
              data: {mobile: phone},
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  all.alertmessage('验证码发送成功');
                  all.time(self, new all.timer());
                } else if (data.code == 400) {
                  all.alertmessage(data.msg);
                }
              }
            });
          } else {
            all.alertmessage('手机号不正确');
          }
        }
        return false;
      });
      $('#namebtn').click(function () {
        if (all.onoff) {
          if ($(this).is('.active')) {
            var username = $.trim($('#username').val());
            var password = $.trim($('#password').val());
            if (username == '') {
              all.alertmessage('请输入账号');
            } else if (password == '') {
              all.alertmessage('请输入密码');
            } else {
              $.ajax({
                type: 'post',
                url: all.serverUrl + '/m/site/login',
                data: {username: username, password: password},
                datatype: 'json',
                success: function (data) {
                  if (data.code == 200) {
                    window.location.href = data.data.rurl;
                  } else if (data.code == 400) {
                    all.alertmessage(data.msg);
                  }
                }
              });
            }
          }
        }
        return false;
      });
      $('#phonebtn').click(function () {
        if (all.onoff && $(this).is('.active')) {
          var phone = $.trim($('#phone').val());
          var code = $.trim($('#code').val());
          if (!phone.match(/^(1)\d{10}$/)) {
            all.alertmessage('手机号不正确');
          } else if (code == '') {
            all.alertmessage('请输入验证码');
          } else {
            var siteurl = '/m/site/mobile-login';
            var data = {'mobile': phone, 'verify': code};
            if ($('#bind-phone').length > 0) {
              siteurl = '/site/bind-third-party';
              data = {'mobile': phone, 'code': code};
            }
            $.ajax({
              type: 'post',
              url: all.serverUrl + siteurl,
              data: data,
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  window.location.href = data.data.rurl;
                } else {
                  all.alertmessage(data.msg);
                }
              }
            });
          }
        }
        return false;
      });
    })();
  }
  //select.html
  if ($('[class^=select]').length > 0) {
    (function () {
      function goSubmit(e) {
        var word = $(e).html();
        $('.select-form-input').val(word);
        $('.select-form-clear').show();
        $('.select-form-form').submit();
      }
      //2018-5-22
      var words = all.getCookie('words');
      if (words && words.length > 0) {
        words = words.split(',').slice(-8);
        for (var i = 0; i < words.length; i++) {
          $('.select-history-list').prepend('<li>' + words[i] + '</li>').find('li:eq(0)').click(function () {
            goSubmit(this);
          })
        }
        $('.select-history-clear').show();
      } else {
        $('.select-history-clear').hide();
      }
      $('.select-form-cancel').click(function () {
        window.history.go(-1);
      });
      $('.select-form-input').bind('input propertychange', function () {
        var word = $(this).val();
        if (word.length > 0) {
          $('.select-form-clear').show();
        } else {
          $('.select-form-clear').hide();
        }
      }).focus(function () {
        $('.select-history,.select-hot').show();
        $('.result-nav,.result-cnt').hide();
        var words = all.getCookie('words');
        if (words && words.length > 0) {
          $('.select-history-clear').show();
        } else {
          $('.select-history-clear').hide();
        }
      });
      $('.select-form-clear').click(function () {
        $('.select-form-input').val('').focus();
        $(this).hide();
      });
      $('.select-hot-bd > li').click(function () {
        goSubmit(this);
      });
      $('.select-form-form').submit(function () {
        $('.select-form-input').blur();
        var word = $.trim($('.select-form-input').val());
        if (word.length > 0) {
          //2018-5-22
          var words = all.getCookie('words');
          if (words) {
            all.setCookie('words', words + ',' + word, 30);
          } else {
            all.setCookie('words', word, 30);
          }
          $('.select-history-list').prepend('<li>' + word + '</li>').find('li:eq(0)').click(function () {
            goSubmit(this);
          });
          $('.select-history-list > li:eq(8)').remove();
        }
        $('.select-history,.select-hot').hide();
        $('.result-nav,.result-cnt').show();
        $('.result-nav > span[i=0]').addClass('active').siblings().removeClass('active');
        $('.result-cnt ul').html('');
        curNavIndex = 0;
        if (mescrollArr[0] == null) {
          mescrollArr[0] = initMescroll('mescroll0', 'dataList0');
        } else {
          mescrollArr[0].resetUpScroll();
        }
        if (mescrollArr[1] != null) {
          mescrollArr[1].destroy();
          mescrollArr[1] = null;
        }
        if (mescrollArr[2] != null) {
          mescrollArr[2].destroy();
          mescrollArr[2] = null;
        }
        if (!swiper) {
          swiper = new Swiper('#swiper', {
            on: {
              transitionStart: function () {
                var i = swiper.activeIndex;
                changePage(i);
              }
            }
          });
          $('.result-nav > span').click(function () {
            var i = Number($(this).attr('i'));
            swiper.slideTo(i);
          });
        } else {
          swiper.slideTo(0);
        }
        return false;
      });
      $('.select-history-clear').click(function () {
        $('.select-confirm,.select-layer').fadeIn('fast');
      });
      $('.select-confirm-no').click(function () {
        $('.select-confirm,.select-layer').fadeOut('fast');
      });
      $('.select-confirm-yes').click(function () {
        //2018-5-22
        all.delCookie('words');
        $('.select-history-list').html('');
        $('.select-history-clear').hide();
        $('.select-confirm,.select-layer').fadeOut('fast');
      });
      var curNavIndex = 0;
      var mescrollArr = new Array(3);
      var swiper;
      function changePage(i) {
        if (curNavIndex != i) {
          $('.result-nav > span[i=' + i + ']').addClass('active').siblings().removeClass('active');
          mescrollArr[curNavIndex].hideTopBtn();
          if (mescrollArr[i] == null) {
            mescrollArr[i] = initMescroll('mescroll' + i, 'dataList' + i);
          } else {
            var curMescroll = mescrollArr[i];
            var curScrollTop = curMescroll.getScrollTop();
            if (curScrollTop >= curMescroll.optUp.toTop.offset) {
              curMescroll.showTopBtn();
            } else {
              curMescroll.hideTopBtn();
            }
          }
          curNavIndex = i;
        }
      }
      function initMescroll(mescrollId, clearEmptyId) {
        var mescroll = new MeScroll(mescrollId, {
          down: {
            use: false
          },
          up: {
            callback: getListData,
            isBounce: false,
            page: {size: 4},
            clearEmptyId: clearEmptyId,
            toTop: {
              src: '/static/m/images/mescroll-totop.png'
            },
            htmlNodata: '<p class="upwarp-nodata">没有更多数据</p>',
            offset: 100
          }
        });
        return mescroll;
      }
      function getListData(page) {
        getListDataFromNet(curNavIndex, page.num, function (pageData) {
          mescrollArr[curNavIndex].endSuccess(pageData.length);
          setListData(pageData, curNavIndex);
        }, function () {
          mescrollArr[curNavIndex].endErr();
        })
      }
      function setListData(curPageData, dataIndex) {
        var html = '';
        if (dataIndex == 0) {
          for (var i = 0; i < curPageData.length; i++) {
            var pd = curPageData[i];
            html += '<li><a href="' + pd.url + '"><img class="result-zuopin-img" src="' + pd.cover + '" /></a>';
            html += '<p class="result-zuopin-title">' + pd.title + '</p>';
            html += '<div class="result-zuopin-cnt' + (pd.user_info.authentication > 0 ? ' vip">' : '">');
            html += '<p class="result-zuopin-author">' + pd.vusername + '</p>';
            html += '<p class="result-zuopin-lovenum">';
            html += '<span class="result-zuopin-love' + (pd.islikes == 1 ? ' active' : '') + '" data-id="' + pd.id + '"></span>';
            html += '<span class="result-zuopin-num">' + pd.like_num + '</span>';
            html += '</p>';
            html += '<a href="' + pd.user_info.url + '"><img class="result-zuopin-head" src="' + pd.user_info.avatar + '" /></a>';
            html += '</div></li>';
          }
        } else if (dataIndex == 1) {
          for (var i = 0; i < curPageData.length; i++) {
            var pd = curPageData[i];
            html += '<li><a href="' + pd.url + '"><img class="result-daren-head" src="' + pd.avatar + '" /></a>';
            html += '<div class="result-daren-bd">';
            html += '<p class="result-daren-name">' + pd.nickname + '</p>';
            html += '<p class="result-daren-zhiye">' + pd.occupation_name + '&nbsp;&nbsp;/&nbsp;&nbsp;' + pd.location_address + '</p>';
            html += '<p class="result-daren-zuopin"><span>' + pd.worksNums + '</span> 作品集&nbsp;&nbsp;&nbsp;&nbsp;<span>' + pd.fanNums + '</span> 粉丝</p>';
            html += '<div class="result-daren-guanzhu' + (pd.ftype == 1 ? ' active1' : pd.ftype == 3 ? ' active2' : '') + '" data-id="' + pd.uid + '"></div>';
            html += '</div></li>';
          }
        } else if (dataIndex == 2) {
          for (var i = 0; i < curPageData.length; i++) {
            var pd = curPageData[i];
            html += '<li><a href="' + pd.url + '"><img class="result-jigou-head" src="' + pd.avatar + '" /></a>';
            html += '<div class="result-jigou-bd">';
            html += '<p class="result-jigou-name">' + pd.nickname + '</p>';
            html += '<p class="result-jigou-zuopin"><span>' + pd.worksNums + '</span> 作品集&nbsp;&nbsp;&nbsp;&nbsp;<span>' + pd.fanNums + '</span> 粉丝</p>';
            html += '<div class="result-jigou-guanzhu' + (pd.ftype == 1 ? ' active1' : pd.ftype == 3 ? ' active2' : '') + '" data-id="' + pd.uid + '"></div>';
            html += '</div></li>';
          }
        }
        $('#dataList' + dataIndex).append(html);
        $('.result-zuopin-love').click(function () {
          if (all.onoff) {
            var id = $(this).attr('data-id');
            var self = $(this);
            var num = self.next('.result-zuopin-num');
            $.ajax({
              type: 'post',
              url: all.serverUrl + '/m/like/add-works',
              data: {id: id},
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  if (data.data.status == 1) {
                    self.addClass('active');
                    all.addnum(num);
                  } else if (data.data.status == 0) {
                    self.removeClass('active');
                    all.subnum(num);
                  }
                } else if (data.code == 400) {
                  all.alertmessage(data.msg);
                }
              }
            });
          }
        });
        $('.result-daren-guanzhu').click(all.download);
        $('.result-jigou-guanzhu').click(all.download);
      }
      function getListDataFromNet(curNavIndex, pageNum, successCallback, errorCallback) {
        var word = $.trim($('.select-form-input').val());
        if (word.length > 0) {
          var url = '';
          if (curNavIndex == 0) {
            url = all.serverUrl + '/m/search/works';
          } else if (curNavIndex == 1) {
            url = all.serverUrl + '/m/search/talent';
          } else if (curNavIndex == 2) {
            url = all.serverUrl + '/m/search/organization';
          }
          var data = {wd: word, page: pageNum};
          $.ajax({
            type: 'post',
            url: url,
            data: data,
            datatype: 'json',
            success: function (data) {
              if (data.code == 200) {
                successCallback(data.data.list);
              } else if (data.code == 400) {
                all.alertmessage(data.msg);
              }
            },
            error: errorCallback
          });
        }
      }
    })();
  }
  //types.html
  if ($('[class^=types]').length > 0) {
    (function () {
      $('.my-title-back').click(function () {
        window.history.go(-1);
      });
      //导航菜单
      var mescrollArr = new Array(9);//每个菜单对应一个mescroll对象
      //当前菜单下标
      var curNavIndex = 0;
      //初始化首页
      mescrollArr[curNavIndex] = initMescroll(curNavIndex);
      /*初始化轮播*/
      var swiper = new Swiper('#swiper', {
        on: {
          transitionStart: function () {
            var i = swiper.activeIndex;//轮播切换完毕的事件
            changePage(i);
          }
        }
      });
      /*菜单点击事件*/
      $('.types-nav-ul > li').click(function () {
        var i = Number($(this).attr('i'));
        swiper.slideTo(i);//以轮播的方式切换列表
      });
      /*切换列表*/
      function changePage(i) {
        if (curNavIndex != i) {
          //更改列表条件
          var curNavDom;//当前菜单项
          $('.types-nav-ul > li').each(function (n, dom) {
            if (dom.getAttribute('i') == i) {
              dom.classList.add('active');
              curNavDom = dom;
            } else {
              dom.classList.remove('active');
            }
          });
          //菜单项居中动画
          var scrollxContent = document.getElementById('scrollxContent');
          var star = scrollxContent.scrollLeft;//当前位置
          var end = curNavDom.offsetLeft + curNavDom.clientWidth / 2 - document.body.clientWidth / 2; //居中
          mescrollArr[curNavIndex].getStep(star, end, function (step, timer) {
            scrollxContent.scrollLeft = step; //从当前位置逐渐移动到中间位置,默认时长300ms
          });
          //隐藏当前回到顶部按钮
          mescrollArr[curNavIndex].hideTopBtn();
          //取出菜单所对应的mescroll对象,如果未初始化则初始化
          if (mescrollArr[i] == null) {
            mescrollArr[i] = initMescroll(i);
          } else {
            //检查是否需要显示回到到顶按钮
            var curMescroll = mescrollArr[i];
            var curScrollTop = curMescroll.getScrollTop();
            if (curScrollTop >= curMescroll.optUp.toTop.offset) {
              curMescroll.showTopBtn();
            } else {
              curMescroll.hideTopBtn();
            }
          }
          //更新标记
          curNavIndex = i;
        }
      }
      /*创建MeScroll对象*/
      function initMescroll(index) {
        //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
        var mescroll = new MeScroll("mescroll" + index, {
          down: {
            use: false
          },
          //上拉加载的配置项
          up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            page: {size: 4},
            clearEmptyId: 'dataList' + index, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            toTop: { //配置回到顶部按钮
              src: '/static/m/images/mescroll-totop.png' //默认滚动到1000px显示,可配置offset修改
            },
            htmlNodata: '<p class="upwarp-nodata">没有更多数据</p>',
            offset: 100
          }
        });
        return mescroll;
      }
      /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
      function getListData(page) {
        //联网加载数据
        var dataIndex = curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
        getListDataFromNet(dataIndex, page.num, function (pageData) {
          mescrollArr[dataIndex].endSuccess(pageData.length);
          setListData(pageData, dataIndex);
        }, function () {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescrollArr[dataIndex].endErr();
        });
      }
      // 匹配不同时间段的值
      function getDateDiff(dateTimeStamp) {
        var minute = 60;
        var hour = minute * 60;
        var day = hour * 24;
        var month = day * 30;
        var now = new Date().getTime() / 1000;
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
          return;
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
          result = "" + parseInt(monthC) + "月前";
        } else if (weekC >= 1) {
          result = "" + parseInt(weekC) + "周前";
        } else if (dayC >= 1) {
          result = "" + parseInt(dayC) + "天前";
        } else if (hourC >= 1) {
          result = "" + parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
          result = "" + parseInt(minC) + "分钟前";
        } else
          result = "刚刚";
        return result;
      }
      /*设置列表数据
       * pageData 当前页的数据
       * dataIndex 数据属于哪个nav */
      function setListData(curPageData, dataIndex) {
        var html = '';
        for (var i = 0; i < curPageData.length; i++) {
          var pd = curPageData[i];
          if ($('.types-article').length > 0) {
            // 文章列表
            html += '<li>';
            html += '<p class="types-article-author"><a href="' + pd.user_info.url + '"><img class="types-article-head" src="' + pd.user_info.avatar + '" /></a>' + pd.vusername + '</p>';
            html += '<a class="types-article-cnt' + (pd.user_info.authentication > 0 ? ' vip' : '') + '" href="' + pd.url + '">';
            html += '<p class="types-article-info"><span class="types-article-title">' + pd.title + '</span>';
            html += '<span>' + pd.title + '</span></p>';
            html += '<p class="types-article-img">';
            html += '<img class="types-article-img" src="' + pd.cover + '" />';
            html += '<span class="types-article-time">' + getDateDiff(pd.add_time) + '</span>';
            html += '<span class="types-article-view">' + pd.view_num + '</span>';
            html += '</p>';
            html += '</a></li>';
          } else {
            // 图片列表
            html += '<li>';
            if (pd.app_work_corner_mark && pd.app_work_corner_mark != '') {
              html += '<img class="types-mark" src="' + pd.app_work_corner_mark + '" />';
            }
            html += '<a href="' + pd.url + '"><img class="types-zuopin-img" src="' + pd.cover + '" /></a>';
            html += '<p class="types-zuopin-title">' + pd.title + '</p>';
            html += '<div class="types-zuopin-cnt' + (pd.user_info.authentication > 0 ? ' vip">' : '">');
            html += '<p class="types-zuopin-author">' + pd.vusername + '</p>';
            html += '<p class="types-zuopin-lovenum">';
            html += '<span class="types-zuopin-love' + (pd.islikes == 1 ? ' active' : '') + '" data-id="' + pd.id + '"></span>';
            html += '<span class="types-zuopin-num">' + pd.like_num + '</span>';
            html += '</p>';
            html += '<a href="' + pd.user_info.url + '"><img class="types-zuopin-head" src="' + pd.user_info.avatar + '" /></a>';
            html += '</div></li>';
          }
        }
        $('#dataList' + dataIndex).append(html);
        $('.types-zuopin-love').click(function () {
          if (all.onoff) {
            var id = $(this).attr('data-id');
            var self = $(this);
            var num = self.next('.types-zuopin-num');
            $.ajax({
              type: 'post',
              url: all.serverUrl + '/m/like/add-works',
              data: {id: id},
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  if (data.data.status == 1) {
                    self.addClass('active');
                    all.addnum(num);
                  } else if (data.data.status == 0) {
                    self.removeClass('active');
                    all.subnum(num);
                  }
                } else if (data.code == 400) {
                  all.alertmessage(data.msg);
                }
              },
              error: function () {
              }
            });
          }
        });
      }
      /*联网加载列表数据
       在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
       请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
       实际项目以您服务器接口返回的数据为准,无需本地处理分页.
       * */
      // types-article
      var posturl = '/m/works/index';
      if($('.types-article').length > 0) {
        posturl = 'http://localhost/api/works-list';
      }
      function getListDataFromNet(curNavIndex, pageNum, successCallback, errorCallback) {
        var tag = $('.types-nav-ul > li[i=' + curNavIndex + ']').text();
        if (curNavIndex == 0) {
          tag = '';
        }
        $.ajax({
          type: 'get',
          url: all.serverUrl + posturl + '?category_id=' + id + '&tag=' + tag + '&page=' + pageNum,
          datatype: 'json',
          success: function (data) {
            successCallback(data.data.list);
          },
          error: errorCallback
        });
      }
    })();
  }
  //ziliao.html
  if ($('[class^=ziliao]').length > 0) {
    (function () {
      $('.my-title-back').click(function () {
        window.history.go(-1);
      });
    })();
  }
  //ziliaoedit.html
  if ($('[class^=ziliaoedit]').length > 0) {
    (function () {
      $('.my-title-back').click(function () {
        if ($('.ziliaoedit-cnt-area').is(':hidden')) {
          window.history.go(-1);
        } else {
          $('.ziliaoedit-img,.ziliaoedit-cnt').show();
          $('.ziliaoedit-cnt-area').hide();
          $('.ziliaoedit-title-submit').html('保存');
        }
      });
      $('.ziliaoedit-title-submit').click(function () {
        if ($('.ziliaoedit-cnt-area').is(':hidden')) {
          $('#form1').submit();
        } else {
          $('.ziliaoedit-img,.ziliaoedit-cnt').show();
          $('.ziliaoedit-cnt-area').hide();
          $('.ziliaoedit-title-submit').html('保存');
          $('#jieshaoSelect').html($('.ziliaoedit-cnt-area').val());
        }
      });
      $('.ziliaoedit-img-img').click(function () {
        $('.ziliaoedit-img-file').click();
      });
      $('.ziliaoedit-img-file').change(function () {
        // var file = $(this)[0].files[0];
        $.ajax({
          type: 'post',
          url: all.serverUrl + '/m/setting/avatar',
          data: new FormData($('#fileForm')[0]),
          processData: false,
          contentType: false,
          datatype: 'json',
          success: function (data) {
            if (data.code == 200) {
              $('.ziliaoedit-img-img').attr('src', data.data.avatar_url);
            } else {
              all.alertmessage(data.msg);
            }
          },
          error: function () {
            all.alertmessage('系统繁忙，请稍后重试');
          }
        });
      });
      var sexData = [{id: 1, value: '男'}, {id: 2, value: '女'}];
      //var zhiyeData = [{ id: 1, value: '摄影师' }, { id: 2, value: '化妆师' }, { id: 3, value: '数码师' }, { id: 4, value: '设计师' }, { id: 5, value: '模特' }, { id: 6, value: '儿童引导师' }, { id: 7, value: '礼服师' }, { id: 8, value: '门市销售' }, { id: 9, value: '经营管理' }, { id: 10, value: '文案策划' }, { id: 11, value: '其他' }];
      var cityData = [];
      for (var i in DISTRICTS['100000']) {
        var province = {};
        province.id = i;
        province.value = DISTRICTS['100000'][i];
        province.childs = [];
        for (var j in DISTRICTS[i]) {
          var city = {};
          city.id = j;
          city.value = DISTRICTS[i][j];
          province.childs.push(city);
        }
        cityData.push(province);
      }
      if ($('#sexSelect').length > 0) {
        var sexSelect = new MobileSelect({
          trigger: '#sexSelect',
          title: '选择性别',
          wheels: [{data: sexData}],
          callback: function (indexArr, data) {
            var sex = data[0].id;
            $('#sex').val(sex);
          }
        });
      }
      if ($('#zhiyeSelect').length > 0) {
        var zhiyeSelect = new MobileSelect({
          trigger: '#zhiyeSelect',
          title: '选择职业',
          wheels: [{data: zhiyeData}],
          callback: function (indexArr, data) {
            var zhiye = data[0].id;
            $('#zhiye').val(zhiye);
            $("#zhiye").trigger('input');
          }
        });
      }
      if ($('#citySelect').length > 0) {
        var citySelect = new MobileSelect({
          trigger: '#citySelect',
          title: '选择地区',
          wheels: [{data: cityData}],
          callback: function (indexArr, data) {
            var province = data[0].id;
            var city = data[1].id;
            $('#province').val(province);
            $('#city').val(city);
            $('#location').val(province+'-'+city);
            $("#location").trigger('input');
          }
        });
      }
      $('#jieshaoSelect').click(function () {
        $('.ziliaoedit-img,.ziliaoedit-cnt').hide();
        $('.ziliaoedit-cnt-area').show().focus();
        $('.ziliaoedit-title-submit').html('确定');
      });
      $('#nick,#location,#zhiye').bind('input propertychange', function () {
        var nick = $('#nick').val();
        var location = $('#location').val();
        var zhiye = $('#zhiye').val();
        if (nick.length > 0 && location.length > 0 && zhiye.length > 0) {
          $('#infobtn').addClass('active');
        } else {
          $('#infobtn').removeClass('active');
        }
      });
      $('#form1').submit(function () {
        if (all.onoff) {
          var nick = $.trim($('#nick').val());
          var sex = $.trim($('#sex').val());
          var province = $.trim($('#province').val());
          var city = $.trim($('#city').val());
          var zhiye = $.trim($('#zhiye').val());
          if (nick == '') {
            all.alertmessage('请填写昵称');
          } else if (sex == '') {
            all.alertmessage('请选择性别');
          } else if (province == '') {
            all.alertmessage('请选择地区');
          } else if (city == '') {
            all.alertmessage('请选择地区');
          } else if (zhiye == '') {
            all.alertmessage('请选择职业');
          } else {
            $.ajax({
              type: 'post',
              url: all.serverUrl + '/m/setting/info',
              data: $('#form1').serialize(),
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  all.alertmessage('资料修改成功');
                  window.setTimeout(function () {
                    window.location.href = data.data.url;
                  }, 1000)
                } else if (data.code == 400) {
                  all.alertmessage(data.msg);
                }
              }
            });
          }
        }
        return false;
      });
      $('#form2').submit(function () {
        if (all.onoff && $('#infobtn').is('.active')) {
          var nick = $.trim($('#nick').val());
          var location = $.trim($('#location').val());
          var zhiye = $.trim($('#zhiye').val());
          if (nick == '') {
            all.alertmessage('请填写昵称');
          } else if (location == '') {
            all.alertmessage('请选择地区');
          } else if (zhiye == '') {
            all.alertmessage('请选择职业');
          } else {
            $.ajax({
              type: 'post',
              url: all.serverUrl + '/setting/fill-info',
              data: $('#form2').serialize(),
              datatype: 'json',
              success: function (data) {
                if (data.code == 200) {
                  all.alertmessage('资料修改成功');
                  window.setTimeout(function () {
                    window.location.href = data.data.rurl;
                  }, 1000)
                } else if (data.code == 400) {
                  all.alertmessage(data.msg);
                }
              }
            });
          }
        }
        return false;
      });
    })();
  }
  //zuopin.html
  if ($('[class^=zuopin]').length > 0) {
    (function () {
      $('.zuopin-head-app,.zuopin-focus-join,.zuopin-foot-join,.zuopin-piao-cha').click(all.download);
      $('.zuopin-love-circle').click(function () {
        if (all.onoff) {
          var num = $('.zuopin-love-num').find('span');
          $.ajax({
            type: 'post',
            url: all.serverUrl + '/m/like/add-works',
            data: {id: id},
            datatype: 'json',
            success: function (data) {
              if (data.code == 200) {
                if (data.data.status == 1) {
                  $('.zuopin-love-img').addClass('active');
                  all.addnum(num);
                } else if (data.data.status == 0) {
                  $('.zuopin-love-img').removeClass('active');
                  all.subnum(num);
                }
              } else if (data.code == 400) {
                all.alertmessage(data.msg);
              }
            }
          });
        }
      });
      $('img').lazyload({effect: 'fadeIn'});
    })();
  }
  //login-auth
  if ($('[class^=login-auth]').length > 0) {
    if (data.code == 200) {
      all.alertmessage('登录成功');
      window.location.href = data.data.rurl;
    } else {
      all.alertmessage(data.msg);
      window.setTimeout(function () {
        window.location.href = data.data.rurl;
      }, 2000);
    }
  }
  //shijia.html
  if ($('[class^=shijia]').length > 0) {
    (function () {
      function initMeScroll(warpid, clearemptyid) {
        var mescroll = new MeScroll('body', {
          down: {
            use: false
          },
          up: {
            callback: getListData,
            page: {size: 4},
            clearEmptyId: clearemptyid,
            toTop: {
              src: '/static/m/images/mescroll-totop.png',
              offset: 1000
            },
            htmlNodata: '<p class="upwarp-nodata">没有更多数据</p>',
            offset: 100,
            loadFull: {
              use: true,
              delay: 500
            },
          }
        });
        return mescroll;
      }
      var mescrolls = null;
      switch (curNavIndex) {
        case 1:
          mescrolls = initMeScroll('huojiang', 'huojiang-list');
          break;
        case 2:
          mescrolls = initMeScroll('ruwei', 'ruwei-list');
          break;
        case 3:
          mescrolls = initMeScroll('shijia', 'shijia-list');
          break;
      }
      var nav = $('.shijia-nav');
      var startPos = nav.offset().top;
      $.event.add(window, "scroll", function () {
        var p = $(window).scrollTop();
        nav.css('position', ((p) > startPos) ? 'fixed' : 'relative');
      });
      function getListDataFromNet(curNavIndex, pageNum, successCallback, errorCallback) {
        var url = curNavUrl + pageNum;
        $.ajax({
          type: 'post',
          url: url,
          datatype: 'json',
          success: function (data) {
            console.log(typeof data);
            console.log(data.code);
            if (data.code == 200) {
              successCallback(data.data.list);
            } else if (data.code == 400) {
              all.alertmessage(data.msg);
            }
          },
          error: errorCallback
        });
      }
      function getListData(page) {
        console.log(page);
        getListDataFromNet(curNavIndex, page.num, function (pageData) {
          mescrolls.endSuccess(pageData.length);
          setListData(pageData, curNavIndex);
        }, function () {
          mescrolls.endErr();
        })
      }
      function setListData(curPageData, dataIndex) {
        var html = '';
        switch (dataIndex) {
          case 1:
            for (var i = 0; i < curPageData.length; i++) {
              var pd = curPageData[i];
              html += '<li>';
              html += '<p class="huojiang-no"><span>TOP ' + pd.rank + '</span></p>';
              html += '<img src="' + pd.cover + '" />';
              html += '<div class="huojiang-div">';
              html += '<img src="' + pd.user_info.avatar + '" />';
              html += '<div>';
              html += '<p><span>' + pd.title + '</span></p>';
              html += '<p><span class="huojiang-name">' + pd.vusername + '</span><span>' + pd.vote_num + '票</span></p>';
              html += '</div>';
              html += '</div>';
              html += '</li>';
            }
            $('#huojiang-list').append(html);
            break;
          case 2:
            for (var i = 0; i < curPageData.length; i++) {
              var pd = curPageData[i];
              html += '<li>';
              html += '<img src="' + pd.cover + '" />';
              html += '<div class="ruwei-div">';
              html += '<img src="' + pd.user_info.avatar + '" />';
              html += '<div>';
              html += '<p><span>' + pd.title + '</span><span class="ruwei-no">排名' + pd.rank + '</span></p>';
              html += '<p><span class="ruwei-name">' + pd.vusername + '</span><span>' + pd.vote_num + '票</span></p>';
              html += '</div>';
              html += '</div>';
              if (!$('.shijia-coming').length && pd.step == 1) {
                html += '<div class="ruwei-tou">投票</div>';
              }
              html += '</li>';
            }
            $('#ruwei-list').append(html);
            $('.ruwei-tou').click(all.download);
            break;
          case 3:
            console.log(curPageData);
            for (var i = 0; i < curPageData.length; i++) {
              var pd = curPageData[i];
              html += '<li>';
              html += '<a class="shijia-img" href="' + pd.url + '"><img src="' + pd.cover + '" /></a>';
              html += '<div class="shijia-div' + (pd.user_info.authentication > 0 ? ' vip">' : '">');
              html += '<img src="' + pd.user_info.avatar + '" />';
              html += '<p>' + pd.title + '</p>';
              html += '<p>' + pd.vusername + '</p>';
              html += '</div>';
              html += '</li>';
            }
            $('#shijia-list').append(html);
            break;
        }
      }
      $('#shijia-submit').click(all.download);
    })();
  }
})

