/*
** PluginName: Pualugin
** Auth: Pual
*/

;
var leftChecker;

(function ($, win, doc, undefined) {
	'use strict';

	/*
	** Local Variables
	*/
	var COMMON = {};

	/*
	** COMMON
	*/
	;
	(function () {

		COMMON.uuid = (function () {
			var _uuid = 0;
			return function (prefix) {
				var id = ++_uuid;
				prefix = prefix ? prefix : '';
				return prefix + id;
			}
		})();

		COMMON.findFocusElement = function( element ) {
			var _basket = [];

			$(element).find('*').each(function (i, val) {
				if (val.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) && parseInt(val.getAttribute("tabIndex")) !== -1) {
					_basket.push(val);
				}
				if ((val.getAttribute("tabIndex") !== null) && (parseInt(val.getAttribute("tabIndex")) >= 0) && (val.getAttribute("tabIndex", 2) !== 32768)) {
					_basket.push(val);
				}
			});

			return [_basket[0], _basket[_basket.length - 1]];
		};

		COMMON.checkPrevId = function( $element, pluginName ) {
			return $element.attr('id').indexOf(pluginName) !== -1 ? false : true;
		}

		COMMON.checkFocusibleElement = function( $element ) {
			var tagName = $element.get(0).tagName.toLowerCase();

			if ( tagName === 'a' || tagName === 'button' ) {
				return true;
			} else {
				return false;
			}
		}

	})()

	/*
	** Plugin - Toggle
	*/
	;
	(function ($, win, doc, undefined) {

		var pluginName = 'toggle';

		var defaults = {
			mode: 'static', // static, slide, fade
			event: 'click', // 'focusin'
			speed: 300,
			easing: 'swing',
			anchorEl: '[data-element="toggle__anchor"]',
			panelEl: '[data-element="toggle__panel"]',
			onChangeBeforeText: null,
			onChangeAfterText: null,
			activeClassName: 'is-active',
			isOpened: false
		};

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.flag = false;
			this.textFlag = false;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function () {
				var plugin = this;

				plugin.buildCache();
				plugin.bindEvents();

				plugin.options.isOpened ? plugin.open() : plugin.close();
			},
			destroy: function () {
				var plugin = this;

				plugin.flag = false;
				plugin.textFlag = false;

				plugin
					.unbindEvents()
					.removeCache();

				plugin.$element.removeData('plugin_' + plugin._name);
			},
			buildCache: function () {
				var plugin = this;

				plugin.$element = $(plugin.element);
				plugin.$anchor = plugin.$element.find(plugin.options.anchorEl);
				plugin.$panel = plugin.$element.find(plugin.options.panelEl);

				!COMMON.checkFocusibleElement(plugin.$anchor)
					&& plugin.$anchor.attr({'role': 'button', 'tabindex': 0 });

				var _id = plugin.$panel.attr('id') ? plugin.$panel.attr('id') : COMMON.uuid(plugin._name + '-');

				plugin.$anchor.attr('aria-controls', _id);
				plugin.$panel.attr('id', _id);

				if ( plugin.options.onChangeAfterText !== null && plugin.options.onChangeBeforeText !== null ) {
					plugin.textFlag = true;
				}
			},
			removeCache: function() {
				var plugin = this;

				plugin.$anchor.removeAttr('aria-expended aria-controls tabindex role');
				plugin.$panel.removeAttr('aria-expended style');

				!COMMON.checkPrevId( plugin.$panel, plugin._name ) && plugin.$panel.removeAttr('id');
			},
			bindEvents: function () {
				var plugin = this;

				var eventName = (function () {
					var events = plugin.options.event;

					if (events === 'focusin') {
						return 'focusin.' + plugin._name + ' mouseenter.' + plugin._name;
					} else if (events === 'click') {
						return 'click.' + plugin._name + ' keydown.' + plugin._name;
					}
					return events + '.' + plugin._name;
				})();

				plugin.$anchor
					.off(eventName)
					.on(eventName, function (e) {
						e.stopPropagation();

						var key = e.which || e.keyCode;

						if (e.type === 'click' || e.type === 'focusin' || key === 13 || key === 32) {
							plugin.idx = $(this).data('index');
							plugin.toggle();
							e.preventDefault();
						}
					});

				plugin.$element
					.off('show.' + plugin._name)
					.on('show.' + plugin._name, function (e) {
						plugin.show();
					});

				plugin.$element
					.off('hide.' + plugin._name)
					.on('hide.' + plugin._name, function (e) {
						plugin.hide();
					})
			},
			unbindEvents: function () {
				var plugin = this;

				plugin.$anchor.off('.' + plugin._name)
				plugin.$element.off('.' + plugin._name)
			},
			beforeChange: function ($anchor, $panel) {
				var plugin = this;

				plugin.$element.trigger('beforeChange', [plugin, $anchor, $panel])
			},
			afterChange: function ($anchor, $panel) {
				var plugin = this;

				plugin.$element.trigger('afterChange', [plugin, $anchor, $panel])

				$panel.find('.slick-initialized').length && $panel.find('.slick-initialized').slick('setPosition');
			},
			toggle: function () {
				var plugin = this;

				plugin.flag ? plugin.close() : plugin.open();
			},
			open: function () {
				var plugin = this;

				plugin.flag = true;

				plugin.beforeChange(plugin.$anchor, plugin.$panel);

				plugin.textFlag && plugin.$anchor.text(plugin.options.onChangeAfterText);

				plugin.$anchor
					.addClass(plugin.options.activeClassName)
					.attr('aria-expended', true);

				if (plugin.options.mode === 'fade') {
					plugin.$panel.stop().fadeIn(plugin.options.speed, plugin.options.easing, function () {
						plugin.afterChange(plugin.$anchor, plugin.$panel);
					});
				} else if (plugin.options.mode === 'slide') {
					plugin.$panel.stop().slideDown(plugin.options.speed, plugin.options.easing, function () {
						plugin.afterChange(plugin.$anchor, plugin.$panel);
					});
				} else {
					plugin.$panel.stop().show();
					plugin.afterChange(plugin.$anchor, plugin.$panel);
				}

				plugin.afterChange(plugin.$anchor, plugin.$panel);
			},
			close: function () {
				var plugin = this;

				plugin.flag = false;

				plugin.beforeChange(plugin.$anchor, plugin.$panel);

				plugin.textFlag && plugin.$anchor.text(plugin.options.onChangeBeforeText);

				plugin.$anchor
					.removeClass(plugin.options.activeClassName)
					.attr('aria-expended', false);

				if (plugin.options.mode === 'fade') {
					plugin.$panel.stop().fadeOut(plugin.options.speed, plugin.options.easing);
				} else if (plugin.options.mode === 'slide') {
					plugin.$panel.stop().slideUp(plugin.options.speed, plugin.options.easing);
				} else {
					plugin.$panel.stop().hide();
				}

				plugin.afterChange(plugin.$anchor, plugin.$panel);
			},
			reInit: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.textFlag = false;

				plugin
					.unbindEvents()
					.removeCache()
					.init();
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('[data-element=toggle]').toggle();
		});

	})(jQuery, window, document, undefined)

	/*
	** Plugin - Tooltip
	*/
	;
	(function ($, win, doc, undefined) {

		var pluginName = "tooltip";

		var defaults = {
			position: 'right', //left, top, bottom
			mode: 'tooltip', // popover
			indent: 15,
			button: '[data-element=tooltip__button]',
			panel: '[data-element=tooltip__panel]',
			tooltipContainerClassName: 'pualugin-tooltip-container',
			activeClassName: 'is-active',
			zindex: 13
		};

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.flag = false;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
				var plugin = this;

				plugin.buildCache();
				plugin.bindEvents();
			},
			destroy: function() {
				var plugin = this;

				plugin.flag = false;

				plugin.$element.removeData('plugin_' + plugin._name);
				plugin
					.unbindEvents()
					.removeCache();
			},
			buildCache: function() {
				var plugin = this;
				var container = '.' + plugin.options.tooltipContainerClassName;

				plugin.$element = $(plugin.element);
				plugin.$button = plugin.$element.find(plugin.options.button);
				plugin.$panel = plugin.$element.find(plugin.options.panel);
				plugin.$container = $(container).length ? $(container) : $('body').append('<div class=' + plugin.options.tooltipContainerClassName + '></div>')
				plugin.$win = $(win);

				var _id = plugin.$panel.attr('id') ? plugin.$panel.attr('id') : COMMON.uuid(plugin._name);

				var focusible = COMMON.checkFocusibleElement( plugin.$button );

				plugin.$element.css('display', 'inline-block');

				plugin.$button.attr({
					'role': 'tooltip',
					'aria-describedby': _id,
					'aria-controls': _id,
					'aria-expended': false,
					'tabindex': focusible ? '' : 0
				})

				plugin.$panel
					.css('z-index', plugin.options.zindex)
					.attr('id', _id)
					.hide()
					.appendTo($(container));
			},
			removeCache: function() {
				var plugin = this;

				plugin.$element
					.removeAttr('style')
					.removeData('plugin_' + plugin._name);
				plugin.$panel
					.appendTo(plugin.$element)
					.removeAttr('style');

				plugin.$button.removeAttr('role aria-describedby aria-controls aria-expended');
				plugin.$container.find(plugin.options.panel).length === 0 && plugin.$container.remove();

				!COMMON.checkPrevId(plugin.$panel, plugin._name) && plugin.$panel.removeAttr('id');
			},
			bindEvents: function() {
				var plugin = this;

				var eventName = (function () {
					var events = plugin.options.mode;

					if ( events === 'tooltip' ) {
						return [ 'focusin.' + plugin._name + ' mouseenter.' + plugin._name, 'focusout.' + plugin._name + ' mouseleave.' + plugin._name ]
					} else {
						return [ 'click.' + plugin._name ]
					}
				})();

				if ( eventName.length == 1 ) {
					plugin.$button.on(eventName[0], function(e) {
						e.preventDefault();
						plugin.toggle();
					})

					plugin.$win.on(eventName[0], function(e) {
						if ( plugin.flag ) {
							if (!plugin.$element.is(e.target) && plugin.$element.has(e.target).length === 0){
								plugin.close()
							}
						}
					})
				} else if (eventName.length == 2) {
					plugin.$button
						.on(eventName[0], function(e) {
							e.preventDefault();

							plugin.open();
						})
						.on(eventName[1], function(e) {
							e.preventDefault();

							plugin.close();
						});
				}
			},
			unbindEvents: function() {
				var plugin = this;

				plugin.$button.off('.' + plugin._name);
				plugin.$win.off('.' + plugin._name);
			},
			toggle: function() {
				var plugin = this;

				plugin.flag ? plugin.close() : plugin.open();
			},
			open: function() {
				var plugin = this;

				plugin.flag = true;
				plugin.$button.attr('aria-expended', true);
				plugin.$panel
					.css('position', 'absolute')
					.addClass(plugin.options.activeClassName)
					.show();
				plugin.setPosition();
			},
			close: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.$button.attr('aria-expended', false);
				plugin.$panel
					.css('position', '')
					.removeClass(plugin.options.activeClassName)
					.hide();
				//  091119 pualugin-tooltip close 시 포커스기능 주석처리

				// var paform = plugin.$button.parents('.form__unit');
				// var palabel = plugin.$button.parents('.form__label');
				// var paformLen = paform.length != 0 ? true : false ;
				// paformLen && paform.hasClass('inputon') ? palabel.next('.form__element').focus() : '';
			},
			setPosition: function() {
				var plugin = this;

				var buttonWidth = plugin.$button.outerWidth(),
					buttonHeight = plugin.$button.outerHeight(),
					panelWidth = plugin.$panel.outerWidth(),
					panelHeight = plugin.$panel.outerHeight();

				var buttonOffset = plugin.$button.offset(),
					buttonTop = buttonOffset.top,
					buttonLeft = buttonOffset.left;

				switch ( plugin.options.position ) {
					case 'left':
						plugin.$panel.css({
							// 'top': buttonTop + ( (buttonHeight - panelHeight) / 2 ),
							'top': buttonTop - 20,
							'left': ( buttonLeft - panelWidth ) - plugin.options.indent
						})
						break;
					case 'top':
						plugin.$panel.css({
							'top': ( buttonTop - panelHeight ) - plugin.options.indent,
							'left': (Math.abs( buttonLeft + ( buttonWidth / 2 ) )) - ( Math.abs( panelWidth / 2 ) )
						})
						break;
					case 'bottom':
						plugin.$panel.css({
							'top': ( buttonTop + buttonHeight ) + plugin.options.indent,
							'left': (Math.abs( buttonLeft + ( buttonWidth / 2 ) )) - ( Math.abs( panelWidth / 2 ) )
						})
						break;
					default:
						plugin.$panel.css({
							// 'top': buttonTop + ( (buttonHeight - panelHeight) / 2 ),
							'top': buttonTop - 20,
							'left': ( buttonLeft + buttonWidth ) + plugin.options.indent
						})
				}
			},
			reInit: function() {
				var plugin = this;

				plugin.flag = false;
				plugin
					.unbindEvents()
					.removeCache()
					.init();
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('[data-element=tooltip]').tooltip();
		});
	})(jQuery, window, document, undefined)

	/*
	** Plugin - Tab
	*/
	;
	(function ($, win, doc, undefined) {

		var pluginName = 'tab';

		var defaults = {
			mode: 'static', // static, slide, fade
			event: 'click', // 'focusin'
			speed: 300,
			easing: 'swing',
			list: '[data-element="tab__list"]',
			anchor: '[data-element="tab__anchor"]',
			panel: '[data-element="tab__panel"]',
			activeClassName: 'is-active',
			disabledClassName: 'is-disabled',
			autoScroll: false,
			isInitActive: true,
			initIndex: 0
		};

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.flag = false;
			this.initialized = false;
			this.idx = 0;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function () {
				var plugin = this;

				plugin.buildCache();
				plugin.bindEvents();

				plugin.options.isInitActive && plugin.$anchor.eq(plugin.options.initIndex).trigger(plugin.options.event);

				plugin.initialized = true;
			},
			destroy: function () {
				var plugin = this;

				plugin.idx = 0;
				plugin.flag = false;
				plugin.initialized = false;

				plugin.$element.removeData('plugin_' + plugin._name);
				plugin
					.unbindEvents()
					.removeCache();
			},
			buildCache: function () {
				var plugin = this;
				var anchorsId = [];

				plugin.$element = $(plugin.element);
				plugin.$anchor = plugin.$element.find(plugin.options.anchor);
				plugin.$panel = plugin.$element.find(plugin.options.panel);
				plugin.$list = plugin.$element.find(plugin.options.list);

				plugin.$anchor.each(function (idx) {
					var $this = $(this);
					var _id = $this.attr('id') ? $this.attr('id') : COMMON.uuid('pualugin-' + plugin._name + '-');
					var focusible = COMMON.checkFocusibleElement( $this );

					$this
						.data(plugin._name + '_target', plugin.$panel.eq(idx))
						.attr({
							'id': _id,
							'role': 'tab',
							'tabindex': focusible ? '' : 0
						});

					anchorsId.push(_id);
				});

				plugin.$panel.each(function (idx) {
					$(this).attr({
						'aria-labelledby': anchorsId[idx],
						'role': 'tabpanel',
						'tabindex': 0
					});
				});

				plugin.$list.attr('role', 'tablist');
			},
			removeCache: function() {
				var plugin = this;

				plugin.$list.removeAttr('role');
				plugin.$anchor
					.removeData(plugin._name + '_target')
					.removeAttr('style role')
					.removeClass(plugin.options.activeClassName);
				plugin.$panel
					.removeAttr('style role aria-labelledby')
					.removeClass(plugin.options.activeClassName);
				!COMMON.checkPrevId( plugin.$panel, plugin._name ) && plugin.$panel.removeAttr('id');
			},
			bindEvents: function () {
				var plugin = this;

				var eventName = (function () {
					var events = plugin.options.event;

					if (events === 'focusin') {
						return 'focusin.' + plugin._name + ' mouseenter.' + plugin._name;
					} else if (events === 'click') {
						return 'click.' + plugin._name + ' keydown.' + plugin._name;
					}
					return events + '.' + plugin._name;
				})();

				plugin.$anchor.on(eventName, function (e) {
					e.stopPropagation();
					var $this = $(this);

					if ($this.hasClass(plugin.options.activeClassName) || $this.hasClass(plugin.options.disabledClassName) || plugin.flag) return false;

					var key = e.which;

					if (e.type === 'click' || e.type === 'focusin' || key === 13 || key === 32) {
						plugin.idx = $(this).data('index');
						plugin.close(this);
						plugin.open(this);
						e.preventDefault();
					}
				});
			},
			unbindEvents: function () {
				var plugin = this;

				plugin.$anchor.off('.' + plugin._name);
				plugin.$element.off('.' + plugin._name);
			},
			beforeChange: function ($anchor, $panel) {
				var plugin = this;

				plugin.$element.trigger('beforeChange', [plugin, $anchor, $panel]);
			},
			afterChange: function ($anchor, $panel) {
				var plugin = this;

				plugin.$element.trigger('afterChange', [plugin, $anchor, $panel]);

				$panel.find('.slick-initialized').length && $panel.find('.slick-initialized').slick('setPosition');
			},
			open: function ( target ) {
				var plugin = this,
					$anchor = $(target);

				var $panel = $anchor
					.addClass(plugin.options.activeClassName)
					.attr({
						'aria-selected': true,
						'aria-expended': true
					})
					.data(plugin._name + '_target')
					.addClass(plugin.options.activeClassName);

				plugin.flag = true;

				plugin.beforeChange($anchor, $panel);

				if (plugin.options.mode === 'fade') {
					$panel.stop().fadeIn(plugin.options.speed, plugin.options.easing, function () {
						plugin.flag = false;
						plugin.afterChange($anchor, $panel);
					});
				} else if (plugin.options.mode === 'slide') {
					$panel.stop().slideDown(plugin.options.speed, plugin.options.easing, function () {
						plugin.flag = false;
						plugin.afterChange($anchor, $panel);
					});
				} else {
					$panel.stop().show();
					plugin.flag = false;
					plugin.afterChange($anchor, $panel);
				}

				if (plugin.options.autoScroll && plugin.initialized) {
					$('html, body').stop().animate({
						scrollTop: plugin.$element.offset().top
					}, plugin.options.speed);
				}
			},
			close: function ( target ) {
				var plugin = this;

				plugin.$anchor.not( target ).each(function () {
					var $panel = $(this)
						.removeClass(plugin.options.activeClassName)
						.attr({
							'aria-selected': false,
							'aria-expended': false
						})
						.data(plugin._name + '_target')
						.removeClass(plugin.options.activeClassName);

					if (plugin.options.mode === 'fade') {
						$panel.stop().fadeOut(plugin.options.speed, plugin.options.easing);
					} else if (plugin.options.mode === 'slide') {
						$panel.stop().slideUp(plugin.options.speed, plugin.options.easing);
					} else {
						$panel.stop().hide();
					}
				});
			},
			go: function(idx, autoScroll) {
				var plugin = this;

				plugin.$anchor.eq(idx).trigger(plugin.options.event);

				if ( autoScroll && plugin.initialized ) {
					$('html, body').stop().animate({
						scrollTop: plugin.$element.offset().top
					}, plugin.options.speed);
				}
			},
			reInit: function() {
				var plugin = this;

				plugin.idx = 0;
				plugin.flag = false;
				plugin.initialized = false;

				plugin
					.unbindEvents()
					.removeCache()
					.init();
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('[data-element=tab]').tab();
		});

	})(jQuery, window, document, undefined)

	/*
	** Plugin - Accordion
	*/
	;
	(function ($, win, doc, undefined) {

		var pluginName = 'accordion';

		var defaults = {
			mode: 'slide', // static, slide
			speed: 500,
			easing: 'linear',
			item: '[data-element="accordion__item"]',
			anchor: '[data-element="accordion__anchor"]',
			panel: '[data-element="accordion__panel"]',
			activeClassName: 'is-active',
			initIndex: 0,
			isInitActive: true,
			autoFold: true,
			autoScroll: false
		};

		function Plugin(element, options) {
			var plugin = this;

			plugin.element = element;
			plugin._name = pluginName;
			plugin._defaults = defaults;
			plugin.options = $.extend({}, plugin._defaults, options);
			plugin.flag = false;
			plugin.initialized = false;
			plugin.init();
		}

		$.extend(Plugin.prototype, {
			init: function () {
				var plugin = this;

				plugin.buildCache();
				plugin.bindEvents();

				plugin.options.isInitActive && plugin.open(plugin.$anchor.eq(plugin.options.initIndex));

				plugin.initialized = true;
			},
			destroy: function () {
				var plugin = this;

				plugin.flag = false;
				plugin.initialized = false;
				plugin.$element.removeData('plugin_' + plugin._name);
				plugin
					.unbindEvents()
					.removeCache();
			},
			buildCache: function () {
				var plugin = this;

				plugin.$element = $(plugin.element).attr('role', 'presentation');
				plugin.$header = plugin.$element.find(plugin.options.item);
				plugin.$anchor = plugin.$element.find(plugin.options.anchor);
				plugin.$panel = plugin.$element.find(plugin.options.panel).hide();

				var tabsId = [];

				plugin.$anchor.each(function (idx) {
					var $this = $(this);
					var _id = $this.attr('id') ? $this.attr('id') : COMMON.uuid('pualugin-' + plugin._name + '-');

					$this
						.data(plugin._name + '_target', plugin.$panel.eq(idx))
						.data('title', $.trim($this.text()))
						.attr({
							'id': _id,
							'aria-expanded': false,
							'aria-controls': _id + '-panel'
						});


					tabsId.push(_id);
				});

				plugin.$panel.each(function (idx) {
					$(this).attr({
						'aria-labelledby': tabsId[idx],
						'role': 'region'
					}).hide();
				});
			},
			removeCache: function() {
				var plugin = this;

				plugin.$anchor
					.removeData(plugin._name + '_target')
					.removeData('title')
					.removeAttr('id aria-expanded aria-controls')
					.removeClass(plugin.options.activeClassName);

				plugin.$panel
					.removeAttr('aria-labelledby role')
					.removeClass(plugin.options.activeClassName);
				!COMMON.checkPrevId( plugin.$anchor, plugin._name ) && plugin.$anchor.removeAttr('id');
			},
			bindEvents: function () {
				var plugin = this;

				plugin.$element.on('click' + '.' + plugin._name, plugin.options.anchor, function (e) {
					e.stopPropagation();
					e.preventDefault();

					if (plugin.flag) {
						return false;
					}
					plugin.toggle($(this));
				});

				plugin.$anchor.on('open.' + plugin._name, function () {
					plugin.open($(this));
				});

				plugin.$anchor.on('close.' + plugin._name, function () {
					plugin.close($(this));
				});
			},
			unbindEvents: function () {
				var plugin = this;

				plugin.$element.off('.' + plugin._name);
				plugin.$header.off('.' + plugin._name);
			},
			beforeChange: function ($activeTarget) {
				var plugin = this;

				plugin.$element.trigger('beforeChange', [plugin, $activeTarget]);
			},
			afterChange: function ($activeTarget) {
				var plugin = this;

				plugin.$element.trigger('afterChange', [plugin, $activeTarget]);
			},
			toggle: function ($targetAnchor) {
				var plugin = this;

				plugin.flag = true;

				$targetAnchor.hasClass(plugin.options.activeClassName) ? plugin.close($targetAnchor) : plugin.open($targetAnchor);
			},
			open: function ($targetAnchor) {
				var plugin = this;

				plugin.beforeChange($targetAnchor);

				var $panel = $targetAnchor
					.attr('aria-expanded', true)
					.addClass(plugin.options.activeClassName)
					.data(plugin._name + '_target')
					.addClass(plugin.options.activeClassName);

				if ( plugin.initialized && plugin.options.mode == 'slide' ) {
					$panel.stop().slideDown(plugin.options.speed, plugin.options.easing, function () {
						plugin.flag = false;

						if (plugin.options.autoScroll) {
							setTimeout(function() {
								$('html, body').stop().animate({
									scrollTop: $targetAnchor.offset().top - 45
								}, 100)
							}, 100);
						}
					});
				} else {
					$panel.stop().show();
					plugin.flag = false;
				}

				if (plugin.options.autoFold) {
					plugin.$anchor.not($targetAnchor).each(function () {
						plugin.close($(this));
					})
				}

				plugin.afterChange($targetAnchor);
			},
			close: function ($targetAnchor) {
				var plugin = this;

				plugin.beforeChange($targetAnchor);

				var $panel = $targetAnchor
					.attr('aria-expanded', false)
					.removeClass(plugin.options.activeClassName)
					.data(plugin._name + '_target')
					.removeClass(plugin.options.activeClassName);

				if (plugin.options.mode === 'slide') {
					$panel.stop().slideUp(plugin.options.speed, plugin.options.easing, function () {
						plugin.flag = false;
					});
				} else {
					$panel.stop().hide();
					plugin.flag = false;
				}

				plugin.afterChange($targetAnchor);
			},
			go: function( idx, autoScroll ) {
				var plugin = this;

				plugin.$anchor.eq(idx).trigger('click');

				if ( autoScroll ) {
					plugin.autoScroll();
				}
			},
			autoScroll: function() {
				var plugin = this;

				$('html, body').stop().animate({
					scrollTop: plugin.$wrap.offset().top
				}, plugin.options.speed);
			},
			reInit: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.initialized = false;

				plugin
					.unbindEvents()
					.removeCache()
					.init();
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('[data-element=accordion]').accordion();
		});

	})(jQuery, window, document, undefined)

	/*
	** Plugin - Sticky
	*/
	;
	(function ( $, win, doc, undefined ){
		var pluginName = 'sticky'

		var defaults = {
			position: "top", //bottom, middle
			top: 0,
			sectionEl: '[data-element=sticky__section]',
			headerEl: '[data-element=sticky__target-parent]',
			targetEl: '[data-element=sticky__target]',
			activeClassName: 'is-sticky'
		};

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend( {}, this._defaults, options );
			this.flag = false;
			this.headerHeight = 0;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
				var plugin = this;

				plugin.buildCache();
				plugin.bindEvents();
			},
			destroy: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.headerHeight = 0;

				plugin.$element.removeData('plugin_' + plugin._name);
				plugin
					.unbindEvents()
					.removeCache()
					.init();
			},
			buildCache: function() {
				var plugin = this;

				plugin.$element = $( plugin.element );
				plugin.$header = plugin.$element.find( plugin.options.headerEl );
				plugin.$target = plugin.$element.find( plugin.options.targetEl );
				plugin.$win = $( win );

				plugin.headerHeight = plugin.$header.outerHeight();
			},
			removeCache: function() {
				var plugin = this;

				plugin.$element.removeAttr('style');
				plugin.$header.removeAttr('style');
				plugin.$target.removeAttr('style');
			},
			bindEvents: function() {
				var plugin = this;

				plugin.$win
					.on('scroll.' + plugin._name, function() {
						var scrTop = $(this).scrollTop();

						plugin.toggle( scrTop );
					})
					.on('resize.' + plugin._name, function() {
						$(this).trigger('scroll');
					})
			},
			unbindEvents: function() {
				plugin.$win.off( '.' + plugin._name);
			},
			toggle: function( scrTop ) {
				var plugin = this;

				plugin.getPosition();

				if ( scrTop > plugin.bottom ) {
					plugin.unFixed();
					plugin.bottomRelative();
				} else if ( scrTop >= plugin.top ) {
					plugin.bottomFixed();
					plugin.setFixed();
				} else if ( scrTop <= plugin.top ) {
					plugin.unFixed();
				}
			},
			setFixed: function() {
				var plugin = this;

				plugin.beforeChange();
				plugin.$header.css('height', plugin.headerHeight);
				plugin.$target
					.addClass( plugin.options.activeClassName )
					.css({
						'position': 'fixed',
						'top': plugin.options.top,
						'left': plugin.$header.offset().left,
						'width': plugin.$header.outerWidth()
					});
				plugin.afterChange();
			},
			unFixed: function() {
				var plugin = this;

				plugin.$header.css('height', plugin.headerHeight);
				plugin.$target
					.removeClass( plugin.options.activeClassName )
					.css({
						'position': '',
						'top': '',
						'left': '',
						'width': ''
					})
			},
			bottomFixed: function() {
				var plugin = this;

				plugin.$element.css({
					position: ''
				})

				plugin.$target.css({
					position: '',
					bottom: '',
					width: ''
				})
			},
			bottomRelative: function() {
				var plugin = this;

				plugin.$element.css('position', 'relative');
				plugin.$target.css({
					position: 'absolute',
					bottom: '0',
					top: 'auto',
					width: '100%'
				})
			},
			getOffsetTop: function( target ) {
				var plugin = this;
				var wrapTop = plugin.$element.offset().top;
				var headerHeight = plugin.$header.height();
				var position = plugin.options.position;
				var topValue = plugin.options.top;

				if ( target ) {
					return ($(target).offset().top - topValue);
				} else if ( position === 'bottom' ) {
					return ( wrapTop + headerHeight ) - topValue;
				} else if (  position === 'middle' ) {
					return ( wrapTop + ( headerHeight / 2 ) ) - topValue;
				} else {
					return wrapTop - topValue;
				}
			},
			getPosition: function() {
				var plugin = this;
				plugin.top = plugin.getOffsetTop( plugin.$element );
				plugin.bottom = plugin.top + ( plugin.$element.outerHeight() - plugin.headerHeight );
			},
			beforeChange: function () {
				var plugin = this;

				plugin.$element.trigger('beforeChange', [plugin, plugin.$target]);
			},
			afterChange: function () {
				var plugin = this;

				plugin.$element.trigger('afterChange', [plugin, plugin.$target]);
			},
			reInit: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.headerHeight = 0;

				plugin
					.unbindEvents()
					.removeCache()
					.init();
			}
		})

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, $.extend( {}, options, $(this).data('options')) ));
				}
			});
		}

		$(function () {
			$('[data-element=sticky]').sticky();
		});

	})(jQuery, window, document, undefined)

	/*
	** Plugin - Form Control
	*/
	;
	(function ($, win, doc, undefined) {
		var pluginName = "formCtrl"

		var defaults = {
			input: '[data-element=form-ctrl__input]',
			textarea: '[data-element=form-ctrl__textarea]',
			delete: '[data-element=form-ctrl__delete]',
			count: '[data-element=form-ctrl__count]',
			countCurrent: '[data-element=form-ctrl__count-current]',
			countTotal: '[data-element=form-ctrl__count-total]',
			activeClassName: 'is-active',
			autoHeight: false, //true
		}

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
				var plugin = this;
				plugin.buildCache();
				plugin.bindEvents();
			},
			buildCache: function() {
				var plugin = this;
				plugin.$element = $(plugin.element);
				plugin.$input = plugin.$element.find( plugin.options.input );
				plugin.$textarea = plugin.$element.find( plugin.options.textarea );
				plugin.$delete = plugin.$element.find( plugin.options.delete );
				plugin.$count = plugin.$element.find( plugin.options.count );
				plugin.$countCurrunt = plugin.$element.find( plugin.options.countCurrent );
				plugin.$countTotal = plugin.$element.find( plugin.options.countTotal );
			},
			bindEvents: function() {
				var plugin = this;

				plugin.$input.on('keyup.' + plugin._name, function(e) {
					plugin.toggle( this );
				}).keyup();

				plugin.$delete.on('click.' + plugin._name, function(e) {
					e.preventDefault();
					plugin.delete();
				});

				plugin.$textarea.on('keyup.' + plugin._name + ' input.' + plugin._name, function(e) {
					plugin.count( e );
					if (plugin.options.autoHeight) {
						plugin.resize();
					}
				}).keyup();

			},
			toggle: function( self ) {
				var plugin = this;
				var $self = $(self);

				$self.val().length > 0 ? plugin.show() : plugin.hide();
			},
			show: function() {
				var plugin = this;

				if ( plugin.$input.attr('class').indexOf('search') != -1 ) {
					$('.search__COMMON-button-box').hide()
				}
				plugin.$delete.addClass(plugin.options.activeClassName);
			},
			hide: function() {
				var plugin = this;

				plugin.$delete.removeClass(plugin.options.activeClassName);
				if ( plugin.$input.attr('class').indexOf('search') != -1 ) {
					$('.search__COMMON-button-box').show()
				}
			},
			delete: function() {
				var plugin = this;
				plugin.$input.val('').focus();
				plugin.hide();
			},
			count: function( e ) {
				var plugin = this;
				var maxLength = plugin.$countTotal.text() || 500;
				var curruntLength = plugin.$textarea.val().length;

				if ( curruntLength <= maxLength ) {
					plugin.$countCurrunt.text( curruntLength );
				} else {
					plugin.$countCurrunt.text( plugin.$countTotal.text() );
				}
			},
			resize: function(){
				var plugin = this;
				var paddingTop = plugin.$textarea.css("padding-top").replace("px", "");
				var paddingBtm = plugin.$textarea.css("padding-bottom").replace("px", "");
				plugin.$textarea.css({
					'height' : 'auto',
					'overflow' : 'hidden',
				}).height(
					plugin.$textarea[0].scrollHeight - paddingTop - paddingBtm
				);
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('[data-element=form-ctrl]').formCtrl();
		});

	})(jQuery, window, document, undefined)

	/*
	** Plugin - Modal
	*/
	;
	(function ($, win, doc, undefined) {
		var pluginName = "modal";

		var defaults = {
			closeExisting: false,
			stackLevel: 10,
			mobileResolution: 1280,
			activeClassName: 'is-open',
			contentsWrapClassName: 'pualugin-wrap',
			modalClassName: 'pualugin-modal',
			modalMaskClassName: 'pualugin-modal__mask',
			container: '[data-element=modal]',
			modal: '[data-element=modal__element]',
			modalInner: '[data-element=modal__element-container]',
			mask: '[data-element=modal__mask]',
			close: '[data-element=modal__close]',
			open: '[data-element=modal__open]'
		}
		var popPadding;
		var headerPadding;
		var headerTrue;
		if($('.wrap>.container:first-child .header').length > 0){
			headerPadding = $('.wrap>.container:first-child .header').width();
			headerTrue = true;
		}
		var pcTrue;
		if($(window).width() > 768){
			pcTrue = true;
		}
		var headerPaddingRight;

		function Plugin(element, options) {
			this.element = element;
			this._name = pluginName;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.flag = false;
			this.stackLevel = this.options.stackLevel;
			this.currentScrollTop = 0;
			this.isMobile = false;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
				var plugin = this;

				//initialSettings
				var container =
					$('<div></div>')
						.addClass(plugin.options.modalClassName)
						.attr('data-element', 'modal')
						.appendTo('body');

				$( plugin.options.modal ).appendTo( container );

				plugin.buildCache();
				plugin.bindEvents();
			},
			destroy: function() {
				var plugin = this;

				plugin.flag = false;
				plugin.stackLevel = 10;

				plugin.$element.removeData('plugin_' + plugin._name);
				plugin
					.unbindEvents()
					.removeCache();
			},
			buildCache: function() {
				var plugin = this;

				plugin.$element = $(plugin.element);
				plugin.$container = plugin.$element.find(plugin.options.container);
				plugin.$modal = plugin.$element.find( plugin.options.modal );
				plugin.$modalInner = plugin.$element.find( plugin.options.modalInner );
				plugin.$open = plugin.$element.find( plugin.options.open );
				plugin.$close = plugin.$element.find( plugin.options.close );
				plugin.$win = $(win);
				plugin.$doc = $(doc);
				plugin.$body = $('body');
				plugin.$html = $('html');

				plugin.$modal.attr({
					'role': 'dialog',
					'aria-modal': true,
				})
				plugin.$open.attr({
					'aria-expended': false,
					'aria-controls': plugin.$open.data('target')
				})
			},
			remoevCache: function() {
				var plugin = this;

				plugin.$modal
					.removeClass( plugin.options.activeClassName )
					.removeAttr('role aria-modal z-index tabindex');
				plugin.$modal.css('z-index','');
			},
			bindEvents: function() {
				var plugin = this;

				plugin.$close.on('click.' + plugin._name, function(e) {
					e.preventDefault();
					e.stopPropagation();
					var len = $('#pualugin-wrap');
					var offTop;
					if(len.length != 0){
						offTop = len.position().top;
					}
					plugin.close( $(this).closest(plugin.options.modal) , offTop);
				})

				plugin.$open !== null && plugin.$open.on('click.' + plugin._name, function(e) {
					e.preventDefault();
					e.stopPropagation();

					$('.modal__scrollarea').scrollTop(0);
					var scrollTopPosition = $(window).scrollTop();
					var lefts = $('.left').length > 0 ? $('.left').position().top : '';
					plugin.open( $(this).data('target'), $(this), scrollTopPosition, lefts);
				})

				plugin.$doc.on('click.' + plugin._name, function(e) {
					var len = $('#pualugin-wrap');
					var offTop;
					if ( plugin.$modal.is('.is-open') ) {
						if(len.length != 0){
							offTop = len.offset().top;
						}
						if (!plugin.$modalInner.is(e.target) && plugin.$modalInner.has(e.target).length === 0){
							plugin.close( e.target,offTop );
						}
					}
				})

				plugin.$modal.each(function() {
					var focusEl = COMMON.findFocusElement( this );
					var focusElFirst = $(focusEl[0]);
					var focusElLast = $(focusEl[1]);

					focusElFirst.on('keydown.' + plugin._name, function(e) {
						var keyCode = e.keyCode || e.which;
						if ( e.shiftKey && keyCode === 9 ) {
							e.preventDefault();
							focusElLast.focus();
						}
					})

					focusElLast.on('keydown.' + plugin._name, function(e) {
						var keyCode = e.keyCode || e.which;
						if ( keyCode == 9 && !e.shiftKey ) {
							e.preventDefault();
							focusElFirst.focus();
						}
					})
				})
			},
			unbindEvents: function () {
				var plugin = this;

				plugin.$open !== null && plugin.$open.off('.' + plugin._name);
				plugin.$close.off('.' + plugin._name);
				plugin.$doc.off('.' + plugin._name);

				plugin.$modal.each(function() {
					var focusEl = COMMON.findFocusElement( this );
					$(focusEl[0]).off('.' + plugin._name);
					$(focusEl[1]).off('.' + plugin._name);
				})
			},
			open: function( target, $clickTarget, stp, lefts) {
				var plugin = this;
				var $target = $(target);

				plugin.isMobile = plugin.$element.width() < plugin.options.mobileResolution && true;

				if ( plugin.options.closeExisting ) {
					plugin.$modal.not( $target ).each(function() {
						plugin.close( this );
					})
				} else {
					plugin.stackLevel += 10;
				}

				$clickTarget !== undefined && $clickTarget.attr('aria-expended', true);
				plugin.wrappingContents( 'open', stp, lefts );

				$target
					.addClass(plugin.options.activeClassName)
					.attr({
						'tabindex': 0,
						'z-index': plugin.stackLevel
					})
					.focus();
					$target.css('z-index','100');

				plugin.$body.trigger('modalOpen', [plugin, $target]);
				$('.modal__scrollarea').css('overflow-y','auto').scrollTop(0);
				if($target.has('.pualugin-tab')){
					$('.pualugin-tab ul li:eq(0) a').click();
				}
				if($target.has('.inner-tab__ul')){
					$('.inner-tab__ul li:eq(0) button').click();
				}
				if($target.has('.step-slide')){
					$('.step-slide').slick("slickGoTo", 0);
				}
			},
			close: function( target, offTop ) {
				var plugin = this;
				var $target = $(target);
				!plugin.options.closeExisting && (plugin.stackLevel -= 10);
				plugin.wrappingContents('close', offTop);

				$target
					.removeClass(plugin.options.activeClassName)
					.attr({
						'tabindex': '',
						'z-index': ''
					});
				$target.css('z-index','');
				plugin.$open.each(function() {
					var $this = $(this);
					$this.data('target') === '#' + $target.attr('id') && $this.attr('aria-expended', false).focus();
				})

				$('.modal__scrollarea').css('overflow-y','');

				plugin.$body.trigger('modalClose', [plugin, $target]);
			},
			wrappingContents: function( status , stp, lefts ) {
				var plugin = this;
				var scrolltopPo = stp;
				if ( status === 'open' ) {
					plugin.currentScrollTop = plugin.$win.scrollTop();
					if(headerTrue && pcTrue){
						if($(document).height() <= $(window).height()) {
							popPadding = 0;
							headerPaddingRight = headerPadding
						} else {
							popPadding = 6;
							headerPaddingRight = headerPadding + 6
						}
					}
					var wrap = $('<div></div>')
						.attr('id', plugin.options.contentsWrapClassName)
						.prependTo('body')
						.css({
							"position": "fixed",
							"top":scrolltopPo*-1,
							"width": "100%",
							//"height": "100%",
							"overflow": "hidden",
							"box-sizing": "border-box",
							"padding-right": popPadding
							//todo 크롬, 익스, 모바일 등 분기 필요
						});
					plugin.$html
						.find('body > *')
						.not('script, style, #__bs_notify__, .' + plugin.options.modalClassName)
						.not('#' + plugin.options.contentsWrapClassName)
						.appendTo(wrap);

					if($('.left').length != 0) {
						leftChecker = true;
						$('.left').css('top', lefts);
					}
					if(headerTrue && pcTrue){
						$('.wrap>.container:first-child .header').width(headerPaddingRight);
					}
					wrap.scrollTop( plugin.currentScrollTop );
				} else if ( status === 'close' ) {
					plugin.$element.find('#pualugin-wrap > *').prependTo('body')
					plugin.$element.find('#pualugin-wrap').remove();
					//$('html, body').scrollTop( plugin.currentScrollTop )
					$('html, body').scrollTop(scrolltopPo*-1)
					$(document).scrollTop(scrolltopPo*-1);
					if($('.left').length > 0) {
						leftChecker = false;
						$('.left').css('top','');
					}
					if(headerTrue && pcTrue){
						$('.wrap>.container:first-child .header').width(headerPadding);
					}
				}
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function () {
			$('body').modal();
		});

	})(jQuery, window, document, undefined)

	/*
	** Plugin - Override Slick
	*/
	/*
	(function ($, win, doc, undefined) {

		var pluginName = 'overrideSlick';

		var defaults = {

		}

		function Plugin(element, options) {
			this.element = element;
			this._defaults = defaults;
			this.options = $.extend( {}, this._defaults, options );
			this.init();
		}

		$.extend( Plugin.prototype, {
			init: function() {
				var plugin = this;
				plugin.buildCache();
				plugin.bindEvents();
			},
			buildCache: function() {
				var plugin = this;

				plugin.$element = $( plugin.element );
			},
			bindEvents: function() {
				var plugin = this;

                var initEvent = 'init.'+plugin._name,
                    refreshEvent = 'refresh.'+plugin._name,
                    beforeEvent = 'beforeChange.'+plugin._name,
                    breakpointEvent = 'breakpoint.'+plugin._name,
                    afterEvent = 'afterChange.'+plugin._name,
					destroyEvent = 'destroy.'+plugin._name;

				plugin.$element.on({
					[initEvent]: function(e, slick) {
						//initEvent
					},
					[beforeEvent]: function(e, slick) {
						//beforeEvent
					},
					[afterEvent]: function(e, slick, currentSlide) {
						//afterEvent
					},
					[refreshEvent]: function(e, slick) {
						// refreshEvent
					},
					[destroyEvent]: function(e, slick) {
						//destroyEvent
					}
				});
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function() {
			$('body').overrideSlick();
		})
	})(jQuery, window, document, undefined)
	*/

	/*
	** Plugin - Checkbox Control
	*/
	;
	(function ($, wino, doc, undefined) {
		var pluginName = 'checkbox'

		var defaults = {
			checkbox: '[data-element=checkbox__input]',
			all: '[data-element=checkbox__all]'
		}

		function Plugin( element, options ) {
			this.element = element;
			this._defaults = defaults;
			this.options = $.extend({}, this._defaults, options);
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function() {
				var plugin = this;

				plugin.buildCache();
				plugin.bindEvents();
			},
			buildCache: function() {
				var plugin = this;

				plugin.$element = $(plugin.element);
				plugin.$checkbox = plugin.$element.find( plugin.options.checkbox ).not(':disabled');
				plugin.$all = plugin.$element.find( plugin.options.all ).not(':disabled');
			},
			bindEvents: function() {
				var plugin = this;

				plugin.$checkbox.on('change', function(e) {
					plugin.checkedAction();
				})

				plugin.$all.on('change', function(e) {
					plugin.allCheckedAction( this );
				})
			},
			checkedAction: function() {
				var plugin = this;

				var checkboxLength = plugin.$checkbox.length,
					checkedLength = plugin.$checkbox.filter(':checked').length;

				if ( checkboxLength === checkedLength ) {
					plugin.$all.prop('checked', true);
				} else {
					plugin.$all.prop('checked') && plugin.$all.prop('checked', false);
				}
			},
			allCheckedAction: function( target ) {
				var plugin = this;

				if ( $(target).prop('checked') ) {
					plugin.$checkbox.prop('checked', true);
				} else {
					plugin.$checkbox.prop('checked', false);
				}
			}
		});

		$.fn[pluginName] = function ( options ) {
			return this.each(function () {
				if (!$.data(this, "plugin_" + pluginName)) {
					$.data(this, "plugin_" + pluginName, new Plugin(this, options || $(this).data('options')));
				}
			});
		}

		$(function() {
			$('[data-element=checkbox]').checkbox();
		})
	})(jQuery, window, document, undefined)

})(jQuery, window, document, undefined);
