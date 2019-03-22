var PC = (function (jx, $) {
	jx.init = function () {
		jx.layout.init();
		jx.gnb.init();
		jx.main.init();
		jx.footer.init();
		// jx.cocoenDrag.init();
	}

	jx.layout = {
		init: function () {
			this._set();
		},
		_set: function () {
			console.log('layout init SET');
		}
	}

	jx.gnb = {
		init: function () {
			this.$gnbWrap = $('#gnb');
			if (this.$gnbWrap.length === 0) {
				return;
			}
			this.$gnbWrap = $('#gnb');
			this.$dimmed = $('.dimmed');

			this.$totSearch = $('.search_menu');
			this.$btnTotSearch = this.$totSearch.find('>button');
			this.$btnTotSearchText = this.$totSearch.find('>button span');
			this.$totSearchBox = $('.search_menu .panel');

			this.$totMenu = $('.total_menu');
			this.$btnTotMenu = this.$totMenu.find('>button');
			this.$btnTotMenuText = this.$totMenu.find('>button span');
			this.$totMenuBox = $('.total_menu .panel');

			this._set();
			this._bindEvent();
		},
		_set: function () {
			console.log('gnb init SET');
		},
		_bindEvent: function () {
			$('#gnb>.menu>li>a').off('mouseover');
			$('#gnb>.menu>li>a').on('mouseover', $.proxy(this.gnbOver, this));

			$(document).off('mouseleave.gnbEl');
			$(document).on('mouseleave.gnbEl', '#gnb', $.proxy(this._mouseleaveHideGnbDef, this));

			$('.total_menu > button').off('click');
			$('.total_menu > button').on('click', $.proxy(this._onClickTotMenu, this));

			$('.search_menu > button').off('click');
			$('.search_menu > button').on('click', $.proxy(this._onClickTotSearch, this));
		},
		gnbSet: function () {
			var $gnb = $('#gnb');
			var $gnbLevel2 = $gnb.find('.level2');

			if (!$gnbLevel2.is(':visible')) {
				return console.log($(this));
			}
		},
		gnbOver: function (e) {
			this.gnbSet();

			var $gnbEl;
			if (e.currentTarget === undefined) {
				$gnbEl = e;
			} else {
				$gnbEl = $(e.currentTarget);
			}

			var $gnbElWrap = $gnbEl.closest('li');
			var $gnbElCont = $gnbElWrap.find('.level2');
			var $gnbWrap = $gnbEl.closest('.menu');

			var isVisibleEl = $gnbWrap.find('>li >a').filter(function () {
				return ($(this).attr('aria-selected') === 'true');
			});

			//메뉴 선택
			$gnbWrap.find('>li >a').attr('aria-selected', 'false');
			$gnbEl.attr('aria-selected', 'true');
			$('#gnb').addClass('on');
			$('#header').addClass('on');

			//이전 메뉴 열려 있는 지 체크
			if (this.$btnTotSearch.attr('aria-expanded') === "true") {
				this.$btnTotSearch.attr('aria-expanded', 'false');
				this.$btnTotSearch.text(this.$btnTotSearchText.text().replace('닫기', ''));
				this.$totSearchBox.removeAttr('style');
				isVisibleEl = 1;
			}

			if (this.$btnTotMenu.attr('aria-expanded') === "true") {
				this.$btnTotMenu.attr('aria-expanded', 'false');
				this.$btnTotMenu.text(this.$btnTotMenuText.text().replace('닫기', ''));
				this.$totMenuBox.removeAttr('style');
				isVisibleEl = 1;
			}

			//맨 처음에만 animation
			if (isVisibleEl.length === 0) {
				$gnbElCont.hide();
				$gnbElCont.stop().slideDown(300, 'easeOutCubic', function () {
					$(this).removeAttr('style');
				});
				this.$dimmed.stop().fadeIn(300);
			}
		},
		_mouseleaveHideGnbDef: function () {

			if ($('.level2:visible').length > 0) {
				$('.level2:visible').show();
				$('.level2:visible').closest('li.level1').find('>a').attr('aria-selected', 'false');
				$('#gnb').removeClass('on');
				$('.level2:visible').stop().slideUp(300, 'easeOutCubic', function () {
					$('#header').removeClass('on');
					$(this).removeAttr('style');
					console.log('leave');
				});
			}

			// if (this.$btnTotSearch.attr('aria-expanded') === "true") {
			// 	this._hideTotBox();
			// }

			// if (this.$btnTotMenu.attr('aria-expanded') === "true") {
			// 	this._hideTotMenu();
			// }

			if ($('.function .panel:visible').length === 0) {
				this.$dimmed.stop().fadeOut(300);
			}

		},
		_onClickTotMenu: function () {
			$('#gnb').removeClass('on');
			if (this.$btnTotMenu.attr('aria-expanded') === "true") {
				this.$btnTotMenu.attr('aria-expanded', 'false');
				this.$btnTotMenu.text(this.$btnTotMenuText.text().replace('닫기', ''));
				this.$totMenuBox.stop().slideUp(300, 'easeOutCubic', function () {
					$('#header').removeClass('on');
				});
				this.$dimmed.stop().fadeOut(300, function () {
					$(this).removeAttr('style');
				});

			} else {
				console.log('total menu box open');
				this.$btnTotMenu.attr('aria-expanded', 'true');
				this.$btnTotMenu.text(this.$btnTotMenuText.text() + '닫기');
				$('#header').addClass('on');
				if ($('.level2:visible').length > 0) {
					this.$totMenuBox.show();
					this.$dimmed.show();
				} else if ($('.gnbList:visible').length > 0) {
					this.$totMenuBox.show();
					this.$dimmed.show();
				} else if (this.$btnTotSearch.attr('aria-expanded') === "true") {
					this.$btnTotSearch.attr('aria-expanded', 'false');
					this.$btnTotSearch.text(this.$btnTotSearchText.text().replace('닫기', ''));
					this.$totSearchBox.removeAttr('style');
					this.$totMenuBox.show();
				} else {
					this.$totMenuBox.stop().slideDown(300, 'easeOutCubic', function () {
						$(this).removeAttr('style');
						$(this).show();
					});
					this.$dimmed.stop().fadeIn(300);
				}
			}
		},
		_onClickTotSearch: function (e) {
			$('#gnb').removeClass('on');
			if (this.$btnTotSearch.attr('aria-expanded') === "true") {
				this.$btnTotSearch.attr('aria-expanded', 'false');
				this.$btnTotSearch.text(this.$btnTotSearchText.text().replace('닫기', ''));
				this.$totSearchBox.stop().slideUp(300, 'easeOutCubic', function () {
					$('#header').removeClass('on');
				});
				this.$dimmed.stop().fadeOut(300, function () {
					$(this).removeAttr('style');
				});
			} else {
				console.log('search box open');
				this.$btnTotSearch.attr('aria-expanded', 'true');
				this.$btnTotSearch.text(this.$btnTotSearchText.text() + '닫기');
				$('#header').addClass('on');
				if ($('.level2:visible').length > 0) {
					this.$totSearchBox.show();
					this.$dimmed.show();
				} else if ($('.gnbList:visible').length > 0) {
					this.$totSearchBox.show();
					this.$dimmed.show();
				} else if (this.$btnTotMenu.attr('aria-expanded') === "true") {
					this.$btnTotMenu.attr('aria-expanded', 'false');
					this.$btnTotMenu.text(this.$btnTotMenuText.text().replace('닫기', ''));
					this.$totMenuBox.removeAttr('style');
					this.$totSearchBox.show();
				} else {
					this.$totSearchBox.stop().slideDown(300, 'easeOutCubic', function () {
						$(this).removeAttr('style');
						$(this).show();
					});
					this.$dimmed.stop().fadeIn(300);
				}
			}
		}
	}

	jx.main = {
		init: function () {
			this._set();
			this._bindEvent();
			this._cocoenDrag();
		},
		_set: function () {
			var $tabsOn = $('.tabs_cell>ul>li.on');
			var $tabsContHeight = $tabsOn.find('.cont').height();
			$('.tabs_cell .on').css({ 'margin-bottom': $tabsContHeight });

			$(window).on('resize', $.proxy(this._resizeTabCont, this));
		},
		_bindEvent: function () {
			$(document).off('click.curEl');
			$(document).on('click.curEl', '.tabs_cell>ul>li>a', $.proxy(this._onClickMainTab, this));
		},
		_onClickMainTab: function (e) {
			var $curEl = $(e.currentTarget);
			if ($curEl.parent().index() !== 5) {
				e.preventDefault();
			}
			$('.tabs_cell>ul>li').removeClass('on');
			$('.tabs_cell>ul>li>a').removeAttr('aria-selected');
			$curEl.attr('aria-selected', 'true');
			$curEl.parent().addClass('on');

			//
			$('.tabs_cell>ul>li').removeAttr('style');
			var $tabsContHeight = $curEl.parent().find('.cont').height();
			$curEl.parent().css({ 'margin-bottom': $tabsContHeight });
			console.log($tabsContHeight);

			//
			$('.tabs_cell>ul>li').find('.cocoen_box').removeClass('cocoen');
			$('.tabs_cell>ul>li').find('.cocoen-drag').remove();
			$curEl.parent().find('.cocoen_box').addClass('cocoen');
			$curEl.parent().find('.cocoen_box>div').css({ 'width': '50%' });

			//
			if ($curEl.attr('aria-selected') === 'true') {
				this._cocoenDrag({});
			}
		},
		_cocoenDrag: function () {
			$('.cocoen').cocoen();
		},
		_resizeTabCont: function () {
			if ($('.tabs_cell>ul>li').hasClass('on')) {
				var tabsContHeight = $('.tabs_cell>ul>li').find('.cont').height();
				$('.tabs_cell>ul>li.on').css({ 'margin-bottom': tabsContHeight });
			}
			console.log(tabsContHeight);
		}
	}

	jx.footer = {
		init: function () {
			this.footerMore();
			this.familyMore();
		},
		footerMore: function () {
			$('.more').attr('aria-expanded', 'false');
			$('.more').on('click', function () {
				if ($('.more').attr('aria-expanded') === 'false') {
					$('.more').attr('aria-expanded', 'true');
					$('.notice').css({ 'overflow': 'visible' });
					$('.info .panel').stop().slideDown(300, 'easeOutCubic', function () {

					});
				} else {
					$('.more').attr('aria-expanded', 'false');
					$('.notice').css({ 'overflow': 'hidden' });
					$('.info .panel').stop().slideUp(300, 'easeOutCubic', function () {

					});
				}
			});
		},
		familyMore: function () {
			$('.family_site button').attr('aria-expanded', 'false');
			$('.family_site button').on('click', function () {
				if ($('.family_site button').attr('aria-expanded') === 'true') {
					$('.family_site button').attr('aria-expanded', 'false');
					$('.family_site .viewport').stop().slideUp(300, 'easeOutCubic', function () {
						$(this).removeAttr('style');
					});
				} else {
					$('.family_site button').attr('aria-expanded', 'true');
					$('.family_site .viewport').hide();
					$('.family_site .viewport').stop().slideDown(300, 'easeOutCubic');
				}
			});
		}
	}

	jx.cocoenDrag = {
		init: function () {
			this._set();
		},
		_set: function () {
			//$('.cocoen').cocoen();
			document.querySelectorAll('.cocoen').forEach(function (element) {
				new Cocoen(element);
			});
		},
	}

	jx.init();
	return jx;

}(window.PC || {}, jQuery));

function newFunction() {
	return this;
}
