var PC = (function (ns, $) {
    ns.init = function () {
        // scroll fixed element
        ns.layout.init();

        ns.layerPopup.init();

        // check input
        ns.formEvent.init();

        //calendar js
        ns.calendar.init();

        //calendarS-E js
        ns.calendarS.init();
        ns.calendarE.init();

        //gnb event
        ns.gnbAniEvent.init();

        ns.menuLocEvent.init();

        //lnb event (IE 10 이상 적용 )
        ns.snbAniEvent.init();

        //footer
        ns.footer.init();

        //slide banner
        ns.slideBanner.init();

        //tabScript
        $('[class*=tabType]').tabJs();
        $('.tabMulti').tabJs();

        //slideTabJs
        $('.tabWrap .tabType04.multi').parent().slideTabJs({
            targetWrap: '.tabWrap',
            prevBtn: '.prev',
            nextBtn: '.next'
        });

        //draw pie chart
        $('.circle_graph').aniPieChartJs();

        //draw pie chart
        $('.reportChart').aniPieChartJs();

        //숫자 표기
        /* $target : .descNum > strong
        *  $(target).markNumJs();
        */
        $('.descNum > strong').markNumJs();

        ns.domEvent.init();

        //table set id, header
        $.setIdAndHeadersToTables();
    };
    //layout
    ns.layout = {
        init: function () {
            // 스크롤 시 body tag 에 fixed 클래스 추가
            this.scrollBody.init();

            //사회 공헌 - 스크롤 시 body tag 에 fixed 클래스 추가
            this.scrollBodyComp.init();

            // 하단 버튼 스크롤
            this.scrollBtnArea.init();
            //iframe.setHeight 클래스 붙어 있을 경우 - iframe 내부 컨텐츠 높이로 iframe 높이 지정
            //기본 iframe - (전체 window 높이 - 269)
            this._checkIframe();


        },
        _checkIframe: function () {
            var $iframe = $('iframe');
            var oSelf = this;
            if ($iframe.length === 0) {
                return;
            }

            $iframe.on('load', function () {
                //생활 편의 골프 iframe 예외 
                if ($(this).attr('name') === 'elife_ifrm') {
                    return;
                }
                if ($(this).hasClass('setHeight')) {
                    // 아이프레임 컨텐츠 높이 만큼 높이 설정
                    oSelf._setIfmContH();
                } else if ($('.keywordBody').length > 0) {
                    //아이프레임 윈도우 높이 만큼 높이 설정
                    oSelf._setIfmWinH();
                    //아이 프레임 컨텐츠 body - iframeBody 클래스 추가
                    oSelf._setIframeBody();
                }
            });

            var ifrmTid = setTimeout(function () {
                clearTimeout(ifrmTid);
                //생활 편의 골프 iframe 예외 
                if ($iframe.attr('name') === 'elife_ifrm') {
                    return;
                }

                if ($iframe.hasClass('setHeight')) {
                    oSelf._setIfmContH();
                } else if ($('.keywordBody').length > 0) {
                    oSelf._setIfmWinH();
                    oSelf._setIframeBody();
                }
            }, 1000);


        },
        _setIfmContH: function () {
            var $iframe = $('iframe.setHeight');
            // iframe setHeight event
            var $this = $(this),
                iframeDocument = $iframe.get(0).contentDocument || $iframe.get(0).contentWindow.document,
                $documentBody = $(iframeDocument).find('body'),
                getHeight = 0;

            if ($documentBody.length > 0 && $documentBody.children()[0] != undefined) {
                if ($documentBody.find('.container').length > 0) {
                    getHeight = $documentBody.find('.container')[0].offsetHeight;
                } else {
                    getHeight = $documentBody.children()[0].offsetHeight;
                }
                $iframe.css('height', getHeight);
            }

        },
        _setIfmWinH: function () {
            var iframeHeight,
                resizeTimer;
            var ifmTop = $('.keywordBody iframe').offset().top || 0;
            $(window).on('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    iframeHeight = window.innerHeight - ifmTop;
                    $('.keywordBody iframe').css('height', iframeHeight);
                }, 0);
            }).trigger('resize');
        },
        _setIframeBody: function () {
            // 아이프레임 컨텐츠 body 에  iframeBody 클래스 추가
            var $iframe,
                iframeDocument,
                $documentBody;
            iframeTid = setTimeout(function () {
                clearTimeout(iframeTid);
                $iframe = $('iframe').get(0);
                if ($('iframe').length === 0 ||
                    $('iframe').attr('name') === 'chatbotFrame' ||
                    ($('iframe.corpIframe').length > 0)  //법인 아이프레임은 클래스 추가 예외 처리
                ) {
                    return;
                }
                iframeDocument = $iframe.contentDocument || $iframe.contentWindow.document;
                $documentBody = $(iframeDocument).find('body');
                $documentBody.addClass('iframeBody');
            }, 100);
        }
    };

    ns.layout.scrollBody = {
        init: function () {
            //팝업 일 경우 제외 / 사회공헌 페이지 일 경우 제외
            if ($('.header').length === 0 || $('body').attr('id') === 'popup' ||
                $('.wrapper').hasClass('socialWrap') ||
                $('.wrapper').hasClass('compWrap')
            ) {
                return;
            }
            this.$body = $('body');
            this.$pageTop = $('.pageTOP');
            this.pointHeader = $('.header').height();
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            var curScroll = $(window).scrollTop();
            this._setHeader(curScroll, false);
        },
        _bindEvent: function () {
            var oSelf = this;
            $(window).on('scroll', function () {
                var curScroll = $(window).scrollTop();
                oSelf._setHeader(curScroll, true);
            });
        },
        _setHeader: function (curScroll, isAni) {

            if (
                $('body').hasClass('iframeBody') || // 아이프레임 컨텐츠 
                $('body').hasClass('on') // snb 메뉴 활성화  
            ) {
                return;
            }

            if (curScroll < this.pointHeader) {
                if (!this.$body.hasClass('fixed')) {
                    return;
                }
                this._resetBody();
            } else {
                if (this.$body.hasClass('fixed')) {
                    return;
                }
                this._fixBody();
            }
        },
        _resetBody: function () {
            this.$body.removeClass('fixed');
            this.$body.removeAttr('style');
        },
        _fixBody: function () {
            this.$body.addClass('fixed');
        }
    };

    ns.layout.scrollBodyComp = {
        init: function () {
            if ($('.compWrap').length === 0) {
                return;
            }
            this.$body = $('body');
            this.$header = $('.header');
            this.pointHeader = $('.headArea').height();
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            var curScroll = $(window).scrollTop();
            this._setHeader(curScroll, false);
        },
        _bindEvent: function () {
            var oSelf = this;
            $(window).on('scroll', function () {
                var curScroll = $(window).scrollTop();
                oSelf._setHeader(curScroll, true);
            });
        },
        _setHeader: function (curScroll, isAni) {

            if ($('body').hasClass('iframeBody')) {
                return;
            }

            if (curScroll < this.pointHeader) {
                if (!this.$body.hasClass('fixed')) {
                    return;
                }
                this._resetBody();
            } else {
                if (this.$body.hasClass('fixed')) {
                    return;
                }
                this._fixBody();
            }
        },
        _resetBody: function () {
            this.$body.removeClass('fixed');
            this.$body.removeAttr('style');
            this.$header.removeClass('gnbOver');
        },
        _fixBody: function () {
            this.$body.addClass('fixed');
            this.$header.addClass('gnbOver');
        }

    };

    ns.layout.scrollBtnArea = {
        init: function () {
            this._setBtnBtm();
            this._bindEvent();
        },
        _bindEvent: function () {
            var oSelf = this;

            var scrollBtnTid;
            $(window).on('scroll', function () {
                if ($('.btnBtm').length === 0) {
                    return;
                }
                scrollBtnTid = setTimeout(function () {
                    clearTimeout(scrollBtnTid);
                    oSelf._setBtnBtm();
                }, 0);
            });

            //리사이즈 될 경우  기준 새로 받음
            $(window).on('resize', function () {
                if ($('.btnBtm').length === 0) {
                    return;
                }
                scrollBtnTid = setTimeout(function () {
                    clearTimeout(scrollBtnTid);
                    oSelf._setBtnBtm();
                }, 0);
            });
        },
        _setBtnBtm: function () {
            if ($('.btnBtm').length === 0) {
                return;
            }
            var winHeight = $(window).height();
            var wrapperHeight = $('.wrapper').height();
            var footerHeight = $('.footer').outerHeight();

            this.pointBtnBtm = this._getPointBtm();

            var curScroll = $(window).scrollTop();

            if ($('body').hasClass('on')) {
                // snb 메뉴 활성화
                return;
            }
            if (wrapperHeight - footerHeight > winHeight + curScroll) {
                if (!$('.btnBtm').hasClass('btnStatic')) {
                    return;
                }
                this._resetBtnBtm();
            } else {
                if ($('.btnBtm').hasClass('btnStatic')) {
                    return;
                }
                this._fixBtnBtm();
            }
        },
        _getPointBtm: function () {
            var paddTop = parseInt($('.btnArea').css('paddingTop')),
                pointBtmVal = $('.btnBtm').offset().top + $('.btnArea').height() - $(window).height() + paddTop;
            return pointBtmVal;
        },
        _resetBtnBtm: function () {
            $('.btnBtm').removeClass('btnStatic');
        },
        _fixBtnBtm: function () {
            $('.btnBtm').addClass('btnStatic');
        }
    };

    //layerPopup
    ns.layerPopup = {
        init: function () {
            this.defaultPopWrap = $('#layerPop');

            this.$target = $('[data-path]');
            this.$dimmed = $('.dimmed');
            this.$container = $('#container');
            this.openPopList = [];
            //body 스크롤 방지
            this.scrollBlock();
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            var oSelf = this;
            //열려 있는 팝업 가운데 정렬
            $('.layPopup:visible').each(function () {
                oSelf.centerPop($(this));
            });

            //스크롤 바 생성
            this._createScrollbar();
        },
        _bindEvent: function () {
            var oSelf = this;
            $(document).on('click', '[data-path]', function (e) {
                if ($(e.currentTarget).attr('href') === "#" || $(e.currentTarget).attr('href') === undefined) {
                    e.preventDefault();
                    oSelf.clickEl = $(e.currentTarget);
                    //팝업 위에 팝업 열리는 케이스 추가
                    if ($(this).closest('article').length > 0) {
                        oSelf.loadPopEl(oSelf.clickEl.data('path'), true);
                    } else {
                        oSelf.loadPopEl(oSelf.clickEl.data('path'));
                    }
                }
            });


            //팝업 닫기 버튼
            $(document).on('click', '.closeL', function (e) {
                //개발단에서 팝업 닫기 기능 막기
                if ($(this).data('isClick') === false) {
                    return;
                }

                e.preventDefault();
                //팝업일 경우
                if ($(this).closest('.layPopWrap').find('.lyCls').length > 0) {
                    $(this).closest('.layPopWrap').find('.lyCls').trigger('click');
                    return;
                }

                var targetId = $(this).closest('article').attr('id');
                if (targetId) {
                    oSelf.closePop('#' + targetId);
                } else if ($(this).closest('.layPopup').length > 0) {
                    //레이 팝업 있을 경우
                    targetId = $(this).closest('.layPopup').attr('id');
                    oSelf.closePop('#' + targetId);
                } else {
                    oSelf.closePop();
                }
            });


            $(document).on('click', '.layerOpen', function (e) {
                e.preventDefault();
                oSelf.clickEl = $(e.currentTarget);
                var targetId = $(this).attr('value');
                if (targetId !== '#') {
                    $(targetId).fadeIn(200);
                }
            });

            //카드 상세 팝업 열기
            $(document).on('click', '.cdLayerOpen', function (e) {
                e.preventDefault();
                oSelf.clickEl = $(e.currentTarget);
                var targetId = $(this).attr('href');
                if (targetId !== '#' && $(targetId).length > 0) {
                    $(targetId).fadeIn(200);
                    //.layPopWrap 클래스 있을 경우 최대 높이 지정
                    ns.layerPopup.setMaxHeight($(targetId).find('.layPopFull'));


                    //가운데 정렬
                    oSelf.centerPop($(targetId).find('.layPopFull'));
                    ns.layerPopup._hideOverflow();
                }
            });
            //카드 상세 팝업 닫기
            $(document).on('click', '.lyCls', function (e) {
                e.preventDefault();
                var $target = $(this).closest('.layPopWrap');
                $target.fadeOut(200);
                ns.layerPopup._showOverflow();
            });

            this._tabFocus();

            //리사이즈 될 경우  가운데 정렬
            $(window).on('resize', function () {
                // layPopFull max Height
                if ($('.layPopFull:visible').length > 0) {
                    ns.layerPopup.setMaxHeight($('.layPopFull:visible'));
                }

                oSelf.centerPop();
            });
        },
        centerPop: function (el) {
            var target;
            if (el) {
                target = el;
            } else if ((this.$curPop !== undefined) && (this.$curPop.length > 0)) {
                target = this.$curPop;
            } else if ($('.layPopFull:visible').length > 0) {
                //레이어 팝업
                target = $('.layPopFull:visible');
            } else {
                target = $('.layPopup:visible');
            }
            if (target.length > 0) {
                target.css('marginTop', -parseInt(target.height() / 2));
            }
        },
        _tabFocus: function () {

            $(document).on('keydown', '.closeL, .closeP', function (e) {
                // tab keydown
                if (e.shiftKey === false && e.keyCode === 9) {
                    $(this).closest('[tabindex=-1]').focus();
                    return false;
                }
            });

            $(document).on('keydown', '[tabindex=0]', function (e) {
                if (e.shiftKey === true && e.keyCode === 9 && $(e.target).attr('tabindex') === "0") {
                    $(this).find('.closeL').focus();
                    return false;
                }
            });
        },
        _appendHtml: function (el) {
            var createEl = $(el);
            this.defaultPopWrap.children().remove();
            this.defaultPopWrap.append(createEl);

            //dimm 사용 하지 않음
            createEl.fadeIn(200);

        },
        openPop: function (el, isParPop) { //isParPop  : true 팝업 위에 팝업 열리는 경우
            this.$curPop = this.defaultPopWrap.find('.layPopup');
            if (el !== undefined) {
                this.$curPop = $(el);
            }

            //팝업 위에 팝업 열릴 경우 이전 팝업 z-index 999 로 지정
            //alertBox 경우 이중 팝업 고려
            if ((isParPop === true || this.$curPop.hasClass('alertBox')) && this.openPopList.length > 0) {
                this.orgPop = this.openPopList[this.openPopList.length - 1]['$target'];
                this.orgPop.css('z-index', '999');

                this.openPopList.push({
                    $target: this.$curPop,
                    $lastFocus: $(document).find(':focus')
                });
            } else {
                this.openPopList = [];
                this.openPopList.push({
                    $target: this.$curPop,
                    $lastFocus: $(document).find(':focus')
                });
            }

            // 팝업 보이기
            if (this.$curPop.hasClass('layPopFull')) {
                this.$curPop.show();
            } else {
                this.$curPop.fadeIn(200);
            }
            this.showDimmed();

            // 레이어 팝업 중앙 정렬
            this._contAni(this.$curPop);

            // 팝업 새로 그릴 경우 함수 재 호출
            this._reInitCont();
        },
        _reInitCont: function () {
            //팝업 내부에 인풋 창 있을 경우
            if (this.$curPop.find('.frmCheck input').length > 0) {
                ns.formEvent.jsCheckbox._setElement();
            }

            //팝업 내부에 tabScript 가 있을 경우
            if (this.$curPop.find('[class*=tabType]').length > 0) {
                $('[class*=tabType]').tabJs();
            }

            //팝업 내부에 달력이 있을 경우
            if (this.$curPop.find('.calenWrap input').length > 0) {
                ns.calendar.init();
            }

            //팝업 내부에 select 가 있을 경우
            if (
                this.$curPop.find('div.selectbox select').length > 0 ||
                this.$curPop.find('div.cardSelect select').length > 0 ||
                this.$curPop.find('.pageSelect select').length > 0

            ) {
                ns.formEvent.selectBox.setEl();
            }

            //스크롤 바 생성
            this._createScrollbar();

        },
        closePop: function (el) {
            var oSelf = this,
                target = $('.layPopup:visible'),
                targetHeight = target.outerHeight();

            if (el !== undefined) {
                target = $(el);
            }

            // 팝업 삭제 리스트 체크
            if (this.openPopList.length > 0) {
                var isPopList = false;
                var curPopId = target.attr('id');

                $.each(this.openPopList, function (idx, val) {
                    var popId = '#' + val['$target'].attr('id');

                    if (popId.indexOf(curPopId) >= 0 || popId === '#layerPop') {
                        isPopList = true;
                        return false;
                    }
                });

                if (isPopList === false) {
                    return;
                }
            }

            if (target.hasClass('layPopFull')) {

                // 풀 팝업 일 경우 fade 효과 삭제
                if (this.openPopList.length > 1) {
                    target.remove();
                } else {
                    target.hide();
                    this.hideDimmed('Y');
                }

            } else {

                if (this.openPopList.length > 1) {
                    target.fadeOut(200, function () {
                        $(this).remove();
                    });
                } else {
                    target.fadeOut(200, function () {
                        $(this).hide();
                    });
                    this.hideDimmed();
                }
            }

            if (this.openPopList.length > 0) {
                this.openPopList[this.openPopList.length - 1]['$lastFocus'].focus();

                //이전 팝업 z-index 초기화
                var orgPop = this.openPopList[this.openPopList.length - 2];
                if (orgPop) {
                    orgPop['$target'].css('z-index', '');
                }
                this.openPopList.pop();
            }
        },
        loadPopEl: function (target, isParPop) {

            var oSelf = this,
                popCont,
                popContId = target,
                popContIdIdx;

            if (popContId.match('/')) {
                popContId = popContId.split('/');
                popContId = popContId[popContId.length - 1];
            }
            popContIdIdx = popContId.indexOf('.');
            if (popContIdIdx > 0) {
                popContId = popContId.substring(0, popContIdIdx);
            }

            $.get(target, function (data) {
                if (isParPop !== true) {
                    $('#layerPop').html('');
                }
                popCont = $(data).filter('#' + popContId);

                popCont.appendTo('#layerPop');
                oSelf.openPop('#' + popContId, isParPop);
            });

        },
        _contAni: function (el) {
            var popCont = el;

            //팝업 열릴 때 포커스 이동
            popCont.attr('tabindex', -1).focus();

            if (!popCont.hasClass('layPopFull')) {
                //풀 팝업은 제외
                this.centerPop();
            }

            //스크롤 초기화
            popCont.find('*').each(function () {
                if ($(this).css('overflow-y') == 'auto' || $(this).css('overflow-y') == 'scroll') {
                    $(this).scrollTop(0);
                }
            })

        },
        createDimmed: function (target) {
            target.after('<div class="dimmed">');

            var curDimmed = target.next('.dimmed');
            curDimmed.css('display', 'block');
        },
        delDimmed: function (target) {
            target.remove();
        },
        showDimmed: function (target) {
            $('.dimmed').show();
        },
        scrollBlock: function (target) {

            // 마우스가 팝업 위에 있을 경우 - 마우스 휠 방향에 따른 현재 객체  스크롤 값 계산하여 지정
            var scrollElem;
            $(document).off('mousewheel').on('mousewheel', function (e) {
                if (scrollElem && scrollElem.is(':visible')) {  // layer popup scroll cont
                    e.preventDefault();
                    var wheelEvent = e.originalEvent;
                    var dY = wheelEvent.detail ? wheelEvent.detail : -(wheelEvent.wheelDelta);
                    var unknownVal = 0;
                    scrollElem.parent().hasClass('popCont') || scrollElem.hasClass('popLayer') ? unknownVal = 0 : unknownVal = -2;
                    scrollElem.each(function (m) {
                        var $scElem = $(this), otherScroll = $scElem.scrollTop();
                        if ($scElem[0].scrollHeight - $scElem.scrollTop() === ($scElem.outerHeight() + unknownVal)) {
                            dY > 0 ? deltaSave = 1 : deltaSave = -1;

                        } else {
                            dY > 0 ? deltaSave = 1 : deltaSave = -1;
                            if ($scElem.scrollTop() === 0) {
                                dY < 0 ? deltaSave = 0 : deltaSave;
                            }
                        }
                        $scElem.scrollTop(otherScroll + deltaSave * 100);
                    });
                } else {
                    //레이어 팝업 열려 있을 경우 body 스크롤 막기
                    if ($('.layPopup:visible').length > 0) {
                        e.preventDefault();
                    }
                }
            });

            $(document).off('mouseenter.pl');
            $(document).on('mouseenter.pl', '.layPopup', function (e) {
                var findElem = $(this).find('*').filter(function () { if ($(this).css('overflow-y') == 'auto' || $(this).css('overflow-y') == 'scroll') return $(this); });
                if ($(this).css('overflow-y') == 'auto' || $(this).css('overflow-y') == 'scroll') {
                    var pElem = $(this);
                    scrollElem = $(this);
                    if (findElem.length > 0) {
                        findElem.off('mouseenter').on('mouseenter', function (e) {
                            scrollElem = $(this);
                        }).off('mouseleave').on('mouseleave', function (e) {
                            scrollElem = pElem;
                        });
                    }
                } else {
                    scrollElem = $(this).find('*').filter(function () { if ($(this).css('overflow-y') == 'auto' || $(this).css('overflow-y') == 'scroll') return $(this); });
                    scrollElem.off('mouseenter').on('mouseenter', function (e) {
                        scrollElem = $(this);
                    }).off('mouseleave').on('mouseleave', function (e) {
                        if ($(this).closest('.layCont').length > 0) {
                            scrollElem = $(this).closest('.layCont');
                        }
                    });
                }
                if (scrollElem.length < 1) scrollElem = undefined;

                //디자인 스크롤
                if ($(e.target).closest('.jspScrollable').length > 0) {
                    scrollElem = $(e.target).closest('.jspScrollable');
                }
            });

            $(document).off('mouseleave.pl');
            $(document).on('mouseleave.pl', '.layPopup', function () {
                scrollElem = undefined;
            });

            //
            $(document).off('keydown.pl').on('keydown.pl', function (e) { // keyCode : 32 = space, 37-40 = arrows, 33 = pageUp, 34 = pageDown
                var doc = $(this);
                //textarea 영역 내에서 keydown 시 아래 로직 안탐
                if ($(e.target).get(0).tagName === 'TEXTAREA' ||
                    $(e.target).get(0).tagName === 'INPUT'
                ) {
                    return;
                }
                if ($('.layPopup').is(':visible')) {   // layer popup

                    var scrollElemFocus;
                    if (doc.find('.layPopup').css('overflow-y') == 'auto' || doc.find('.layPopup').css('overflow-y') == 'scroll') {
                        scrollElemFocus = doc.find('.layPopup');
                    } else {
                        scrollElemFocus = doc.find('.layPopup div').filter(function () { if ($(this).css('overflow-y') == 'auto' || $(this).css('overflow-y') == 'scroll') return $(this); });
                    }
                    scrollElemFocus.each(function (i) {
                        var scrollElemFocusThis = $(this);
                        var arraySElem = scrollElemFocus.map(function (v, k) { return k; });//focusElement

                        if ($(arraySElem[i]).attr('class') === scrollElemFocusThis.filter(':focus').attr('class')) {
                            if (scrollElemFocusThis[0].scrollHeight - scrollElemFocusThis.scrollTop() === (scrollElemFocusThis.outerHeight())) {

                                if (e.keyCode == 32 || e.keyCode == 40 || e.keyCode == 34) e.preventDefault(); //e.keyCode == 40 ||
                            } else {
                                if (scrollElemFocusThis.scrollTop() === 0) {
                                    if (e.keyCode == 38 || e.keyCode == 33) e.preventDefault();
                                }
                            }
                        }
                    });

                    if (scrollElemFocus.filter(':focus').length > 0) {

                    } else {
                        if (e.keyCode == 32 || e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 33 || e.keyCode == 34) e.preventDefault();
                    }
                }
            });
        },
        hideDimmed: function (isDelFade) {
            //isDelFade : fade 효과 제거
            if (isDelFade === 'Y') {
                $('.dimmed').hide();
            } else {
                $('.dimmed').fadeOut(200);
            }
        },
        _hideOverflow: function () {
            $('body').css({
                'overflow': 'hidden'
            });
        },
        _showOverflow: function () {
            $('body').css({
                'overflow': ''
            });
        },
        setMaxHeight: function (target) {
            //.layPopWrap 클래스 있을 경우 최대 높이 지정
            if (target.closest('.layPopWrap').length === 0) {
                return;
            }
            var docHeight = $(window).height(),
                $cont = target.find('.layCont'),
                titHeight = target.find('.titLay').outerHeight(true),
                btnHeight = target.find('.lyBtnBtm').outerHeight(),
                heightCont = docHeight - titHeight - btnHeight - 200;
            $cont.css('max-height', heightCont);
        },
        _createScrollbar: function () {
            if ($('.layPopup.touchLayer:visible').length === 0) {
                return;
            }
            var $popCont = $('.layPopup.touchLayer:visible').find('.layCont');
            var popContHeight = $popCont.outerHeight();
            $popCont
                .on(
                    'jsp-initialised',
                    function (event, isScrollable) {
                        //스크롤 조절
                        $(this).find('.jspTrack').removeAttr('style');

                        //불필요한 태그 삭제
                        $(this).find('.jspArrow').remove();
                        $(this).find('.jspCap').remove();
                        $(this).find('.jspHorizontalBar').remove();
                        $(this).css('max-height', '');
                    }
                )
                .jScrollPane({
                    showArrows: false,
                    verticalDragMinHeight: 30,
                    mouseWheelSpeed: popContHeight
                });
        }
    };

    //form event
    ns.formEvent = {
        init: function () {
            this.selectBox.init();
            this.toggle.init();

            //subTab toggle
            this.subTabToggle.init();

            this.tooltip.init();

            this.slideUI();

            //전체 동의 체크
            this.jsCheckbox.init();

            //frm button check
            this.checkFrmBtn.init();


            //frmList input check
            this.checkFrmListInp.init();

            /*
             * 첨부 파일 명
             */
            this._setAttachFile();

            //인풋 삭제 버튼 클릭 시 내용 삭제
            this._delInp();

            //input 포커스 시 화면 중앙 이동
            this._focusInpCenterMove();

            //접근성 - input placeholder 글자 title에 추가
            this._addInpTitleAccess();
        },
        getCheckBox: function () {
            //IE8 이하에서만 사용
            var isIe = this._checkIe();
            if (isIe === false || isIe > 8) {
                return;
            }
            this.checkBox.init();
            this.radioBtn.init();
        },
        setCheckBox: function (selector, bChecked) {
            //IE8 이하에서만 사용
            var isIe = this._checkIe();
            if (isIe === false || isIe > 8) {
                return;
            }

            var checkInput = $(selector);
            var getName = checkInput.attr('name'),
                $siblings = $('[name="' + getName + '"]');
            if (checkInput.attr('type').toUpperCase() === 'RADIO') {
                $siblings.removeClass('on');
                $siblings.prop('checked', false);
            }

            if (bChecked) {
                checkInput.addClass('on');
                checkInput.prop('checked', true);
            } else {
                checkInput.removeClass('on');
                checkInput.prop('checked', false);
            }
        },
        _checkIe: function () {
            var myNav = navigator.userAgent.toLowerCase();
            var isIe = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
            return isIe;
        },
        _setAttachFile: function () {
            var uploadFile = $('#file_attach'),
                fileName;
            $('body').on('change', 'input[type=file]', function () {
                if (window.FileReader) {
                    if ($(this)[0].files[0] !== undefined) {
                        fileName = $(this)[0].files[0].name;
                    } else {
                        fileName = '';
                    }
                } else {
                    if ($(this).val() !== undefined) {
                        fileName = $(this).val().split('/').pop().split('\\').pop();
                    } else {
                        fileName = '';
                    }
                }

                $(this).siblings('.file').text(fileName);
            });
        },
        _delInp: function () {
            $(document).off('click.delInp');
            $(document).on('click.delInp', '.del', function () {
                $(this).siblings('input').val('');
                $(this).siblings('input').focus();
            });
        },
        _focusInpCenterMove: function () {
            $('input').off('focus.inpCenterMove');
            $('input').on('focus.inpCenterMove', function () {
                var inpType = $(this).attr('type');
                if (
                    $(this).attr('npkencrypt') === "on" ||
                    $(this).attr('readonly') !== undefined ||
                    $(this).attr('disabled') !== undefined ||
                    (inpType !== "text" && inpType !== "password" && inpType !== "number" &&
                        inpType !== "tel" && inpType !== "email" && inpType !== "search")
                ) {
                    return false;
                }

                //오류 인풋 포커스 될때만 실행
                if (!$(this).nextAll('.alert').is(':visible')) {
                    return;
                }
                var center = $(window).height() / 2;
                var top = $(this).offset().top;
                var inpH = $(this).outerHeight() / 2;
                if (top > center) {
                    $(window).scrollTop(top - center + inpH);
                }
            });
        },
        _addInpTitleAccess: function () {
            $('input').each(function () {
                var placeholder = $(this).attr('placeholder');
                var title;

                if (placeholder) {
                    title = $(this).attr('title') === undefined ? '' : $(this).attr('title');
                    $(this).data('title', title);
                    $(this).attr('title', title + ' ' + placeholder);
                }
            });

            $(document).off('focus.inpPlacehoder').on('focus.inpPlacehoder', 'input', function (e) {
                var placeholder = $(this).attr('placeholder');
                var titleData = $(this).data('title');

                if (placeholder && (titleData === undefined)) {
                    var title = $(this).attr('title') === undefined ? '' : $(this).attr('title');
                    $(this).data('title', title);
                    $(this).attr('title', title + ' ' + placeholder);
                }
            });

        },
        resetSelect: function (el) {
            var instance = $(el).siblings('a').getInstance();
            if (instance) {
                instance.resetSB();
            }
        },
        setSelectIndex: function (el, idx) {
            var instance = $(el).siblings('a').getInstance();
            if (instance) {
                instance.setIndexSB(idx);
            } else {
                $(el).find('option').eq(idx).prop('selected', true);
            }
        },
        setSelect: function (el, value) {
            var instance = $(el).siblings('a').getInstance();
            if (instance) {
                instance.setValueSB(value);
            } else {
                $(el).find('option[value="' + value + '"]').prop('selected', true);
            }
        },
        sliceSelect: function (el, startIdx, endIdx) {
            var $selWrap = $(el).siblings('.maskDiv_wddo'),
                $conWrap = $selWrap.find('.con'),
                $conLi = $conWrap.find('li'),
                $selEl = $(el).siblings('a.tit');
            var $tweenWrap = $selWrap.find('.tweenDiv_wddo');
            var $scrollEl = $selWrap.find('.scroll-pane');
            var isOpen = $selWrap.is(':visible');

            $conLi.hide();
            $conLi.slice(startIdx, endIdx).show();
            //스크롤 재 정의 $selWrap
            $selWrap.show();
            var scrollContH = $selWrap.find('.overcon').height();
            if (scrollContH < 200) {
                $selWrap.css('height', scrollContH);
                $tweenWrap.css('height', scrollContH);
                $scrollEl.css('height', scrollContH);
            } else {
                $selWrap.css('height', 200);
                $tweenWrap.css('height', 200);
                $scrollEl.css('height', 200);
            }
            if ($scrollEl.data('jsp')) {
                $selWrap.show();

                $(el).closest('.selectbox').find('.jspPane').css('top', 0);
                $scrollEl.data('jsp').reinitialise();

                $conLi.find('>a').filter(':visible').eq(0).trigger('click');
            }
        },
        disableTab: function ($target) {
            $target.find('> li').each(function () {
                $(this).addClass('disabled');
                $(this).find('>a').attr('aria-disabled', 'true');
            });
        },
        setSelectDisabled: function (_$target, isBoolean) {
            //_target 은 셀렉트박스 객체
            var instance = _$target.closest('div').find('a.tit').getInstance();

            if (instance) {
                instance.disabledSB(isBoolean);
            } else {
                _$target.prop('disabled', isBoolean);
            }
        },
        scrollToHead: function ($target) {
            if ($target.length === 0) {
                return;
            }
            var $targetTop = $target.offset().top;
            var targetMg = parseInt($target.css('marginTop'));
            var headerHeigt = $('.pageTOP').outerHeight() + $('.titDep1').outerHeight();
            if (targetMg === 0) {
                targetMg = 2;
            }
            var scrollTop = $targetTop - headerHeigt - targetMg + 7;
            $(window).scrollTop(scrollTop);
        }
    };

    ns.formEvent.selectBox = {
        init: function () {
            this.setEl();
        },
        setEl: function () {
            if ($.SelectBoxSet !== undefined) {
                $.SelectBoxSet('div.selectbox select', {
                    height: 200,
                    multiText: '⊙'
                });

                $.SelectBoxSet('div.cardSelect select', {
                    height: 200,
                    multiText: '⊙'
                });

                $.SelectBoxSet('.pageSelect select', {
                    height: 200,
                    multiText: '⊙'
                });
            }
        }
    };

    ns.formEvent.toggle = {
        init: function () {
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            //selectBox selected 된 값으로 선택
            this._setSelCont();
        },
        _bindEvent: function () {
            var oSelf = this;
            $(document).off('click.toggleCtrl');
            $(document).on('click.toggleCtrl', '.toggle .ctrl', function (e) {
                var $targetWrap = $(this).closest('.toggle');

                var isOpend;
                if ($(e.currentTarget).get(0).tagName !== "INPUT") {
                    isOpend = $targetWrap.hasClass('toggleON');
                    e.preventDefault();
                } else {
                    isOpend = !$(e.currentTarget).prop('checked');
                }

                oSelf._toggleMenu($targetWrap, isOpend);
            });

            //전체 닫힘, 열기
            $(document).off('click.togAllMenu');
            $(document).on('click.togAllMenu', '.expendAll, .collapseAll', $.proxy(this._onClickTogAllMenu, this));

            // tab toggle
            $(document).on('click', '.tabToggle li', function (e) {
                var $target = $(this),
                    curSubTabIdx;
                //클릭 방지
                if ($(this).hasClass('disabled')) {
                    return;
                }

                //input checked 실행
                if ($(this).children().get(0).tagName !== "INPUT") {
                    e.preventDefault();
                }

                if ($target.closest('.subTab').length > 0) {
                    //서브탭 보여지는 탭 내용  경로 다름
                    curSubTabIdx = $(this).parent().index();
                    oSelf._showSubTabCont($target.find('a'), curSubTabIdx);
                } else {
                    oSelf._showTabCont($target);
                }
            });
        },
        _toggleMenu: function ($targetWrap, isOpend) {
            if (isOpend === true) {
                this._hideCon($targetWrap);
            } else {
                if ($targetWrap.closest('.toggleList').length > 0) {
                    var $parWrap = $targetWrap.closest('.toggleList'),
                        visibleCont = $parWrap.find('.toggleON');

                    if (visibleCont.length > 0) {
                        //이전 내용 닫힐 경우 - 헤더에 탭 내용이 가려 질때 탭 내용 보이도록 스크롤
                        this._scrollShowCont($targetWrap);
                        this._hideCon(visibleCont);

                    }
                }
                this._showCon($targetWrap);
            }
        },
        _showCon: function ($targetWrap) {
            if ($targetWrap.hasClass('toggleON')) {
                return;
            }

            var targetCont = $targetWrap.find('.toggleCont');
            $targetWrap.addClass('toggleON');
            targetCont.hide();
            targetCont.slideToggle(400, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });
        },
        _hideCon: function ($targetWrap) {
            if (!$targetWrap.hasClass('toggleON')) {
                return;
            }
            var targetCont = $targetWrap.find('.toggleCont');
            $targetWrap.removeClass('toggleON');
            targetCont.show();
            targetCont.slideToggle(400, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });

        },
        _onClickTogAllMenu: function (e) {
            var oSelf = this;
            var $btnEl = $(e.currentTarget);
            var $toggleCont = $btnEl.closest('div').next('ul').find('.toggle .ctrl');
            var $actCont;
            if ($btnEl.hasClass('expendAll')) {
                //열림
                $actCont = $toggleCont.filter(function () {
                    return ($(this).closest('.toggle').hasClass('toggleON') === false);
                });

                $actCont.closest('.toggle').each(function () {
                    oSelf._showCon($(this));
                });
            } else {
                //닫힘
                $actCont = $toggleCont.filter(function () {
                    return ($(this).closest('.toggle').hasClass('toggleON') === true);
                });

                $actCont.closest('.toggle').each(function () {
                    oSelf._hideCon($(this));
                });
            }
        },
        _showSubTabCont: function ($target, curSubTabIdx) {
            var $targetWrap = $target.closest('.tabToggle');
            var targetId = $target.attr('href');
            if (targetId === '#') {
                targetId = '';
            }

            if ($targetWrap.nextAll('.tabCont.on').length > 0 && targetId !== '') {
                $(targetId).show();
                $(targetId).siblings('.innerTabCont').hide();
            }
        },
        _showTabCont: function ($target) {
            var $targetLi = $target.closest('li'),
                $targetWrap = $target.closest('.tabToggle'),
                curIdx = $targetLi.index(),
                contCnt = $targetWrap.find('>li').length,
                $toggleCont;

            var $clickTarget = $targetLi.find('> a');
            //사회 공헌 탭 일 경우만
            if ($targetLi.closest('.socialTabW').length > 0) {
                var imgSrc = '';
                var curImg = '';

                if ($targetLi.hasClass('dataN')) {
                    return;
                }
                curImg = $targetLi.find('img').attr('src');
                if (curImg.indexOf('don_grup_4_') === -1) {
                    $targetLi.find('img').attr('src', curImg.replace('don_grup_2_', 'don_grup_4_'));
                }

                $targetLi.siblings().find('img').each(function () {
                    imgSrc = $(this).attr('src');
                    if (imgSrc.indexOf('don_grup_2_') === -1) {
                        imgSrc = imgSrc.replace('don_grup_4_', 'don_grup_2_');
                        $(this).attr('src', imgSrc);
                    }

                });

            }

            if (!$targetWrap.is('[class*=tabType]')) {
                $clickTarget.attr('aria-selected', 'true');
                $targetLi.siblings().find('a').attr('aria-selected', '');

                $targetLi.addClass('on');
                $targetLi.siblings().removeClass('on');
            }
            //cont
            if ($targetWrap.nextAll('.tabCont').length > 0) {
                $toggleCont = $targetWrap.nextAll('.tabCont');
            } else if ($targetWrap.closest('.fixsizeSwiper').length > 0) {
                //ET8_2 예외
                $toggleCont = $targetWrap.closest('.fixsizeSwiper').nextAll('.tabCont');
            } else {
                $toggleCont = $targetWrap.closest('div').nextAll('.tabCont');
            }

            $toggleCont.removeClass('on');
            $toggleCont.eq(curIdx).addClass('on');

            //slide 있을 경우
            if ($toggleCont.eq(curIdx).find('.slider-container:visible').length > 0) {
                if ($('.slider-container:visible').data('plugin_slideBannerJs')) {
                    $('.slider-container:visible').data('plugin_slideBannerJs').setSlide(0);
                } else {
                    ns.slideBanner.init();
                }
            }

            // '#tabScript'  id 여러개 일 경우 현재 활성화 탭 에만 id 지정
            if ($toggleCont.find('.tabArea.type02').length > 1) {
                $toggleCont.find('#tabScript').attr('id', '');
                $toggleCont.eq(curIdx).find('.tabArea.type02').attr('id', 'tabScript');
            }

            if ($toggleCont.eq(curIdx).find('.barChart > li >.bar').length > 0) {
                ns.domEvent.barChart.init();
            }

            if ($toggleCont.eq(curIdx).find('.reportChart').length > 0) {
                $toggleCont.eq(curIdx).find('.reportChart').aniPieChartJs();
            }
        },
        _scrollShowCont: function ($targetWrap) {
            if ($targetWrap.prevAll('.toggleON').length > 0) {
                var curOffset = $targetWrap.offset().top,
                    prevContHeight = $targetWrap.prevAll('.toggleON').find('>.toggleCont').outerHeight(),
                    headerHeight = $('.pageTOP').outerHeight() + $('.titDep1').outerHeight(),
                    pointScroll = curOffset - prevContHeight - headerHeight + 2;


                if (curOffset - prevContHeight - $(window).scrollTop() < headerHeight) {
                    $('body,html').animate({
                        scrollTop: pointScroll
                    }, '100');
                }
            }
        },
        _setSelCont: function () {
            if ($('.selectbox.tabToggle').length === 0) {
                return;
            }
            var tabTogIdx = $('.selectbox.tabToggle select option:selected').index();
            $('.selectbox.tabToggle').nextAll('.tabCont').removeClass('on');
            $('.selectbox.tabToggle').nextAll('.tabCont').eq(tabTogIdx).addClass('on');
        }
    };

    ns.formEvent.subTabToggle = {
        init: function () {
            this._attachEventHandlers();
        },
        _attachEventHandlers: function () {
            $(document).on('click', '.subTab > li >a', $.proxy(this._onClickToggleSubTab, this));
        },
        _onClickToggleSubTab: function (e) {
            var $subTabEl = $(e.currentTarget);

            //탭 링크 걸려 있을 경우 고려
            if ($(e.target).attr('href') === "#") {
                e.preventDefault();
            }

            this._toggleSubTab($subTabEl);
        },
        _toggleSubTab: function ($subTabEl) {
            var $subTab = $subTabEl.closest('li');

            $subTab.addClass('on');
            $subTab.siblings().removeClass('on');

            $subTab.find('>a').attr('aria-selected', 'true');
            $subTab.siblings().find('>a').attr('aria-selected', 'false');
        }
    };
    ns.formEvent.tooltip = {
        init: function () {
            this.curFocus = '';
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            var $target;
            $('.popTipBox').each(function () {
                $target = $(this).find('>button');
                $target.attr('aria-expanded', 'false');
            });
        },
        _bindEvent: function () {
            var oSelf = this;
            //tip box 동적 페이지 생성
            $(document).off('click.tooltip');
            $(document).on('click.tooltip', '.popTipBox > button', function (e) {
                e.preventDefault();

                if ($(this).attr('aria-expanded') !== "true") {
                    oSelf._showBox(e);
                } else {
                    oSelf._hideBox(e);
                }
            });
            $(document).on('click', '.tipBox .closePs', function (e) {
                oSelf._hideBox(e);
            });

            $(document).on('click', '.frmButton input', function (e) {
                if ($(this).closest('li').find('.tipBox').is(':visible')) {
                    oSelf._hideBox(e);
                } else {
                    oSelf._showBox(e);
                }
            });
        },
        _showBox: function (e) {
            this.curFocus = $(e.currentTarget);

            //모두 초기화
            this._hideBox();

            var con;
            if (this.curFocus.closest('.frmButton').length > 0) {
                con = $(e.currentTarget).siblings('.tipBox');
            } else {
                con = $(e.currentTarget).closest('.popTipBox').find('> .tipBox');
            }

            if (con.length === 0) {
                return;
            }
            $(e.currentTarget).attr('aria-expanded', 'true');
            con.show();
        },
        _hideBox: function (e) {
            var con = $('.tipBox:visible');
            con.hide();
            con.closest('.popTipBox').find('>button').attr('aria-expanded', 'false');
            if ((this.curFocus !== undefined) && (this.curFocus !== '')) {
                this.curFocus.focus();
            }
        }
    };

    ns.formEvent.slideUI = function () {
        if ($("#slider").length === 0) {
            return;
        }
        var curVal = $("#slider").next('.valueList').find('button.on').text();
        $("#slider").append('<div class="sliderInner">');
        $("#slider .sliderInner").slider({
            range: "min",
            min: 10,
            max: 100,
            value: curVal,
            step: 10,
            slide: function (event, ui) {
                $("#amount").val(ui.value);
                var oSlideVal = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    selValIdx = oSlideVal.indexOf(ui.value),
                    valList = $(event.target).closest('#slider').next('.valueList').find('button'),
                    selBtn = $(event.target).find('a');
                valList.removeClass('on');
                valList.attr('aria-selected', '');
                valList.eq(selValIdx).addClass('on');
                valList.eq(selValIdx).attr('aria-selected', 'true');
                selBtn.attr('title', ui.value + '%');
            },
            create: function (event, ui) {
                $(this).find('a').attr('title', $("#slider .sliderInner").slider("value") + '%');
                $(this).closest('#slider .sliderInner').siblings('.valueList').find('button.on').attr('aria-selected', 'true');
            }
        });
        $("#amount").val($("#slider .sliderInner").slider("value"));


        //버튼 셀렉트
        $(document).on('click', '.sliderUI .valueList button', function () {
            $(this).siblings().removeClass('on');
            $(this).siblings().attr('aria-selected', '');

            $(this).addClass('on');
            $(this).attr('aria-selected', 'true');
            $('#slider .sliderInner').slider("option", "value", $(this).text());
        });
    };
    ns.formEvent.jsCheckbox = {
        init: function () {
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            $('.btnTog').each(function () {
                $(this).attr('aria-expanded', 'true');
            });

            $('.boxAgree .agreeItem input').each(function () {
                var $inpLabel = $(this).siblings('label').find('.data'),
                    labelValLength = $inpLabel.text().length;
                if (($inpLabel.length > 0) && (labelValLength === 0)) {
                    $(this).prop('disabled', true);
                }
            });

            //전체 동의 체크 시 하위 항목 체크
            this._checkAgreeAll();
        },
        _checkAgreeAll: function () {
            var oSelf = this;
            $('input').each(function () {
                if ($(this).prop('checked')) {
                    oSelf._checkInp($(this));
                }
            });
        },
        _bindEvent: function () {
            var oSelf = this;
            $(document).off('click.btnTog');
            $(document).on('click.btnTog', ".frmCheck .btnTog", function (e) {
                oSelf._toggleFrmInp(e);
            });

            $(document).off('click.boxInp');
            $(document).on('click.boxInp', ".boxAgree .frmCheck input:not(:disabled)", function (e) {
                oSelf._checkInp(e);
            });

            //CD2_3_step1_2L
            $(document).off('click.allInp');
            $(document).on('click.allInp', ".allCheckBox .frmCheck input:not(:disabled)", function (e) {
                oSelf._checkInpBox(e);
            });
        },
        _checkInpBox: function (e) {
            var $target = $(e.currentTarget),
                isChecked = $target.is(':checked'),
                $targetWrap = $target.closest('.allCheckBox'),
                $targetItemInp = $targetWrap.find('.chooseItem input:not(:disabled)'),
                $targetAllInp = $targetWrap.find('.chooseAll input'),
                isAllInp = $target.closest('.chooseAll').length > 0;

            if (isAllInp) {
                $targetItemInp.prop('checked', isChecked);
            } else {

                if ($targetItemInp.filter(':checked').length === $targetItemInp.length) {
                    $targetAllInp.prop('checked', true);
                } else {
                    $targetAllInp.prop('checked', false);
                }
            }
        },
        _toggleFrmInp: function (e) {
            var oSelf = this,
                target = $(e.currentTarget),
                isOpened = (target.attr('aria-expanded') === "true" ? true : false),
                isTotalBtn = target.closest('.agreeAll').length > 0,
                $toggleWrap,
                $subTotalBtn = target.closest('.boxAgree').find('.agreeItem .btnTog');

            this._markArea(target, isOpened);

            if (isTotalBtn) {
                $toggleWrap = target.closest('.boxAgree').find('.agreeItem');
                $subTotalBtn.each(function () {
                    oSelf._markArea($(this), isOpened);
                });
            } else {
                $toggleWrap = target.siblings('ul');
            }
            if (isOpened) {
                this._hideAgreeBox($toggleWrap, isTotalBtn);
            } else {
                this._showAgreeBox($toggleWrap, isTotalBtn);
            }
        },
        _checkInp: function (e) {
            var target = $(e.currentTarget),
                totInp = target.closest('.agreeAll'),
                subTotInp = target.siblings('.agreeDep');

            if (totInp.length > 0) {
                this._checkTotInp(target);
            } else if (subTotInp.length > 0) {
                this._checkSubTotInp(target);
                this._checkParInp(target);
            } else {
                this._checkParInp(target);
            }

            this._setToggleWrap(target);
        },
        _checkTotInp: function (target) {
            var isChecked = target.is(':checked'),
                $toggleWrap = target.closest('.boxAgree').find('.agreeItem'),
                isBtnTog = target.siblings('.btnTog').length > 0;

            if (isChecked) {
                $toggleWrap.find('input:not(:disabled)').prop('checked', true);
            } else {
                $toggleWrap.find('input:not(:disabled)').prop('checked', false);
            }
        },
        _checkSubTotInp: function (target) {
            var isChecked = target.is(':checked'),
                $toggleWrap = target.siblings('.agreeDep'),
                isBtnTog = target.siblings('.btnTog').length > 0;

            if (isChecked) {
                $toggleWrap.find('input:not(:disabled)').prop('checked', true);
            } else {
                $toggleWrap.find('input:not(:disabled)').prop('checked', false);
            }
        },
        _checkParInp: function (target) {
            var wrap = target.closest('.boxAgree'),
                totInp = wrap.find('.agreeAll input'),
                totItemInp = wrap.find('.agreeItem .frmCheck').find('input:visible:not(:disabled)'),
                $subItemWrap = '';

            //상세 check
            target.parents('.frmCheck').each(function () {
                $subItemWrap = $(this).find('>.agreeDep, .sub_wrap');
                if ($subItemWrap.length > 0) {

                    if ($subItemWrap.find('input:not(:disabled)').filter(':checked').length === $subItemWrap.find('input:not(:disabled)').length) {
                        $(this).find('>input:not(:disabled)').prop('checked', true);
                        $('.sub_wrap').hide();
                        $('.btnTogNew').removeClass('on');
                    } else {
                        $(this).find('>input:not(:disabled)').prop('checked', false);
                    }
                }
            });

            //total check
            if (totItemInp.filter(':checked').length === totItemInp.length) {
                totInp.prop('checked', true);
            } else {
                totInp.prop('checked', false);
            }
        },
        _setToggleWrap: function (target) {
            var wrap = target.closest('.boxAgree'),
                totInp = wrap.find('.agreeAll input'),
                totItemWrap = wrap.find('.agreeItem'),
                $toggleWrap,
                oSelf = this;

            //check toggleWrap
            if (String(totInp.prop('checked')) === totInp.siblings('.btnTog').attr('aria-expanded')) {
                $toggleWrap = totItemWrap;
                this._toggleWrap($toggleWrap, totInp.prop('checked'));
            } else {
                target.parents('.frmCheck').each(function () {
                    if ($(this).find('>.agreeDep').length > 0) {
                        if (String($(this).find('input:not(:disabled)').prop('checked')) === $(this).find('.btnTog').attr('aria-expanded')) {
                            $toggleWrap = $(this).find('>.agreeDep');
                        }
                    }
                });
                if ($toggleWrap) {
                    oSelf._toggleWrap($toggleWrap, $toggleWrap.siblings('input:not(:disabled)').prop('checked'));
                }
            }
        },
        _toggleWrap: function (target, state) {
            var isTotalBtn = target.siblings('.agreeAll').length > 0;
            //area
            if (target.hasClass('agreeItem')) {
                var allBtn = target.siblings('.agreeAll').find('.btnTog'),
                    subAllBtn = target.find('>.frmCheck .btnTog'),
                    oSelf = this;
                this._markArea(allBtn, state);

                subAllBtn.each(function () {
                    oSelf._markArea($(this), state);
                });

            } else if (target.hasClass('agreeDep')) {
                var curSubBtn = target.siblings('.btnTog');
                this._markArea(curSubBtn, state);
            }

            if (state) {
                this._hideAgreeBox(target, isTotalBtn);
            } else {
                this._showAgreeBox(target, isTotalBtn);
            }
        },
        _markArea: function (target, state) {
            if (state === true) {
                target.removeClass('open');
                target.attr('aria-expanded', "false");
                target.text(target.text().replace("접기", "펼치기"));

            } else {
                target.addClass('open');
                target.attr('aria-expanded', "true");
                target.text(target.text().replace("펼치기", "접기"));
            }
        },
        _hideAgreeBox: function (target, isTotal) {
            target.slideUp(300, 'easeOutCubic', function () {
                if (isTotal) {
                    $(this).closest('.boxAgree').find('.agreeItem .agreeDep').hide();
                    $(this).closest('.boxAgree').find('.agAddInfo').hide();
                } else {
                    if ($(this).closest('.frmCheck').find('.agAddInfo').length > 0) {
                        $(this).closest('.frmCheck').find('.agAddInfo').hide();
                    }
                }
            });

        },
        _showAgreeBox: function (target, isTotal) {
            if (isTotal) {
                target.closest('.boxAgree').find('.agreeItem .agreeDep').show();
                target.closest('.boxAgree').find('.agAddInfo').show();
            } else {
                if (target.closest('.frmCheck').find('.agAddInfo').length > 0) {
                    target.closest('.frmCheck').find('.agAddInfo').show();
                }
            }

            target.slideDown(300, 'easeOutCubic');
        }
    };

    ns.formEvent.checkBox = {
        init: function () {
            this.chkBox = $("input[type=checkbox]");

            this._setElment();
            this._bindEvents();
        },
        _setElment: function () {
            this.chkBox = $("input[type=checkbox]");
            this.chkBox.each(function () {
                if ($(this).prop('checked')) {
                    $(this).addClass('on');
                }
            });
        },
        _bindEvents: function () {
            $(document).off('change', "input[type=checkbox]");
            $(document).on('change', "input[type=checkbox]", $.proxy(this.changeChk, this));
        },
        changeChk: function (e) {
            this.chkBoxWrap = $(e.target);
            this.chkBoxWrap.toggleClass('on');
            this.getId = $(e.target)[0].id;

            if (this.chkBoxWrap.hasClass('on')) {
                ns.formEvent.setCheckBox('#' + this.getId, true);
            } else {
                ns.formEvent.setCheckBox('#' + this.getId, false);
            }
        }
    };

    ns.formEvent.radioBtn = {
        init: function () {
            this.radioBtn = $("input[type=radio]");

            this._setElment();
            this._bindEvents();
        },
        _setElment: function () {
            this.radioBtn = $("input[type=radio]");
            this.radioBtn.each(function () {
                if ($(this).prop('checked')) {
                    $(this).addClass('on');
                }
            });
        },
        _bindEvents: function () {
            $(document).off('change', "input[type=radio]");
            $(document).on('change', "input[type=radio]", $.proxy(this.changeRadio, this));
        },
        changeRadio: function (e) {
            this.getId = $(e.target)[0].id;
            ns.formEvent.setCheckBox('#' + this.getId, true);
        }
    };

    /*
    * PC.formEvent.checkFrmBtn._setElment();  : input prop checked 된 값 css 표시
    */
    ns.formEvent.checkFrmBtn = {
        init: function () {
            this.$frmBtn = $('.frmButton, .frmSel');
            //ie8이하 일 경우에만 사용 = > 모든 IE적용
            // var isIe = ns.formEvent._checkIe();
            // if(isIe=== false || isIe > 8 || this.$frmBtn.length === 0){
            //     return;
            // }
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            this.$frmBtn = $('.frmButton, .frmSel');
            this.chkBox = this.$frmBtn.find(">li input");
            this.chkBox.each(function () {
                if ($(this).prop('checked')) {
                    $(this).parent().addClass('on');
                } else {
                    $(this).parent().removeClass('on');
                }
            });
        },
        _bindEvent: function () {
            $(document).off('click.frmBtn');
            $(document).on('click.frmBtn', '.frmButton >li input, .frmSel> li input', $.proxy(this._checkFrmInp, this));
        },
        _checkFrmInp: function (e) {
            var $target = $(e.currentTarget);
            var getName;
            if ($target.get(0).type.toUpperCase() === 'CHECKBOX') {
                $target.parent().toggleClass('on');
            } else {
                getName = $target.attr('name');
                $('input[name="' + getName + '"]').parent().removeClass('on');
                $target.parent().addClass('on');
            }
        }
    };


    /*
    * PC.formEvent.checkFrmListInp.init();  : '.frmList input' prop checked 된 값 css 표시
    * 스페셜 기프트 인풋 테두리 추가 (PBS1_1_3_1S)
    */
    ns.formEvent.checkFrmListInp = {
        init: function () {
            this.$frmListInp = $('.frmList input');
            this.setElement();
            this._bindEvent();
        },
        setElement: function () {
            this.checkedInp = $('.frmList input');
            var chkWrap;
            this.checkedInp.each(function () {
                chkWrap = $(this).closest('div');
                if ($(this).prop('checked')) {
                    if (chkWrap.find('span.checked').length > 0) {
                        chkWrap.find('span.checked').show();
                    } else {
                        chkWrap.append('<span class="checked" />');
                    }
                } else {
                    chkWrap.find('.checked').hide();
                }
            });
        },
        _bindEvent: function () {
            var getNameInp = '';
            $(document).on('click', '.frmList input', function () {
                getNameInp = $(this).attr('name');
                $('input[name="' + getNameInp + '"]').not(':checked').closest('div').find('.checked').hide();

                if ($(this).prop('checked')) {
                    if ($(this).closest('div').find('span.checked').length > 0) {
                        $(this).closest('div').find('span.checked').show();
                    } else {
                        $(this).closest('div').append('<span class="checked" />');
                    }
                }
            });


            //체크 박스 일 경우 체크 해제
            $(document).on('click', '.frmList .frmCheck .checked', function (e) {
                var $inpEl = $(this).closest('.frmCheck').find('>input');
                var inpType = $inpEl.attr('type');
                $inpEl.prop('checked', false);

                //PCD1_2S - checkLayer 클릭 시 닫히는 부분 방지
                if (inpType === 'checkbox' &&
                    ($(e.target).closest('.frmCategory').length === 0) &&
                    $(e.target).hasClass('checked')) {
                    $(this).hide();
                }
            });


        }
    };

    /********************************************************
     * 달력 스크립트
     * // 특정 날짜 이전 선택 불가능 (data-min 속성 적용)
     * <input data-min="yy.mm.dd">
     *
     * // 특정 날짜 이후 선택 불가능 (data-max 속성 적용)
     * <input data-max="yy.mm.dd">
     *********************************************************/
    ns.calendar = {
        init: function () {
            if ($('.calenWrap input').length === 0) {
                return;
            }
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            var $jsDatepicker = $('.calenWrap input');
            var oSelf = this,
                $lastFocus,
                $dateWrap;

            $jsDatepicker.each(function () {
                var getDataMin = $(this).data('min') || '-2Y',
                    getDataMax = $(this).data('max') || '+4Y',
                    $calBtn = $(this).siblings('button.cal');


                // 접근성 관련 - showOn: 'button' 추가
                $(this).siblings('.cal').remove();

                var dateFormat = oSelf._checkDateFormat($(this).val());
                $(this).datepicker({
                    /*
                     * dateFormat : 'y. mm. dd'로 수정할 경우 개발자분들에게 추가 요청 필요함
                     * 변경할 때 data-min, data-max 값도 16. mm. dd식으로 수정 요청 필요함
                     */
                    showOn: 'button',
                    buttonText: '날짜선택',
                    dateFormat: dateFormat,
                    showMonthAfterYear: true,
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    // changeMonth: true,
                    // changeYear: true,
                    monthNames: ['.01', '.02', '.03', '.04', '.05', '.06', '.07', '.08', '.09', '.10', '.11', '.12'],
                    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                    monthNamesShort: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
                    showButtonPanel: true,
                    minDate: getDataMin,
                    maxDate: getDataMax,
                    closeText: '취소',
                    beforeShow: function (input, date) {

                        //create layout
                        oSelf._createLayoutSel(input, date);

                        $lastFocus = $(document).find(':focus');

                        setTimeout(function () {
                            $datepicker = $('#ui-datepicker-div');
                            $datepicker.css({
                                position: '',
                                top: '',
                                left: '',
                                'z-index': ''
                            });

                            //datepicker 탬플릿 특정 영역 안에 위치 하도록 수정
                            $(input).closest('.calenWrap').find('.calendarWrap').append($('#ui-datepicker-div'));

                            //상단  selectbox 내용 create
                            oSelf._createSelDate(input, date);

                            oSelf._renderDateHeader({
                                target: $datepicker,
                                year: date.selectedYear,
                                month: date.selectedMonth + 1
                            });

                            $(input).closest('.calenWrap').find('.calendarWrap').attr('tabindex', 0).focus();
                        }, 0);

                        // input에 data-min이 있을 경우 data-min의 이전 날짜 체크 불가능
                        if ($(input).attr('data-min')) {
                            $(input).datepicker('option', 'minDate', $(input).attr('data-min'));
                        }

                        // input에 data-min이 있을 경우 data-max의 이후 날짜 체크 불가능
                        if ($(input).attr('data-max')) {
                            $(input).datepicker('option', 'maxDate', $(input).attr('data-max'));
                        }
                    },
                    onChangeMonthYear: function (year, month, inst) {
                        setTimeout(function () {
                            oSelf._renderDateHeader({
                                target: $datepicker,
                                year: year,
                                month: month
                            });
                        }, 0);
                    },
                    onClose: function (selectedDate, ins) {
                        //닫기
                        ins.input.closest('.calenWrap').find('.calendarWrap').fadeOut();
                        if ($('.alertBox:visible').length > 0) {
                            return;
                        }
                    }
                });

            });
        },
        _bindEvent: function () {
            var oSelf = this;
            //데이터피커 외부 영역 클릭 시 달력 닫히는 부분 방지
            $(document).unbind('mousedown', $.datepicker._checkExternalClick);

            //이전/다음 버튼 클릭
            $(document).on('click.btnDatepicker', '.ui-datepicker-prev, .ui-datepicker-next', $.proxy(this._selDateBtn, this));
            $(document).on('click.datepicker', '.calenWrap button.cal, .calenWrap input', function (e) {
                e.preventDefault();
                if ($(this).hasClass('cal')) {
                    $(this).siblings('input').datepicker("show");
                } else {
                    $(this).datepicker("show");
                }
            });

            $(document).on('click', '.ui-datepicker-prev.ui-state-disabled, .ui-datepicker-next.ui-state-disabled', function (e) {
                e.preventDefault();
            });

            //년도, 날짜 선택
            $(document).on('click.selDateBox');
            $(document).on('click.selDateBox', '.calendarWrap .overcon a', function (e) {
                if ($(this).closest('.selectbox').index() === 0) {
                    //년도 선택
                    oSelf.lastFocusClass = '.selectbox > a:eq(0)';
                } else {
                    //월 선택
                    oSelf.lastFocusClass = '.selectbox > a:eq(1)';
                }
                oSelf._refreshDay($(this), $(this).text().replace(/[^0-9]/g, ""));
            });

            $(document).off('keydown.cal').on('keydown.cal', '.calenWrap .selectbox >a', function (e) {
                if (e.keyCode >= 37 && e.keyCode <= 40) {
                    if ($(this).closest('.selectbox').index() === 0) {
                        //년도 선택
                        oSelf.lastFocusClass = '.selectbox > a:eq(0)';
                    } else {
                        //월 선택
                        oSelf.lastFocusClass = '.selectbox > a:eq(1)';
                    }
                    oSelf._refreshDay($(this), $(this).text().replace(/[^0-9]/g, ""));
                }
            });

            //캘린더 다른 영역 선택 시 닫힘
            $(document).off('click.closeCal');
            $(document).on('click.closeCal', $.proxy(this._onClickCloseCal, this));

        },
        _onClickCloseCal: function (e) {
            var $clickEl = $(e.target);

            if ($('.calendarWrap:visible').length === 0) {
                return;
            }
            //영역 삭제 되면 체크 안함
            if (!$clickEl.is(':visible')) {
                return;
            }
            var isCalendar = $clickEl.closest('.calenWrap').length > 0;

            if (!isCalendar) {
                $('.ui-datepicker-close').trigger('click');
            }
        },
        _createLayoutSel: function (input, date) {
            var $calWrap = $(input).closest('.calenWrap');

            if ($calWrap.find('.selectbox').length > 0) {
                $calWrap.find('.selectbox').children().remove();

            } else {
                $calWrap.append('<div class="calendarWrap"><div class="selectArea"></div></div>');
                //select
                $calWrap.find('.calendarWrap .selectArea').append('<div class="selectbox" /><div class="selectbox" />');
            }

            $calWrap.find('.selectbox').eq(0).append('<select id="selYear" title="년도 선택" />');
            $calWrap.find('.selectbox').eq(1).append('<select id="selMonth" title="월 선택" />');
            $calWrap.find('.calendarWrap').fadeIn();
        },
        _createSelDate: function (input, date) {
            //년도 선택
            var insYear = '';
            var today = new Date();
            var todayMonth = today.getMonth();
            var todayYear = today.getFullYear();

            if ($(input).data('min') !== undefined) {
                this.minYear = Number($(input).data('min').replace(/[^0-9]/g, '').substring(0, 4));
                this.minMonth = Number($(input).data('min').replace(/[^0-9]/g, '').substring(4, 6)) - 1;
            } else {
                var minDate = parseInt(date.settings.minDate.substring(1, 2));
                this.minYear = todayYear - minDate;
                this.minMonth = todayMonth;
            }

            if ($(input).data('max') !== undefined) {
                this.maxYear = Number($(input).data('max').replace(/[^0-9]/g, '').substring(0, 4));
                this.maxMonth = Number($(input).data('max').replace(/[^0-9]/g, '').substring(4, 6));
            } else {
                var maxDate = parseInt(date.settings.maxDate.substring(1, 2));
                this.maxYear = todayYear + maxDate;
                this.maxMonth = todayMonth + 1;
            }
            for (var y = this.minYear; y <= this.maxYear; y++) {
                if (date.drawYear === y) {
                    insYear += '<option value="' + y + '" selected>' + y + '년</option>';
                } else {
                    insYear += '<option value="' + y + '">' + y + '년</option>';
                }

            }
            $(input).closest('.calenWrap').find('.calendarWrap select').eq(0).append(insYear);

            //월 create
            var insMonth = '';
            var minMonth, maxMonth;

            if (this.minYear === date.selectedYear) {
                minMonth = this.minMonth;
            } else {
                minMonth = 0;
            }

            if (date.selectedYear < this.maxYear) {
                maxMonth = 12;
            } else {
                maxMonth = this.maxMonth;
            }


            for (var m = minMonth; m < maxMonth; m++) {
                month = this._pad(m + 1, 2);

                if (date.drawMonth === m) {
                    insMonth += '<option value="' + m + '" selected>' + month + '월</option>';
                } else {
                    insMonth += '<option value="' + m + '">' + month + '월</option>';
                }

            }
            $(input).closest('.calenWrap').find('.calendarWrap select').eq(1).append(insMonth);
            $.SelectBoxSet('div.selectbox select', {
                height: 200,
                multiText: '|'
            });
        },
        _renderDateHeader: function (opts) {
            opts.target.find('.tblCalendar').prepend('<caption>달력 테이블에는 일,월,화,수,목,금,토 요일과 일 선택을 하실 수 있습니다.</caption>');
            opts.target.find('.ui-datepicker-current').remove();

            //disabled 된 영역 접근성 추가
            opts.target.find('.ui-datepicker-unselectable').children().attr('aria-disabled', 'true');

            //접근성 - 좌우 화살표에 a 링크에 href 속성 추가
            opts.target.find('.ui-datepicker-prev').attr('href', '#');
            opts.target.find('.ui-datepicker-next').attr('href', '#');

        },
        _refreshDay: function ($target, _selDate, isChageYear) {
            var $targetInp = $target.closest('.calenWrap').find('input');
            var inpIns;
            var selDate = Number(_selDate);
            var $selectedYear = $target.closest('.calendarWrap').find('#selYear');
            var $selectMonth = $target.closest('.calendarWrap').find('#selMonth');

            //년도 선택
            if ($target.closest('.selectbox').index() == 0 || isChageYear) {
                $.datepicker._getInst($targetInp[0]).drawYear = selDate;
                $.datepicker._getInst($targetInp[0]).selectedYear = selDate;

                //해당 달 그리기
                var startMonth;
                var endEndMonth;
                var today = new Date();
                var todayMonth = today.getMonth();
                if (selDate === this.minYear) {
                    startMonth = this.minMonth;
                    endEndMonth = 11;
                } else if (selDate === this.maxYear) {
                    startMonth = 0;
                    endEndMonth = this.maxMonth - 1;
                } else {
                    startMonth = 0;
                    endEndMonth = 11;
                }

                if ($.datepicker._getInst($targetInp[0]).drawMonth < startMonth) {
                    $.datepicker._getInst($targetInp[0]).drawMonth = startMonth;
                    $.datepicker._getInst($targetInp[0]).selectedMonth = startMonth;
                }

                if ($.datepicker._getInst($targetInp[0]).drawMonth > endEndMonth) {
                    $.datepicker._getInst($targetInp[0]).drawMonth = endEndMonth;
                    $.datepicker._getInst($targetInp[0]).selectedMonth = endEndMonth;
                }

                var insMonth = '';
                for (var i = startMonth; i <= endEndMonth; i++) {
                    month = this._pad(i + 1, 2);
                    if ($.datepicker._getInst($targetInp[0]).drawMonth === i) {
                        insMonth += '<option value="' + i + '" selected>' + month + '월</option>';
                    } else {
                        insMonth += '<option value="' + i + '">' + month + '월</option>';
                    }

                }
                $selectMonth.find('option').remove();
                $selectMonth.append(insMonth);
                $selectMonth.siblings('a').getInstance().resetSB();


                //년도 수정
                if (isChageYear) {
                    $('#selYear option').prop("selected", false);
                    $('#selYear option[value=' + selDate + ']').prop("selected", true);
                    $target.closest('.calendarWrap').find('.selectArea .selectbox:eq(0) > a').getInstance().resetSB();
                }
            } else if ($target.closest('.selectbox').index() == 1) {
                //월 선택
                selDate = Number(selDate) - 1;

                $.datepicker._getInst($targetInp[0]).drawMonth = selDate;
                $.datepicker._getInst($targetInp[0]).selectedMonth = selDate;
            }
            $targetInp.datepicker('refresh');
            this._renderDateHeader({
                target: $('#ui-datepicker-div'),
                year: $.datepicker._getInst($targetInp[0]).drawYear,
                month: $.datepicker._getInst($targetInp[0]).drawMonth + 1
            });
        },
        _pad: function (n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        },
        _selDateBtn: function (e) {
            e.preventDefault();
            if ($(e.currentTarget).hasClass('ui-datepicker-next')) {
                this.lastFocusClass = '.ui-datepicker-next';
            } else {
                this.lastFocusClass = '.ui-datepicker-prev';
            }
            var $calWrap = $('#ui-datepicker-div').closest('.calenWrap');
            var year = String($calWrap.find('input').data('datepicker').drawYear);
            var month = String($calWrap.find('input').data('datepicker').drawMonth);

            //이전/다음 버튼 선택 시 년도 변경 될 경우 다시 그려야 함
            if ((year !== this.orgYear) && this.orgYear !== undefined) {
                this._refreshDay($('#ui-datepicker-div'), year, true);
            } else {
                $calWrap.find('.selectbox:eq(0)').find('a').getInstance().setValueSB(year);
                $calWrap.find('.selectbox:eq(1)').find('a').getInstance().setValueSB(month);
            }

            setTimeout(function () {
                $calWrap.find('.selectbox:eq(0)').find('a.tit').attr('aria-selected', 'true');
                $calWrap.find('.selectbox:eq(1)').find('a.tit').attr('aria-selected', 'true');
            }, 100);

            this.orgYear = year;
        },
        _checkDateFormat: function (date) {
            if (date === '') {
                return 'yy. mm. dd';
            } else {
                var gubun = date.substr(4, 1);

                var dateFormat = date.split(gubun);
                var regex = /[0-9]/g;
                var dateFormat1 = dateFormat[1].replace(regex, 'm');
                var dateFormat2 = dateFormat[2].replace(regex, 'd');

                return 'yy' + gubun + dateFormat1 + gubun + dateFormat2;
            }
        }
    };

    ns.calendarS = {
        init: function () {
            if ($('.calenWrapLayerS').length === 0) {
                return;
            }
            this.$dimmed = $('.dimmed');
            this._bindEvent();
            this._setElment();
            this._createSelDate();
        },

        _setElment: function () {
            var $jsDatepicker = $('.calenWrapLayerS .calendarWrapNew'),
                $jsDatepickerInput = $jsDatepicker.siblings('input'),
                getDataMin = $jsDatepickerInput.data('min') || '-2Y',
                getDataMax = $jsDatepickerInput.siblings('input').data('max') || '+4Y',
                oSelf = this,
                dateFormat = oSelf._checkDateFormat($jsDatepickerInput.val());

            $jsDatepicker.datepicker({
                dateFormat: dateFormat,
                showMonthAfterYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                setweek: true,
                monthNames: ['.01', '.02', '.03', '.04', '.05', '.06', '.07', '.08', '.09', '.10', '.11', '.12'],
                dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                monthNamesShort: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
                showButtonPanel: false,
                minDate: getDataMin,
                maxDate: getDataMax,
                closeText: '취소',
                altField: '.dateStart',
                defaultDate: $('#startDtCalen').val()
            })
        },
        _bindEvent: function () {
            var oSelf = this;

            //데이터피커 외부 영역 클릭 시 달력 닫히는 부분 방지
            $(document).unbind('mousedown', $.datepicker._checkExternalClick);

            //이전/다음 버튼 클릭
            $(document).on('click', '.ui-datepicker-prev, .ui-datepicker-next', $.proxy(this._selDateBtn, this));

            //년도, 날짜 선택
            $(document).on('click.selDateBox');
            $(document).on('click.selDateBox', '.calenWrapLayerS .overcon a', function (e) {
                if ($(this).closest('.selectbox').index() === 0) {
                    //년도 선택
                    oSelf.lastFocusClass = '.selectbox > a:eq(0)';
                } else {
                    //월 선택
                    oSelf.lastFocusClass = '.selectbox > a:eq(1)';
                }
                oSelf._refreshDay($(this), $(this).text().replace(/[^0-9]/g, ""));
            });

            $(document).off('keydown.cal').on('keydown.cal', '.calenWrapLayerS .selectbox >a', function (e) {
                if (e.keyCode >= 37 && e.keyCode <= 40) {
                    if ($(this).closest('.selectbox').index() === 0) {
                        //년도 선택
                        oSelf.lastFocusClass = '.selectbox > a:eq(0)';
                    } else {
                        //월 선택
                        oSelf.lastFocusClass = '.selectbox > a:eq(1)';
                    }
                    oSelf._refreshDay($(this), $(this).text().replace(/[^0-9]/g, ""));
                }
            });

            $(document).on('focus', '.btnCal', function () {
                oSelf.$dimmed.css('z-index', '10001').show();
                $('.dateLayer').show();
                $('.dateLayer .selectbox > a:eq(0)').focus();
                $('.calenWrapLayerS .calendarWrapNew').datepicker('setDate', $('#startDtCalen').val());
                oSelf._selDateRe();
            });

            $(document).on('click', '.radioCal', function () {
                oSelf.$dimmed.css('z-index', '10001').show();
                $('.dateLayer').show();
                $('.dateLayer .selectbox > a:eq(0)').focus();
                $('.calenWrapLayerS .calendarWrapNew').datepicker('setDate', $('#startDtCalen').val());
                oSelf._selDateRe();
            });

            $(document).on('click', '.dateLayer .closeL', function () {
                $('.dateLayer').hide();
            });
        },
        _createSelDate: function (input, date) {
            var input = $('.calenWrapLayerS .hasDatepicker');
            //년도 선택
            var insYear = '';
            var today = new Date();
            var todayMonth = today.getMonth();
            var todayYear = today.getFullYear();
            if (input.data('min') !== undefined) {
                this.minYear = Number(input.data('min').replace(/[^0-9]/g, '').substring(0, 4));
                this.minMonth = Number(input.data('min').replace(/[^0-9]/g, '').substring(4, 6)) - 1;
            } else {
                var minDate = 2;
                this.minYear = todayYear - minDate;
                this.minMonth = todayMonth;
            }

            if (input.data('max') !== undefined) {
                this.maxYear = Number(input.data('max').replace(/[^0-9]/g, '').substring(0, 4));
                this.maxMonth = Number(input.data('max').replace(/[^0-9]/g, '').substring(4, 6));
            } else {
                var maxDate = 4;
                this.maxYear = todayYear + maxDate;
                this.maxMonth = todayMonth + 1;
            }
            for (var y = this.minYear; y <= this.maxYear; y++) {
                if (Number($(".calenWrapLayerS .ui-datepicker-year").text().substring(0, 4)) === y) {
                    insYear += '<option value="' + y + '" selected>' + y + '년</option>';
                } else {
                    insYear += '<option value="' + y + '">' + y + '년</option>';
                }

            }
            $('.calenWrapLayerS').find('select').eq(0).append(insYear);

            //월 create
            var insMonth = '';
            var minMonth, maxMonth;

            if (this.minYear === Number($('.calenWrapLayerS .ui-datepicker-year').text())) {
                minMonth = this.minMonth;
            } else {
                minMonth = 0;
            }

            if (Number($('.calenWrapLayerS .ui-datepicker-year').text()) < this.maxYear) {
                maxMonth = 12;
            } else {
                maxMonth = this.maxMonth;
            }


            for (var m = minMonth; m < maxMonth; m++) {
                month = this._pad(m + 1, 2);

                if (Number($(".calenWrapLayerS .ui-datepicker-month").text().substring(1, 3)) - 1 === m) {
                    insMonth += '<option value="' + m + '" selected>' + month + '월</option>';
                } else {
                    insMonth += '<option value="' + m + '">' + month + '월</option>';
                }

            }
            $('.calenWrapLayerS').find('select').eq(1).append(insMonth);
            $.SelectBoxSet('.calenWrapLayerS div.selectbox select', {
                height: 200,
                multiText: '|'
            });
        },
        _renderDateHeader: function (opts) {
            opts.target.find('.tblCalendar').prepend('<caption>달력 테이블에는 일,월,화,수,목,금,토 요일과 일 선택을 하실 수 있습니다.</caption>');
            opts.target.find('.ui-datepicker-current').remove();

            //disabled 된 영역 접근성 추가
            opts.target.find('.ui-datepicker-unselectable').children().attr('aria-disabled', 'true');

            //접근성 - 좌우 화살표에 a 링크에 href 속성 추가
            opts.target.find('.ui-datepicker-prev').attr('href', '#');
            opts.target.find('.ui-datepicker-next').attr('href', '#');

            //접근성 - 달력 새로 선택 시 포커스 이동
            if (this.lastFocusClass) {
                opts.target.closest('.calendarWrapNew').find(this.lastFocusClass).focus();
            }

        },
        _refreshDay: function ($target, _selDate, isChageYear) {
            var $targetInp = $target.closest('.hasDatepicker');
            var inpIns;
            var selDate = Number(_selDate);
            var $selectedYear = $target.closest('.calendarWrapNew').find('.selYearS');
            var $selectMonth = $target.closest('.calendarWrapNew').find('.selMonthS');

            //년도 선택
            if ($target.closest('.selectbox').index() == 0 || isChageYear) {
                $.datepicker._getInst($targetInp[0]).drawYear = selDate;
                $.datepicker._getInst($targetInp[0]).selectedYear = selDate;

                //해당 달 그리기
                var startMonth;
                var endEndMonth;
                var today = new Date();
                var todayMonth = today.getMonth();
                if (selDate === this.minYear) {
                    startMonth = this.minMonth;
                    endEndMonth = 11;
                } else if (selDate === this.maxYear) {
                    startMonth = 0;
                    endEndMonth = this.maxMonth - 1;
                } else {
                    startMonth = 0;
                    endEndMonth = 11;
                }

                if ($.datepicker._getInst($targetInp[0]).drawMonth < startMonth) {
                    $.datepicker._getInst($targetInp[0]).drawMonth = startMonth;
                    $.datepicker._getInst($targetInp[0]).selectedMonth = startMonth;
                }

                if ($.datepicker._getInst($targetInp[0]).drawMonth > endEndMonth) {
                    $.datepicker._getInst($targetInp[0]).drawMonth = endEndMonth;
                    $.datepicker._getInst($targetInp[0]).selectedMonth = endEndMonth;
                }

                var insMonth = '';
                for (var i = startMonth; i <= endEndMonth; i++) {
                    month = this._pad(i + 1, 2);
                    if ($.datepicker._getInst($targetInp[0]).drawMonth === i) {
                        insMonth += '<option value="' + i + '" selected>' + month + '월</option>';
                    } else {
                        insMonth += '<option value="' + i + '">' + month + '월</option>';
                    }

                }
                $selectMonth.find('option').remove();
                $selectMonth.append(insMonth);
                $selectMonth.siblings('a').getInstance().resetSB();


                //년도 수정
                if (isChageYear) {
                    $('.selYearS option').prop("selected", false);
                    $('.selYearS option[value=' + selDate + ']').prop("selected", true);
                    $target.closest('.calendarWrapNew').find('.selectArea .selectbox:eq(0) > a').getInstance().resetSB();
                }
            } else if ($target.closest('.selectbox').index() == 1) {
                //월 선택
                selDate = Number(selDate) - 1;

                $.datepicker._getInst($targetInp[0]).drawMonth = selDate;
                $.datepicker._getInst($targetInp[0]).selectedMonth = selDate;
            }
            $targetInp.datepicker('refresh');
            this._renderDateHeader({
                target: $('.calenWrapLayerS .ui-datepicker-inline'),
                year: $.datepicker._getInst($targetInp[0]).drawYear,
                month: $.datepicker._getInst($targetInp[0]).drawMonth + 1
            });
        },
        _pad: function (n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        },
        _selDateBtn: function (e) {
            e.preventDefault();
            if ($(e.currentTarget).hasClass('ui-datepicker-next')) {
                this.lastFocusClass = '.ui-datepicker-next';
            } else {
                this.lastFocusClass = '.ui-datepicker-prev';
            }
            this._selDateRe();
        },
        _selDateRe: function () {
            var $calWrap = $('.calenWrapLayerS');
            var year = String($('.calenWrapLayerS .hasDatepicker').data('datepicker').drawYear);
            var month = String($('.calenWrapLayerS .hasDatepicker').data('datepicker').drawMonth);


            //이전/다음 버튼 선택 시 년도 변경 될 경우 다시 그려야 함
            if ((year !== this.orgYear) && this.orgYear !== undefined) {
                this._refreshDay($('.calenWrapLayerS .hasDatepicker'), year, true);
            } else {
                $calWrap.find('.selectbox:eq(0)').find('a').getInstance().setValueSB(year);
                $calWrap.find('.selectbox:eq(1)').find('a').getInstance().setValueSB(month);
            }

            setTimeout(function () {
                $calWrap.find('.selectbox:eq(0)').find('a.tit').attr('aria-selected', 'true');
                $calWrap.find('.selectbox:eq(1)').find('a.tit').attr('aria-selected', 'true');
            }, 100);

            this.orgYear = year;
        },
        _checkDateFormat: function (date) {
            if (date === '') {
                return 'yy. mm. dd';
            } else {
                var gubun = date.substr(4, 1);

                var dateFormat = date.split(gubun);
                var regex = /[0-9]/g;
                var dateFormat1 = dateFormat[1].replace(regex, 'm');
                var dateFormat2 = dateFormat[2].replace(regex, 'd');

                return 'yy' + gubun + dateFormat1 + gubun + dateFormat2;
            }
        }
    };
    ns.calendarE = {
        init: function () {
            if ($('.calenWrapLayerE').length === 0) {
                return;
            }
            this.$dimmed = $('.dimmed');
            this._bindEvent();
            this._setElment();
            this._createSelDate();
        },

        _setElment: function () {
            var $jsDatepicker = $('.calenWrapLayerE .calendarWrapNew'),
                $jsDatepickerInput = $jsDatepicker.siblings('input'),
                getDataMin = $jsDatepickerInput.data('min') || '-2Y',
                getDataMax = $jsDatepickerInput.siblings('input').data('max') || '+4Y',
                oSelf = this,
                dateFormat = oSelf._checkDateFormat($jsDatepickerInput.val());

            $jsDatepicker.datepicker({
                dateFormat: dateFormat,
                showMonthAfterYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                setweek: true,
                monthNames: ['.01', '.02', '.03', '.04', '.05', '.06', '.07', '.08', '.09', '.10', '.11', '.12'],
                dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                monthNamesShort: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
                showButtonPanel: false,
                minDate: getDataMin,
                maxDate: getDataMax,
                closeText: '취소',
                altField: '.dateEnd',
                defaultDate: $('#endDtCalen').val()
            })
        },
        _bindEvent: function () {
            var oSelf = this;

            //데이터피커 외부 영역 클릭 시 달력 닫히는 부분 방지
            $(document).unbind('mousedown', $.datepicker._checkExternalClick);

            //이전/다음 버튼 클릭
            $(document).on('click', '.ui-datepicker-prev, .ui-datepicker-next', $.proxy(this._selDateBtn, this));

            //년도, 날짜 선택
            $(document).on('click.selDateBox');
            $(document).on('click.selDateBox', '.calenWrapLayerE .overcon a', function (e) {
                if ($(this).closest('.selectbox').index() === 0) {
                    //년도 선택
                    oSelf.lastFocusClass = '.selectbox > a:eq(0)';
                } else {
                    //월 선택
                    oSelf.lastFocusClass = '.selectbox > a:eq(1)';
                }
                oSelf._refreshDay($(this), $(this).text().replace(/[^0-9]/g, ""));
            });

            $(document).off('keydown.cal').on('keydown.cal', '.calenWrapLayerE .selectbox >a', function (e) {
                if (e.keyCode >= 37 && e.keyCode <= 40) {
                    if ($(this).closest('.selectbox').index() === 0) {
                        //년도 선택
                        oSelf.lastFocusClass = '.selectbox > a:eq(0)';
                    } else {
                        //월 선택
                        oSelf.lastFocusClass = '.selectbox > a:eq(1)';
                    }
                    oSelf._refreshDay($(this), $(this).text().replace(/[^0-9]/g, ""));
                }
            });

            $(document).on('focus', '.btnCal', function () {
                oSelf.$dimmed.css('z-index', '10001').show();
                $('.dateLayer').show();
                $('.dateLayer .selectbox > a:eq(0)').focus();
                $('.calenWrapLayerE .calendarWrapNew').datepicker('setDate', $('#endDtCalen').val());
                oSelf._selDateRe();
            });

            $(document).on('click', '.radioCal', function () {
                oSelf.$dimmed.css('z-index', '10001').show();
                $('.dateLayer').show();
                $('.dateLayer .selectbox > a:eq(0)').focus();
                $('.calenWrapLayerE .calendarWrapNew').datepicker('setDate', $('#endDtCalen').val());
                oSelf._selDateRe();
            });

            $(document).on('click', '.dateLayer .closeL', function () {
                $('.dateLayer').hide();
            });
        },
        _createSelDate: function (input, date) {
            var input = $('.calenWrapLayerE .hasDatepicker');
            //년도 선택
            var insYear = '';
            var today = new Date();
            var todayMonth = today.getMonth();
            var todayYear = today.getFullYear();
            if (input.data('min') !== undefined) {
                this.minYear = Number(input.data('min').replace(/[^0-9]/g, '').substring(0, 4));
                this.minMonth = Number(input.data('min').replace(/[^0-9]/g, '').substring(4, 6)) - 1;
            } else {
                var minDate = 2;
                this.minYear = todayYear - minDate;
                this.minMonth = todayMonth;
            }

            if (input.data('max') !== undefined) {
                this.maxYear = Number(input.data('max').replace(/[^0-9]/g, '').substring(0, 4));
                this.maxMonth = Number(input.data('max').replace(/[^0-9]/g, '').substring(4, 6));
            } else {
                var maxDate = 4;
                this.maxYear = todayYear + maxDate;
                this.maxMonth = todayMonth + 1;
            }
            for (var y = this.minYear; y <= this.maxYear; y++) {
                if (Number($(".calenWrapLayerE .ui-datepicker-year").text().substring(0, 4)) === y) {
                    insYear += '<option value="' + y + '" selected>' + y + '년</option>';
                } else {
                    insYear += '<option value="' + y + '">' + y + '년</option>';
                }

            }
            $('.calenWrapLayerE').find('select').eq(0).append(insYear);

            //월 create
            var insMonth = '';
            var minMonth, maxMonth;

            if (this.minYear === Number($('.calenWrapLayerE .ui-datepicker-year').text())) {
                minMonth = this.minMonth;
            } else {
                minMonth = 0;
            }

            if (Number($('.calenWrapLayerE .ui-datepicker-year').text()) < this.maxYear) {
                maxMonth = 12;
            } else {
                maxMonth = this.maxMonth;
            }


            for (var m = minMonth; m < maxMonth; m++) {
                month = this._pad(m + 1, 2);

                if (Number($(".calenWrapLayerE .ui-datepicker-month").text().substring(1, 3)) - 1 === m) {
                    insMonth += '<option value="' + m + '" selected>' + month + '월</option>';
                } else {
                    insMonth += '<option value="' + m + '">' + month + '월</option>';
                }

            }
            $('.calenWrapLayerE').find('select').eq(1).append(insMonth);
            $.SelectBoxSet('.calenWrapLayerE div.selectbox select', {
                height: 200,
                multiText: '|'
            });
        },
        _renderDateHeader: function (opts) {
            opts.target.find('.tblCalendar').prepend('<caption>달력 테이블에는 일,월,화,수,목,금,토 요일과 일 선택을 하실 수 있습니다.</caption>');
            opts.target.find('.ui-datepicker-current').remove();

            //disabled 된 영역 접근성 추가
            opts.target.find('.ui-datepicker-unselectable').children().attr('aria-disabled', 'true');

            //접근성 - 좌우 화살표에 a 링크에 href 속성 추가
            opts.target.find('.ui-datepicker-prev').attr('href', '#');
            opts.target.find('.ui-datepicker-next').attr('href', '#');

        },
        _refreshDay: function ($target, _selDate, isChageYear) {
            var $targetInp = $target.closest('.hasDatepicker');
            var inpIns;
            var selDate = Number(_selDate);
            var $selectedYear = $target.closest('.calendarWrapNew').find('.selYearE');
            var $selectMonth = $target.closest('.calendarWrapNew').find('.selMonthE');

            //년도 선택
            if ($target.closest('.selectbox').index() == 0 || isChageYear) {
                $.datepicker._getInst($targetInp[0]).drawYear = selDate;
                $.datepicker._getInst($targetInp[0]).selectedYear = selDate;

                //해당 달 그리기
                var startMonth;
                var endEndMonth;
                var today = new Date();
                var todayMonth = today.getMonth();
                if (selDate === this.minYear) {
                    startMonth = this.minMonth;
                    endEndMonth = 11;
                } else if (selDate === this.maxYear) {
                    startMonth = 0;
                    endEndMonth = this.maxMonth - 1;
                } else {
                    startMonth = 0;
                    endEndMonth = 11;
                }

                if ($.datepicker._getInst($targetInp[0]).drawMonth < startMonth) {
                    $.datepicker._getInst($targetInp[0]).drawMonth = startMonth;
                    $.datepicker._getInst($targetInp[0]).selectedMonth = startMonth;
                }

                if ($.datepicker._getInst($targetInp[0]).drawMonth > endEndMonth) {
                    $.datepicker._getInst($targetInp[0]).drawMonth = endEndMonth;
                    $.datepicker._getInst($targetInp[0]).selectedMonth = endEndMonth;
                }

                var insMonth = '';
                for (var i = startMonth; i <= endEndMonth; i++) {
                    month = this._pad(i + 1, 2);
                    if ($.datepicker._getInst($targetInp[0]).drawMonth === i) {
                        insMonth += '<option value="' + i + '" selected>' + month + '월</option>';
                    } else {
                        insMonth += '<option value="' + i + '">' + month + '월</option>';
                    }

                }
                $selectMonth.find('option').remove();
                $selectMonth.append(insMonth);
                $selectMonth.siblings('a').getInstance().resetSB();


                //년도 수정
                if (isChageYear) {
                    $('.selYearE option').prop("selected", false);
                    $('.selYearE option[value=' + selDate + ']').prop("selected", true);
                    $target.closest('.calendarWrapNew').find('.selectArea .selectbox:eq(0) > a').getInstance().resetSB();
                }
            } else if ($target.closest('.selectbox').index() == 1) {
                //월 선택
                selDate = Number(selDate) - 1;

                $.datepicker._getInst($targetInp[0]).drawMonth = selDate;
                $.datepicker._getInst($targetInp[0]).selectedMonth = selDate;

            }
            $targetInp.datepicker('refresh');
            this._renderDateHeader({
                target: $('.calenWrapLayerE .ui-datepicker-inline'),
                year: $.datepicker._getInst($targetInp[0]).drawYear,
                month: $.datepicker._getInst($targetInp[0]).drawMonth + 1
            });

        },
        _pad: function (n, width) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        },
        _selDateBtn: function (e) {
            e.preventDefault();
            if ($(e.currentTarget).hasClass('ui-datepicker-next')) {
                this.lastFocusClass = '.ui-datepicker-next';
            } else {
                this.lastFocusClass = '.ui-datepicker-prev';
            }
            this._selDateRe();
        },
        _selDateRe: function () {
            var $calWrap = $('.calenWrapLayerE');
            var year = String($('.calenWrapLayerE .hasDatepicker').data('datepicker').drawYear);
            var month = String($('.calenWrapLayerE .hasDatepicker').data('datepicker').drawMonth);


            //이전/다음 버튼 선택 시 년도 변경 될 경우 다시 그려야 함
            if ((year !== this.orgYear) && this.orgYear !== undefined) {
                this._refreshDay($('.calenWrapLayerE .hasDatepicker'), year, true);
            } else {
                $calWrap.find('.selectbox:eq(0)').find('a').getInstance().setValueSB(year);
                $calWrap.find('.selectbox:eq(1)').find('a').getInstance().setValueSB(month);
            }

            setTimeout(function () {
                $calWrap.find('.selectbox:eq(0)').find('a.tit').attr('aria-selected', 'true');
                $calWrap.find('.selectbox:eq(1)').find('a.tit').attr('aria-selected', 'true');
            }, 100);

            this.orgYear = year;
        },
        _checkDateFormat: function (date) {
            if (date === '') {
                return 'yy. mm. dd';
            } else {
                var gubun = date.substr(4, 1);

                var dateFormat = date.split(gubun);
                var regex = /[0-9]/g;
                var dateFormat1 = dateFormat[1].replace(regex, 'm');
                var dateFormat2 = dateFormat[2].replace(regex, 'd');

                return 'yy' + gubun + dateFormat1 + gubun + dateFormat2;
            }
        }
    };

    var defaultTabJs = {
        activeClass: 'on'
    };

    ns.gnbAniEvent = {
        init: function () {
            this.$gnbWrap = $('.gnb');
            if (this.$gnbWrap.length === 0) {
                return;
            }
            this.$gnbWrap = $('.gnb');
            this.$gnbInner = $('.gnbInner');
            this.$gnbBtn = $('.gnbBtm');
            this.$dimmed = $('.dimmed');

            this.$totSearch = $('.totalSearch');
            this.$btnTotSearch = this.$totSearch.find('>button');
            this.$totSearchBox = $('.totalSearch .totalSearchBox');

            this.$totMenu = $('.totalMenu');
            this.$btnTotMenu = this.$totMenu.find('>button');
            this.$totMenuBox = this.$totMenu.find('.totalMenuBox');
            this.$totMenuLi = this.$totMenuBox.find('.tabMulti li');

            this.$defaultWord = $('.wordWrap').eq(0);
            this.$autoWord = $('.wordWrap.autoWord');

            this.$menuScroll = $('.menuScroll');
            this._setAccessbillity();
            this._setElementGNB();
            this._bindEvent();
        },
        _setAccessbillity: function () {
            //키보드 탭 이동 시 - gnb 메뉴 벗어날 경우 닫기
            $(document).on('keydown keyup', $.proxy(this._keydownTabMove, this));

            //키보드 탭 이동시 - 포커스 순차 이동
            $('.socialWrap , .compWrap').on('keydown', '.gnbArea', $.proxy(this._keydownSocialTabMove, this));
        },
        _keydownSocialTabMove: function (e) {
            var event = e;
            if ($(e.target).closest('.gnb').length > 0) {
                //대메뉴
                if (!event.shiftKey && event.keyCode === 9) {
                    //tab
                    var menuIdx = $(e.target).parent().index();
                    $('.snbDep2').eq(menuIdx).attr('tabindex', -1).focus();

                    //사회 공헌 마지막 대분류 탭 클릭 시 닫기 버튼으로 포커스 이동
                    if ($('.compWrap').length > 0 && $('.snbDep2').eq(menuIdx).length === 0) {
                        event.preventDefault();
                        $('.gnbCont .gnbClose').focus();
                    }
                }
            }

            //메뉴컨텐츠
            if ($(e.target).closest('.snbDep2').length > 0) {
                var $focus = $(e.target).closest('.snbDep2').find('a');
                var $firstFocus = $focus.first();
                var $lastFocus = $focus.last();

                //첫번째 링크 back tab: 이전 대분류 포커스 이동
                if (event.shiftKey && event.keyCode === 9) {
                    if ($(e.target).get(0) === $firstFocus.get(0)) {
                        var menuIdx = $('.gnbList .snbDep2').index($(e.target).closest('.snbDep2'));
                        event.preventDefault();
                        $('.gnb a').eq(menuIdx).focus();
                    }
                }

                //마지막 링크 tab : 다음 대분류 포커스 이동
                if (!event.shiftKey && event.keyCode === 9) {
                    if ($(e.target).get(0) === $lastFocus.get(0)) {
                        var menuIdx = $('.gnbList .snbDep2').index($(e.target).closest('.snbDep2'));

                        if ($('.gnb a').eq(menuIdx + 1).length > 0) {
                            event.preventDefault();
                            $('.gnb a').eq(menuIdx + 1).focus();
                            $('.gnb > li > a').removeAttr('aria-selected');
                            $('.gnb a').eq(menuIdx + 1).attr('aria-selected', 'true');
                        }
                    }
                }
            }
        },
        _keydownTabMove: function (e) {
            //gnb list
            if ($('.socialWrap .gnbList:visible').length > 0) {
                this._moveTabSocialGnbList(e);
            } else if ($('.compWrap:visible').length > 0) {
                this._moveTabCompGnbList(e);
            } else if ($('.gnbList:visible').length > 0) {
                this._moveTabGnbList();
            }

            //menu loc
            if ($('.menuLoc .sGnb:visible').length > 0) {
                this._moveTabMenuLoc();
            }
        },
        _moveTabSocialGnbList: function (e) {
            var isGnbFocus, gnbMenuIdx;
            var event = e;
            if (!$('.wrapper').hasClass('socialWrap')) {
                return;
            }

            //사회공헌
            isGnbFocus = $(':focus').closest('.gnbArea').length > 0;
            if (isGnbFocus) {
                if ($(e.target).closest('.gnb').length > 0) {
                    var selGnbMenuIdx = $('.gnb a[aria-selected=true]').closest('li').index();
                    var curGnbMenuIdx = $(e.target).closest('li').index();
                    if (selGnbMenuIdx !== curGnbMenuIdx) {
                        $('.gnb > li > a').removeAttr('aria-selected');
                        $('.gnb a').eq(curGnbMenuIdx).attr('aria-selected', 'true');
                    }
                }
            } else {
                this._hideGnbSocial();
            }
        },
        _moveTabCompGnbList: function (e) {
            var isGnbFocus, gnbMenuIdx;
            var event = e;
            if (!$('.wrapper').hasClass('compWrap')) {
                return;
            }

            //사회공헌
            isGnbFocus = $(':focus').closest('.gnbArea').length > 0;
            if (isGnbFocus) {
                if ($(e.target).closest('.gnb').length > 0) {
                    var selGnbMenuIdx = $('.gnb a[aria-selected=true]').closest('li').index();
                    var curGnbMenuIdx = $(e.target).closest('li').index();
                    if (selGnbMenuIdx !== curGnbMenuIdx) {
                        $('.gnb > li > a').removeAttr('aria-selected');
                        $('.gnb a').eq(curGnbMenuIdx).attr('aria-selected', 'true');
                    }
                }
            } else {
                this._hideGnbComp();
            }
        },
        _moveTabGnbList: function () {
            var gnbMenuIdx, gnbContIdx, isGnbFocus;

            if (
                $('.wrapper').hasClass('tripWrapper') || //여행
                $('.wrapper').hasClass('buySaleWrapper') || // 법인(구매, 판매)
                $('.wrapper').hasClass('shopWrapper') //가맹점
            ) {
                gnbMenuIdx = $(':focus').closest('[class*=gnb0]').index();
                gnbContIdx = $('.gnbList:visible').closest('li').index();

                if (gnbMenuIdx !== gnbContIdx) {
                    if ($('.wrapper').hasClass('tripWrapper')) {
                        this._hideGnbTrip();
                    } else if (
                        $('.wrapper').hasClass('buySaleWrapper') ||
                        $('.wrapper').hasClass('shopWrapper')
                    ) {
                        this._hideGnbShop();
                    }
                }
            }
        },
        _moveTabMenuLoc: function () {
            var menuLocIdx = $(':focus').closest('.menuLoc').index();
            var menuLocContIdx = $('.sGnb:visible').closest('.menuLoc').index();
            if (menuLocIdx !== menuLocContIdx) {
                ns.menuLocEvent.hideMenuLoc();
            }
        },
        _setElementGNB: function () {
            if ($('.wrapper').hasClass('buySaleWrapper') || $('.wrapper').hasClass('shopWrapper')) {
                return;
            }
            //GNB가 열려 있을 경우
            if ($('.gnbCont:visible').length > 0) {
                var $visibleCont = $('.gnbCont:visible');
                var $gnbWrap = $visibleCont.closest('.gnb');
                var $gnbElWrap = $visibleCont.closest('li');
                var gnbHeight = $visibleCont.outerHeight() + $gnbElWrap.find('>a').outerHeight();

                $gnbWrap.css('height', gnbHeight);
                this.$gnbBtn.show();
                this.$dimmed.show();
            }

            if (this.$autoWord.length > 0) {
                this._setScrollWrap(this.$autoWord.find('.left'));
            }

            // var actTotMenuIdx = this.$totMenuBox.find('.tabMulti li.on').index();
            // $('.menuScroll > div').eq(actTotMenuIdx).siblings().hide();
            if (this.$menuScroll.children().length > 0) {
                //화면 높이로 지정 
                var menuH = $(window).height() - 300;
                this.$menuScroll.css('height', menuH);
                this._setScrollWrap(this.$menuScroll);
            }

            this.$gnbInner.css('max-height', $(window).height() - 310);
            this._setScrollWrap(this.$gnbInner);

        },
        _bindEvent: function () {

            //기본 GNB (법인)
            $(document).off('mouseenter.showGnb');
            $(document).on('mouseenter.showGnb', '.gnb > li > a', $.proxy(this._showGnbDef, this));

            $(document).off('mouseleave.gnbArea');
            $(document).on('mouseleave.gnbArea', '.gnbArea', $.proxy(this._mouseleaveHideGnbDef, this));


            $(document).off('click.hideGnb');
            $(document).on('click.hideGnb', '.gnbClose', $.proxy(this.hideGnbDef, this));

            $(document).off('keyup.checkFocusGnb');
            $(document).on('keyup.checkFocusGnb', $.proxy(this._keyupCheckFocusDef, this));

            //여행 GNB 닫기 
            $('.tripWrapper').off('click.hideGnbTrip');
            $('.tripWrapper').on('click.hideGnbTrip', $.proxy(this._hideGnbTrip, this));

            //가맹점 GNB (구매)
            $('.buySaleWrapper, .shopWrapper').off('click.showGnbShop');
            $('.buySaleWrapper, .shopWrapper').on('click.showGnbShop', '.gnb>li>a, .gnb>li>a', $.proxy(this._showGnbShop, this));

            $('.buySaleWrapper, .shopWrapper').off('click.hideGnbShop');
            $('.buySaleWrapper, .shopWrapper').on('click.hideGnbShop', $.proxy(this._hideGnbShop, this));

            //회사소개 GNB
            $('.compWrap').off('click.showGnbComp');
            $('.compWrap').on('click.showGnbComp', '.gnb>li>a', $.proxy(this._showGnbComp, this));

            $('.compWrap').off('click.hideGnbComp');
            $('.compWrap').on('click.hideGnbComp', '.gnbClose', $.proxy(this._hideGnbComp, this));


            //회사소개 GNB hover
            $('.compWrap').off('mouseenter.hoverComp');
            $('.compWrap').on('mouseenter.hoverComp', '.header', $.proxy(this._mouseEGnbComp, this));

            $('.compWrap').off('mouseleave.hoverComp');
            $('.compWrap').on('mouseleave.hoverComp', '.header', $.proxy(this._mouseLGnbComp, this));


            //사회 공헌 GNB
            $('.socialWrap').off('click.showGnbSocial');
            $('.socialWrap').on('click.showGnbSocial', '.gnb>li>a', $.proxy(this._showGnbSocial, this));

            $('.socialWrap').off('click.hideGnbSocial');
            $('.socialWrap').on('click.hideGnbSocial', $.proxy(this._hideGnbSocial, this));



            //토탈 메뉴
            $(document).off('click.totSearch');
            $(document).on('click.totSearch', '.totalSearch>button', $.proxy(this._onClickTotSearch, this));

            $(document).off('click.totMenu');
            $(document).on('click.totMenu', '.totalMenu>button', $.proxy(this._onClickTotMenu, this));

            $(document).on('keydown keyup', '.searchArea input', $.proxy(this._keyDownInpWord, this));

            $(document).off('click.btnDel');
            $(document).on('click.btnDel', '.searchArea  .del', $.proxy(this._onClickdelInp, this));


            $(document).off('click.totMenuLi');
            $(document).on('click.totMenuLi', '.totalMenuBox  .tabMulti  a', $.proxy(this._onClickTotMenuLi, this));

            this.$menuScroll.off('scroll.totMenu');
            this.$menuScroll.on('scroll.totMenu', $.proxy(this._scrollTotMenu, this));

            //리사이즈
            $(window).on('resize', $.proxy(this._resizeGnb, this));

        },
        _showGnbDef: function (e) {
            if ($('.wrapper').hasClass('buySaleWrapper') ||
                $('.wrapper').hasClass('shopWrapper') ||
                $('.wrapper').hasClass('socialWrap') ||
                $('.wrapper').hasClass('compWrap') ||
                $('.taxSaveAdmin').length > 0 ||
                $('.socialCont').length > 0
            ) {
                return;
            }

            var $gnbEl;
            if (e.currentTarget === undefined) {
                $gnbEl = e;
            } else {
                $gnbEl = $(e.currentTarget);
            }
            var oSelf = this;
            var $gnbElWrap = $gnbEl.closest('li');
            var $gnbElCont = $gnbElWrap.find('.gnbCont');
            var gnbHeight = $gnbEl.outerHeight() + $gnbElCont.outerHeight();
            var $gnbWrap = $gnbEl.closest('.gnb');

            var isVisibleEl = $gnbWrap.find('>li >a').filter(function () {
                return ($(this).attr('aria-selected') === 'true');
            });

            //gnb 높이 지정
            $gnbWrap.css('height', gnbHeight);


            //메뉴 선택
            $gnbWrap.find('>li >a').attr('aria-selected', 'false');
            $gnbEl.attr('aria-selected', 'true');
            $('.gnbArea').addClass('on');
            $('#header').addClass('on');

            //리사이즈
            this._resizeGnb();

            //이전 메뉴 열려 있는 지 체크
            if (this.$btnTotSearch.attr('aria-expanded') === "true") {
                this.$btnTotSearch.attr('aria-expanded', 'false');
                this.$btnTotSearch.text(this.$btnTotSearch.text().replace(' 닫기', ''));
                this.$totSearchBox.removeAttr('style');
                this.$gnbBtn.show();
                isVisibleEl = 1;
            }

            if (this.$btnTotMenu.attr('aria-expanded') === "true") {
                this.$btnTotMenu.attr('aria-expanded', 'false');
                this.$btnTotMenu.text(this.$btnTotMenu.text().replace(' 닫기', ''));
                this.$totMenuBox.removeAttr('style');
                this.$gnbBtn.show();
                isVisibleEl = 1;
            }

            //맨 처음에만 animation
            if (isVisibleEl.length === 0) {
                $gnbElCont.hide();
                $gnbElCont.stop().slideDown(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                    oSelf.$gnbBtn.show();
                });

                if (!$('.wrapper').hasClass('tripWrapper')) {
                    this.$dimmed.css('z-index', 10002);
                    this.$dimmed.stop().fadeIn(400);
                }
            }

            this._onGnbScrollBlock();
        },
        _mouseleaveHideGnbDef: function (e) {

            if ($('.wrapper').hasClass('buySaleWrapper') ||
                $('.wrapper').hasClass('shopWrapper') ||
                $('.wrapper').hasClass('compWrap') ||
                $('.gnbCont:visible').length === 0 ||
                $('.taxSaveAdmin').length > 0 ||
                $('.socialCont').length > 0
            ) {
                return;
            }
            if (e.toElement !== undefined) {
                if ($(e.toElement).closest('.topSide').length === 0 &&
                    $(e.toElement).closest('.gnbArea').length === 0) {
                    this.hideGnbDef();
                }

            } else {
                this.hideGnbDef();
            }
        },
        _keyupCheckFocusDef: function (e) {
            if ($('.wrapper').hasClass('buySaleWrapper') ||
                $('.wrapper').hasClass('shopWrapper') ||
                $('.wrapper').hasClass('compWrap') ||
                $('.gnbCont:visible').length === 0 ||
                $('.taxSaveAdmin').length > 0 ||
                $('.socialCont').length > 0
            ) {
                return;
            }
            //tab 키 눌렀을 경우에만 체크
            if (e.keyCode !== 9 && e.keyCode !== 16 && e.keyCode !== 13) {
                return;
            }
            var $target = $(e.target);

            if ($target.get(0).tagName === 'INPUT') {
                return;
            }

            if ($target.closest('[class*=gnb0]').length > 0) {
                if (e.keyCode === 13) {
                    //엔터키 누를 경우 메뉴 열림
                    this._showGnbDef($target);
                }
            }

            if (
                $target.closest('.gnbArea').length === 0 &&
                $target.closest('.totalSearch').length === 0 &&
                $target.closest('.totalMenu').length === 0 &&
                $target.closest('.alertBox').length === 0
            ) {
                this.hideGnbDef('', false);
            }
        },
        hideGnbDef: function (fnCallback, isMoveFocus) {  //isMoveFocus :  메뉴 닫힐 경우 포커스 이동 여부
            if ($('.wrapper').hasClass('buySaleWrapper') ||
                $('.wrapper').hasClass('shopWrapper') ||
                $('.wrapper').hasClass('compWrap') ||
                $('.gnbCont:visible').length === 0 ||
                $('.taxSaveAdmin').length > 0 ||
                $('.socialCont').length > 0
            ) {
                return;
            }
            var oSelf = this;
            if ($('.gnbCont:visible').length > 0) {
                $('.gnbCont:visible').show();
                $('.gnbCont:visible').closest('li').find('>a').attr('aria-selected', 'false');
                $('.gnbArea').removeClass('on');
                $('.gnbCont:visible').stop().slideUp(400, 'easeOutCubic', function () {
                    if (isMoveFocus !== false) {
                        if ($(this).closest('li').hasClass('gnb07')) {
                            $('.totalSearch>button').focus();
                        } else {
                            $(this).closest('li').find('a').focus();
                        }
                    }
                    $('#header').removeClass('on');

                    $(this).removeAttr('style');
                    oSelf.$gnbWrap.removeAttr('style');

                    //fnCallback 함수 호출 
                    if (fnCallback && (typeof fnCallback === 'function')) {
                        fnCallback();
                    }
                });
                this.$gnbBtn.hide();
            }

            if (this.$btnTotSearch.attr('aria-expanded') === "true") {
                this._hideTotBox();
            }

            if (this.$btnTotMenu.attr('aria-expanded') === "true") {
                this._hideTotMenu(fnCallback);
            }

            this.$dimmed.stop().fadeOut(400, function () {
                $(this).css('z-index', '');
            });
            this._offGnbScrollBlock();
        },
        _hideGnbTrip: function (e) {
            if (!$('.wrapper').hasClass('tripWrapper')) {
                return;
            }
            if (e) {
                var $menuEl = $(e.target);

                if ($menuEl.closest('[class*=gnb0]').length > 0) {
                    return;
                }
            }
            if ($('.gnbList:visible').length > 0) {
                var $menu = $('[class*=gnb0]').find('>a[aria-selected="true"]');
                var $gnbList = $menu.siblings('.gnbCont');

                $gnbList.slideUp(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                    if (e) {
                        $(this).closest('li').find('a').focus();
                    }
                    $menu.attr('aria-selected', 'false');
                });
            }

        },
        _onClickTotSearch: function (e) {
            $('.gnbArea').removeClass('on');

            if (this.$btnTotSearch.attr('aria-expanded') === "true") {
                this._offGnbScrollBlock();
                this._hideTotBox();
            } else {
                this._onGnbScrollBlock();
                this._showTotBox();
            }

        },
        _showTotBox: function () {
            this.$btnTotSearch.attr('aria-expanded', 'true');
            this.$btnTotSearch.text(this.$btnTotSearch.text() + ' 닫기');
            this.$dimmed.css('z-index', 10002);
            $('#header').addClass('on');
            if ($('.gnbCont:visible').length > 0) {
                $('.gnb .gnbCont:visible').closest('li').find('>a').attr('aria-selected', 'false');
                this.$gnbBtn.hide();
                this.$gnbWrap.removeAttr('style');

                this.$totSearchBox.show();
            } else if ($('.gnbList:visible').length > 0) {
                $('.gnb .gnbList:visible').closest('li').find('>a').attr('aria-selected', 'false');
                $('.gnb .gnbList:visible').closest('li').find('> .gnbList').hide();

                this.$totSearchBox.show();

                this.$dimmed.show();
            } else if (this.$btnTotMenu.attr('aria-expanded') === "true") {
                this.$btnTotMenu.attr('aria-expanded', 'false');
                this.$btnTotMenu.text(this.$btnTotMenu.text().replace(' 닫기', ''));
                this.$totMenuBox.removeAttr('style');

                this.$totSearchBox.show();
            } else {
                this.$totSearchBox.stop().slideDown(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                    $(this).show();
                });
                this.$dimmed.stop().fadeIn(400);
            }
        },
        _hideTotBox: function () {
            var oSelf = this;
            this.$btnTotSearch.attr('aria-expanded', 'false');
            this.$btnTotSearch.text(this.$btnTotSearch.text().replace(' 닫기', ''));
            this.$totSearchBox.stop().slideUp(400, 'easeOutCubic', function () {
                $(this).removeAttr('style');
                oSelf.$dimmed.hide();
                oSelf.$dimmed.css('z-index', '');
                $('#header').removeClass('on');
            });
            this.$dimmed.stop().fadeOut(400, function () {
                $(this).removeAttr('style');
            });
        },
        _onClickTotMenu: function () {
            $('.gnbArea').removeClass('on');
            if (this.$btnTotMenu.attr('aria-expanded') === "true") {
                this._offGnbScrollBlock();
                this._hideTotMenu();
            } else {
                this._onGnbScrollBlock();
                this._showTotMenu();
            }
        },
        _showTotMenu: function () {
            var oSelf = this;
            this.$btnTotMenu.attr('aria-expanded', 'true');
            this.$btnTotMenu.text(this.$btnTotMenu.text() + ' 닫기');
            this.$dimmed.css('z-index', 10002);
            $('#header').addClass('on');
            if ($('.gnbCont:visible').length > 0) {
                $('.gnb .gnbCont:visible').closest('li').find('>a').attr('aria-selected', 'false');
                this.$gnbBtn.hide();
                this.$gnbWrap.removeAttr('style');

                this.$totMenuBox.show();
                this.$dimmed.show();

            } else if ($('.gnbList:visible').length > 0) {
                $('.gnb .gnbList:visible').closest('li').find('>a').attr('aria-selected', 'false');
                $('.gnb .gnbList:visible').closest('li').find('> .gnbList').hide();
                this.$dimmed.show();
                this.$totMenuBox.show();
            } else if (this.$btnTotSearch.attr('aria-expanded') === "true") {
                this.$btnTotSearch.attr('aria-expanded', 'false');
                this.$btnTotSearch.text(this.$btnTotSearch.text().replace(' 닫기', ''));
                this.$totSearchBox.removeAttr('style');

                this.$totMenuBox.show();
            } else {
                this.$totMenuBox.stop().slideDown(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                    $(this).show();
                });
                this.$dimmed.stop().fadeIn(400);
            }

        },
        _onGnbScrollBlock: function () {
            $(document).off('mousewheel.gnbScroll').on('mousewheel.gnbScroll', function (e) {
                e.preventDefault();
            });
        },
        _offGnbScrollBlock: function () {
            //body 스크롤 풀기
            $(document).off('mousewheel.gnbScroll');
        },
        _hideTotMenu: function (fnCallback) {
            var oSelf = this;
            this.$btnTotMenu.attr('aria-expanded', 'false');
            this.$btnTotMenu.text(this.$btnTotMenu.text().replace(' 닫기', ''));

            this.$totMenuBox.stop().slideUp(400, 'easeOutCubic', function () {
                $(this).removeAttr('style');
                $('#header').removeClass('on');
                //fnCallback 함수 호출 
                if (fnCallback && (typeof fnCallback === 'function')) {
                    fnCallback();
                }
                oSelf.$dimmed.hide();
                oSelf.$dimmed.css('z-index', '');
            });
            this.$dimmed.stop().fadeOut(400, function () {
                $(this).removeAttr('style');
            });
            this._offGnbScrollBlock();
        },
        _keyDownInpWord: function (e) {
            var inpWord = $(e.currentTarget).val();
            if (inpWord.length === 0) {
                this.$defaultWord.show();
                this.$autoWord.hide();
            } else {
                this.$defaultWord.hide();
                this.$autoWord.show();
            }

        },
        _onClickdelInp: function () {
            this.$defaultWord.show();
            this.$autoWord.hide();
        },
        _onClickTotMenuLi: function (e) {
            e.preventDefault();

            //menuScroll 스크롤 길이 구함
            this._getPosYMenuScroll();

            //menuScroll 스크롤 길이 구함
            this._getPosYMenuScroll();

            var curTabIdx = $(e.currentTarget).closest('li').index();
            var contPosY = this.oPosY[curTabIdx];
            this.$menuScroll.data('jsp').scrollToY(contPosY);
        },
        _getPosYMenuScroll: function () {
            //menuScroll 스크롤 길이 구함
            var oSelf = this;
            this.oPosY = [0];
            var totalPosY = 0;
            var $menuWrap;

            if ($('.menuScroll .jspPane >div').length > 0) {
                $menuWrap = $('.menuScroll .jspPane >div');
            } else {
                $menuWrap = $('.menuScroll > div');
            }

            $menuWrap.each(function () {
                totalPosY += $(this).outerHeight();
                oSelf.oPosY.push(totalPosY);
            });
        },
        _scrollTotMenu: function () {
            if (this.$menuScroll.data('jsp') === undefined) {
                return;
            }
            var curPosY = this.$menuScroll.data('jsp').getContentPositionY();
            var curTabIdx = 0;
            var maxLen = $('.tabMulti>li').length;
            var maxScroll = $('.menuScroll').data('jsp').getContentHeight() - this.$menuScroll.height();
            $.each(this.oPosY, function (idx, val) {
                if (curPosY >= maxScroll) {
                    curTabIdx = maxLen;
                    return false;
                } else if (curPosY < val) {
                    curTabIdx = idx;
                    return false;
                }
            });
            var curTab = this.$totMenuLi.eq(curTabIdx - 1);

            curTab.addClass('on');
            curTab.find('>a').attr('aria-selected', 'true');

            curTab.siblings().removeClass('on');
            curTab.siblings().attr('aria-selected', 'false');
        },
        _setScrollWrap: function ($target) {
            if ($target.length === 0) {
                return;
            }
            var oSelf = this;
            $target.parents().filter(function () {
                return $(this).css('display') === 'none';
            }).show().addClass('unhide_wrap');

            //menuScroll 스크롤 길이 구함
            if ($target.hasClass('menuScroll')) {
                this._getPosYMenuScroll();
            }

            var scrollHeigth = $target.height();
            $target.on(
                'jsp-initialised',
                function (event, isScrollable) {
                    //스크롤 조절
                    $(this).find('.jspTrack').removeAttr('style');
                    $(this).find('.jspDrag').css('height', $(this).find('.jspDrag').height());
                    //불필요한 태그 삭제
                    $(this).find('.jspArrow').remove();
                    $(this).find('.jspCap').remove();
                    $(this).find('.jspHorizontalBar').remove();
                    $(this).css('max-height', '');

                    $(this).css('width', '');
                    $(this).find('.jspContainer').css('width', '');
                    $(this).find('.jspPane').css('width', '');

                    //통합 검색일 경우에만 height 삭제 
                    if ($target.closest('.totalSearchBox').length > 0) {
                        $(this).find('.jspContainer').css('height', '');
                    }
                }
            )
                .jScrollPane({
                    showArrows: true,
                    verticalDragMinHeight: 30,
                    mouseWheelSpeed: scrollHeigth
                });

            $target.parents('.unhide_wrap').removeAttr('style');
            $target.parents('.unhide_wrap').removeClass('unhide_wrap');
        },
        _resizeGnb: function () {
            //menuScroll 리사이즈
            if (this.$menuScroll.length > 0 && this.$menuScroll.is(':visible')) {
                //화면 높이로 지정
                var menuH = $(window).height() - 300;
                this.$menuScroll.css('height', menuH);
                if (this.$menuScroll.data('jsp') !== undefined) {
                    this.$menuScroll.data('jsp').reinitialise();
                }
            }

            //gnb 높이 지정
            var $gnbEl = $('.gnb>  li >a[aria-selected= "true"]');
            var $gnbElWrap = $gnbEl.closest('li');
            var $gnbElCont = $gnbElWrap.find('.gnbCont');

            if ($gnbElWrap.find('.gnbInner').data('jsp') === undefined) {
                return;
            }
            var gnbContHeight = $gnbElWrap.find('.gnbInner').data('jsp').getContentHeight();
            var winHeigth = $(window).height() - 310;
            var maxHeight = gnbContHeight > winHeigth ? winHeigth : gnbContHeight;
            $gnbElWrap.find('.gnbInner').css('max-height', maxHeight);
            $gnbElWrap.find('.gnbInner').find('.jspContainer').css('height', maxHeight);

            $gnbElCont.find('.gnbInner').data('jsp').reinitialise();

            var gnbHeight = $gnbEl.outerHeight() + $gnbElCont.outerHeight();
            $('.gnb').css('height', gnbHeight);
        },
        _showGnbShop: function (e) {
            if (!$('.wrapper').hasClass('buySaleWrapper') && !$('.wrapper').hasClass('shopWrapper')) {
                return;
            }
            var $menu = $(e.currentTarget);
            var $gnbList = $menu.siblings('.gnbList');

            var isVisibleEl = $('.gnb >li >a').filter(function () {
                return ($(this).attr('aria-selected') === 'true');
            });

            //이전 메뉴 열려 있는 지 체크
            if (this.$btnTotSearch.attr('aria-expanded') === "true") {
                this.$btnTotSearch.attr('aria-expanded', 'false');
                this.$btnTotSearch.text(this.$btnTotSearch.text().replace(' 닫기', ''));
                this.$totSearchBox.removeAttr('style');
                this.$gnbBtn.show();
                isVisibleEl = 1;
            }

            if (this.$btnTotMenu.attr('aria-expanded') === "true") {
                this.$btnTotMenu.attr('aria-expanded', 'false');
                this.$btnTotMenu.text(this.$btnTotMenu.text().replace(' 닫기', ''));
                this.$totMenuBox.removeAttr('style');
                this.$gnbBtn.show();
                isVisibleEl = 1;
            }

            this.$dimmed.hide();
            if (isVisibleEl.length === 0) {
                $gnbList.slideDown(400, 'easeOutCubic');
            } else {
                $('.gnb > li  >a[aria-selected="true"]').siblings('.gnbList').hide();
                $('.gnb > li  >a[aria-selected="true"]').attr('aria-selected', 'false');
                $gnbList.show();
            }
            $menu.attr('aria-selected', 'true');
        },
        _hideGnbShop: function (e) {
            if (!$('.wrapper').hasClass('buySaleWrapper') && !$('.wrapper').hasClass('shopWrapper')) {
                return;
            }
            if (e) {
                var $menuEl = $(e.target);

                if ($menuEl.closest('[class*=gnb0]').length > 0 ||
                    $menuEl.closest('.totalSearch').length > 0 ||
                    $menuEl.closest('.totalMenu').length > 0
                ) {
                    return;
                }
            }

            if ($('.gnbList:visible').length > 0) {
                var $menu = $('.gnb > li >a[aria-selected="true"]');
                var $gnbList = $menu.siblings('.gnbList');

                $menu.attr('aria-selected', 'false');
                $gnbList.slideUp(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');

                    if (e) {
                        $(this).closest('li').find('a').focus();
                    }
                });
            }

            if (this.$btnTotSearch.attr('aria-expanded') === "true") {
                this._hideTotBox();
            }

            if (this.$btnTotMenu.attr('aria-expanded') === "true") {
                this.hideTotMenu();
            }

        },
        _showGnbSocial: function (e) {
            e.preventDefault();
            var $menu = $(e.currentTarget);
            var $gnbList = $('.gnbCont.socialCont');
            var menuIdx = $menu.parent().index();
            var $gnbSubMenuFocus = $('.snbDep2').eq(menuIdx);
            $('#gnb > li > a').removeAttr('aria-selected');
            $menu.attr('aria-selected', 'true');

            $('.snbDep2').removeAttr('tabindex');

            //처음 열 경우 슬라이드 모션 추가
            if (!$gnbList.is(':visible')) {
                $gnbList.slideDown(400, 'easeOutCubic');
            }
        },
        _hideGnbSocial: function (e) {
            //사회공헌 페이지에서 gnb 가 열려 있을 경우 체크
            if (!$('.wrapper').hasClass('socialWrap') &&
                !$('.gnbCont.socialCont').is(':visible')
            ) {
                return;
            }
            if (e) {
                var $menuEl = $(e.target);

                if ($menuEl.closest('[class*=gnb0]').length > 0 ||
                    $menuEl.closest('.gnbCont.socialCont').length > 0
                ) {
                    return;
                }
            }

            var $menu = $('.gnb > li >a[aria-selected="true"]');

            var $gnbList = $('.gnbCont.socialCont');
            $gnbList.slideUp(400, 'easeOutCubic', function () {
                $menu.attr('aria-selected', 'false');
                if (e) {
                    $menu.focus();
                }
            });
        },
        _showGnbComp: function (e) {
            if ($(e.currentTarget).closest('li').hasClass('socialLink')) {
                //링크 연결 시 아래 로직 안탐
                return;
            }

            //영문 사이트 제외
            if ($(e.currentTarget).closest('.gnb.en').length > 0) {
                return;
            }
            e.preventDefault();
            var $menu = $(e.currentTarget);
            var $gnbList = $('.gnbCont.companyCont');
            var menuIdx = $menu.parent().index();
            var $gnbSubMenuFocus = $('.snbDep2').eq(menuIdx);
            $('#gnb > li > a').removeAttr('aria-selected');
            $menu.attr('aria-selected', 'true');

            $('.snbDep2').removeAttr('tabindex');


            //처음 열 경우 슬라이드 모션 추가
            if (!$gnbList.is(':visible')) {
                $gnbList.slideDown(400, 'easeOutCubic', function () {
                    $gnbSubMenuFocus.attr('tabindex', -1).focus();
                });
                this.$dimmed.fadeIn(400);
            } else {
                $gnbSubMenuFocus.attr('tabindex', -1).focus();
            }

            this._onGnbScrollBlock();
        },
        _hideGnbComp: function (e) {
            //회사  페이지에서 gnb 가 열려 있을 경우 체크
            if (!$('.wrapper').hasClass('socialWrap') &&
                !$('.gnbCont.companyCont').is(':visible')
            ) {
                return;
            }


            var $menu = $('.gnb > li >a[aria-selected="true"]');

            var $gnbList = $('.gnbCont.companyCont');
            var $selectedMenu = $('#gnb > li > a').filter(function () {
                return $(this).attr('aria-selected') === 'true';
            });
            $gnbList.slideUp(400, 'easeOutCubic', function () {
                $('#gnb > li > a').removeAttr('aria-selected');
                $selectedMenu.focus();
                if ($('.fixed').length === 0) {
                    $('.header').removeClass('gnbOver');
                }
            });
            this.$dimmed.fadeOut(400, function () {
                $(this).css('z-index', '');
            });
            this._offGnbScrollBlock();
        },
        _mouseEGnbComp: function () {
            $('.header').addClass('gnbOver');
        },
        _mouseLGnbComp: function () {
            if (
                !$('.gnbCont.companyCont').is(':visible') &&
                $('.fixed').length === 0
            ) {

                $('.header').removeClass('gnbOver');
            }
        },
        closeAllMenu: function () {
            $('.gnbArea').removeClass('on');
            if ($('.gnbList').is(':visible')) {
                $('.gnb').removeAttr('style');
                $('.gnbBtm').removeAttr('style');
                $('.gnb > li >a[aria-selected=true]').removeAttr('aria-selected');
            }

            if ($('.totalSearchBox').is(':visible')) {
                $('.totalSearchBox').removeAttr('style');
                $('.totalSearch > button').removeAttr('aria-expanded');
                $('.totalSearch > button').text($('.totalSearch > button').text().replace(' 닫기', ''));
            }


            if ($('.totalMenuBox').is(':visible')) {
                $('.totalMenuBox').removeAttr('style');
                $('.totalMenu > button').removeAttr('aria-expanded');
                $('.totalMenu > button').removeAttr('aria-selected');
                $('.totalMenu > button').text($('.totalSearch > button').text().replace(' 닫기', ''));
            }

            $('.dimmed').css('z-index', '10006');
            this._offGnbScrollBlock();
        }
    };

    ns.menuLocEvent = {
        init: function () {
            this._attachEventHandlers();
        },
        _attachEventHandlers: function () {
            $(document).off('click.hideMenuLoc');
            $(document).on('click.hideMenuLoc', $.proxy(this.hideMenuLoc, this));


            $(document).off('click.showMenuLoc');
            $(document).on('click.showMenuLoc', '.menuLoc >  a', $.proxy(this._toggleMenuLoc, this));
        },
        _toggleMenuLoc: function (e) {
            e.preventDefault();
            var $menuLocEl = $(e.currentTarget);

            if ($menuLocEl.attr('aria-expanded') === 'true') {
                this.hideMenuLoc();
            } else {
                this._showMenuLoc(e);
            }
        },
        _showMenuLoc: function (e) {
            var $menuLocEl = $(e.currentTarget);
            var $menuLocGnb = $menuLocEl.closest('.menuLoc').find('.sGnb');
            var $pageLocation = $menuLocEl.closest('.pageLocation');
            var $visibleLoc = $('.pageLocation .menuLoc .sGnb:visible');


            $pageLocation.find('.menuLoc > a').attr('aria-expanded', 'false');
            $menuLocEl.attr('aria-expanded', 'true');

            if ($visibleLoc.length === 0) {
                $menuLocGnb.hide();
                $menuLocGnb.slideDown(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                });
            }

        },
        hideMenuLoc: function (e) {
            if ($('.pageLocation .menuLoc .sGnb').length === 0) {
                return;
            }

            //fnCallback 함수 호출 
            var fnCallback;
            if (typeof e === 'function') {
                fnCallback = e;
            }

            if (e !== undefined && (fnCallback === undefined)) {
                var $clickTarget = $(e.target);

                if ($clickTarget.closest('.menuLoc').length > 0) {
                    return;
                }
            }

            var $visibleLoc = $('.pageLocation .menuLoc .sGnb').filter(function () {
                return $(this).is(':visible');
            });
            $('.pageLocation .menuLoc > a').attr('aria-expanded', '');
            $visibleLoc.show();
            $visibleLoc.slideUp(400, 'easeOutCubic', function () {
                $(this).removeAttr('style');

                //법인 일 경우 , fnCallback 함수 호출 
                if ($('.wrapper.corpWrapper').length > 0 && fnCallback) {
                    fnCallback();
                }
            });
        }
    };

    ns.snbAniEvent = {
        init: function () {
            if ($('.snb').length === 0) {
                return;
            }

            this._assignElements();
            this._setElement();
            this._attachEventHandlers();
        },
        _assignElements: function () {
            this.$skip = $('.skip');
            this.$body = $('body');
            this.$snbWrap = $('.snb');
            this.$snbBtn = this.$snbWrap.find('.btnOpen');
            this.$areaScroll = this.$snbWrap.find('.scrollArea');
            this.$titSnb = this.$snbWrap.find('.titSnb');

        },
        _setElement: function () {
            if (this.$body.hasClass('on')) {
                this._showSnb();
            } else {
                this._hideSnb();
            }
            //버튼 흔들리는 문제 해결
            this.$snbBtn.css('top', $(window).height() / 2);
            this._setSnbScrollbar();

        },
        _attachEventHandlers: function () {
            $(document).off('click.snb');
            $(document).on('click.snb', '.snb .btnOpen', $.proxy(this._onClicktoggleSnb, this));

            $(document).off('click.snbList');
            $(document).on('click.snbList', '.snbList a', $.proxy(this._onClicktoggleSnbList, this));

            $(document).off('click.lnbDep');
            $(document).on('click.lnbDep', '.lnbDep2> li > a', $.proxy(this._onClicktoggleLnbDep, this));

            //리사이즈
            $(window).on('resize', $.proxy(this._resizeSnb, this));

        },
        _onClicktoggleSnb: function (e) {
            e.preventDefault();

            //스크롤 값 저장 
            if (this.$body.hasClass('on')) {
                this.bodyScroll = $('.wrapper').scrollTop();
            } else {
                this.bodyScroll = $(document).scrollTop();
            }

            this.$body.toggleClass('on');
            if (this.$body.hasClass('on')) {
                this._showSnb();
                this._updateScroll();
            } else {
                this._hideSnb();
            }
        },
        _setSnbScrollbar: function () {
            this.$docHeight = $(window).height();

            var scrollHeigth = this.$docHeight - this.$titSnb.outerHeight();
            this.$areaScroll.css('height', scrollHeigth);
            this.$areaScroll.off('jsp-initialised');
            this.$areaScroll
                .on(
                    'jsp-initialised',
                    function (event, isScrollable) {
                        //스크롤 조절
                        $(this).find('.jspTrack').removeAttr('style');
                        $(this).find('.jspDrag').css('height', $(this).find('.jspDrag').height() - 20);

                        //불필요한 태그 삭제
                        $(this).find('.jspArrow').remove();
                        $(this).find('.jspCap').remove();
                        $(this).find('.jspHorizontalBar').remove();
                        $(this).css('max-height', '');
                    }
                )
                .jScrollPane({
                    showArrows: true,
                    verticalDragMinHeight: 30,
                    mouseWheelSpeed: 40 //최소 메뉴 높이
                });
        },
        _showSnb: function () {

            //스크롤 초기화
            this.$snbWrap.find('.jspPane').css('top', 0);
            this.$snbWrap.find('.jspDrag').css('top', 0);

            this.$body.css('overflow', 'hidden');
            this.$snbBtn.attr('aria-expanded', 'true');
            this.$snbBtn.text("MENU close");

            //body 스크롤 상속 
            $('.wrapper').scrollTop(this.bodyScroll);


            //fixed -> absolute 변경
            var headerH = $('.header').height();
            var pageTop = $('.wrapper').scrollTop() - headerH;
            if ($('.pageTOP').css('position') === 'fixed') {
                $('.pageTOP').css({
                    'position': 'absolute',
                    'top': pageTop
                });
            }

            if ($('.titDep1').css('position') === 'fixed') {
                $('.titDep1').css({
                    'position': 'absolute',
                    'top': pageTop + 40
                });
            }

            if ($('.btnBtm > div').css('position') === 'fixed') {
                $('.btnBtm > div').css({
                    'position': 'absolute',
                    'top': (pageTop + $(window).height() - $('.btnBtm > div').height())
                });
            }
        },
        _hideSnb: function () {
            this.$body.css('overflow', '');
            this.$snbBtn.attr('aria-expanded', 'false');
            this.$snbBtn.text("MENU open");
            //body 스크롤 상속
            $('html,body').scrollTop(this.bodyScroll);


            $('.pageTOP').removeAttr('style');
            $('.titDep1').removeAttr('style');
            $('.btnBtm > div').removeAttr('style');

        },
        _onClicktoggleSnbList: function (e) {
            var $snbMenuEl = $(e.currentTarget);

            if ($snbMenuEl.attr('aria-expanded') === undefined || $snbMenuEl.attr('aria-expanded') === "false") {
                this._showSnbMenu($snbMenuEl);
            } else {
                this._hideSnbMenu($snbMenuEl);
            }
        },
        _showSnbMenu: function ($snbMenu) {
            var oSelf = this;
            var $menuCont = $snbMenu.closest('li').find('>ul');
            var $visiblePreCont = $snbMenu.closest('li').siblings().find('a[aria-expanded=true]');

            if ($visiblePreCont.length > 0) {
                this._hideSnbMenu($visiblePreCont);
            }
            $snbMenu.attr('aria-expanded', 'true');
            $menuCont.slideDown({
                "duration": 400,
                "ease": "easeOutCubic",
                step: function () {
                    oSelf._updateScroll();
                }
            });
        },
        _hideSnbMenu: function ($snbMenu) {
            var oSelf = this;
            var $menuCont = $snbMenu.closest('li').find('>ul');
            $snbMenu.attr('aria-expanded', 'false');

            //스크롤 지정
            this._setScroll($snbMenu);

            $menuCont.slideUp({
                "duration": 400,
                "ease": "easeOutCubic",
                step: function () {
                    oSelf._updateScroll();
                },
                complete: function () {
                    $(this).removeAttr('style');
                }
            });

        },
        _onClicktoggleLnbDep: function (e) {
            var $lnbDepEl = $(e.currentTarget);
            $lnbDepEl.closest('.lnbDep2').find('>li').removeClass('menuON');
            $lnbDepEl.closest('li').addClass('menuON');

        },
        _setScroll: function ($snbMenu) {
            if (this.$areaScroll.data('jsp') === undefined) {
                return;
            }
            var totContH = this.$areaScroll.data('jsp').getContentHeight() + this.$titSnb.outerHeight();
            if ($(window).height() > totContH) {
                this.$snbWrap.find('.jspPane').css('top', 0);
            }
        },
        _updateScroll: function () {
            if (this.$areaScroll.data('jsp') === undefined) {
                return;
            }
            this.$docHeight = $(window).height();
            var scrollHeigth = this.$docHeight - this.$titSnb.outerHeight();
            this.$areaScroll.css('height', scrollHeigth);
            this.$areaScroll.data('jsp').reinitialise();

            this._setScroll();
        },
        _resizeSnb: function () {
            this._updateScroll();
            this.$snbBtn.css('top', $(window).height() / 2);
        }
    };

    ns.footer = {
        init: function () {
            this.markSliderIdx = 0;
            this._setElement();
            this._attachEventHandlers();
        },
        _setElement: function () {
            var oSelf = this;
            $('.markSlider .prevSlide').attr('disabled', true);
        },
        _checkPosX: function () {
            var oSelf = this;
            //전체 넓이 지정
            var totalSlidePosX = 0;
            this.oSliderPosX = [0];

            var sumW = 0;
            var maxFootSlidePosX;
            $('.footer .slider-wrapper-wrap .slider-slide').each(function () {
                sumW += ($(this).outerWidth() + parseInt($(this).css('marginLeft')));
            });
            maxFootSlidePosX = sumW - $('.footer .slider-wrapper-wrap').width();
            $('.footer .slider-wrapper').css('width', sumW);

            $('.hiddenArea .markSlider .slider-wrapper > li').each(function () {
                totalSlidePosX += $(this).width() + 30;

                if (totalSlidePosX > maxFootSlidePosX) {
                    totalSlidePosX = maxFootSlidePosX;
                    oSelf.oSliderPosX.push(totalSlidePosX);
                    return false;
                }
                oSelf.oSliderPosX.push(totalSlidePosX);
            });
        },
        _attachEventHandlers: function () {
            $(document).off('click.openFoot');
            $(document).on('click.openFoot', '.topInner > button', $.proxy(this._onClickBtnFoot, this));

            $(document).off('click.btnSite');
            $(document).on('click.btnSite', '.familyList > button', $.proxy(this._onClickBtnSite, this));

            $(document).off('click.slideBtn');
            $(document).on('click.slideBtn', '.markSlider .nextSlide, .markSlider .prevSlide', $.proxy(this._onClickBtnSlide, this));
        },
        _onClickBtnFoot: function (e) {
            var oSelf = this;
            var $btnFoot = $(e.currentTarget);
            if ($btnFoot.attr('aria-expanded') === "true") {
                $btnFoot.attr('aria-expanded', 'false');
                $('.footer .noticeList').css('overflow', '');
                $('.topInner .hiddenArea').slideUp(400, 'easeOutCubic', function () {
                    oSelf._resetSlider();
                    $('.footer').css('z-index', '');
                });
            } else {
                $('.footer').css('z-index', 10002);
                $('.footer .noticeList').css('overflow', 'visible');
                $btnFoot.attr('aria-expanded', 'true');
                $('.topInner .hiddenArea').slideDown(400, 'easeOutCubic', function () {
                    oSelf._checkPosX();
                });
            }
        },
        _onClickBtnSite: function (e) {
            var $btnSite = $(e.currentTarget);
            if ($btnSite.attr('aria-expanded') === "true") {
                $btnSite.attr('aria-expanded', 'false');
                $('.familyList .list').slideUp(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                });
            } else {
                $btnSite.attr('aria-expanded', 'true');
                $('.familyList .list').hide();
                $('.familyList .list').slideDown(400, 'easeOutCubic');
            }
        },
        _onClickBtnSlide: function (e) {
            var $curBtn = $(e.currentTarget);
            var totalSlideCnt = this.oSliderPosX.length - 1;
            //이전 버튼
            if ($curBtn.hasClass('prevSlide')) {
                this.markSliderIdx--;
            } else {
                this.markSliderIdx++;
            }

            if (this.markSliderIdx < 0) {
                this.markSliderIdx = 0;
            }

            if (this.markSliderIdx > totalSlideCnt) {
                this.markSliderIdx = totalSlideCnt;
            }

            //버튼 비활성화
            if (this.markSliderIdx === 0) {
                $('.markSlider .prevSlide').attr('disabled', true);
            } else {
                $('.markSlider .prevSlide').attr('disabled', false);
            }
            if (this.markSliderIdx === totalSlideCnt) {
                $('.markSlider .nextSlide').attr('disabled', true);
            } else {
                $('.markSlider .nextSlide').attr('disabled', false);
            }

            this._moveSlide(this.markSliderIdx);
        },
        _moveSlide: function (idx) {
            var oSelf = this;
            $('.hiddenArea .markSlider ul').stop().animate({
                'marginLeft': -oSelf.oSliderPosX[idx]
            }, 400, 'easeOutCubic');
        },
        _resetSlider: function () {
            $('.hiddenArea .markSlider ul').removeAttr('style');
            this.markSliderIdx = 0;
            $('.markSlider .prevSlide').attr('disabled', true);
            $('.markSlider .nextSlide').attr('disabled', false);
        }
    };

    ns.slideBanner = {
        init: function () {
            //기본 슬라이드
            this.basicSlide();

            //one slider(슬라이드 하나씩 이동)
            this.oneSlide();

            //카드 혜택 (PBS1_1)
            this.cardBenfit();

            //해외 안심 카드(PLC5_1_1_1T)
            this.relaxCardSlider();

            // 사회 메인 (MA)
            this.sMainSlide();

            //touch Banner (PMP)
            this.myTouchCoupon();

            //PCD4 (smtpSlide)
            this.smtpSlide();

            //PCD12_2
            this.keyWdSlide();

            //PBS9_2_1T_7T
            this.trEventSlide();

            //IHLFSDB_V100
            this.ifrmEventSlide();
        },
        basicSlide: function () {
            var basicSliderOpt,
                autoPlayOpt,
                isLoopOpt;
            $('.slider-container:visible').each(function (idx, target) {
                if ($(this).closest('.oneSlide').length === 0 &&
                    $(this).closest('.sMainSlide').length === 0 &&
                    $(this).closest('.compSlider').length === 0 &&
                    $(this).closest('.smtpSlide').length === 0 &&
                    $(this).closest('.keySwiper').length === 0 &&
                    $(this).closest('.bgCard').length === 0 &&
                    !$(this).hasClass('relaxCardSlider') &&
                    $(this).find('.eventSlider').length === 0
                ) {
                    if ($(this).hasClass('autoSlide')) {
                        autoPlayOpt = 3000;
                    } else {
                        autoPlayOpt = undefined;
                    }
                    basicSliderOpt = {
                        autoPlay: autoPlayOpt,
                    };
                    $(this).slideBannerJs(basicSliderOpt);
                }
            });
        },
        oneSlide: function () {
            var oneSlider = $('.oneSlide .slider-container');
            var perViewSlideCntOpt,
                slideW,
                distanceVal,
                oneSliderOpt,
                isLoopOpt,
                autoPlayOpt;


            oneSlider.each(function () {
                slideW = $(this).find('.slider-slide').outerWidth();
                distanceVal = $(this).find('.slider-slide').outerWidth() + parseInt($(this).find('.slider-slide').css('marginRight'));
                perViewSlideCntOpt = parseInt($(this).find('.slider-wrapper-wrap').width() / slideW);

                if ($(this).closest('.popularitySlide').length > 0) {
                    isLoopOpt = true;
                    autoPlayOpt = 3000;
                } else {
                    isLoopOpt = false;
                    autoPlayOpt = false;
                }
                oneSliderOpt = {
                    containerClass: '.slider-container',
                    wrapperClass: '.slider-wrapper',
                    isLoop: isLoopOpt,
                    perView: 1,
                    distance: distanceVal,
                    slideW: slideW, //슬라이드 넓이 지정
                    perViewSlideCnt: perViewSlideCntOpt, //화면에 보이는 슬라이드 갯수
                    moveSlideCnt: 1, //화면 이동 하는 슬라이드 갯수
                    autoPlay: autoPlayOpt//자동 재생 시간
                };
                $(this).slideBannerJs(oneSliderOpt);
            });
        },
        cardBenfit: function () {
            if ($('.bgCard .cardSlide .slider-container:visible').length === 0) {
                return;
            }
            var cardBenfitOpt = {
                isLoop: false,
                slideW: 640
            };
            $('.bgCard .cardSlide .slider-container').slideBannerJs(cardBenfitOpt);
        },
        relaxCardSlider: function () {
            if ($('.slider-container.relaxCardSlider:visible').length === 0) {
                return;
            }
            var relaxCardOpt = {
                isLoop: false,
                slideW: 920
            };
            $('.slider-container.relaxCardSlider').slideBannerJs(relaxCardOpt);
        },
        sMainSlide: function () {
            if ($('.sMainSlide .slider-container:visible').length === 0) {
                return;
            }
            var slideW = $('.sMainSlide .slider-container .slider-slide').outerWidth();
            var slideWrapW = $('.sMainSlide .slider-wrapper-wrap').width();
            var perViewSlideCntOpt = parseInt(slideWrapW / slideW);
            var sMainOpt = {
                isLoop: false,
                perView: 4,
                distance: 1068,
                perViewSlideCnt: perViewSlideCntOpt //화면에 보이는 슬라이드 갯수
            };
            $('.sMainSlide .slider-container').slideBannerJs(sMainOpt);
        },
        myTouchCoupon: function () {
            if ($('.myTouch:visible').length === 0) {
                return;
            }
            var couponOpt = {
                containerClass: '.myTouch',
                wrapperClass: '.swiper-wrap',
                slideClass: '.couponList',
                isLoop: true,
                slideWrapW: 680,    // '.swiper-wrap' 전체 넓이  지정
                slideW: false,  // slide width 미지정
                autoPlay: 3000//자동 재생 시간
            };
            $('.myTouch').slideBannerJs(couponOpt);
        },
        smtpSlide: function () {
            if ($('.slider-container.smtpSlide:visible').length === 0) {
                return;
            }
            var slideW = $('.smtpSlide .slider-slide').outerWidth();
            var slideWrapW = $('.smtpSlide .slider-wrapper-wrap').width();
            var perViewSlideCntOpt = parseInt(slideWrapW / slideW);

            var smtpOpt = {
                containerClass: '.smtpSlide',
                wrapperClass: '.slider-wrapper',
                slideClass: '.slider-slide',
                isLoop: false,
                distance: 160, // 화면 이동 거리
                slideW: false,    // '.swiper-wrap' 전체 넓이  지정
                isAlignSlide: true,
                perViewSlideCnt: perViewSlideCntOpt, //화면에 보이는 슬라이드 갯수
                moveSlideCnt: 1 //화면 이동 하는 슬라이드 갯수
            };
            $('.slider-container.smtpSlide').slideBannerJs(smtpOpt);
        },
        keyWdSlide: function () {
            if ($('.keySwiper.slider-container:visible').length === 0) {
                return;
            }
            var slideW = $('.keySwiper .swiper-slide').outerWidth();
            var slideWrapW = $('.keySwiper .slider-wrapper-wrap').width();
            var perViewSlideCntOpt = parseInt(slideWrapW / slideW);

            var keyWdOpt = {
                containerClass: '.keySwiper',
                wrapperClass: '.slider-wrapper',
                slideClass: '.swiper-slide',
                isLoop: false,
                distance: 160, // 화면 이동 거리
                slideW: false,    // '.swiper-wrap' 전체 넓이  지정
                isAlignSlide: true, // 슬라이드 정렬
                perViewSlideCnt: perViewSlideCntOpt, //화면에 보이는 슬라이드 갯수
                moveSlideCnt: 1, //화면 이동 하는 슬라이드 갯수
                isSetAccessbillityFocus: false //접근성 - 숨겨진 탭 포커스 방지(숨겨진 슬라이드 - visibility:hidden)
            };
            $('.keySwiper.slider-container').slideBannerJs(keyWdOpt);
        },
        trEventSlide: function () {
            if ($('.trEvent:visible').length === 0) {
                return;
            }
            var keyWdOpt = {
                containerClass: '.trEventSlider-container',
                wrapperClass: '.slider-wrapper',
                slideClass: '.slider-slide',
                distance: 1000,
                slideW: false,
                activeClass: 'on', //현재 활성화 슬라이드 클래스 지정
                isLoop: true,
                effectMove: 'fade', //슬라이드 이동 시 효과 
                autoPlay: 3000, //자동 재생 시간
                isDummySlide: true,
                isSetAccessbillityFocus: false //접근성 - 숨겨진 탭 포커스 방지(숨겨진 슬라이드 - visibility:hidden)
            };
            $('.trEvent').slideBannerJs(keyWdOpt);
        },
        ifrmEventSlide: function () {
            if ($('.iframeEvent .slider-container:visible').length === 0) {
                return;
            }
            var tourEvtOpt = {
                containerClass: '.slider-container',
                wrapperClass: '.slider-wrapper',
                slideClass: '.slider-slide',
                distance: 260,
                slideW: false,
                isLoop: true,
                autoPlay: 3000 //자동 재생 시간
            };
            $('.iframeEvent .slider-container').slideBannerJs(tourEvtOpt);
        }
    };
    ns.tabJs = ns.tabJs || {};
    ns.tabJs = function (element, options) {
        this.element = element;
        this.target = $(this.element);
        this.options = $.extend({}, defaultTabJs, options);
        this.init();
    };

    ns.tabJs.prototype = {
        constructor: ns.tabJs,
        init: function () {
            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            var oSelf = this,
                targetWrap = '';

            this.target.find('li.on').each(function () {
                targetWrap = $(this).closest('ul');
                oSelf._setActCont(targetWrap, false); //false:scroll animation 여부
                oSelf.curTabIdx = $(this).index(); //현재 클릭 한 idx
            });

            // paddingBottom 지정 (PCD2_1_1)
            this.setTabSubPad();
        },
        _bindEvent: function () {
            var oSelf = this,
                targetWrap = '';

            this.target.off('click.tabMenu');
            this.target.on('click.tabMenu', '>li > a', $.proxy(this._clickTabMenu, this));
        },
        selTabLi: function (target, isOutCall) {
            var targetWrap = target.closest('ul');
            //활성화된 탭을 선택 할 경우
            if (targetWrap.find('>li.on').index() === target.index()) {
                return;
            }
            target.addClass('on');
            target.siblings().removeClass('on');

            this._setActCont(targetWrap, true); //true :scroll animation  여부

            //외부에서 selTabLi 함수 호출 시에만 호출
            if (targetWrap.hasClass('tabToggle') && isOutCall !== false) {
                ns.formEvent.toggle._showTabCont(target.find('a'));
            }

            // paddingBottom 지정 (PCD2_1_1)
            this.setTabSubPad();
        },
        _clickTabMenu: function (e) {
            var $tabMenu = $(e.currentTarget);
            //탭 링크 걸려 있을 경우 고려
            e.preventDefault();

            //클릭 방지
            if ($tabMenu.parent().hasClass('disabled')) {
                return;
            }

            this.selTabLi($tabMenu.closest('li'), false);
        },
        _setActCont: function (targetWrap, isAniScroll) {
            var targetId;
            this.curTabIdx = targetWrap.find('>li.on').index(); //현재 클릭 한 idx
            //웹접근성
            this._setArea(targetWrap);

            //subTab
            if (targetWrap.hasClass('subTab') && this.curTarget) {
                targetId = this.curTarget.find('>a').attr('href');
                if (targetId === "#") {
                    return;
                }
                this._showSubCont(targetId);
            }

        },
        _showSubCont: function (targetId) {
            $(targetId).show();
            $(targetId).siblings().hide();
        },
        _setArea: function (targetWrap) {
            //접근성
            targetWrap.find('>li.on > a').attr('aria-selected', 'true');
            targetWrap.find('>li.on').siblings().find('> a').removeAttr('aria-selected');

            targetWrap.find('>li>a').attr('role', 'button');

        },
        setTabSubPad: function () {
            var $subTabs = this.target.find('.sub'),
                $subTab = this.target.find('.sub.on'),
                $subTabCont = $subTab.find('.subTab');

            if (!this.target.hasClass('flexable') || $subTabCont.length === 0) {
                return;
            }
            $subTabs.css('paddingBottom', '');
            $subTab.css('paddingBottom', $subTabCont.outerHeight() + 30);

        }
    };


    $.fn.tabJs = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_tabJs")) {
                $.data(this, "plugin_tabJs", new ns.tabJs(this, options));
            }
        });
    };
    //ani PieChartJs
    ns.aniPieChartJs = ns.aniPieChartJs || {};
    ns.aniPieChartJs = function (element) {
        this.element = element;
        this.$target = $(this.element);
        this.init();
    };
    ns.aniPieChartJs.prototype = {
        init: function () {
            //초기화
            if (this.$target.is(':visible') === false) {
                return;
            }
            this.$target.removeData('plugin_aniPieChartJs');
            this.$target.find('>svg').remove();

            if (this.$target.siblings('.chipType01').length > 0) {
                this.$dataText = this.$target.siblings('.chipType01').find('>li >span');
            } else if (this.$target.closest('.chartArea').find('.chipType01').length > 0) {
                this.$dataText = this.$target.closest('.chartArea').find('.chipType01').find('>li >span');
            }

            if (this.$target.hasClass('circle_graph')) {
                this.chartType = 'circle';
            } else {
                this.chartType = 'basic';
            }
            //법인 그래프 합계 0 일 경우 회색 원형 그래프 출력
            var sumTot = Number(this.$target.find('b').text().replace(/,|원/gi, ""));
            if (this.$target.hasClass('circle_graph') && sumTot === 0) {
                this._dummyChart();
                return;
            }

            //IE 버전 8이하 일경우 path - 애니메이션 미작동, 패턴 이미지 없음
            //IE 버전 9이상 d3 플러그인 사용 - 애니메이션 작동, 패턴 이미지 사용
            var isIe = ns.formEvent._checkIe();
            if (isIe === false || isIe > 8) {
                this._aniSetElment();
                this._aniBindEvent();
                this._aniStartDrawChart();
            } else {
                this._pathSetElement();
            }
        },
        _dummyChart: function () {
            this.$target.find('canvas').remove();
            var chartWidth = 310;
            var chartHeight = 310;
            var lineWdith = 40;

            var centerPosX = chartWidth / 2;
            var centerPosY = chartHeight / 2;

            var radius = centerPosX - 30;

            var startAngle = 0;
            var endAngle = Math.PI * 2;

            this.$target.append('<canvas width="310" height="310" />');
            var canvas = this.$target.find('canvas').get(0);
            if (typeof G_vmlCanvasManager != 'undefined') {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            var context = canvas.getContext('2d');
            context.beginPath();

            context.arc(centerPosX, centerPosY, radius, startAngle, endAngle);
            context.lineWidth = lineWdith;
            context.strokeStyle = "#e6e6e6";
            context.stroke();
        },
        _aniSetElment: function () {
            var width = this.$target.width(),
                height = this.$target.height(),
                oSelf = this,
                patternImg;

            if (this.chartType === 'circle') {
                patternImg = 'corp/bg_patterns_0';
            } else {
                patternImg = 'my/bg_pattern0';
            }

            this.radius = Math.min(width, height) / 2;
            this.oData = [];

            this.$dataText.each(function (idx) {
                oSelf.oData.push({
                    'index': idx,
                    'value': $(this).text().replace(/,|원/gi, "")
                });
            });

            var wrapClass = this.$target.attr('class').split(' ').join('.');

            var svg = d3.select('.' + wrapClass).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            var defs = d3.select('.' + wrapClass + " svg").append("defs");

            var gubunIdx = wrapClass.split('.')[1];
            var hostImg = '';
            if (typeof (gvImgUrl) !== "undefined" && gvImgUrl !== '') {
                hostImg = gvImgUrl;
            } else {
                hostImg = 'http://image.lottecard.co.kr';
            }

            this.oData.forEach(function (d, i) {
                d3.select('.' + wrapClass + " g").append("path")
                    .attr("fill", "url(#img" + i + "_" + gubunIdx + ")")
                    .each(function () {
                        this._current = {
                            startAngle: 0,
                            endAngle: 0
                        };
                    });

                defs.append('pattern')
                    .attr('id', 'img' + i + "_" + gubunIdx)
                    .attr('patternUnits', 'userSpaceOnUse')
                    .attr('width', 24)
                    .attr('height', 24)
                    .append("svg:image")
                    .attr("xlink:href", hostImg + '/webapp/pc/images/' + patternImg + (i + 1) + '.png')
                    .attr('width', 24)
                    .attr('height', 24)
                    .attr("x", 0)
                    .attr("y", 0);
            });

            //path border css
            $('.' + wrapClass).find('path').css('stroke', '#fff');

        },
        _aniBindEvent: function () {
            var oSelf = this;

            //해당 영력이 보일 경우 모션 실행
            $(window).off('scroll.drawChart');
            $(window).on('scroll.drawChart', function () {
                oSelf._aniStartDrawChart();
            });

        },
        _aniStartDrawChart: function () {

            var curScroll = $(window).scrollTop(),
                docHeight = $(window).height(),
                viewHeight = docHeight + curScroll,
                targetTop = this.$target.offset().top;
            if (this.$target.is(':visible') && (viewHeight > targetTop) && this.isDraw === undefined) {
                this._drawChart();
            }

            if (this.isDraw !== undefined) {
                $(window).off('scroll.drawChart');
            }
        },
        _drawChart: function () {
            this.isDraw = true;
            var wrapClass = this.$target.attr('class').split(' ').join('.');
            var oSelf = this;
            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                });
            var arc;
            if (this.$target.hasClass('circle_graph')) {
                arc = d3.svg.arc()
                    .outerRadius(function (d) {
                        return oSelf.radius - 10;
                    })
                    .innerRadius(oSelf.radius - 50)
                    .startAngle(function (d) {
                        return d.startAngle;
                    })
                    .endAngle(function (d) {
                        return d.endAngle;
                    });


            } else {
                arc = d3.svg.arc()
                    .outerRadius(function (d) {
                        return oSelf.radius - (8 * d.data.index);
                    })
                    .innerRadius(oSelf.radius - 70)
                    .startAngle(function (d) {
                        return d.startAngle + Math.PI * 1.3;
                    })
                    .endAngle(function (d) {
                        return d.endAngle + Math.PI * 1.3;
                    });
            }
            d3.selectAll('.' + wrapClass + " path").data(pie(this.oData))
                .transition()
                .duration(800)
                .attrTween("d", function (d) {
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        return arc(interpolate(t));
                    };
                });
        },
        _pathSetElement: function () {
            var oSelf = this;
            this.canvasW = this.$target.width();
            this.canvasH = this.$target.height();
            this.canvasR = this.canvasW / 2;
            this.oPathData = [];
            this.oPathData['percentages'] = [];
            this.oPathData['colors'] = [];

            var sumData = 0;
            this.$dataText.each(function () {
                sumData += Number($(this).text().replace(/,|원/gi, ""));
            });

            var curVal = '';
            var percent = '';
            var curColor = '';
            this.$dataText.each(function (idx) {
                curVal = Number($(this).text().replace(/,|원/gi, ""));
                percent = (curVal / sumData);
                curColor = $(this).closest('li').data('color');
                oSelf.oPathData['percentages'][idx] = percent;
                oSelf.oPathData['colors'][idx] = curColor;
            });

            this.$target.append('<canvas width="' + this.canvasW + '" height="' + this.canvasH + '" />');
            this._pathDrawChart(this.oPathData, true);

        },
        _pathDrawChart: function (slices, segmentMode) {
            var percentElements = slices.percentages;
            var colorElements = slices.colors;

            var canvas = this.$target.find('canvas').get(0);
            if (typeof G_vmlCanvasManager != 'undefined') {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            var context = canvas.getContext('2d');
            var centerX = this.canvasW / 2;
            var centerY = this.canvasH / 2;

            var lastAngle,
                chartR,
                percent,
                color,
                currentSegment,
                currentAngle,
                innerChartR;

            if (this.chartType === 'circle') {
                lastAngle = 1.5 * Math.PI;
            } else {
                lastAngle = 0.8 * Math.PI;
            }
            var endAngle = 2 * Math.PI;

            for (var i = 0; i < percentElements.length; i++) {
                percent = percentElements[i];
                color = colorElements[i];
                currentSegment = endAngle * percent;
                currentAngle = lastAngle + currentSegment;

                if (this.chartType === 'circle') {
                    chartR = this.canvasR - 10;
                    innerChartR = this.canvasR - 50;
                } else {
                    chartR = this.canvasR - (8 * i);
                    innerChartR = this.canvasR - 70;
                }

                context.beginPath();
                context.moveTo(centerX, centerY);
                context.arc(centerX, centerY, chartR, lastAngle, currentAngle, false);
                context.closePath();

                lastAngle = lastAngle + currentSegment;

                context.fillStyle = color;
                context.fill();

                if (segmentMode) {
                    context.lineWidth = 5;
                    context.strokeStyle = 'white';
                } else {
                    context.lineWidth = 1;
                    context.strokeStyle = 'black';
                }
                // context.stroke();
                context.fill();
            }
            if (segmentMode) {
                context.beginPath();
                context.fillStyle = 'white';
                context.arc(centerX, centerY, innerChartR, 0, 2 * Math.PI, false);
                context.fill();
            }
        }
    };
    $.fn.aniPieChartJs = function (options) {
        return this.each(function (idx) {

            if (!$.data(this, "plugin_aniPieChartJs")) {
                //고유 클래스 지정
                $(this).addClass('c' + idx);
                var wrapClass = $(this).attr('class').split(' ').join('.');
            }
            $.data(this, "plugin_aniPieChartJs", new ns.aniPieChartJs(this));
        });
    };


    ns.markNumJs = ns.markNumJs || {};
    ns.markNumJs = function (element) {
        this.element = element;
        this.$target = $(this.element);
        this.init();
    };
    ns.markNumJs.prototype = {
        init: function () {

            var _txt = this.$target.text();
            var _after = '';
            _txt = _txt.replace(/(\s*)/gi, "");
            _txt = _txt.split('');
            for (var i in _txt) {
                if (_txt[i] == ',') {
                    //콤마
                    _after += '<span class="num numCom"></span>';
                } else if (_txt[i] == '원') {
                    //원
                    _after += '<span class="num numWon"></span>';
                } else if (_txt[i] == '-') {
                    //-
                    _after += '<span class="num numDash"></span>';
                } else if (_txt[i] == '시') {
                    //시
                    _after += '<span class="num numSi"></span>';
                } else if (_txt[i] == '간') {
                    //간
                    _after += '<span class="num numGan"></span>';
                } else if (_txt[i] == '분') {
                    //분
                    _after += '<span class="num numBun"></span>';
                } else if (_txt[i] == '매') {
                    //매
                    _after += '<span class="num numMe"></span>';
                } else if (_txt[i] == '월') {
                    //월
                    _after += '<span class="num numWol"></span>';
                } else if (_txt[i] == '일') {
                    //일
                    _after += '<span class="num numIl"></span>';
                } else if (_txt[i] == 'P') {
                    //포인트
                    _after += '<span class="num numP"></span>';
                } else if (!isNaN(_txt[i])) {
                    //숫자
                    _after += '<span class="num num' + _txt[i] + '"></span>';
                }
            }

            this.$target.closest('.descNum').find('.num').remove();
            this.$target.closest('.descNum').append(_after);

        }
    };


    $.fn.markNumJs = function (options) {
        return this.each(function (idx) {
            $.data(this, "plugin_markNumJs", new ns.markNumJs(this));
        });
    };


    ns.slideBannerJs = ns.slideBannerJs || {};
    ns.slideBannerJs = function (element, options) {
        this.element = element;
        this.$target = $(this.element);

        this.defOpt = {
            containerClass: '.container',
            wrapperClass: '.slider-wrapper',
            slideClass: '.slider-slide',
            isLoop: true,
            autoPlay: false,
            perViewSlideCnt: 1,
            distance: ''
        };

        this.options = $.extend({}, this.defOpt, options);
        this.init();
    };
    ns.slideBannerJs.prototype = {
        constructor: ns.slideBannerJs,
        init: function () {
            this.$wrapper = this.$target.find(this.options.wrapperClass);
            this.$slide = this.$wrapper.find(this.options.slideClass);
            this.$nav = this.$target.find('.indiList');
            this.$prevBtn = this.$target.find('.prevSlide');
            this.$nextBtn = this.$target.find('.nextSlide');

            this.isLoop = this.options.isLoop;  //isLoop
            this.autoPlay = this.options.autoPlay; //autoPlay
            this.perViewSlideCnt = this.options.perViewSlideCnt; //화면에 보이는 slide갯수

            this._timeId = 0;
            this.isSetSlideWidth = false;

            //슬라이드 처음 인덱스 설정
            if (this.$target.data('initialslide') !== undefined) {
                this.curIdx = Number(this.$target.data('initialslide'));
            } else {
                this.curIdx = 0;
            }

            if (this.isLoop) {
                this.moveIdx = this.curIdx + 1;
            } else {
                this.moveIdx = this.curIdx;
            }

            //dummy slide 추가 할 경우 
            if (this.options.isDummySlide) {
                this.moveIdx = this.moveIdx + 1;
            }

            //슬라이드 이동 갯수
            if (this.options.moveSlideCnt) {
                this.moveSlideCnt = this.options.moveSlideCnt;
            } else {
                this.moveSlideCnt = this.perViewSlideCnt;
            }

            if (
                this.isLoop &&
                this.moveSlideCnt === 1 &&
                this.perViewSlideCnt > 1
            ) {
                //PBS9_2_1T_7T('popularitySlide')
                this.moveIdx = this.$slide.length;
            }

            if (this.moveSlideCnt !== 1) {
                //슬라이드 묶음 이동
                this.totalSlide = Math.ceil(this.$slide.length / this.options.perView);
            } else {
                this.totalSlide = this.$slide.length;
            }

            //접근성 - 숨겨진 슬라이드 visible:hidden
            if (this.options.isSetAccessbillityFocus === undefined) {
                this.isSetAccessbillityFocus = true;
            } else {
                this.isSetAccessbillityFocus = this.options.isSetAccessbillityFocus;
            }

            // myTouch (PMP) :  slider-wrap 에  margin-left 있을 경우
            this.wrapMarLeft = parseInt(this.$wrapper.css('marginLeft'));

            //page naviagtion
            if (this.$nav.length > 0) {
                this._isNav = true;
            } else {
                this._isNav = false;
            }

            //슬라이드 갯수 최소 갯수 일 경우 정지
            if (this.$slide.length <= this.perViewSlideCnt) {
                this._removeIndicate();
                return;
            }

            this._setElement();
            this._bindEvent();
        },
        _setElement: function () {
            //set slide width
            if (!this.isSetSlideWidth && (this.perViewSlideCnt === 1)) {
                this._setSlideW();
            }

            //move slide distance
            if (this.options.distance === '') {
                this.distance = this.slideWidth + parseInt(this.$slide.css('marginLeft'));
            } else {
                this.distance = this.options.distance;
            }
            //set position slide
            this._setPosSlide();

            //loop 일 경우 가상 slide
            if (this.isLoop) {
                this.slideLenght = this.totalSlide + 2;
                this._createLoop();
            } else {
                this.slideLenght = this.totalSlide;
            }

            //dummy slide 추가 할 경우 
            if (this.options.isDummySlide) {
                this.slideLenght = this.slideLenght + 2;
            }
            //set slide wrapper
            if (this.options.slideWrapW !== undefined) {
                this.$wrapper.css({
                    'width': this.slideLenght * this.options.slideWrapW
                });
            } else if (this.perViewSlideCnt === 1) {
                this.$wrapper.css({
                    'width': this.slideLenght * 100 + '%'
                });
            }

            //페이지 네비게이션
            if (this._isNav) {
                this._createNav(this.curIdx, this.totalSlide);
            }

            //이전 / 다음 버튼 클릭
            if (this.$prevBtn.length > 0 && this.$nextBtn.length > 0) {
                this._checkBtn();
            }

            //접근성
            this._setAccessbillity();

            //활성화 슬라이드 클래스 지정
            this._checkActSlide();
        },
        _bindEvent: function () {
            var oSelf = this;
            //리사이즈 될 경우  기준 새로 받음
            $(window).off('resize.slideBanner').on('resize.slideBanner', $.proxy(this._resizeSlideBanner, this));

            // oneSlide - 슬라이드 클릭 시  정렬 (PCD12_2)
            if (this.options.isAlignSlide) {
                this.$slide.off('click.alingSlide');
                this.$slide.on('click.alingSlide', $.proxy(this._onClickSlide, this));
            }

            this.$target.off('keyup keydown');
            this.$target.on('keyup keydown', $.proxy(this._onkeyUpMoveTab, this));

            //이전 / 다음 버튼 클릭
            this.$target.off('click.prevBtn');
            this.$target.on('click.prevBtn', '.prevSlide', $.proxy(this._prevSlide, this));

            this.$target.off('click.nextBtn');
            this.$target.on('click.nextBtn', '.nextSlide', $.proxy(this._nextSlide, this));

            //loop 일 경우
            if (this.autoPlay) {
                //자동 플레이
                this._startAutoPlay();

                this.$target.off('mouseenter.slideBanner');
                this.$target.on('mouseenter.slideBanner', $.proxy(this._mouseenterSlideBanner, this));

                this.$target.off('mouseleave.slideBanner');
                this.$target.on('mouseleave.slideBanner', $.proxy(this._mouseleaveSlideBanner, this));

                //재생/ 정지
                this.$target.off('click.slideBannerPlayBtn');
                this.$target.on('click.slideBannerPlayBtn', '.btnStop', $.proxy(this._clickSlideBannerPlayBtn, this));
            }

            //네비게이션
            if (this.$nav.length > 0) {
                this.$nav.off('click.slideBannerNav');
                this.$nav.on('click.slideBannerNav', 'button', $.proxy(this._clickSlideBannerNav, this));
            }
        },
        _mouseenterSlideBanner: function (e) {
            if (this.$target.find('.btnStop.play').length > 0) {
                return;
            }
            this._stopAutoPlay();
        },
        _mouseleaveSlideBanner: function (e) {
            if (this.$target.find('.btnStop.play').length > 0) {
                return;
            }
            this._startAutoPlay();
        },
        _clickSlideBannerPlayBtn: function (e) {
            e.preventDefault();
            var $palyBtn = $(e.currentTarget);

            $palyBtn.toggleClass('play');

            if ($palyBtn.hasClass('play')) {
                $palyBtn.text('재생');
                this._stopAutoPlay();
            } else {
                $palyBtn.text('정지');
                this._startAutoPlay();
            }
        },
        _clickSlideBannerNav: function (e) {
            var idx = $(e.currentTarget).index();
            this.curIdx = idx;
            if (this.isLoop) {
                if (this.options.isDummySlide) {
                    this.moveIdx = idx + 2;
                } else {
                    this.moveIdx = idx + 1;
                }
                this._moveSlide(this.moveIdx);
            } else {
                this.moveIdx = idx;
                this._moveSlide(this.moveIdx);
            }
        },
        _resizeSlideBanner: function () {
            if (this.perViewSlideCnt !== 'auto') {
                this._setSlideW();
                this._setPosSlide();
            }
        },
        _onkeyUpMoveTab: function (e) {
            var isPlaySlide = (this.$target.find('.btnStop').length > 0) && (!this.$target.find('.btnStop').hasClass('play'));
            //슬라이드가 정지 해 있을 경우 예외
            if (!this.autoPlay && !isPlaySlide) {
                return;
            }
            var event = e;
            var $focusEl = this.$target.find('*').filter(function () {
                return $(this).get(0).tagName === 'A' || $(this).get(0).tagName === 'BUTTON';
            });
            var $focusFirst = $focusEl.first();
            var $focusLast = $focusEl.last();


            if (
                event.shiftKey && event.keyCode === 9 &&
                ($(e.target).get(0) === $focusFirst.get(0)) &&
                event.type === 'keydown'
            ) {
                //처음 포커스에서 back tab
                this._startAutoPlay();
            } else if (
                !event.shiftKey && event.keyCode === 9 &&
                ($(e.target).get(0) === $focusLast.get(0)) &&
                event.type === 'keydown'
            ) {
                //마지막 포커스에서 next tab
                this._startAutoPlay();
            } else {
                //정지
                this._stopAutoPlay();
            }
        },
        _onClickSlide: function (e) {
            var $slide = $(e.currentTarget);

            //container 에 표시된 slide 갯수
            var $wrap = this.$wrapper.parents().filter(
                function () {
                    if ($(this).css('overflow') === 'hidden') {
                        return $(this);
                    }
                });
            var perSlideView = parseInt($($wrap[0]).width() / this.$slide.width());
            var maxSlideViewCnt = this.$slide.length - perSlideView;
            //카드 이동 내역 없을 경우 리턴
            if (maxSlideViewCnt < 0) {
                return;
            }

            var slideIdx = $slide.index();
            this.moveIdx = slideIdx;
            this.curIdx = slideIdx;

            if (this.moveIdx > maxSlideViewCnt) {
                this.moveIdx = maxSlideViewCnt;
                this.curIdx = maxSlideViewCnt;
            }
            this._moveSlide(this.moveIdx);
        },
        _removeIndicate: function () {
            var $indiWrap = this.$target.find('.indiWrap');
            if ($indiWrap.length > 0) {
                $indiWrap.hide();
            }

            if (this.$prevBtn.length > 0) {
                this.$prevBtn.addClass('disabled');
                this.$prevBtn.attr('disabled', true);
            }
            if (this.$nextBtn.length > 0) {
                this.$nextBtn.addClass('disabled');
                this.$nextBtn.attr('disabled', true);
            }
        },
        _setSlideW: function () {
            // set  slide width - 기본 container width
            if (!this.isSetSlideWidth && (this.perViewSlideCnt === 1)) {
                this.slideWidth = this.$target.width();
            }
            this.$slide.css('width', this.slideWidth);

            //옵션값 설정 되어 있을 경우
            if (this.options.slideW !== undefined) {
                this.slideWidth = this.options.slideW;
                this.$slide.css('width', this.options.slideW);
            }

            if (this.options.slideW === false) {
                this.$slide.css('width', '');
                this.slideWidth = this.$slide.width();
            }
        },
        _setPosSlide: function () {
            this.$wrapper.css({
                'marginLeft': - (this.distance * this.moveIdx) + this.wrapMarLeft
            });
        },
        _createLoop: function () {

            if (
                this.options.isLoop &&
                this.moveSlideCnt === 1 &&
                this.perViewSlideCnt > 1
            ) {
                //슬라이드 한개씩 이동 loop
                var $slide = this.$wrapper.find(this.options.slideClass).clone().addClass('duplicate');
                this.$wrapper.find(this.options.slideClass).last().after($slide);
            } else {
                var $firstSlide = this.$slide.first().clone(),
                    $lastSlide = this.$slide.last().clone();

                $firstSlide.addClass('duplicate');
                $lastSlide.addClass('duplicate');

                this.$slide.first().before($lastSlide);
                this.$slide.last().after($firstSlide);
            }

            // 다음 다음 슬라이드 보여야 하는 경우 고려 (PBS9_2_1T_7T)
            if (this.options.isDummySlide) {
                var $dupSlideLast = this.$slide.eq(1).clone();
                var $dupSlideFirst = this.$slide.eq(this.$slide.length - 2).clone();

                this.$wrapper.find(this.options.slideClass).last().after($dupSlideLast);
                this.$wrapper.find(this.options.slideClass).last().addClass('dummySlide');

                this.$wrapper.find(this.options.slideClass).first().before($dupSlideFirst);
                this.$wrapper.find(this.options.slideClass).first().addClass('dummySlide');
            }

        },
        _createNav: function (current, total) {
            this.$nav.html('');

            var text = '',
                txt = '',
                $buttonEl = this.$nav.find('>button');
            for (var i = 1; i <= total; i++) {
                if ((current + 1) == i) {
                    text += "<button type='button' class='on' title='선택됨'>" + i + "</button>";
                } else {
                    text += "<button type='button'>" + i + "</button>";
                }
            }
            this.$nav.html(text);

            $buttonEl.removeClass('on');
            $buttonEl.attr('title', '');

            $buttonEl.eq(current).addClass('on');
            $buttonEl.eq(current).attr('title', '선택됨');
        },
        _checkBtn: function () {
            if (this.isLoop) {
                return;
            }
            // 처음,마지막 슬라이드 버튼 비활성화
            // oneSlide 경우 고려 (PBS9_4)

            if (this.moveSlideCnt === 1) {
                if (this.perViewSlideCnt > 1) {
                    maxSlideViewCnt = this.$slide.length - this.perViewSlideCnt;
                } else {
                    maxSlideViewCnt = this.totalSlide - 1;
                }
            } else {
                // 슬라이더가 여러개 씩 움직일 경우 고려 (MA)
                maxSlideViewCnt = parseInt(this.$slide.length / this.moveSlideCnt);
            }

            if (this.curIdx === 0) {
                this.$prevBtn.addClass('disabled');
                this.$prevBtn.attr('disabled', true);
            } else {
                this.$prevBtn.removeClass('disabled');
                this.$prevBtn.attr('disabled', false);
            }

            if (this.curIdx === maxSlideViewCnt) {
                this.$nextBtn.addClass('disabled');
                this.$nextBtn.attr('disabled', true);
            } else {
                this.$nextBtn.removeClass('disabled');
                this.$nextBtn.attr('disabled', false);
            }
        },
        _prevSlide: function () {
            this.moveIdx--;
            this.curIdx--;

            if (this.isLoop) {

                if (this.curIdx < 0) {
                    this.curIdx = this.totalSlide - 1;
                }

                // 이전 버튼 빨리 누를 경우 =>
                // 맨 처음 슬라이드 (duplicate last slide) 위치 시  두번째 슬라이드 위치 후 첫번재 슬라이드 이동 
                if (this.moveIdx < 0) {
                    this.moveIdx = 1;
                    $(this).css('marginLeft', -(this.totalSlide - 1) * this.slideWidth);
                }

            } else {
                if (this.moveIdx < 0) {
                    this.moveIdx = 0;
                    this.curIdx = 0;
                    return;
                }
            }
            this._effectMoveSlide('prev');
            this._moveSlide(this.moveIdx);
        },
        _nextSlide: function () {
            this.moveIdx++;
            this.curIdx++;

            if (this.isLoop) {
                // 마지막 슬라이드 이동
                if (this.curIdx > this.totalSlide - 1) {
                    this.curIdx = 0;
                }

                // 다음 버튼 빨리 누를 경우 =>
                // 맨 마지막 슬라이드 (duplicate first slide) 위치 시  첫번째 슬라이드 위치 후 두번재 슬라이드 이동 
                if (this.options.isDummySlide) {
                    if (this.moveIdx === this.totalSlide + 4) {
                        this.moveIdx = 3;
                        $(this).css('marginLeft', -(this.slideWidth * 2));
                    }
                } else if (this.moveIdx === this.totalSlide + 2) {
                    this.moveIdx = 2;
                    $(this).css('marginLeft', -this.slideWidth);
                }
            } else {

                if (this.moveIdx > this.totalSlide - 1) {
                    this.moveIdx = this.totalSlide - 1;
                    this.curIdx = this.totalSlide - 1;
                    return;
                }
            }
            this._effectMoveSlide('next');
            this._moveSlide(this.moveIdx);
        },
        _moveSlide: function (idx, _moveSlideTid) {
            var oSelf = this;
            var moveSlideTid;
            if (_moveSlideTid === undefined) {
                moveSlideTid = 400;
            } else {
                moveSlideTid = _moveSlideTid;
            }

            this._markNav();
            this._checkBtn();

            var sliderMarL = parseInt(this.$slide.css('marginLeft'));
            var moveSz = - (idx * this.distance) + this.wrapMarLeft;

            //접근성 태그 초기화
            if (this.isSetAccessbillityFocus) {
                this.$wrapper.find(this.options.slideClass).css('visibility', 'visible');
            }
            this.$wrapper.stop(true, true).animate({
                'margin-left': moveSz
            }, moveSlideTid, 'easeOutCubic', function () {
                if (oSelf.isLoop) {
                    // 처음 duplicate 슬라이드 보일 경우 : 마지막 슬라이드 이동 
                    if (oSelf.options.isDummySlide) {
                        if (idx === 1) {
                            oSelf.moveIdx = oSelf.totalSlide + 1;
                            $(this).css('marginLeft', - ((oSelf.totalSlide + 1) * oSelf.distance) + oSelf.wrapMarLeft);
                        }
                    } else if (idx === 0) {
                        oSelf.moveIdx = oSelf.totalSlide;
                        $(this).css('marginLeft', - (oSelf.totalSlide * oSelf.distance) + oSelf.wrapMarLeft);
                    }
                    // 마지막 duplicate 슬라이드 보일 경우 : 처음 슬라이드 이동 
                    if (oSelf.options.isDummySlide) {
                        if (oSelf.moveIdx === oSelf.totalSlide + 2) {
                            oSelf.moveIdx = 2;
                            $(this).css('marginLeft', - (oSelf.distance * 2) + oSelf.wrapMarLeft);
                        }
                    } else if (idx === oSelf.totalSlide + 1) {
                        oSelf.moveIdx = 1;
                        $(this).css('marginLeft', -oSelf.distance + oSelf.wrapMarLeft);
                    }
                }

                //접근성 태그
                oSelf._setAccessbillity();

                //애니메이션 완료
                oSelf._emit('onTransitionEnd');

                //활성화 slide 표시 
                oSelf._checkActSlide();

            });
        },
        _setAccessbillity: function () {
            if (!this.isSetAccessbillityFocus) {
                return;
            }
            var viewStartIdx = this.moveIdx * this.moveSlideCnt;
            var viewEndIdx = viewStartIdx + this.perViewSlideCnt;
            var $slide = this.$wrapper.find(this.options.slideClass);

            $slide.attr('aria-hidden', 'true');
            $slide.css('visibility', 'hidden');

            for (var i = viewStartIdx; i < viewEndIdx; i++) {
                $slide.eq(i).attr('aria-hidden', 'false');
                $slide.eq(i).css('visibility', 'visible');
            }
        },
        _checkActSlide: function () {
            //활성화 슬라이드 클래스 지정
            if (this.options.activeClass !== undefined) {
                var $slide = this.$wrapper.find(this.options.slideClass);
                $slide.removeClass(this.options.activeClass);
                $slide.eq(this.moveIdx).addClass(this.options.activeClass);
            }
        },
        _effectMoveSlide: function (dir) {
            // 슬라이드 이동시 애니메이션 효과 
            var oSelf = this;
            var $slide = this.$wrapper.find(this.options.slideClass);
            if (this.options.effectMove !== undefined) {
                var $actSlide = $slide.filter(function () {
                    return $(this).hasClass(oSelf.options.activeClass);
                });
                var $nextActSlide;
                if (dir === 'prev') {
                    $nextActSlide = $actSlide.prev();
                } else {
                    $nextActSlide = $actSlide.next();
                }

                $actSlide.stop().animate({
                    opacity: '0.3'
                }, 400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                });

                $nextActSlide.stop().animate({
                    opacity: '1'
                }, 400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                });

            }
        },
        _markNav: function () {
            var $navBtn = this.$nav.find('button');
            $navBtn.removeClass('on');
            $navBtn.attr('title', '');


            $navBtn.eq(this.curIdx).addClass('on');
            $navBtn.eq(this.curIdx).attr('title', '선택됨');

        },
        _startAutoPlay: function () {
            var oSelf = this;
            var slideTime;
            if (this.autoPlay === undefined) {
                slideTime = 3000;
            } else {
                slideTime = this.autoPlay;
            }
            if (this._timeId === 0) {
                this._timeId = setInterval(function () {
                    oSelf._nextSlide();
                }, slideTime);
            }
        },
        _stopAutoPlay: function () {
            var oSelf = this;
            if (this._timeId != 0) {
                clearInterval(this._timeId);
                this._timeId = 0;
            }
        },
        setSlide: function (idx) {
            var minSlideCnt = this.perViewSlideCnt;
            var maxSlideCnt = this.slideLenght - minSlideCnt;

            //슬라이드 최소 갯수 일 경우 정지(PBS9_4)
            if (!this.isLoop && (this.$slide.length <= minSlideCnt)) {
                return;
            }

            this.curIdx = idx;

            if (this.isLoop === true) {
                this.moveIdx = 1 + this.curIdx;
            } else {
                this.moveIdx = this.curIdx;
            }

            if (!this.isLoop && (this.moveIdx >= maxSlideCnt)) {
                this.moveIdx = maxSlideCnt;
                this.curIdx = maxSlideCnt;
            }
            this._moveSlide(this.moveIdx, 0);
        },
        onTransitionEnd: function (runCallbacks) {
            if (runCallbacks) {
                this._emitOn('onTransitionEnd', runCallbacks);
            }
        },
        _emitOn: function (ev, cb) {
            this.subscribers = {};
            this.subscribers[ev] = this.subscribers[ev] || [];
            this.subscribers[ev].push({
                callback: cb
            });
        },
        _emit: function (ev) {
            if (this.subscribers === undefined) {
                return;
            }
            var subs = this.subscribers[ev];
            var idx = 0;
            var args = Array.prototype.slice.call(arguments, 1);
            if (subs) {
                while (idx < subs.length) {
                    sub = subs[idx];
                    sub.callback.apply(sub.context || this, args);
                    idx++;
                }
            }
        }
    };
    $.fn.slideBannerJs = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_slideBannerJs") && $(this).is(':visible')) {
                $.data(this, "plugin_slideBannerJs", new ns.slideBannerJs(this, options));
            }
        });
    };

    ns.slideTabJs = ns.slideTabJs || {};
    ns.slideTabJs = function (element, options) {
        this.element = element;
        this.$target = $(this.element);
        this.options = $.extend({}, defaultTabJs, options);
        this.init();

    };
    ns.slideTabJs.prototype = {
        constructor: ns.slideTabJs,
        init: function () {
            this.$targetWrap = this.$target.closest(this.options.targetWrap);
            this.targetWrapPadd = parseInt(this.$targetWrap.css('paddingRight'));
            this.tabW = this.$target.width();
            this.$tabList = this.$target.find('>ul');
            this.tabEl = this.$tabList.find('>li');
            this.tabElW = this.tabEl.width();
            this.tabElLength = this.tabEl.length;

            this.slidePosX = [0];

            //카드 상세 일 경우 max Length 지정
            if (this.$targetWrap.closest('.cardBnfTab').length > 0) {
                this.maxTabLength = parseInt(this.tabW / this.tabElW);
                this.isCardSlide = true;
            } else {
                this.maxTabLength = parseInt(this.tabW / this.tabElW);
                this.isCardSlide = false;
            }

            // set slide posX
            var gubunSlide = Math.ceil(this.tabElLength / this.maxTabLength);

            var slideX = 0;
            var tabListW = this.$target.width();

            var modSlideX;
            var gubunSlideMod;
            var lastSlideX;
            if (gubunSlide > 0) {
                for (var i = 0; i < gubunSlide; i++) {

                    if (i > 0) {
                        slideX = - (i * this.maxTabLength * this.tabElW);

                        if (i === (gubunSlide - 1)) {
                            //마지막
                            lastSlideX = - (this.tabElLength * this.tabElW) + tabListW - 2;
                            this.slidePosX.push(lastSlideX);
                        } else {
                            this.slidePosX.push(slideX);
                        }
                    }

                }

            }


            this.$prevBtn = this.$targetWrap.find(this.options.prevBtn);
            this.$nextBtn = this.$targetWrap.find(this.options.nextBtn);

            this.curIdx = 0;

            this._checkBtn();
            this._bindEvent();
            this._setElment();
        },
        _checkBtn: function () {
            if (this.curIdx === 0) {
                this.$prevBtn.addClass('disabled');
                this.$prevBtn.attr('disabled', true);
            } else {
                this.$prevBtn.removeClass('disabled');
                this.$prevBtn.attr('disabled', false);
            }

            var isLastSlide = '';
            if (this.isCardSlide) {
                isLastSlide = (this.tabElLength <= this.maxTabLength || ((this.tabElLength - this.maxTabLength * (this.curIdx)) <= 5));
            } else {
                isLastSlide = ((this.tabElLength - this.maxTabLength - this.curIdx) === 0);
            }

            if (isLastSlide) {
                this.$nextBtn.addClass('disabled');
                this.$nextBtn.attr('disabled', true);
            } else {
                this.$nextBtn.removeClass('disabled');
                this.$nextBtn.attr('disabled', false);
            }
        },
        _setElment: function () {
            //활성화 탭 중앙 정렬
            var $actTab = this.tabEl.filter(function () {
                return $(this).hasClass('on');
            });

            if ($actTab.length > 0) {
                this._selMoveTab($actTab.find('>a'), false);
            }
        },
        _bindEvent: function () {
            var oSelf = this;
            this.$prevBtn.on('click', $.proxy(this._setPrevMoveSlide, this));

            this.$nextBtn.on('click', $.proxy(this._setNextMoveSlide, this));

            this.tabEl.on('click', '>a', function () {
                oSelf._selMoveTab($(this), true);
            });
        },
        _setPrevMoveSlide: function () {
            var tabMarLeft = parseInt(this.$tabList.css('marginLeft'));
            var prevTabIdx = 0;
            var oSelf = this;
            $.each(oSelf.slidePosX, function (idx, val) {
                if (tabMarLeft >= val) {
                    prevTabIdx = idx - 1;
                    return false;
                }
            });
            var moveLeft = this.slidePosX[prevTabIdx];

            this.$tabList.stop().animate({
                'margin-left': moveLeft
            }, 400, 'easeOutCubic', function () {
                oSelf._checkBtn();
            });

        },
        _setNextMoveSlide: function () {
            var tabMarLeft = parseInt(this.$tabList.css('marginLeft'));
            var nextTabIdx;
            var oSelf = this;
            $.each(oSelf.slidePosX, function (idx, val) {
                if (tabMarLeft > val) {
                    nextTabIdx = idx;
                    return false;
                }
            });

            var moveLeft = this.slidePosX[nextTabIdx];

            this.$tabList.stop().animate({
                'margin-left': moveLeft
            }, 400, 'easeOutCubic', function () {
                oSelf._checkBtn();
            });
        },
        _selMoveTab: function (_$target, isAni) {
            var moveLeft;
            var oSelf = this;
            var $tabA = _$target;
            var $tabEl = $tabA.parent();
            var idx = $tabEl.index();
            var preSlidePos = Math.abs(parseInt(this.$tabList.css('marginLeft')));
            var centerPos = -($tabEl.outerWidth() * (idx - 2));
            if (centerPos > 0) {
                centerPos = 0;
            }
            var maxPos = this.slidePosX[this.slidePosX.length - 1];
            if (centerPos <= maxPos) {
                //최대
                moveLeft = maxPos;
            } else {
                //맨 처음
                moveLeft = centerPos;
            }

            if (isAni) {
                this.$tabList.stop().animate({
                    'margin-left': moveLeft
                }, 400, 'easeOutCubic', function () {
                    oSelf._checkBtn();
                });

            } else {
                // 처음 화면 로딩 시 애니메이션 효과  삭제
                this.$tabList.css('marginLeft', moveLeft);
                this._checkBtn();
            }
        },
        _checkBtn: function () {
            var marLeft = parseInt(this.$tabList.css('marginLeft'));

            if (marLeft === 0) {
                this.$prevBtn.addClass('disabled');
                this.$prevBtn.attr('disabled', true);
            } else {
                this.$prevBtn.removeClass('disabled');
                this.$prevBtn.attr('disabled', false);
            }
            if (marLeft === this.slidePosX[this.slidePosX.length - 1]) {
                this.$nextBtn.addClass('disabled');
                this.$nextBtn.attr('disabled', true);
            } else {
                this.$nextBtn.removeClass('disabled');
                this.$nextBtn.attr('disabled', false);
            }
        }
    };

    $.fn.slideTabJs = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_slideTabJs")) {
                $.data(this, "plugin_slideTabJs", new ns.slideTabJs(this, options));
            }
        });
    };

    /*
     *  차트 그리기
     */
    ns.drawPieChartJs = ns.drawPieChartJs || {};
    ns.drawPieChartJs = function (element, data) {
        this.element = element;
        this.target = $(this.element);
        this.data = data;
        this.init();
    };

    ns.drawPieChartJs.prototype = {
        constructor: ns.drawPieChartJs,
        init: function () {

            this.chartWidth = 180;
            this.chartHeight = 180;
            this.lineWdith = 12;

            this.centerPosX = this.chartWidth / 2;
            this.centerPosY = this.chartHeight / 2;

            this.radius = this.centerPosX - (this.lineWdith / 2);

            this._setElment();
        },
        _setElment: function () {

            // 배경 값 그리기
            this._baseLine();

            //현재 값 그리기
            this._actLine();

        },
        _baseLine: function () {
            var startAngle = 0,
                endAngle = Math.PI * 2;
            this.target.append('<canvas width="180" height="180" />');
            var canvas = this.target.find('canvas').get(0);
            if (typeof G_vmlCanvasManager != 'undefined') {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            var context = canvas.getContext('2d');
            context.beginPath();

            context.arc(this.centerPosX, this.centerPosY, this.radius, startAngle, endAngle);
            context.lineWidth = this.lineWdith;
            context.strokeStyle = "#e6e6e6";
            context.stroke();
        },
        _actLine: function () {
            var percentage = this.data.curVal / this.data.totalVal,
                degrees = percentage * 360,
                radians = (degrees * Math.PI) / 180,
                startAngle = Math.PI * 1.5,
                endAngle = Math.PI * 0.5;

            var canvas = this.target.find('canvas').get(0);
            var context = canvas.getContext('2d');
            context.beginPath();

            context.arc(this.centerPosX, this.centerPosY, this.radius, startAngle, radians + startAngle);
            context.lineWidth = this.lineWdith;
            context.strokeStyle = "#6b5ea3";
            context.stroke();

        }
    };

    $.fn.drawPieChartJs = function (data) {
        return this.each(function () {
            $.data(this, "plugin_drawPieChartJs", new ns.drawPieChartJs(this, data));
        });
    };

    /**
     *   개별 함수
     */

    ns.domEvent = {
        init: function () {
            //메인 페이지
            this.mainAni.init();

            //회사 소개
            this.comAni.init();

            //회사 연혁 (CI3.html)
            this.scrollComp.init();

            // toggle stmSelect (PMP2_1.html)
            this.stmSelect.init();

            //tab More btn
            this.toggleTabMore.init();

            // 포인트 메뉴 토글 PBS2_9_1
            this.togPtMenu.init();

            //프로모션 gif (PLC6_2)
            this.aniPromotion.init();


            //내게 맞는 카드 선택(PCD1_2S.html, PCD1_2S_1L)
            this.selCard.init();
            this.scrollSelCard.init();

            //plan gage ani (PMP4_1_1S.html)
            this.planGage.init();

            //barChart ani (PMP_3P.html)
            this.barChart.init();


            //빅데이터 분석 그래프(CCU3_6_1)
            this.dataGage.init();

            //통합 검색(PET2_1)
            this.totSearchBox.init();

            //기부 - 차트 (FD1_1)
            //막대 그래프 그리기 , 자세히 보기 토글
            this.socialMatch.init();

            /*
             *  카드 혜택
             */
            this._cardBnfTab();

            /*
             * 카드 서명 (PCD2_2_2S)
             */
            this._inpEngName();


            //스마트 픽 슬라이드 카드 선택 (PCD4)
            this._selStmpCard();


            //조직도 체크 선택 (ADMS1_1_1)
            this._checkBtnOrgChart();


            // 카드 템플릿 이미지 경로
            this._setDtImg();

            // 일년 후애 > 신청 리스트 확인 버튼 클릭 시 이용 혜택 리스트 포커스 이동
            this._focusOneYearLater();

            //토글 이벤트 (CSG4_4_2P)
            this._toggleTerms();

            //공통 - 하단 사이트맵 클릭 시 GNB 메뉴 열림 
            this._onClickSiteMap();

            //진행이벤트 > 전체 이벤트 슬라이드 탭 (PBS_event_1)
            this._slideTabEvent();


            //페이지 상단으로 가기 버튼 클릭 시 스크롤 상단 이동
            this._scrollBtnTop();

            // 지역선택 스크롤 추가 (PBS9_2_1T_7T)
            this.travleInner.init();


            // 가맹점, 법인 메인 리사이즈 사이즈 지정
            this.resizeBackSz.init();

        },
        _cardBnfTab: function () {
            $(document).off('click.cardTab');
            $(document).on('click.cardTab', '.cardBnfTab .tabType04 li', function (e) {
                e.preventDefault();
                var curIdx = $(this).index(),
                    tabCont = $(this).closest('.cardBnfTab').find('.bnfCont');
                tabCont.hide();
                tabCont.eq(curIdx).show();

            });


        },
        _inpEngName: function () {
            if ($('.applyEngName').length === 0) {
                return;
            }

            $('.applyEngName').on('focusout', function () {
                var curVal = $(this).val();
                if (curVal.length > 0) {
                    $('.previewCard .engName').text(curVal);
                }
            });
        },
        _selStmpCard: function () {
            if ($('.slider-container.smtpSlide').length === 0) {
                return;
            }
            $(document).off('click.smtpSlide');
            $(document).on('click.smtpSlide', '.slider-container.smtpSlide .slider-slide > a', function (e) {
                e.preventDefault();
                if ($(this).parent().hasClass('on')) {
                    return;
                }
                //이전 선택 초기화
                var prevSel = $(this).parent().siblings('.on');
                prevSel.removeClass('on');
                prevSel.find('.cardImg .onCheck').remove();
                //카드 선택
                $(this).parent().addClass('on');
                $(this).find('.cardImg').append('<span class="onCheck">선택됨</span>');

                //카드 탭 cont 선택
                var cardIdx = $(this).parent().index();
                var $tabContWrap = $(this).closest('.smtpSlide').siblings('.tabCont');
                $tabContWrap.removeClass('on');
                $tabContWrap.eq(cardIdx).addClass('on');

                // 탭 컨텐츠 안에 slideTabJs 포함 되어 있을 경우 재 호출
                if ($('.tabWrap .tabType04.multi:visible').length > 0) {
                    $('.tabWrap .tabType04.multi:visible').parent().removeData("plugin_slideTabJs");
                    $('.tabWrap .tabType04.multi:visible').parent().slideTabJs({
                        targetWrap: '.tabWrap',
                        prevBtn: '.prev',
                        nextBtn: '.next'
                    });
                }
            });
        },
        _checkBtnOrgChart: function () {
            if (!$('.orgChartReg').hasClass('type01')) {
                $('.orgChartReg .orgChart ul').find('a').on('click', function () {
                    $('.orgChartReg .orgChart ul').find('a').removeClass('on');
                    $(this).addClass('on');
                });
            }
        },
        _setDtImg: function () {
            var hostImg = '';
            if (typeof (gvImgUrl) !== "undefined" && gvImgUrl !== '') {
                hostImg = gvImgUrl;
            } else {
                hostImg = 'https://image.lottecard.co.kr';
            }

            var imgReplaceUrl;

            $('.bnfCont .dtImg > img').each(function () {
                if ($(this).attr('src').indexOf('image.lottecard.co.kr') < 0) {
                    imgReplaceUrl = $(this).attr('src').replace('/webapp', hostImg + '/webapp');
                    $(this).attr('src', imgReplaceUrl);
                }
            });

            var btnReplaceUrl;
            $('.bnfCont .toggle .btnCd').each(function () {
                if ($(this).attr('href').indexOf('image.lottecard.co.kr') < 0) {
                    btnReplaceUrl = $(this).attr('href').replace('/webapp', hostImg + '/webapp');
                    $(this).attr('href', btnReplaceUrl);
                }
            });
        },
        _focusOneYearLater: function () {
            var scrollOneYear;
            var headerH = $('.pageTOP').outerHeight() + $('.titDep1').outerHeight() - 10;
            $(document).off('click.focusOneYearLater');
            $(document).on('click.focusOneYearLater', '.useCardList .btnM', function (e) {
                if ($('.oneYearLater').length === 0) {
                    return;
                }
                $oneYear = $('.oneYearLater').prevAll('.titDep2').eq(0);
                scrollOneYear = $oneYear.offset().top - parseInt($oneYear.css('marginTop')) - headerH;
                $oneYear.attr('tabindex', -1).focus();
                $(window).scrollTop(scrollOneYear);
            });
        },
        _toggleTerms: function () {
            $(document).on('click.togTerm', '.taxSaveTerms button', function (e) {
                e.preventDefault();
                if ($(this).text() === '펼치기') {
                    $(this).attr('aria-expanded', 'true');
                    $(this).text("접기");
                } else {
                    $(this).attr('aria-expanded', 'false');
                    $(this).text("펼치기");
                }
                $(this).closest('li').toggleClass('on');
                $(this).closest('li').find('.withdrawBox').slideToggle(400, 'easeOutCubic');
            });
        },
        _onClickSiteMap: function () {
            $(document).off('click.footSiteMap');
            $(document).on('click.footSiteMap', '.footBtm .sitemap a', function (e) {
                $('html,body').scrollTop(0);
                $('.totalMenu > button').focus();
                $('.totalMenu > button').trigger('click');
            });
        },
        _slideTabEvent: function () {
            if ($('.ctgrTab .tabArea').length === 0) {
                return;
            }

            $('.ctgrTab .tabArea').slideTabJs({
                targetWrap: '.ctgrTab',
                prevBtn: '.prevBtn',
                nextBtn: '.nextBtn'
            });
        },
        _scrollBtnTop: function () {
            var scrollBtnTopTid;
            var btnTopBottom;
            var maxBtnBtm;
            var footerH = $('.footer').outerHeight();
            var btnBottom = 50;
            // 화면 스크롤 시 btnTop 위치 조정
            $(window).on('scroll.btnTop', function () {
                scrollBtnTopTid = setTimeout(function () {
                    clearTimeout(scrollBtnTopTid);
                    if ($('.btnTop').length === 0) {
                        return;
                    }
                    maxBtnBtm = -($('body')[0].scrollHeight - $(window).height() - footerH - btnBottom);
                    btnTopBottom = -$(window).scrollTop() + btnBottom;
                    if (btnTopBottom < maxBtnBtm) {
                        btnTopBottom = maxBtnBtm;
                    }

                    $('.btnTop').css('bottom', btnTopBottom);
                }, 0);
            }).trigger('scroll.btnTop');

            //스크롤 상단 버튼 클릭 
            $(document).off('click.btnTop');
            $(document).on('click.btnTop', '.btnTop', function () {
                $(window).scrollTop(0);
            });
        },
        setSzProfileImg: function () {
            var $gnb = $('.gnb');
            var proGnbImg = $('.gnb .myPhoto .file .file_img');
            var proImgWrap = $('.myPhoto .file .file_img');
            var proImg = $('.myPhoto .file .file_img img');
            var isGnb = true;
            var wImg,
                hImg;

            proGnbImg.one('load', function () {
                if (!$gnb.is(':visible')) {
                    isGnb = false;
                    $gnb.show();
                }

                hImg = proGnbImg.height();
                wImg = proGnbImg.width();

                if (wImg > hImg) {
                    proImg.addClass('type02');
                } else {
                    proImg.removeClass('type02');
                }

                if (!isGnb) {
                    $gnb.hide();
                }
            });

            if (proImg.is(':visible')) {
                var proImgW = proImg.width();
                var proImgH = proImg.height();

                if (proImgW > proImgH) {
                    proImgWrap.addClass('type02');
                } else {
                    proImgWrap.removeClass('type02');
                }
            }

            proImg.one('load', function () {
                var proImgW = proImg.width();
                var proImgH = proImg.height();

                if (proImgW > proImgH) {
                    proImgWrap.addClass('type02');
                } else {
                    proImgWrap.removeClass('type02');
                }
            });
        },
        quickApplyBtnAni: function () {
            var $quickBtn = $('.quickWrap .goApply');

            if ($quickBtn.length === 0) {
                return;
            }
            var imgW = $quickBtn.find('.card').outerWidth();

            $quickBtn.stop().delay(2000).animate({
                width: 60,
                'paddingLeft': 9,
                'paddingRight': 9
            }, 400, 'easeOutCubic', function () {
                $(this).removeAttr('style');
                $(this).addClass('fold');
            });
        }
    };
    ns.domEvent.travleInner = {
        init: function () {
            this._bindEvent();
        },
        _bindEvent: function () {
            $(document).off('click.innerTravle');
            $(document).on('click.innerTravle', '.travelSelect  li a', $.proxy(this._selInner, this));
        },
        createScrollTravelInner: function () {
            if ($('.travelSelect').length === 0) {
                return;
            }

            $('.travelSelect').each(function () {
                if ($(this).find('li').length === 0) {
                    return;
                }
                //초기화
                if ($(this).find('> .jspContainer').length === 0) {
                    $(this).removeData('jsp');
                }

                if ($(this).data('jsp') === undefined) {
                    $(this).parents().filter(function () {
                        return $(this).css('display') === 'none';
                    }).show().addClass('unhide_wrap');

                    var scrollHeigth = $(this).outerHeight();
                    $(this).off('jsp-initialised').on(
                        'jsp-initialised',
                        function (event, isScrollable) {
                            //스크롤 조절
                            $(this).find('.jspTrack').removeAttr('style');
                            $(this).find('.jspDrag').css('height', $(this).find('.jspDrag').height() - 10);
                            //불필요한 태그 삭제
                            $(this).find('.jspArrow').remove();
                            $(this).find('.jspCap').remove();
                            $(this).find('.jspHorizontalBar').remove();
                            $(this).css('max-height', '');

                        }
                    )
                        .jScrollPane({
                            verticalDragMinHeight: 30,
                            contentWidth: 177,
                            mouseWheelSpeed: scrollHeigth
                        });
                    $(this).parents('.unhide_wrap').removeAttr('style');
                    $(this).parents('.unhide_wrap').removeClass('unhide_wrap');

                } else {
                    $(this).data('jsp').reinitialise();
                }
            });

        },
        _selInner: function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            $target.parent().addClass('on');
            $target.parent().siblings().removeClass('on');
        }

    };

    ns.domEvent.resizeBackSz = {
        init: function () {
            if ($('.corpMainCont .mainVisualArea').length === 0) {
                return;
            }
            this._setResizeBack();
            this._bindEvent();
        },
        _setResizeBack: function () {
            var winWidth = $(window).width();
            if (winWidth > 2000) {
                $('.corpMainCont .mainVisualArea').css('background-size', '100%');
            } else {
                $('.corpMainCont .mainVisualArea').css('background-size', 'initial');
            }
        },
        _bindEvent: function () {
            $(window).on('resize', $.proxy(this._setResizeBack, this));
        }
    };
    ns.domEvent.mainAni = {
        init: function () {
            //메인 중앙 배너
            this.sliderMain.init();

            //메인 선택 로그인
            this.loginMain.init();

            //메인 탭 컨텐츠 변경
            this.changeTabCont.init();
        }
    };
    ns.domEvent.mainAni.sliderMain = {
        init: function () {
            this.$mainContainer = $('.mainSlider-container');
            this.$mainSlide = $('.mainSlider');
            this.$slide = $('.mainSlider .slider-slide');
            this.slideLenght = this.$slide.length;
            this.$nav = this.$mainContainer.find('.indiList');
            this.$navBtn = this.$mainContainer.find('.indiList > button');
            this.curIdx = 0;
            this._timeId = 0;
            this._isAni = false;
            this._isAutoPlay = true;
            this.dupSlideLength = 0;

            this._setElement();

            //슬라이드 한개 일 경우 auto play 방지
            if (this.$slide.length <= 1) {
                this._removeIndicate();
                return;
            }
            this._bindEvent();
        },
        _setElement: function () {
            //처음 슬라이드 초기화
            this.$mainSlide.find('.prev').removeClass('prev');
            this.$mainSlide.find('.on').removeClass('on');
            this.$mainSlide.find('.next').removeClass('next');

            this._createNav(this.curIdx, this.slideLenght);

            if (
                this.$slide.length === 2 ||
                this.$slide.length === 3
            ) {
                this.dupSlideLength = this.$slide.length;
                this._createDupSlide();
            }
            this.$slide = $('.mainSlider .slider-slide');
            this.slideLenght = this.$slide.length;

            if (this.$slide.length <= 1) {
                this.$mainSlide.find('.slider-slide').addClass('on');
            } else {
                this.$mainSlide.find('.slider-slide').eq(this.slideLenght - 1).addClass('prev');

                this.$mainSlide.find('.slider-slide').eq(0).addClass('on');
                this.$mainSlide.find('.slider-slide').eq(1).addClass('next');

                this._replaceTag();

            }
        },
        _createNav: function (current, total) {
            this.$nav.html('');


            var text = '',
                txt = '',
                $buttonEl = this.$nav.find('>button');
            for (var i = 1; i <= total; i++) {
                if ((current + 1) == i) {
                    text += "<button type='button' class='on' title='선택됨'>" + i + "</button>";
                } else {
                    text += "<button type='button'>" + i + "</button>";
                }
            }
            this.$nav.html(text);

            $buttonEl.removeClass('on');
            $buttonEl.attr('title', '');


            $buttonEl.eq(current).addClass('on');
            $buttonEl.eq(current).attr('title', '선택됨');
        },
        _createDupSlide: function () {
            var $dupSlide = $('.mainSlider .slider-slide').clone();
            $('.mainSlider .slider-slide').last().after($dupSlide);
        },
        _replaceTag: function () {
            var oSelf = this;
            var curSlide = $('.mainSlider .slider-slide.on').children().get(0);
            if (curSlide && curSlide.tagName === 'SPAN') {
                // span -> a
                this._changeTag('a', curSlide);
            }
            var $otherSlide = $('.mainSlider .slider-slide.on').siblings().children();
            $.each($otherSlide, function (idx, el) {
                if (el.tagName === 'A') {
                    // a -> span  
                    oSelf._changeTag('span', el);
                }
            })
        },
        _changeTag: function (tag, el) {
            var $target = $(el);
            var $newTag = $("<" + tag + ">");

            $.each(el.attributes, function (i, attribute) {
                $newTag.attr(attribute.nodeName, attribute.nodeValue);
            });

            //content
            $newTag.html($target.html());
            $target.replaceWith($newTag);
        },
        _bindEvent: function () {
            this._startAutoPlay();

            //이전 다음 버튼 클릭
            $(document).off('click.sliderBtn');
            $(document).on('click.sliderBtn', '.mainSlider-container .prevSlide,.mainSlider-container .nextSlide', $.proxy(this._onClickSlideBtn, this));


            //재생 , 정지 버튼
            $(document).off('click.play');
            $(document).on('click.play', '.mainSlider-container .indiWrap .btnStop', $.proxy(this._onClickPlayBtn, this));

            $(document).off('click.navMainSlider');
            $(document).on('click.navMainSlider', '.mainSlider-container  .indiList > button', $.proxy(this._onClickNav, this));

            $(document).off('keyup.accessbillityMainTab');
            $(document).on('keyup.accessbillityMainTab', $.proxy(this._onkeyUpMoveMainTab, this));
        },
        _onkeyUpMoveMainTab: function (e) {
            var $focusEl = $(e.target);

            var $focusSlide = $('.mainSlider-container').find('*').filter(function () {
                if ($(this).get(0) === $focusEl.get(0)) {
                    return $(this);
                }
            });

            var isStartSlide = !$('.mainSlider-container .btnStop').hasClass('play');
            if ($focusSlide.length > 0) {
                // 재생 -> 정지 
                this._stopAutoPlay();
            } else if (isStartSlide) {
                //focus out - 정지 -> 기존 상태가 재생 일 경우 재시작
                this._startAutoPlay();
            }
        },
        _removeIndicate: function () {
            var $indiWrap = this.$mainContainer.find('.indiWrap');
            var $prevBtn = this.$mainContainer.find('.prevSlide');
            var $nextBtn = this.$mainContainer.find('.nextSlide');
            if ($indiWrap.length > 0) {
                $indiWrap.hide();
            }

            if ($prevBtn.length > 0) {
                $prevBtn.hide();
            }
            if ($nextBtn.length > 0) {
                $nextBtn.hide();
            }
        },
        _startAutoPlay: function () {
            var oSelf = this;
            //슬라이드 한개 일 경우 auto play 방지
            if (this.$slide.length <= 1) {
                return;
            }
            if (this._timeId === 0) {
                this._timeId = setInterval($.proxy(oSelf._nextSlide, this), 5000);
            }
        },
        _stopAutoPlay: function () {
            //슬라이드 한개 일 경우 auto play 방지
            if (this.$slide.length <= 1) {
                return;
            }
            if (this._timeId != 0) {
                clearInterval(this._timeId);
                this._timeId = 0;
            }
        },
        _onClickPlayBtn: function (e) {
            var $playBtn = $(e.currentTarget);

            if ($playBtn.hasClass('play')) {
                //정지
                this._startAutoPlay();
                $playBtn.removeClass('play');
                $playBtn.text('정지');
                this._isAutoPlay = true;
            } else {
                //재생
                this._stopAutoPlay();
                $playBtn.addClass('play');
                $playBtn.text('재생');
                this._isAutoPlay = false;
            }

        },
        _onClickSlideBtn: function (e) {
            var $curBtn = $(e.currentTarget);
            if (this._isAni === true) {
                return;
            }
            if (this._isAutoPlay) {
                this._stopAutoPlay();
            }

            if ($curBtn.hasClass('prevSlide')) {
                this._prevSlide();
            } else {
                this._nextSlide();
            }
            if (this._isAutoPlay) {
                this._startAutoPlay();
            }
        },
        _prevSlide: function (_slideIdx) {
            var oSelf = this;
            this._isAni = true;
            //변경 전 현재 슬라이더
            var preCurIdx = this.curIdx;

            //변경 전 현재 다음  슬라이더
            var preNextIdx = this.curIdx + 1;
            if (preNextIdx > this.slideLenght - 1) {
                preNextIdx = 0;
            }

            if (_slideIdx !== undefined) {
                this.curIdx = _slideIdx;
            } else {
                this.curIdx--;
                if (this.curIdx < 0) {
                    this.curIdx = this.slideLenght - 1;
                }
            }

            //변경 전 현재 이전 슬라이더
            var prePreIdx = this.curIdx;

            var $curSlide = $('.mainSlider .slider-slide').eq(preCurIdx);
            var $preSlide = $('.mainSlider .slider-slide').eq(prePreIdx);
            var $nextSlide = $('.mainSlider .slider-slide').eq(preNextIdx);


            var centerSlideW = parseInt($curSlide.width() / 2);
            var preSlideImgW = parseInt(($curSlide.width() * $preSlide.find('img').height()) / $curSlide.height());



            //네비게이션 체크
            this._checkNav();

            var ceterPos = parseInt($(window).width() / 2) - centerSlideW;
            var actSlideW = $curSlide.width();
            var actSlideH = $curSlide.height();
            var preSlideW = $preSlide.width();
            var preSlideImgH = $preSlide.find('img').height();
            var preSlideLeft = preSlideW / 2;

            //현재 슬라이드 ->  다음 슬라이드  변경
            $curSlide.css({
                left: ceterPos,
                marginLeft: '0'
            });

            var leftPos;
            var isMinWindowMode;
            if ($(window).width() <= 1560) {
                leftPos = $(window).width();
                isMinWindowMode = true;
            } else {
                leftPos = $(window).width() - preSlideLeft;
                isMinWindowMode = false;
            }

            $curSlide.stop().animate({
                width: preSlideW,
                left: leftPos,
                opacity: 0.5,
                'border-radius': '50%'
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
                $(this).removeClass('on');
                $(this).addClass('next');
                $(this).find('img').removeAttr('style');
                $(this).find('span').removeAttr('style');
                oSelf._isAni = false;
                oSelf._replaceTag();
            });


            $curSlide.find('img').stop().animate({
                height: preSlideImgH,
                width: preSlideImgW
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
            });


            //이전 슬라이드 -> 현재 슬라이드 변경
            $preSlide.stop().animate({
                width: actSlideW,
                height: actSlideH,
                left: ceterPos,
                opacity: 1,
                top: 0,
                'border-radius': '0'
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
                $(this).removeClass('prev');
                $curSlide.removeClass('on');
                $(this).addClass('on');
                $(this).find('img').removeAttr('style');
                $(this).find('span').removeAttr('style');
                oSelf._replaceTag();
            });


            //이미지 fadeOut
            $preSlide.find('span').stop().animate({
                width: actSlideW,
                height: actSlideH,
                opacity: 1
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
            });


            $preSlide.find('img').stop().animate({
                height: actSlideH
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
            });


            //이전 슬라이드 -> 현재 슬라이드 작업 변경시 이전 슬라이드 표시
            if ($preSlide.prev().length === 0) {
                this.$slide.eq(this.slideLenght - 1).addClass('prev');
                if (!isMinWindowMode) {
                    this.$slide.eq(this.slideLenght - 1).css({
                        left: -preSlideW
                    });

                    this.$slide.eq(this.slideLenght - 1).stop().delay(100).animate({
                        left: -preSlideLeft
                    }, 400, 'easeOutQuart', function () {
                        $(this).removeAttr('style');
                    });
                }
            } else {
                $preSlide.prev().addClass('prev');
                if (!isMinWindowMode) {
                    $preSlide.prev().css({
                        left: -preSlideW
                    });

                    $preSlide.prev().stop().delay(100).animate({
                        left: -preSlideLeft
                    }, 400, 'easeOutQuart', function () {
                        $(this).removeAttr('style');
                    });
                }
            }

            //next 슬라이드 변경
            if (!isMinWindowMode) {
                $nextSlide.stop().animate({
                    right: -preSlideW
                }, 400, 'easeOutQuart', function () {
                    $(this).removeAttr('style');
                    $(this).removeClass('next');
                });
            } else {
                $nextSlide.removeAttr('style');
                $nextSlide.removeClass('next');
            }

        },
        _nextSlide: function (_slideIdx) {
            var oSelf = this;
            this._isAni = true;

            //변경 전 현재 슬라이더
            var preCurIdx = this.curIdx;

            //변경 전 현재 이전 슬라이더
            var prePreIdx = this.curIdx - 1;
            if (prePreIdx < 0) {
                prePreIdx = this.slideLenght - 1;
            }

            this.curIdx++;
            if (this.curIdx >= this.slideLenght) {
                this.curIdx = 0;
            }

            //변경 전 현재 다음 슬라이더
            var preNextIdx = this.curIdx;


            var $curSlide = $('.mainSlider .slider-slide').eq(preCurIdx);
            var $preSlide = $('.mainSlider .slider-slide').eq(prePreIdx);
            var $nextSlide = $('.mainSlider .slider-slide').eq(preNextIdx);


            //네비게이션 체크
            this._checkNav();

            var centerSlideW = parseInt($curSlide.width() / 2);
            var preSlideImgW = parseInt(($curSlide.width() * $preSlide.find('img').height()) / $curSlide.height());


            //현재 슬라이드 -> 이전 슬라이드  변경
            var ceterPos = parseInt($(window).width() / 2) - centerSlideW;
            var actSlideW = $curSlide.width();
            var actSlideH = $curSlide.height();
            var preSlideW = $preSlide.width();
            var preSlideImgH = $preSlide.find('img').height();
            $curSlide.css({
                left: ceterPos,
                marginLeft: '0'
            });


            var preSlideLeft;
            var isMinWindowMode;
            if ($(window).width() <= 1560) {
                preSlideLeft = preSlideW;
                isMinWindowMode = true;
            } else {
                preSlideLeft = preSlideW / 2;
                isMinWindowMode = false;
            }

            $curSlide.stop().animate({
                width: preSlideW,
                left: -preSlideLeft,
                opacity: 0.5,
                'border-radius': '50%'
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
                $(this).removeClass('on');
                $(this).addClass('prev');
                $(this).find('img').removeAttr('style');
                oSelf._isAni = false;
                oSelf._replaceTag();
            });


            $curSlide.find('img').stop().animate({
                height: preSlideImgH,
                width: preSlideImgW
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
            });


            //다음 슬라이드 -> 현재 슬라이드 변경
            $nextSlide.stop().animate({
                width: actSlideW,
                height: actSlideH,
                right: ceterPos,
                opacity: 1,
                top: 0,
                'border-radius': '0'
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
                $(this).removeClass('next');
                $curSlide.removeClass('on');
                $(this).addClass('on');
                $(this).find('img').removeAttr('style');
                $(this).find('span').removeAttr('style');
                oSelf._replaceTag();
            });


            //이미지 fadeOut
            $nextSlide.find('span').stop().animate({
                width: actSlideW,
                height: actSlideH,
                opacity: 1
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
            });

            $nextSlide.find('img').stop().animate({
                height: actSlideH
            }, 600, 'easeOutQuart', function () {
                $(this).removeAttr('style');
            });


            // 다음 슬라이드 -> 현재 슬라이드 작업 변경시 다음 슬라이드 표시
            if ($nextSlide.next().length === 0) {
                this.$slide.eq(0).addClass('next');
                if (!isMinWindowMode) {
                    this.$slide.eq(0).css({
                        right: -preSlideW
                    });

                    this.$slide.eq(0).stop().delay(100).animate({
                        right: -preSlideLeft
                    }, 400, 'easeOutQuart', function () {
                        $(this).removeAttr('style');
                    });
                }
            } else {
                $nextSlide.next().addClass('next');
                if (!isMinWindowMode) {
                    $nextSlide.next().css({
                        right: -preSlideW
                    });

                    $nextSlide.next().stop().delay(100).animate({
                        right: -preSlideLeft
                    }, 400, 'easeOutQuart', function () {
                        $(this).removeAttr('style');
                    });
                }
            }

            //prev 이전 슬라이드 변경
            if (!isMinWindowMode) {
                $preSlide.stop().animate({
                    left: -preSlideW
                }, 400, 'easeOutQuart', function () {
                    $(this).removeAttr('style');
                    $(this).removeClass('prev');
                });
            } else {
                $preSlide.removeAttr('style');
                $preSlide.removeClass('prev');
            }

        },
        _checkNav: function () {
            var navIdx;
            this.$navBtn = this.$mainContainer.find('.indiList > button');

            if (this.dupSlideLength > 0) {
                navIdx = this.curIdx % this.dupSlideLength;
            } else {
                navIdx = this.curIdx;
            }


            this.$navBtn.removeAttr('aria-selected');
            this.$navBtn.removeClass('on');

            this.$navBtn.eq(navIdx).attr('aria-selected', 'true');
            this.$navBtn.eq(navIdx).addClass('on');
        },
        _onClickNav: function (e) {
            var curIdx = $(e.currentTarget).index();
            if (curIdx === this.curIdx) {
                return;
            }
            if (this._isAutoPlay) {
                this._stopAutoPlay();
            }
            this.curIdx = curIdx;

            var preIdx = this.curIdx - 1;
            if (preIdx < 0) {
                preIdx = this.slideLenght - 1;
            }
            var nextIdx = this.curIdx + 1;
            if (nextIdx > this.slideLenght - 1) {
                nextIdx = 0;
            }
            $('.mainSlider .slider-slide').removeClass('on');
            $('.mainSlider .slider-slide').removeClass('prev');
            $('.mainSlider .slider-slide').removeClass('next');
            $('.mainSlider .slider-slide img').removeAttr('style');

            $('.mainSlider .slider-slide').eq(preIdx).addClass('prev');
            $('.mainSlider .slider-slide').eq(this.curIdx).addClass('on');
            $('.mainSlider .slider-slide').eq(nextIdx).addClass('next');
            this._checkNav();
            this._replaceTag();
            if (this._isAutoPlay) {
                this._startAutoPlay();
            }
        }
    };
    ns.domEvent.mainAni.loginMain = {
        init: function () {
            this._bindEvent();
        },
        _bindEvent: function () {
            $(document).off('click.openLoginMenu');
            $(document).on('click.openLoginMenu', '.loginSel > li > a', $.proxy(this._onClickOpenLoginMenu, this));


            $(document).off('click.closeLoginMenu');
            $(document).on('click.closeLoginMenu', '.mainLogin > .close', $.proxy(this._onClickCloseLoginMenu, this));
        },
        _onClickOpenLoginMenu: function (e) {
            e.preventDefault();
            var $loginMenu = $('.mainLogin .loginSel li');
            var $curEl = $(e.currentTarget);
            var $curMenu = $curEl.parent();
            var $curLoginArea = $curMenu.find('.loginAreaS');
            var menuPadB;
            this.$loginSel = $('.loginSel');

            //초기화
            $loginMenu.removeClass('on');
            $loginMenu.find('>a').removeAttr('aria-selected');

            //현재 메뉴 선택
            $curMenu.addClass('on');
            $curEl.attr('aria-selected', 'true');

            menuPadB = parseInt($curMenu.css('paddingBottom'));

            if (!this.$loginSel.hasClass('open')) {
                //애니메이션 열기
                this.$loginSel.addClass('open');

                $curMenu.css('paddingBottom', 0);
                $curLoginArea.hide();

                $curMenu.stop().animate({
                    'paddingBottom': menuPadB
                }, 400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                });


                $curLoginArea.slideDown(400, 'easeOutCubic', function () {
                    $(this).removeAttr('style');
                });

            }

        },
        _onClickCloseLoginMenu: function (e) {

            var $closeMenu = $(e.currentTarget);

            var $loginSel = $('.loginSel');
            var openedMenu = this.$loginSel.find('> li.on');
            var openedArea = openedMenu.find('.loginAreaS');

            openedMenu.stop().animate({
                'paddingBottom': 0
            }, 400, 'easeInCubic', function () {
                $(this).removeClass('on');
                $(this).removeAttr('style');
                $(this).find('>a').attr('aria-selected', 'false');
                $loginSel.removeClass('open');
            });



            openedArea.slideUp(400, 'easeInCubic', function () {
                $(this).removeAttr('style');
            });

        }
    };
    ns.domEvent.mainAni.changeTabCont = {
        init: function () {
            //카드
            this.cardCont.init();

            //혜택
            this._benefitCont();

            //생활 편의
            this._conventCont();

            //생활/ 문화
            this.lifeCont.init();

            this._bindEvent();
        },
        _bindEvent: function () {
            $(document).off('click.mainTab');
            $(document).on('click.mainTab', '.mainTabcont > li > a', $.proxy(this._onClickMainTab, this));


        },
        _onClickMainTab: function (e) {
            var $curEl = $(e.currentTarget);
            //MY 탭은 링크로 설정
            if ($curEl.parent().index() !== 5) {
                e.preventDefault();
            }
            $('.mainTabcont > li ').removeClass('on');
            $('.mainTabcont > li > a').removeAttr('aria-selected');

            $curEl.attr('aria-selected', 'true');
            $curEl.parent().addClass('on');

            //슬라이드 배너 재 호출
            this._benefitCont();
        },
        _benefitCont: function () {
            var couponOpt = {
                containerClass: '.touch',
                wrapperClass: '.swiper-wrap',
                slideClass: '.touchList',
                isLoop: true,
                distance: 390, // 화면 이동 거리
                slideW: 370,
                slideWrapW: 410,    // slide Wrap 전체 넓이 지정
                autoPlay: 3000 //자동 재생 시간
            };
            $('.contentC2 .touch').slideBannerJs(couponOpt);
        },
        _conventCont: function () {
            var $mainTabLink = $('.convenCont  .mainTab02 > li > a');
            $(document).off('click.convenMainTab');
            $(document).on('click.convenMainTab', '.convenCont  .mainTab02 > li > a', function (e) {
                e.preventDefault();
                $mainTabLink.removeAttr('aria-selected');
                $(this).attr('aria-selected', 'true');
            });
        }
    };
    ns.domEvent.mainAni.changeTabCont.cardCont = {
        init: function () {
            this.curCardContIdx = 0;
            this.cardContTot = $('.cardCont .mainTab02 > li >a').length;
            this.isRoll = true;

            this._bindEvent();

        },
        _bindEvent: function () {
            this._stopCardCont();
            this._playCardCont();
            //mouse over
            $(document).off('mouseenter.mainCardCont');
            $(document).on('mouseenter.mainCardCont', '.cardCont .contRight', $.proxy(this._stopCardCont, this));


            $(document).off('mouseleave.mainCardCont');
            $(document).on('mouseleave.mainCardCont', '.cardCont .contRight', $.proxy(this._playCardCont, this));

            //main tab
            $(document).off('click.mainCardTab');
            $(document).on('click.mainCardTab', '.cardCont .mainTab02 > li >a', $.proxy(this._onClickMainTab, this));


            //nav
            $(document).off('click.cardNav');
            $(document).on('click.cardNav', '.cardCont .indiList > button', $.proxy(this._onClickNav, this));

            //재생/정지
            $(document).off('click.btnPlay');
            $(document).on('click.btnPlay', '.cardCont .indiWrap .btnStop', $.proxy(this._togglePlay, this));


            $(document).off('keyup.accessbillityMainCardTab');
            $(document).on('keyup.accessbillityMainCardTab', $.proxy(this._onkeyUpMoveMainCardTab, this));
        },
        _playCardCont: function () {
            //카드 내용 롤링
            if (this.cardRollTid === 0 &&
                this.isRoll
            ) {
                this.cardRollTid = setInterval($.proxy(this._changeCardCont, this), 3000);
            }
        },
        _stopCardCont: function () {
            if (this.cardRollTid !== 0) {
                clearInterval(this.cardRollTid);
                this.cardRollTid = 0;
            }
        },
        _changeCardCont: function (_curIdx) {
            if (_curIdx !== undefined) {
                this.curCardContIdx = _curIdx;
            } else {
                this.curCardContIdx++;
            }
            if (this.curCardContIdx >= this.cardContTot) {
                this.curCardContIdx = 0;
            }
            var $navBtn = $('.cardCont .mainCont .indiList > button');

            $('.cardCont .mainTab02 > li >a').removeAttr('aria-selected');
            $('.cardCont .mainTab02 > li >a').eq(this.curCardContIdx).attr('aria-selected', true);

            $navBtn.removeClass('on');
            $navBtn.removeAttr('aria-selected');

            $navBtn.eq(this.curCardContIdx).addClass('on');
            $navBtn.eq(this.curCardContIdx).attr('aria-selected', 'true');

        },
        _onClickMainTab: function (e) {
            e.preventDefault();
            var oSelf = this;
            var $curIdx = $(e.currentTarget).parent().index();

            this._stopCardCont();
            this._changeCardCont($curIdx);
            this._playCardCont();

        },
        _onClickNav: function (e) {
            var oSelf = this;
            var $curIdx = $(e.currentTarget).index();

            this._stopCardCont();
            this._changeCardCont($curIdx);
            this._playCardCont();

        },
        _togglePlay: function (e) {
            var $playBtn = $(e.currentTarget);

            if ($playBtn.hasClass('play')) {
                //재생
                this.isRoll = true;
                $playBtn.removeClass('play');
                $playBtn.text('정지');
                this._playCardCont();
            } else {
                //정지
                this.isRoll = false;
                $playBtn.addClass('play');
                $playBtn.text('재생');
                this._stopCardCont();
            }

        },
        _onkeyUpMoveMainCardTab: function (e) {
            var $focusEl = $(e.target);

            var $focusSlide = $('.cardCont .contRight').find('*').filter(function () {
                if ($(this).get(0) === $focusEl.get(0)) {
                    return $(this);
                }
            });

            var isStartSlide = !$('.cardCont .contRight .btnStop').hasClass('play');
            if ($focusSlide.length > 0) {
                // 재생 -> 정지 
                this._stopCardCont();
            } else if (isStartSlide) {
                //focus out - 정지 -> 기존 상태가 재생 일 경우 재시작
                this._playCardCont();
            }
        }
    };

    ns.domEvent.mainAni.changeTabCont.lifeCont = {
        init: function () {
            this.$lifeSlideCont = $('.lifeCont .lifeSwiper');
            this.$lifeSlide = this.$lifeSlideCont.find('.lifeList >li');
            this.$totSlide = this.$lifeSlide.length;
            this.slidePerView = 3;
            this.curIdx = 0;
            this.moveSlideCnt = parseInt(this.$totSlide / this.slidePerView);

            this.lifeRollTid = 0;
            this.isRoll = true;

            this.$nav = this.$lifeSlideCont.find('.indiList > button');
            this._bindEvent();

        },
        _bindEvent: function () {
            this._playLifeCont();
            $(document).off('click.lifeNav');
            $(document).on('click.lifeNav', '.lifeCont .indiList > button', $.proxy(this._onClickNav, this));

            $(document).off('click.btnPlayLife');
            $(document).on('click.btnPlayLife', '.lifeCont .indiWrap .btnStop', $.proxy(this._togglePlay, this));

            $(document).off('keyup.accessbillityMainLifeTab');
            $(document).on('keyup.accessbillityMainLifeTab', $.proxy(this._onkeyUpMoveMainLifeTab, this));

        },
        _onkeyUpMoveMainLifeTab: function (e) {
            var $focusEl = $(e.target);

            var $focusSlide = $('.lifeSwiper').find('*').filter(function () {
                if ($(this).get(0) === $focusEl.get(0)) {
                    return $(this);
                }
            });

            var isStartSlide = !$('.lifeSwiper .btnStop').hasClass('play');
            if ($focusSlide.length > 0) {
                // 재생 -> 정지 
                this._stopLifeCont();
            } else if (isStartSlide) {
                //focus out - 정지 -> 기존 상태가 재생 일 경우 재시작
                this._playLifeCont();
            }
        },
        _moveSlide: function (_idx) {
            if (_idx !== undefined) {
                this.curIdx = _idx;
            } else {
                this.curIdx++;
                if (this.curIdx > this.moveSlideCnt - 1) {
                    this.curIdx = 0;
                }
            }
            var startIdx = this.curIdx * this.slidePerView;
            var lastIdx = startIdx + this.slidePerView;
            this.$lifeSlide.removeAttr('style');
            this.$lifeSlide.hide();
            for (var i = startIdx; i < lastIdx; i++) {
                if (i === startIdx) {
                    this.$lifeSlide.eq(i).css('marginLeft', 0);
                }
                this.$lifeSlide.eq(i).show();
            }
            this._checkNav();
        },
        _playLifeCont: function () {
            if (this.lifeRollTid === 0 &&
                this.isRoll
            ) {
                this.lifeRollTid = setInterval($.proxy(this._moveSlide, this), 2000);
            }
        },
        _stopLifeCont: function () {
            if (this.lifeRollTid !== 0) {
                clearInterval(this.lifeRollTid);
                this.lifeRollTid = 0;
            }
        },
        _onClickNav: function (e) {
            var $curIdx = $(e.currentTarget).index();

            this._stopLifeCont();
            this._moveSlide($curIdx);
            this._playLifeCont();
        },
        _togglePlay: function (e) {
            var $playBtn = $(e.currentTarget);

            if ($playBtn.hasClass('play')) {
                //재생
                this.isRoll = true;
                $playBtn.removeClass('play');
                $playBtn.text('정지');
                this._playLifeCont();
            } else {
                //정지
                this.isRoll = false;
                $playBtn.addClass('play');
                $playBtn.text('재생');
                this._stopLifeCont();
            }

        },
        _checkNav: function () {
            this.$nav.removeAttr('aria-selected');
            this.$nav.removeClass('on');

            var $curNav = this.$nav.eq(this.curIdx);
            $curNav.addClass('on');
            $curNav.attr('aria-selected', 'true');
        }
    };

    ns.domEvent.comAni = {
        init: function () {
            this.$comSlide = $('.compSlider .slider-slide');
            this.$nav = $('.compSlider .indiList > button');
            this.slideLength = this.$comSlide.length;
            this.curIdx = 0;
            this.prevSlide = 0;
            this._timeId = 0;

            if ($('.compSlider').length === 0) {
                return;
            }
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            //body scroll 방지
            $('.compWrap').css('overflow', 'hidden');
            //슬라이드 크기 지정
            this._setSlideSz();

            //슬라이드 초기화
            this.$comSlide.hide();
            this.$comSlide.eq(0).show();
            this._checkNav();
        },
        _setSlideSz: function () {
            // $('html, body, #container, .mainWrap').css('overflow', 'hidden');
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            $('.compSlider').find('.slider-slide').width(winWidth).height(winHeight);
            $('.compSlider').height(winHeight);
            if (winWidth > 2048) {
                $('.compSlider').find('.slider-slide').css('background-size', '100%');
            } else {
                $('.compSlider').find('.slider-slide').css('background-size', '');
            }
        },
        _bindEvent: function () {
            this._startAutoPlay();

            $(document).off('click.newsOpen');
            $(document).on('click.newsOpen', '.newsOpen', $.proxy(this._onClickNewsBtn, this));


            $(document).off('click.moveNext');
            $(document).on('click.moveNext', '.compSlider .nextSlide', $.proxy(this._nextSlide, this));

            $(document).off('click.movePrev');
            $(document).on('click.movePrev', '.compSlider .prevSlide', $.proxy(this._prevSlide, this));

            $(document).off('click.nav.compSlider');
            $(document).on('click.nav.compSlider', '.compSlider .indiList > button', $.proxy(this._onClickNav, this));

            $(document).off('click.playBtnCompSlider');
            $(document).on('click.playBtnCompSlider', '.compSlider .indiWrap > .btnStop', $.proxy(this._onClickPlayBtn, this));

            $(window).on('resize', $.proxy(this._resizeSz, this));
        },
        _resizeSz: function () {
            var oSelf = this;
            var resizeTid = setTimeout(function () {
                clearTimeout(resizeTid);

                //화면 사이즈 재정의
                oSelf._setSlideSz();
            }, 0);
        },
        _onClickNewsBtn: function (e) {
            var $curBtn = $(e.currentTarget);
            if ($curBtn.attr('aria-expanded') === "true") {
                $curBtn.attr('aria-expanded', 'false');
                $('.news .closeList').show();
                // $('.btmBar').removeClass('on', 500, 'easeOutCubic');
                $('.btmBar').animate({
                    'height': 76 + 'px'
                }, 500);
            } else {
                $curBtn.attr('aria-expanded', 'true');
                $('.news .closeList').hide();
                // $('.btmBar').addClass('on', 500, 'easeOutCubic');
                $('.btmBar').animate({
                    'height': 348 + 'px'
                }, 500);
            }
        },
        _startAutoPlay: function () {
            var oSelf = this;
            if (this._timeId === 0) {
                this._timeId = setInterval(function () {
                    oSelf._nextSlide();
                }, 5000);
            }
        },
        _onClickPlayBtn: function (e) {
            var $playBtn = $(e.currentTarget);

            if ($playBtn.hasClass('play')) {
                //정지
                this._startAutoPlay();
                $playBtn.removeClass('play');
                $playBtn.text('정지');
            } else {
                //재생
                this._stopAutoPlay();
                $playBtn.addClass('play');
                $playBtn.text('재생');
            }
        },
        _stopAutoPlay: function () {
            var oSelf = this;
            if (this._timeId != 0) {
                clearInterval(this._timeId);
                this._timeId = 0;
            }
        },
        _nextSlide: function () {
            var oSelf = this;
            this.preIdx = this.curIdx;
            this.curIdx++;
            if (this.curIdx >= this.slideLength) {
                this.curIdx = 0;
            }

            this._moveSlide();

        },
        _prevSlide: function (_curIdx) {
            var oSelf = this;
            this.preIdx = this.curIdx;
            this.curIdx--;
            if (this.curIdx < 0) {
                this.curIdx = this.slideLength - 1;
            }

            this._moveSlide();
        },
        _moveSlide: function () {
            var oSelf = this;
            this._checkNav();

            this.$curSlide = this.$comSlide.eq(this.curIdx);
            this.$preSlide = this.$comSlide.eq(this.preIdx);

            this.$comSlide.css({
                'z-index': ''
            });

            this.$curSlide.css({
                'z-index': 1,
                'opacity': 0,
                'display': 'block'
            });

            this.$curSlide.stop().animate({
                'opacity': 1
            }, 500, 'easeOutCubic', function () {
                oSelf.$preSlide.hide();
            });
        },
        _checkNav: function () {
            this.$nav.removeAttr('aria-selected');
            this.$nav.removeClass('on');

            var $curNav = this.$nav.eq(this.curIdx);
            $curNav.addClass('on');
            $curNav.attr('aria-selected', 'true');
        },
        _onClickNav: function (e) {
            var curIdx = $(e.currentTarget).index();
            if (curIdx === this.curIdx) {
                return;
            }
            this.preIdx = this.curIdx;
            this.curIdx = curIdx;
            this._moveSlide();
        }
    };

    ns.domEvent.scrollComp = {
        init: function () {
            var oSelf = this;

            this._fixCompH();
            this._bindEvent();
        },
        _bindEvent: function () {
            // history 영역 고정
            $(window).off('scroll.setCompH');
            $(window).on('scroll.setCompH', $.proxy(this._fixCompH, this));

            //history 영역 탭 클릭
            $(document).off('click.tabH');
            $(document).on('click.tabH', '.history >ul >li a', $.proxy(this._onClickTabH, this));
        },
        _getContPosY: function () {
            var oSelf = this;
            var headerH = $('.header').height();
            var contMarT = 50;
            var paddTop;
            if ($('body').hasClass('fixed')) {
                paddTop = 0;
            } else {
                paddTop = 60;
            }
            var $contH = $('.history .cont');
            this.contHPosY = [];
            var posY,
                posTop;
            $('.history .cont').each(function () {
                posTop = $(this).offset().top || 0;
                posY = posTop - paddTop - headerH - contMarT;

                oSelf.contHPosY.push(posY);
            });
        },
        _fixCompH: function () {
            if ($('.history').length === 0) {
                return;
            }
            var compHTid,
                curScroll;
            var oSelf = this;
            var headerH = $('.header').outerHeight();
            var curTabIdx = 0;
            var $tabEl = $('.compWrap  .history .tab li');
            var $curTab;
            compHTid = setTimeout(function () {
                historyTop = $('.compWrap  .history').offset().top || 0;
                curScroll = $(window).scrollTop();

                // 탭고정
                if (curScroll + headerH > historyTop) {
                    $('.compWrap  .history .tab').addClass('fixed');

                    // check tab menu
                    oSelf._getContPosY();
                    $.each(oSelf.contHPosY, function (idx, val) {

                        if (curScroll < oSelf.contHPosY[idx]) {
                            return false;
                        }
                        curTabIdx = idx;
                    });


                    $curTab = $tabEl.eq(curTabIdx);

                } else {
                    $('.compWrap  .history .tab').removeClass('fixed');
                    $curTab = $tabEl.eq(0);
                }
                $curTab.addClass('on');
                $curTab.find('>a').attr('aria-selected', 'true');

                $curTab.closest('li').siblings().removeClass('on');
                $curTab.closest('li').siblings().find('a').attr('aria-selected', 'false');
            }, 0);
        },
        _onClickTabH: function (e) {
            e.preventDefault();
            var $curTab = $(e.currentTarget);
            var $curTabLi = $curTab.closest('li');
            var curTabIdx = $curTabLi.index();

            //this.contHPosY 값 update
            this._getContPosY();

            var scrollTop = this.contHPosY[curTabIdx];
            $curTab.attr('aria-selected', 'true');
            $curTabLi.addClass('on');

            $curTabLi.siblings().removeClass('on');
            $curTabLi.siblings().find('a').removeAttr('aria-selected');

            $(window).scrollTop(scrollTop);
        }
    };
    ns.domEvent.stmSelect = {
        init: function () {
            if ($('.stmSelect').length === 0) {
                return;
            }
            this.$stmWrap = $('.stmSelect');
            this.$selBtn = this.$stmWrap.find('.select');
            this.$dateBtn = this.$stmWrap.find('.dateArea li button');
            this.$lastDateBtn = this._getLastMonth();
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            this.$selBtn.attr('aria-expanded', 'false');
        },
        _bindEvent: function () {
            var oSelf = this;


            $(document).off('click.stmSelect');
            $(document).on('click.stmSelect', 'button.select', function (e) {
                e.preventDefault();
                oSelf._toggleCont(e);
            });

            this.$lastDateBtn.on('keydown', function (e) {
                oSelf._moveTabFocus(e);
            });

        },
        _toggleCont: function (e) {
            var target = $(e.currentTarget).closest('.stmSelect');

            if (target.hasClass('open')) {
                this._hideSelCont();
            } else {
                this._showSelCont();
            }
        },
        _showSelCont: function () {
            this.$selBtn.attr('aria-expanded', 'true');
            this.$stmWrap.addClass('open');
        },
        _hideSelCont: function () {
            this.$selBtn.attr('aria-expanded', 'false');
            this.$stmWrap.removeClass('open');
        },
        _getLastMonth: function () {
            var $dateBtn = this.$dateBtn.filter(function () {
                if ($(this).attr('disabled') === undefined) {
                    return $(this);
                }
            });
            return $dateBtn.last();
        },
        _moveTabFocus: function (e) {
            if (e.shiftKey === false && e.keyCode === 9) {
                e.preventDefault();
                this.$selBtn.focus();
                this._hideSelCont();
            }
        }
    };
    ns.domEvent.toggleTabMore = {
        init: function () {
            this.$targetWrap = $('.tabMore');

            if (this.$targetWrap.length === 0) {
                return;
            }

            this.$moreBtn = this.$targetWrap.find('button.more');
            this.$closeBtn = this.$targetWrap.find('button.close');

            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            this.$moreBtn.attr('aria-expanded', 'false');
            this.$closeBtn.attr('aria-expanded', 'false');
        },
        _bindEvent: function () {
            var oSelf = this;
            $(document).off('click.tabMore');
            $(document).on('click.tabMore', '.tabMore button', function (e) {
                oSelf._toggleTabList(e);
            });
        },
        _toggleTabList: function (e) {
            var $target = $(e.currentTarget),
                $toggleCont = $target.closest('.tabMore').find('.tabList');

            if ($toggleCont.css('display') === 'block') {
                this._hideTabMore($toggleCont);
            } else {
                this._showTabMore($toggleCont);
            }

        },
        _hideTabMore: function ($toggleCont) {
            this.$moreBtn.attr('aria-expanded', 'false');
            this.$closeBtn.attr('aria-expanded', 'false');
            $toggleCont.hide();
        },
        _showTabMore: function ($toggleCont) {
            this.$moreBtn.attr('aria-expanded', 'true');
            this.$closeBtn.attr('aria-expanded', 'true');
            $toggleCont.show();
        }
    };

    ns.domEvent.togPtMenu = {
        init: function () {
            this._attachEventHandlers();
        },
        _attachEventHandlers: function () {
            $(document).off('click.ptMenu');
            $(document).on('click.ptMenu', '.otherPoint .btnView', $.proxy(this._onClicktogPtMenu, this));
        },
        _onClicktogPtMenu: function (e) {
            var $btnViewEl = $(e.currentTarget);
            var $togCont = $btnViewEl.closest('.otherPoint').find('.inner');

            $btnViewEl.toggleClass('on');
            $togCont.slideToggle(400, 'easeOutCubic', function () {
                if ($(this).is(':visible') === false) {
                    $(this).removeAttr('style');
                }
            });
        }
    };
    ns.domEvent.aniPromotion = {
        init: function () {
            if ($('.promStep').length === 0) {
                return;
            }
            this.$targetWrap = $('.slider-container.promStep');
            this.mWrapHeight = this.$targetWrap.height();
            this._setElment();
            this._attachEventHandlers();
        },
        _setElment: function () {
            this._setDupSlide();
            this._motionStep1(1);
        },
        _attachEventHandlers: function () {
            $(document).on('click', '.promStep .prevSlide, .promStep .nextSlide, .indiList > button', $.proxy(this._onClickBtnSlide, this));
        },
        _setDupSlide: function () {
            var oSelf = this;
            var $fistMotionWrap = this.$targetWrap.find('.slider-slide').eq(5).find('.motion.motion01');
            var $lastMotionWrap = this.$targetWrap.find('.slider-slide').eq(0).find('.motion.motion04');

            $fistMotionWrap.hide();
            $lastMotionWrap.hide();
        },
        _onClickBtnSlide: function (e) {
            var slideIdx = this.$targetWrap.data('plugin_slideBannerJs').curIdx;
            if (slideIdx === 0) {
                this._motionStep1();
            } else if (slideIdx === 1) {
                this._motionStep2();
            } else if (slideIdx === 2) {
                this._motionStep3();
            } else if (slideIdx === 3) {
                this._motionStep4();
            }

        },
        _motionStep1: function () {
            var oSelf = this;
            var $motionWrap = this.$targetWrap.find('.slider-slide').eq(1).find('.motion.motion01');

            $motionWrap.find('.img01').removeClass('buttonUp');
            $motionWrap.find('.img01').removeAttr('style');
            $motionWrap.find('.img01 .point').css({
                top: 0,
                left: 0
            });
            $motionWrap.find('.bg02').removeAttr('style');

            //위치 설정
            $motionWrap.children().each(function (idx) {
                motionBtm = oSelf.mWrapHeight - parseInt($(this).css('bottom'));
                $(this).css('bottom', -motionBtm);
            });

            //모션 시작
            $motionWrap.show();
            $motionWrap.find('.bg01').stop().delay(400).animate({
                'bottom': 0
            }, 800, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });

            $motionWrap.find('.img01').stop().delay(400).animate({
                'bottom': 27
            }, 800, 'easeOutCubic', function () {
                $(this).addClass('buttonUp');
                $(this).removeAttr('style');
                $(this).find('.point').stop().animate({
                    top: -13,
                    left: -13
                }, function () {
                    $(this).removeAttr('style');
                });

            });

            $motionWrap.find('.bg02').stop().delay(500).animate({
                'bottom': 0
            }, 500, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });

        },
        _motionStep2: function () {
            var $motionWrap = this.$targetWrap.find('.slider-slide').eq(2).find('.motion.motion02');
            //초기화
            $motionWrap.find('.bg01').css('bottom', -this.mWrapHeight);
            $motionWrap.find('.bg02').hide();
            $motionWrap.find('.img01').css({
                'opacity': 0,
                'left': 216
            });

            //모션 시작
            $motionWrap.show();
            $motionWrap.find('.bg01').stop().delay(400).animate({
                'bottom': 0
            }, 800, 'easeOutCubic', function () {
                $(this).removeAttr('style');
                $motionWrap.find('.img01').fadeIn();
                $motionWrap.find('.bg02').delay(400).fadeIn(function () {
                    $(this).removeAttr('style');
                });
                $motionWrap.find('.img01').stop().animate({
                    'opacity': 1,
                    left: 236
                }, function () {
                    $(this).removeAttr('style');
                });
            });

        },
        _motionStep3: function () {
            var $motionWrap = this.$targetWrap.find('.slider-slide').eq(3).find('.motion.motion03');
            //초기화
            $motionWrap.find('.bg01').css('bottom', -this.mWrapHeight);
            $motionWrap.find('.bg02').css('bottom', -this.mWrapHeight);
            $motionWrap.find('.img01').css('bottom', -this.mWrapHeight);
            $motionWrap.find('.img01 .point').hide();

            //모션 시작
            $motionWrap.show();
            $motionWrap.find('.bg01').stop().delay(400).animate({
                'bottom': 0
            }, 800, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });

            //그래프
            $motionWrap.find('.bg02').stop().delay(500).animate({
                'bottom': 0
            }, 800, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });

            $motionWrap.find('.img01').stop().delay(1200).animate({
                'bottom': 0
            }, 600, 'easeOutCubic', function () {
                $(this).removeAttr('style');
                $(this).find('.point').fadeIn();
                $(this).find('.point').effect('bounce', {
                    times: 2
                }, 400, function () {
                    $(this).removeAttr('style');
                });

            });
        },
        _motionStep4: function () {
            var oSelf = this;
            var $motionWrap = this.$targetWrap.find('.slider-slide').eq(4).find('.motion.motion04');
            //초기화
            $motionWrap.find('.bg01').css('bottom', -this.mWrapHeight);
            $motionWrap.find('.bg02').css('bottom', -this.mWrapHeight);
            $motionWrap.find('.img01').removeAttr('style');
            $motionWrap.find('.img01').hide();

            //모션 시작
            $motionWrap.show();
            $motionWrap.find('.bg02').stop().delay(400).animate({
                'bottom': 0
            }, 800, 'easeOutCubic', function () {
                $(this).removeAttr('style');
                $motionWrap.find('.img01').fadeIn(function () {
                    $(this).css('display', '');
                });
                oSelf._reloadGif($motionWrap.find('.img01'));

            });

            $motionWrap.find('.bg01').stop().delay(500).animate({
                'bottom': 0
            }, 800, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });

        },
        _reloadGif: function ($target) {
            if ($target.length <= 0) {
                return;
            }
            $target.css('background-image', '');
            this.targetBgSrc = $target.css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");


            this.targetBgSrcIndex = this.targetBgSrc.indexOf('?');
            if (this.targetBgSrcIndex != -1) {
                this.targetBgSrc = this.targetBgSrc.substring(0, this.targetBgSrcIndex);
            }
            $target.css('background-image', "url(" + this.targetBgSrc + '?a=' + Math.random() + ")");
        }
    };

    ns.domEvent.selCard = {
        init: function () {
            this._attachEventHandlers();
        },
        _attachEventHandlers: function () {

            $(document).off('click.closeBtnCat');
            $(document).on('click.closeBtnCat', '.selInp .btnClose', $.proxy(this._onClickCloseCat, this));

            $(document).off('click.closeBtnLayer');
            $(document).on('click.closeBtnLayer', '.checkLayer .btnClose', $.proxy(this._onClickCloseLay, this));

            $(document).off('click.checkCat');
            $(document).on('click.checkCat', '.frmList.frmCategory .frmCheck > input, .frmList.frmDetail .frmCheck > input', $.proxy(this._onClickCheckCat, this));

            $(document).off('click.selInp');
            $(document).on('click.selInp', '.frmList.frmCategory .selInp, .frmList.frmDetail .selInp', $.proxy(this._onClickSelInp, this));

            //값 입력 확인 버튼
            $(document).off('click.inpArea');
            $(document).on('click.inpArea', '.checkLayer .btnM', $.proxy(this._onClickInpBtn, this));

        },
        _onClickCloseCat: function (e) {
            $(e.target).closest('li').find('.frmCheck .checked').hide();
            $(e.target).closest('li').find('.selInp').hide();
        },
        _onClickCloseLay: function (e) {
            $(e.target).closest('li').find('.frmCheck .checked').hide();

            //선택된 상태에서 값이 입력안 되어 있을 경우
            if ($(e.target).closest('.checkLayer').find('input').val() === '') {
                $(e.target).closest('.frmCheck').siblings('.selInp').hide();
            }
        },
        _onClickCheckCat: function (e) {
            //이전 항목 닫기
            $('.checked:visible').hide();

            var $frmCheck = $(e.target).closest('li').find('.frmCheck');
            $frmCheck.find('.checked').toggle();
        },
        _onClickSelInp: function (e) {
            //닫기 버튼 클릭 시 return
            if ($(e.target).hasClass('btnClose')) {
                return;
            }
            if ($(e.target).closest('li').find('.checked').is(':visible')) {
                $(e.target).closest('li').find('.frmCheck .checkLayer .btnClose').trigger('click');
            } else {
                $(e.target).closest('li').find('.frmCheck > input').trigger('click');
            }
        },
        _onClickInpBtn: function (e) {
            var $carWrap = $(e.target).closest('li');
            var $selInt = $(e.target).closest('li').find('.selInp');
            var catVal = $carWrap.find('.frmCheck').find('.category').text();
            var inpVal = $(e.target).siblings('input').val();

            //확인 버튼 눌렀을 때 입력 되었을 경우
            if ($selInt.length > 0 && inpVal !== '') {
                $selInt.show();
            }
            $(e.target).closest('.checked').hide();

        }
    };

    ns.domEvent.scrollSelCard = {
        init: function () {
            if ($('.followBar').length === 0) {
                return;
            }
            this.$followBar = $('.followBar');
            this._attachEventHandlers();
        },
        _attachEventHandlers: function () {
            $(document).on('scroll', $.proxy(this._scrollFBar, this));
        },
        _scrollFBar: function () {
            var viewHeihgt = $(window).height() + $(window).scrollTop();
            var footPosY = $('.footer').offset().top;

            var followBarBtm = viewHeihgt - footPosY;
            if (followBarBtm > 0) {
                this.$followBar.css('bottom', followBarBtm);
            } else {
                this.$followBar.css('bottom', '');
            }
        }
    };

    ns.domEvent.planGage = {
        init: function () {
            this.$planGage = $('.planGage');

            if (this.$planGage.length === 0) {
                return;
            }
            this.$reportList = this.$planGage.find('.infoDataS');
            this.$gageBar = $('.gage .bar');
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            var oSelf = this,
                curWidth = '';

            this.$reportList.show();
            this.$gageBar.each(function () {
                curWidth = parseInt($(this).css('width'));
                $(this).data('width', curWidth);
            });

            this.$planGage.find('.frmButton input').eq(0).attr('aria-selected', 'true');
            this.$reportList.eq(1).hide();
            this.$gageBar.css('width', '0');
            this._showAniGage(0);
        },
        _showAniGage: function (curIdx) {
            this.$reportList.eq(curIdx).find('.gage .bar').css('width', 0);
            this.$reportList.eq(curIdx).find('.gage .bar').each(function () {
                $(this).stop().delay(200).animate({
                    'width': $(this).data('width')
                }, '300', 'linear');
            });
        },
        _bindEvent: function () {
            var oSelf = this,
                curIdx;

            this.$planGage.on('click', '.frmButton input', function (e) {
                curIdx = $(e.currentTarget).closest('li').index();
                oSelf._toggleCont(e);
                oSelf._showAniGage(curIdx);
            });
        },
        _toggleCont: function (e) {
            var target = $(e.currentTarget),
                curIdx = target.closest('li').index();

            target.attr('aria-selected', 'true');
            target.closest('li').siblings().find('input').attr('aria-selected', '');

            this.$reportList.eq(curIdx).show();
            this.$reportList.not(':eq(' + curIdx + ')').hide();
        }
    };


    // chart Width : 0 ~ $('.barChart .bar').width() 애니메이션 작동
    // PC.domEvent.barChart.init();
    ns.domEvent.barChart = {
        init: function () {
            // 두번 호출 할 경우 방지 
            if (this.isPlay !== undefined && this.isPlay === true) {
                return;
            }
            this.isPlay = false;
            this.$barChart = $('.barChart:visible');
            this.$bar = $('.barChart > li >.bar');
            if (this.$barChart.length === 0) {
                return;
            }

            this._bindEvent();
        },
        _bindEvent: function () {
            var oSelf = this;

            this.isPlay = true;
            var barWrapW = $('.barChart > li').width();
            this.$bar.each(function () {
                if ($(this).data('width') === undefined) {
                    var width = Math.round((parseInt($(this).css('width')) / barWrapW) * 100);
                    $(this).data('width', width);
                }
                dataW = $(this).data('width');
                $(this).css('width', 0);
                $(this).stop().animate({
                    'width': dataW + '%'
                }, 400, 'easeOutCubic', function () {
                    oSelf.isPlay = false;
                });
            });

        }
    };
    ns.domEvent.dataGage = {
        init: function () {
            if ($('.dataState .gage').length === 0) {
                return;
            }
            this.isDraw = false;
            this.$dataGage = $('.dataState .gage');
            this._setElment();
            this._bindEvent();
            this._startDrawGage();
        },
        _setElment: function () {
            var oSelf = this,
                curWidth = '';
            this.$dataGage.each(function () {
                if ($(this).data('height') === undefined) {
                    curWidth = parseInt($(this).css('height'));
                    $(this).data('height', curWidth);
                }
            });
            this.$dataGage.css('height', '0');

        },
        _bindEvent: function () {
            var oSelf = this;
            //해당 영력이 보일 경우 모션 실행
            $(window).off('scroll.drawGage');
            $(window).on('scroll.drawGage', function () {
                oSelf._startDrawGage();
            });
        },
        _startDrawGage: function () {
            var curScroll = $(window).scrollTop(),
                docHeight = $(window).height(),
                viewHeight = docHeight + curScroll,
                targetTop = $('.gageArea:eq(0)').offset().top;
            if (this.$dataGage.is(':visible') && (viewHeight > targetTop) && this.isDraw === false) {
                this._showAniGage();
            }

        },
        _showAniGage: function () {
            this.isDraw = true;
            this.$dataGage.each(function () {
                $(this).stop().delay(200).animate({
                    'height': $(this).data('height')
                }, '300', 'linear');
            });

        }
    };

    ns.domEvent.totSearchBox = {
        init: function () {
            this.$autoWord = $('.totalSearchBox .autoWordBox');
            this.$dimmed = $('.dimmed');
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            if (this.$autoWord.length > 0) {
                ns.gnbAniEvent._setScrollWrap(this.$autoWord.find('.left'));
            }
        },
        _bindEvent: function () {
            $(document).on('keydown keyup', '.searchArea input', $.proxy(this._searchInpWord, this));
            $(document).on('click', '.totalBox .del', $.proxy(this._hideSearchBox, this));
        },
        _searchInpWord: function (e) {
            var inpWord = $(e.currentTarget).val();
            if (inpWord.length === 0) {
                this._hideSearchBox();
            } else {
                this._showSearchBox();
            }
        },
        _hideSearchBox: function () {
            this.$autoWord.slideUp(function () {
                $(this).removeAttr('style');
            });
        },
        _showSearchBox: function () {
            if (this.$autoWord.is(':visible')) {
                return;
            }
            this.$autoWord.slideDown();
        },
        resizeAutoWordBox: function () {
            var scrollData = $('.wordWrap.autoWord .left').data('jsp');
            if (scrollData) {
                scrollData.reinitialise();
            }

        }

    };


    ns.domEvent.socialMatch = {
        init: function () {
            this._drawSocialChart();
            this._bindEvent();
        },
        _drawSocialChart: function () {
            //100%일 경우 end 태그 붙임
            $('.barGroup').each(function () {
                var subWidth = $(this).width();
                if (subWidth === ($(this).find('.graphBar1').width() + $(this).find('.graphBar2').width())) {
                    $(this).find('.graphBar2').addClass('end');
                }
            });
            var ratioW;
            if ($('.barGroup').closest('.mGraph').length) {
                ratioW = 0.18;
            } else {
                ratioW = 0.14;
            }
            var wChart = $('.barGroup').find('>span').css('width');
            var wchartMin = parseInt($('.barGroup').width() * ratioW);
            $('.barGroup').data('isEndAni', 'false');
            $('.barGroup').find('>span').each(function () {
                wChart = $(this).width();

                //최소 값 min-width 14%
                if (wChart < wchartMin) {
                    wChart = wchartMin;
                }
                $(this).data('width', wChart);

                $(this).css('width', 0);
            });


            this._showChart();
        },
        _bindEvent: function () {
            $(document).on('click', '.ingCardW .btnGroup .btnL', $.proxy(this._toggleView, this));

            $(window).on('scroll', $.proxy(this._showChart, this));
        },
        _showChart: function () {
            var oSelf = this;
            var winheight = $(window).height();
            var scrollSize = $(window).scrollTop();
            $('.barGroup').each(function () {
                if ($(this).data('isEndAni') === 'false' &&
                    $(this).offset().top < winheight + scrollSize) {
                    oSelf._startChart($(this));
                }
            });

        },
        _startChart: function ($target) {
            var wSize;
            $target.data('isEndAni', 'true');
            $target.find('>span').each(function () {
                wSize = $(this).data('width');
                $(this).stop().delay(200).animate({
                    'width': wSize
                }, 400, 'easeOutCubic');
            });
        },
        _toggleView: function (e) {
            var $target = $(e.currentTarget);
            if ($target.hasClass('action')) {
                return;
            }
            $target.toggleClass('active');
            if ($target.hasClass('active')) {
                this._showSocialView($target);
            } else {
                this._hideSocialView($target);
            }
        },
        _showSocialView: function ($target) {
            var $socialBox = $target.closest('.ingCardW').find('.viewBox');
            var oSelf = this;
            $socialBox.slideDown(300, 'easeOutCubic');

            //기존에 열려 있는 팝업 닫기
            var preVisibleBox = $target.closest('.ingCardW').siblings('.ingCardW').find('.viewBox:visible');
            var prevTarget;
            if (preVisibleBox.length > 0) {
                //이전 컨텐츠 열려 있을 경우 스크롤 지정
                if ($target.closest('.ingCardW').prev('.ingCardW').length > 0) {
                    var scrollSz = $target.closest('.ingCardW').offset().top;
                    var prevContHeight = $target.closest('.ingCardW').prev('.ingCardW').find('.viewBox').outerHeight();
                    $(window).scrollTop(scrollSz - prevContHeight);
                }


                preVisibleBox.each(function () {
                    prevTarget = $(this).closest('.ingCardW').find('.btnL').eq(1);
                    oSelf._hideSocialView(prevTarget);
                });
            }
        },
        _hideSocialView: function ($target) {
            var $socialBox = $target.closest('.ingCardW').find('.viewBox');
            $target.text('자세히보기');
            $socialBox.slideUp(300, 'easeOutCubic');
        }
    };
    ns.itemSum = ns.itemSum || {};
    ns.itemSum.scrollSumArea = {
        init: function () {
            if ($('.useCardList').length === 0) {
                return;
            }
            // this.$itemSum = $('#itemSum');
            this.$useCardList = $('.useCardList:visible');
            this.$itemInp = this.$useCardList.find('input:checkbox');
            this.$sumArea = $('.sumArea');
            this.sumAreaHeight = this.$sumArea.outerHeight();
            this.btnBtmHeight = $('.btnStep').length === 0 ? 0 : $('.btnStep').outerHeight();
            this.pointSumArea = this.$sumArea.offset().top + this.sumAreaHeight;
            this._attachEventHandlers();
        },
        _attachEventHandlers: function () {
            var oSelf = this;
            $('.useCardList input:checkbox').on('change', function (e) {
                var tiemId = setTimeout(function () {
                    oSelf._setAniSumArea(e);
                    clearTimeout(tiemId);
                }, 200);
            });

            $('.toggle .rcon .icoMore.ctrl').on('click', function () {
                var tiemId = setTimeout(function () {
                    oSelf._setSumArea();
                    clearTimeout(tiemId);
                }, 200);
            });


            $(window).on('scroll', $.proxy(this._setSumArea, this));
            $(window).on('resize', $.proxy(this._setSumArea, this));

            $('.sumArea').on('click', '.icoMore.ctrl', function (e) {
                e.preventDefault();
                oSelf._setPadItemWrap(e);
            });

        },
        _setPadItemWrap: function (e) {
            var $toggleCont = $(e.currentTarget).closest('.sumArea').find('.toggleCont');
            if ($(e.currentTarget).closest('.sumArea').hasClass('sumFixed') && !$toggleCont.is(':visible')) {
                this.$useCardList.css('paddingBottom', $toggleCont.outerHeight());
            } else {
                this.$useCardList.css('paddingBottom', '');
            }

        },
        _getPointTotalBtm: function () {
            return parseInt(this.$useCardList.offset().top) + this.$useCardList.height() + this.sumAreaHeight;
        },
        _setSumArea: function () {
            this.showContHeight = window.innerHeight + $(window).scrollTop() - this.btnBtmHeight;
            this.paddBtm = parseInt(this.$useCardList.css('paddingBottom'));
            this.pointSumArea = this._getPointTotalBtm();
            if (this.$itemInp.filter(':checked').length > 0 && (this.showContHeight < this.pointSumArea + this.paddBtm)) {
                this._fixSumArea();
            } else {
                this._resetSumArea();
            }
        },
        _fixSumArea: function () {
            if (this.$sumArea.hasClass('sumFixed')) {
                return;
            }
            this.$sumArea.addClass('sumFixed');
            this.$sumArea.after('<div fix-totalBtm="66px" style="height:66px" />');
            this.$sumArea.find('a').attr('aria-expanded', 'false');
            this.$sumArea.removeClass('toggleON');
        },
        _resetSumArea: function () {
            if (!this.$sumArea.hasClass('sumFixed')) {
                return;
            }
            this.$sumArea.removeClass('sumFixed');
            this.$useCardList.css('paddingBottom', '');
            $('[fix-totalbtm]').remove();
        },
        _setAniSumArea: function (e) {
            this.showContHeight = $(window).height() + $(window).scrollTop() - this.btnBtmHeight;
            this.paddBtm = parseInt(this.$useCardList.css('paddingBottom'));
            this.pointSumArea = this._getPointTotalBtm();


            if ((this.$itemInp.filter(':checked').length > 0) && (this.showContHeight < this.pointSumArea + this.paddBtm)) {
                this._fixAniSumArea();
            } else {
                this._resetAniSumArea();
            }
        },
        _fixAniSumArea: function () {
            if (this.$sumArea.hasClass('sumFixed')) {
                return;
            }

            var oSelf = this;
            this.pointSumArea = this._getPointTotalBtm();
            this.$sumArea.addClass('sumFixed');
            this.$sumArea.after('<div fix-totalBtm="66px" style="height:66px" />');
            this.$sumArea.css('bottom', -this.$sumArea.outerHeight());

            this.$sumArea.stop().animate({
                'bottom': oSelf.btnBtmHeight
            }, 300, 'easeOutCubic', function () {
                $(this).removeAttr('style');
            });
        },
        _resetAniSumArea: function () {
            if (!this.$sumArea.hasClass('sumFixed')) {
                return;
            }
            var oSelf = this;

            this.$sumArea.stop().animate({
                'bottom': -this.$sumArea.outerHeight()
            }, 300, 'easeOutCubic', function () {
                oSelf.$sumArea.removeClass('sumFixed');
                $('[fix-totalbtm]').remove();
                $(this).removeAttr('style');
            });
        }
    };

    /**
     * 포인트 전환 신청
     * @type {Object}
     */
    ns.transPoint = {
        init: function (options) {
            this.curPoint = options.curPoint;
            this.minPoint = options.minPoint;
            this.rate = options.rate;
            if (options.unitPoint === undefined) {
                this.unitPoint = options.minPoint;
            } else {
                this.unitPoint = options.unitPoint;
            }
            if (this.curPoint === undefined || this.minPoint === undefined || this.rate === undefined) {
                return;
            }

            this.$applyPt = $('.beforePoint');
            this.$switchPointWrap = $('.pointNum .descNum');
            this.$switchPoint = this.$switchPointWrap.find('strong');
            this.maxGubunPt = 0;
            this.curGubunPt = 0;
            this.$btnPoint = $('.variableBar button');
            this.$gauge = $('.gauge');
            this.$inpPoint = $('.apply_inpPoint');
            this._setElment();
            this._bindEvent();
        },
        _setElment: function () {
            //최대 포인트 지정
            this.maxGubunPt = parseInt(this.curPoint / this.unitPoint);
            this.$inpPoint.val(this.maxGubunPt * this.minPoint);
            this._setPoint(this.maxGubunPt);
            this._setBtn(this.maxGubunPt);
        },
        _bindEvent: function () {
            var oSelf = this;
            this.$inpPoint.off('blur');
            this.$inpPoint.on('blur', $.proxy(this._setNearVal, this));


            this.curGubunPt = this.maxGubunPt;
            //증가/ 감소 버튼 클릭
            this.$btnPoint.off('click.btnPt');
            this.$btnPoint.on('click.btnPt', $.proxy(this._onClickBtnPt, this));
        },
        _onClickBtnPt: function (e) {
            var $curBtn = $(e.currentTarget);
            var curPt;

            if ($curBtn.is(':disabled')) {
                return;
            }

            if ($curBtn.hasClass('btnDec')) {
                //감소
                this.curGubunPt--;
            } else {
                //증가
                this.curGubunPt++;
            }

            curPt = this.curGubunPt * this.unitPoint;

            if (curPt < this.minPoint) {
                if ($curBtn.hasClass('btnDec')) {
                    //감소
                    this.curGubunPt = 0;
                    curPt = 0;
                } else {
                    //증가
                    this.curGubunPt = (this.minPoint / this.unitPoint);
                    curPt = this.minPoint;
                }
            }


            this.$inpPoint.val(curPt);
            this._setNearVal();

        },
        _setNearVal: function () {
            var inpVal = this.$inpPoint.val();
            this.inpVal = this._unComma(inpVal);

            if (this.inpVal > this.curPoint) {
                this.curGubunPt = this.maxGubunPt;
            } else if (this.inpVal < this.minPoint) {
                this.curGubunPt = 0;
            } else {
                this.curGubunPt = parseInt(this.inpVal / this.unitPoint);
            }
            this._setBtn(this.curGubunPt);
            this._setPoint(this.curGubunPt);
            this._setGauge(this.curGubunPt);
        },
        _setBtn: function (gubun) {
            if (gubun <= 0) {
                this.$btnPoint.eq(0).attr('disabled', true);
            } else {
                this.$btnPoint.eq(0).attr('disabled', false);
            }
            if (gubun >= this.maxGubunPt) {
                this.$btnPoint.eq(1).attr('disabled', true);
            } else {
                this.$btnPoint.eq(1).attr('disabled', false);
            }
        },
        _setGauge: function (gubun) {
            var gauge = (gubun / this.maxGubunPt) * 100;
            this.$gauge.css('width', gauge + '%');
        },
        _setPoint: function (gubun) {

            this.maxApplyPt = (gubun * this.unitPoint);
            this.$applyPt.text(this._setComma(this.maxApplyPt));

            //전환 포인트
            this.applyRate = this.rate.split(':')[0];
            this.switchRate = this.rate.split(':')[1];
            this.switchPt = parseInt((this.maxApplyPt * this.switchRate) / this.applyRate);
            //전환 포인트 그리기
            this.$switchPoint.text(this._setComma(this.switchPt));
            this._createSwitchPt();

            // input val set
            this.$inpPoint.val(this.maxApplyPt);
        },
        _setComma: function (str) {
            str = String(str);
            return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        _unComma: function (str) {
            str = String(str);
            return Number(str.replace(/[^\d]+/g, ''));
        },
        _createSwitchPt: function () {
            //초기화
            this.$switchPointWrap.find('span').remove();

            var pointTxt = this.$switchPoint.text().split('');

            for (var i in pointTxt) {
                if (pointTxt[i] === ',') {
                    pointTxt[i] = 'Com';
                }
                this.$switchPointWrap.append('<span class="num num' + pointTxt[i] + '"></span>');
            }
        }
    };

    ns.loginTimeBar = {
        init: function (time, callback) {
            this.fnCallback = callback;
            this.setTimeId = Number(time);
            this._createLayout();
            this._startCount(Number(time));

        },
        _createLayout: function () {
            var oSelf = this;
            if ($('.loginTime:visible').length === 0) {
                $('body').prepend('<div class="loginTime" />');
                $('.loginTime').append('<span class="time"><span class="count">59초</span> 후 로그아웃 됩니다.</span><span class="bar"/><button type="button" class="extend">로그인 연장</button>');
            }

            setTimeout(function () {
                $('.loginTime').focus();
            }, 1000);
            this.$timeBar = $('.loginTime .bar span');
        },
        _startCount: function (time) {
            var oSelf = this;
            if (this.timeId) {
                clearInterval(this.timeId);
            }
            this.setTime = Number(time);
            this.secWidth = this.$timeBar.width() / Number(time);

            this._checkTime();
            this.timeId = setInterval($.proxy(oSelf._markTime, this), 1000);
        },
        _markTime: function () {
            var oSelf = this;
            this.setTime--;

            if (this.setTime < 0) {
                clearInterval(this.timeId);
                if (this.fnCallback) {
                    setTimeout(function () {
                        oSelf.fnCallback();
                    }, 300);
                }
                oSelf.setTime = 0;
            }

            this.$timeBar.css('width', this.secWidth * this.setTime);
            $('.loginTime .time .count').text(this.setTime + '초');

        },
        _checkTime: function () {
            if (this.setTime < 0) {
                this.setTime = 0;
            }
            this.$timeBar.css('width', this.secWidth * this.setTime);
            $('.loginTime .time .count').text(this.setTime + '초');
        }
    };

    ns.domEvent.scrollUseInfo = {
        init: function () {
            if ($('.newUseInfo').length === 0) {
                return;
            }
            this._fixUseInfo();
            this._bindEvent();
            this._resetTxt();
            this._onCardBtnUseInfo();
        },
        _bindEvent: function () {
            var oSelf = this;
            // 영역 고정
            $(window).off('scroll.setCompH');
            $(window).on('scroll.setCompH', $.proxy(this._fixUseInfo, this));

            // 영역 탭 클릭
            $(document).off('click.UseInfotabC');
            $(document).on('click.UseInfotabC', '.newUseInfo article > ul:first-of-type li input', $.proxy(this._onClickUseInfo, this));

            // 고정 탭 클릭
            $(document).off('click.UseInfoFixC');
            $(document).on('click.UseInfoFixC', '.newUseInfo .fixedSelect', $.proxy(this._onFixClickUseInfo, this));

            // 고정 버튼 클릭
            $(document).off('click._onCardConfirmC');
            $(document).on('click._onCardConfirmC', '.newUseInfo .fixedBtn', $.proxy(this._onCardConfirm, this));
            // 카드 리스트 클릭
            $(document).off('click.onCardBtnUseInfoC');
            $(document).on('click.onCardBtnUseInfoC', '.useChkCard input', $.proxy(this._onCardBtnUseInfo, this));

        },
        _fixUseInfo: function () {
            var compHTid,
                curScroll,
                oSelf = this,
                $contEl = $('.newUseWrap').next('.titArea').find('.titDep2'),
                headerOH = $('.header').outerHeight(),
                curTabIdx = 0,
                $tabEl = $('.newUseInfo ul li'),
                $curTab = $tabEl,
                $cardLi = $('.chooseItem li:visible'),
                newUseInfoTop = $contEl.offset().top - 74 || 0;
            curScroll = $(window).scrollTop();

            // 탭고정
            compHTid = setTimeout(function () {
                curScroll = $(window).scrollTop();

                // 탭고정
                if (curScroll + headerOH > newUseInfoTop) {
                    $('.newUseInfo > div').addClass('newUseFloting');

                    //카드스크롤 박스 초기화
                    var tot = 0;
                    for (i = 0; i <= 2; i++) {
                        tot = tot + $('.chooseItem li:visible').eq(i).outerHeight();
                    }
                    $('.useChkCard .jspContainer, .useChkCard > div:first-child').height($('.chooseAll').outerHeight() + tot + 20);

                    $(function () {
                        PC.domEvent.scrollUseInfo._resetTxt();
                        PC.domEvent.scrollUseInfo._onCardBtnUseInfo();
                    })
                } else {
                    $('.newUseInfo > div').removeClass('newUseFloting');
                    $('.chooseItem').show();
                    $('.useChkCard .jspContainer, .useChkCard > div:first-child').height(344);
                }
                $('.newUseInfo .allCheckBox').jScrollPane({
                    showArrows: true,
                    verticalDragMinHeight: 30,
                    mouseWheelSpeed: 40
                });
                $curTab.parents('article').find('[aria-selected="true"]').closest('li').addClass('on');
                $curTab.parents('article').find('li').find('label').not('[aria-selected="true"]').attr('aria-selected', 'false');
            }, 0)
        },
        _onClickUseInfo: function (e) {
            var oSelf = this,
                $curTab = $(e.currentTarget),
                $curTabLi = $curTab.closest('li');

            $curTab.parents('article').find('input').prop('checked', false);
            $curTab.prop('checked', true);

            $curTabLi.addClass('on');
            $curTabLi.siblings().removeClass('on');
            $curTabLi.siblings().find('label').removeAttr('aria-selected');
            $curTabLi.parents('article').find('label').not('[aria-selected="true"]').attr('aria-selected', 'false');
            $curTabLi.parents('article').removeClass('on');

            // $('.useChkCard .jspContainer, .useChkCard > div:first-child').height($('.newUseInfo > div').height() - 58);
            $('.newUseInfo .allCheckBox').jScrollPane({
                showArrows: true,
                verticalDragMinHeight: 30,
                mouseWheelSpeed: 40
            });
            $(function () {
                PC.domEvent.scrollUseInfo._resetTxt();
                PC.domEvent.scrollUseInfo._onCardBtnUseInfo();
            })
        },
        _resetTxt: function () {
            $('.newUseInfo article:eq(0) .fixedSelect').text($('input[name="useCdDvRadio"]:checked').filter(':checked').siblings('label').text());
            $('.newUseInfo article:eq(2) .fixedSelect').text($('input[name="uplDvRadio"]:checked').filter(':checked').siblings('label').text());
            $('.newUseInfo article:eq(3) .fixedSelect').text($('input[name="stDvRadio"]:checked').filter(':checked').siblings('label').text());
            $('.newUseInfo article:eq(4) .fixedSelect').text($('input[name="useDvRadio"]:checked').filter(':checked').siblings('label').text());
            $('.newUseInfo article:eq(5) .fixedSelect').text($('input[name="use_month"]:checked').filter(':checked').siblings('label').text());
        },
        _onFixClickUseInfo: function (e) {
            var $fixTab = $(e.currentTarget),
                $cardLi = $('.chooseItem li:visible'),
                $cardListCont = $('.newUseFloting article');

            $fixTab.parents('article').siblings().removeClass('on');
            $fixTab.parents('article').addClass('on');

            if ($fixTab.parents('article').hasClass('on')) {

                if ($('#useCarditemAll').attr('disabled') === 'disabled') {
                    $('.chooseItem').hide();
                    $('.newUseFloting .fixedBtn').addClass('on');
                } else {
                    $('.newUseFloting .fixedBtn').removeClass('on');
                    $('.chooseItem').show();
                }

                //카드스크롤 박스 초기화
                var tot = 0;
                for (i = 0; i <= 2; i++) {
                    tot = tot + $cardLi.eq(i).outerHeight();
                }
                $('.useChkCard .jspContainer, .useChkCard > div:first-child').height($('.chooseAll').outerHeight() + tot + 20);
                $('.newUseInfo .allCheckBox').jScrollPane({
                    showArrows: true,
                    verticalDragMinHeight: 30,
                    mouseWheelSpeed: 40
                });
            }
        },
        _onCardBtnUseInfo: function () {
            var $fixCardChkBtn = $('.cardChkC'),
                $fixCardChkBox = $fixCardChkBtn.children('span'),
                $cardInputChk = $("input[name=useCarditem]:checked"),
                $inputFirst = $cardInputChk.first().attr('data-name'),
                $inputLeng = $("input[name=useCarditem]").length,
                $inputChkLeng = $cardInputChk.length;

            // 카드 텍스트 체크
            if ($cardInputChk.prop('checked')) {
                $fixCardChkBox.text($inputFirst);
            } else {
                $fixCardChkBox.text('카드를 선택해주세요.');
            }

            if ($inputLeng == $cardInputChk.filter(':checked').length) {
                $fixCardChkBox.text('전체카드');
                $fixCardChkBtn.removeClass('on');

            } else if ($inputChkLeng >= 2) {
                $fixCardChkBtn.addClass('on');
                $fixCardChkBox.siblings().text('외 ' + $inputChkLeng + '개');

            } else {
                $fixCardChkBtn.removeClass('on');
            }
            // if($cardInputChk.first().next('label').find('span').width() >= 301){
            //     $fixCardChkBox.addClass('widthFix');
            // } else {
            //     $fixCardChkBox.removeClass('widthFix');
            // }
            $(function () {
                if ($('.cardChkC span').width() >= 341) {
                    $('.cardChkC').children('span').addClass('widthFix');
                } else {
                    $('.cardChkC').children('span').removeClass('widthFix');
                }
            })
        },

        _onCardConfirm: function (e) {
            var $fixBtn = $(e.currentTarget);
            $fixBtn.parents('article').removeClass('on');
        }
    };

    ns.init();
    return ns;
}(window.PC || {}, jQuery));