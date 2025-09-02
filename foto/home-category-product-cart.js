(function(root) {
define("matchMedia", [], function() {
  return (function() {
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. MIT license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        if (!script) {
            document.head.appendChild(style);
        } else {
            script.parentNode.insertBefore(style, script);
        }

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function() {
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }

    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening = false,
        timeoutID = 0, // setTimeout for debouncing 'handleChange'
        queries = [], // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange = function(evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function() {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql = queries[i].mql,
                        listeners = queries[i].listeners || [],
                        matches = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            listeners[j].call(window, mql);
                        }
                    }
                }
            }, 30);
        };

    window.matchMedia = function(media) {
        var mql = localMatchMedia(media),
            listeners = [],
            index = 0;

        mql.addListener = function(listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql: mql,
                    listeners: listeners
                });
            }

            listeners.push(listener);
        };

        mql.removeListener = function(listener) {
            for (var i = 0, il = listeners.length; i < il; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };
}());

window.mediaCheck = function(options) {
    var mq;

    function mqChange(mq, options) {
        if (mq.matches) {
            if (typeof options.entry === "function") {
                options.entry();
            }
        } else if (typeof options.exit === "function") {
            options.exit();
        }
    };

    mq = window.matchMedia(options.media);

    mq.addListener(function() {
        mqChange(mq, options);
    });

    mqChange(mq, options);
};

return root.mediaCheck = mediaCheck;
  }).apply(root, arguments);
});
}(this));


define('text!Magento_Checkout/template/minicart/subtotal.html',[],function () { return '<!--\n/**\n * Copyright © Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class="subtotal">\n    <span class="label">\n        <!-- ko i18n: \'Subtotal\' --><!-- /ko -->\n\n<svg class="tooltip__trigger-icon" role="none" focusable="false" aria-hidden="true"><use xlink:href="#icon--tooltip"><svg id="icon--tooltip" viewBox="0 0 40 40"><path d="M20 0C9 0 0 9 0 20s9 20 20 20 20-9 20-20S31 0 20 0zm1.7 29.8h-2.9v-2.9h2.9v2.9zM26 17c-.7 1-1.6 1.9-2.5 2.7-.7.6-1.3 1.4-1.8 2.2-.3.8-.4 1.8-.4 2.7h-2.5c0-1.1.1-2.2.5-3.2.5-1.1 1.2-2.1 2.1-2.9l1.1-1.1c.3-.3.6-.6.8-1 .4-.6.6-1.2.6-1.9 0-.9-.3-1.7-.8-2.4-.7-.8-1.8-1.1-2.9-1-1.2-.1-2.5.6-3.2 1.8-.4.9-.6 1.9-.6 2.9H14c-.1-1.9.5-3.6 1.7-5 1.2-1.3 3-1.9 4.7-1.8 1.6-.1 3.2.5 4.5 1.6 1.1 1 1.7 2.5 1.7 4 0 .8-.2 1.7-.6 2.4z"></path></svg></use></svg>\n        <span class="tooltiptext" data-bind="i18n: \'This is what you are spending before shipping, taxes, and discounts.\'"></span>\n</span>\n    <!-- ko foreach: elems -->\n        <!-- ko template: getTemplate() --><!-- /ko -->\n    <!-- /ko -->\n</div>';});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('Magento_Catalog/js/view/image',[
    'uiComponent'
], function (Component) {
    'use strict';

    return Component.extend({
        /** @inheritdoc */
        initialize: function () {
            this._super();

            this.template = window.checkout.imageTemplate || this.template;
        }
    });
});


define('text!Magento_Catalog/template/product/image_with_borders.html',[],function () { return '<!--\n/**\n * Copyright © Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<span class="product-image-container" data-bind="style: {width: width/2 + \'px\'}">\n    <span class="product-image-wrapper"  data-bind="style: {\'padding-bottom\': height/width*100 + \'%\'}">\n        <img class="product-image-photo" data-bind="attr: {src: src, alt: alt}, style: {width: \'auto\', height: \'auto\'}" />\n    </span>\n</span>\n';});

/*!
 * jQuery UI Form Reset Mixin 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Form Reset Mixin
//>>group: Core
//>>description: Refresh input widgets when their form is reset
//>>docs: http://api.jqueryui.com/form-reset-mixin/

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/form-reset-mixin',[
            "jquery",
            "./form",
            "./version"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    return $.ui.formResetMixin = {
        _formResetHandler: function() {
            var form = $( this );

            // Wait for the form reset to actually happen before refreshing
            setTimeout( function() {
                var instances = form.data( "ui-form-reset-instances" );
                $.each( instances, function() {
                    this.refresh();
                } );
            } );
        },

        _bindFormResetHandler: function() {
            this.form = this.element._form();
            if ( !this.form.length ) {
                return;
            }

            var instances = this.form.data( "ui-form-reset-instances" ) || [];
            if ( !instances.length ) {

                // We don't use _on() here because we use a single event handler per form
                this.form.on( "reset.ui-form-reset", this._formResetHandler );
            }
            instances.push( this );
            this.form.data( "ui-form-reset-instances", instances );
        },

        _unbindFormResetHandler: function() {
            if ( !this.form.length ) {
                return;
            }

            var instances = this.form.data( "ui-form-reset-instances" );
            instances.splice( $.inArray( this, instances ), 1 );
            if ( instances.length ) {
                this.form.data( "ui-form-reset-instances", instances );
            } else {
                this.form
                    .removeData( "ui-form-reset-instances" )
                    .off( "reset.ui-form-reset" );
            }
        }
    };

} );

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('mage/tabs',[
    'jquery',
    'jquery-ui-modules/widget',
    'jquery/ui-modules/widgets/tabs',
    'mage/mage',
    'mage/collapsible'
], function ($) {
    'use strict';

    $.widget('mage.tabs', {
        options: {
            active: 0,
            disabled: [],
            openOnFocus: true,
            collapsible: false,
            collapsibleElement: '[data-role=collapsible]',
            header: '[data-role=title]',
            content: '[data-role=content]',
            trigger: '[data-role=trigger]',
            closedState: null,
            openedState: null,
            disabledState: null,
            ajaxUrlElement: '[data-ajax=true]',
            ajaxContent: false,
            loadingClass: null,
            saveState: false,
            animate: false,
            icons: {
                activeHeader: null,
                header: null
            }
        },

        /**
         * @private
         */
        _create: function () {
            if (typeof this.options.disabled === 'string') {
                this.options.disabled = this.options.disabled.split(' ').map(function (item) {
                    return parseInt(item, 10);
                });
            }
            this._processPanels();
            this._handleDeepLinking();
            this._processTabIndex();
            this._closeOthers();
            this._bind();
        },

        /**
         * @private
         */
        _destroy: function () {
            $.each(this.collapsibles, function () {
                $(this).collapsible('destroy');
            });
        },

        /**
         * If deep linking is used, all sections must be closed but the one that contains the anchor.
         * @private
         */
        _handleDeepLinking: function () {
            var self = this,
                anchor = window.location.hash,
                isValid = $.mage.isValidSelector(anchor),
                anchorId = anchor.replace('#', '');

            if (anchor && isValid) {
                $.each(self.contents, function (i) {
                    if ($(this).attr('id') === anchorId || $(this).find('#' + anchorId).length) {
                        self.collapsibles.not(self.collapsibles.eq(i)).collapsible('forceDeactivate');

                        return false;
                    }
                });
            }
        },

        /**
         * When the widget gets instantiated, the first tab that is not disabled receive focusable property
         * All tabs receive tabIndex 0
         * @private
         */
        _processTabIndex: function () {
            var self = this;

            self.triggers.attr('tabIndex', 0);
            $.each(this.collapsibles, function (i) {
                self.triggers.attr('tabIndex', 0);
                self.triggers.eq(i).attr('tabIndex', 0);
            });
        },

        /**
         * Prepare the elements for instantiating the collapsible widget
         * @private
         */
        _processPanels: function () {
            var isNotNested = this._isNotNested.bind(this);

            this.contents = this.element
                .find(this.options.content)
                .filter(isNotNested);

            this.collapsibles =  this.element
                .find(this.options.collapsibleElement)
                .filter(isNotNested);

            this.collapsibles
                .attr('role', 'presentation')
                .parent()
                .attr('role', 'tablist');

            this.headers = this.element
                .find(this.options.header)
                .filter(isNotNested);

            if (this.headers.length === 0) {
                this.headers = this.collapsibles;
            }
            this.triggers = this.element
                .find(this.options.trigger)
                .filter(isNotNested);

            if (this.triggers.length === 0) {
                this.triggers = this.headers;
            }
            this._callCollapsible();
        },

        /**
         * Checks if element is not in nested container to keep the correct scope of collapsible
         * @param {Number} index
         * @param {HTMLElement} element
         * @private
         * @return {Boolean}
         */
        _isNotNested: function (index, element) {
            var parentContent = $(element).parents(this.options.content);

            return !parentContent.length || !this.element.find(parentContent).length;
        },

        /**
         * Setting the disabled and active tabs and calling instantiation of collapsible
         * @private
         */
        _callCollapsible: function () {
            var self = this,
                disabled = false,
                active = false;

            $.each(this.collapsibles, function (i) {
                disabled = active = false;

                if ($.inArray(i, self.options.disabled) !== -1) {
                    disabled = true;
                }

                if (i === self.options.active) {
                    active = true;
                }
                self._instantiateCollapsible(this, i, active, disabled);
            });
        },

        /**
         * Instantiate collapsible.
         *
         * @param {HTMLElement} element
         * @param {Number} index
         * @param {*} active
         * @param {*} disabled
         * @private
         */
        _instantiateCollapsible: function (element, index, active, disabled) {
            $(element).collapsible(
                $.extend({}, this.options, {
                    active: active,
                    disabled: disabled,
                    header: this.headers.eq(index),
                    content: this.contents.eq(index),
                    trigger: this.triggers.eq(index)
                })
            );
        },

        /**
         * Adding callback to close others tabs when one gets opened
         * @private
         */
        _closeOthers: function () {
            var self = this;

            $.each(this.collapsibles, function () {
                $(this).on('beforeOpen', function () {
                    self.collapsibles.not(this).collapsible('forceDeactivate');
                });
            });
        },

        /**
         * @param {*} index
         */
        activate: function (index) {
            this._toggleActivate('activate', index);
        },

        /**
         * @param {*} index
         */
        deactivate: function (index) {
            this._toggleActivate('deactivate', index);
        },

        /**
         * @param {*} action
         * @param {*} index
         * @private
         */
        _toggleActivate: function (action, index) {
            this.collapsibles.eq(index).collapsible(action);
        },

        /**
         * @param {*} index
         */
        disable: function (index) {
            this._toggleEnable('disable', index);
        },

        /**
         * @param {*} index
         */
        enable: function (index) {
            this._toggleEnable('enable', index);
        },

        /**
         * @param {*} action
         * @param {*} index
         * @private
         */
        _toggleEnable: function (action, index) {
            var self = this;

            if (Array.isArray(index)) {
                $.each(index, function () {
                    self.collapsibles.eq(this).collapsible(action);
                });
            } else if (index === undefined) {
                this.collapsibles.collapsible(action);
            } else {
                this.collapsibles.eq(index).collapsible(action);
            }
        },

        /**
         * @param {jQuery.Event} event
         * @private
         */
        _keydown: function (event) {
            var self = this,
                keyCode, toFocus, toFocusIndex, enabledTriggers, length, currentIndex, nextToFocus;

            if (event.altKey || event.ctrlKey) {
                return;
            }
            keyCode = $.ui.keyCode;
            toFocus = false;
            enabledTriggers = [];

            $.each(this.triggers, function () {
                if (!self.collapsibles.eq(self.triggers.index($(this))).collapsible('option', 'disabled')) {
                    enabledTriggers.push(this);
                }
            });
            length = $(enabledTriggers).length;
            currentIndex = $(enabledTriggers).index(event.target);

            /**
             * @param {String} direction
             * @return {*}
             */
            nextToFocus = function (direction) {
                if (length > 0) {
                    if (direction === 'right') {
                        toFocusIndex = (currentIndex + 1) % length;
                    } else {
                        toFocusIndex = (currentIndex + length - 1) % length;
                    }

                    return enabledTriggers[toFocusIndex];
                }

                return event.target;
            };

            switch (event.keyCode) {
                case keyCode.RIGHT:
                case keyCode.DOWN:
                    toFocus = nextToFocus('right');
                    break;

                case keyCode.LEFT:
                case keyCode.UP:
                    toFocus = nextToFocus('left');
                    break;

                case keyCode.HOME:
                    toFocus = enabledTriggers[0];
                    break;

                case keyCode.END:
                    toFocus = enabledTriggers[length - 1];
                    break;
            }

            if (toFocus) {
                toFocusIndex = this.triggers.index(toFocus);
                $(event.target).attr('tabIndex', -1);
                $(toFocus).attr('tabIndex', 0);
                toFocus.focus();

                if (this.options.openOnFocus) {
                    this.activate(toFocusIndex);
                }
                event.preventDefault();
            }
        },

        /**
         * @private
         */
        _bind: function () {
            var events = {
                keydown: '_keydown'
            };

            this._off(this.triggers);
            this._on(this.triggers, events);
        }
    });

    return $.mage.tabs;
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('mage/accordion',[
    'jquery',
    'mage/tabs'
], function ($, tabs) {
    'use strict';

    $.widget('mage.accordion', tabs, {
        options: {
            active: [0],
            multipleCollapsible: false,
            openOnFocus: false
        },

        /**
         * @private
         */
        _callCollapsible: function () {
            var self = this,
                disabled = false,
                active = false;

            if (typeof this.options.active === 'string') {
                this.options.active = this.options.active.split(' ').map(function (item) {
                    return parseInt(item, 10);
                });
            }

            $.each(this.collapsibles, function (i) {
                disabled = active = false;

                if ($.inArray(i, self.options.disabled) !== -1) {
                    disabled = true;
                }

                if ($.inArray(i, self.options.active) !== -1) {
                    active = true;
                }
                self._instantiateCollapsible(this, i, active, disabled);
            });
        },

        /**
         * Overwrites default functionality to provide the option to activate/deactivate multiple sections simultaneous
         * @param {*} action
         * @param {*} index
         * @private
         */
        _toggleActivate: function (action, index) {
            var self = this;

            if (Array.isArray(index && this.options.multipleCollapsible)) {
                $.each(index, function () {
                    self.collapsibles.eq(this).collapsible(action);
                });
            } else if (index === undefined && this.options.multipleCollapsible) {
                this.collapsibles.collapsible(action);
            } else {
                this._super(action, index);
            }
        },

        /**
         * If the Accordion allows multiple section to be active at the same time, if deep linking is used
         * sections that don't contain the id from anchor shouldn't be closed, otherwise the accordion uses the
         * tabs behavior
         * @private
         */
        _handleDeepLinking: function () {
            if (!this.options.multipleCollapsible) {
                this._super();
            }
        },

        /**
         * Prevent default behavior that closes the other sections when one gets activated if the Accordion allows
         * multiple sections simultaneous
         * @private
         */
        _closeOthers: function () {
            var self = this;

            if (!this.options.multipleCollapsible) {
                $.each(this.collapsibles, function () {
                    $(this).on('beforeOpen', function () {
                        self.collapsibles.not(this).collapsible('deactivate');
                    });
                });
            }
            $.each(this.collapsibles, function () {
                $(this).on('beforeOpen', function () {
                    var section = $(this);

                    section.addClass('allow').prevAll().addClass('allow');
                    section.nextAll().removeClass('allow');
                });
            });
        }
    });

    return $.mage.accordion;
});

define('WeltPixel_SearchAutoComplete/js/searchautocomplete',['jquery', 'domReady'], function ($) {
    "use strict";
    var xhr = null;
    var searchAutoComplete =
        {
            ajaxSearch: function (e) {
                var q = $("#search").val();

                var config = {
                    baseURL: window.baseURL,
                    loaderAjax: window.loaderAjax
                };

                /* if there is a previous ajax request, then we abort it and then set xhr to null */
                if( xhr != null ) {
                    xhr.abort();
                    xhr = null;
                }

                xhr = $.ajax({
                    url: config.baseURL + 'searchautocomplete',
                    dataType: 'json',
                    type: 'post',
                    data: { q : q },
                    success: function(data) {
                        $('.searchautocomplete').show();
                        $('.searchautocomplete').find('.prod-container').html(data.results);
                        $('.searchautocomplete').find('.cat-container').html(data.categoryResults);
                        $( ".wpx-footer" ).text(config.resultFooter);
                        if(data.suggestions > 0) {
                            $('.wpx-search-autocomplete ul li').each(function() {
                                if (!$.trim($(this).text())) {
                                    $(this).remove();
                                }
                            });
                            $('.wpx-search-autocomplete ul li').css('cursor', 'pointer');
                            $('.wpx-search-autocomplete ul li').click(function(){
                                $('#search').val($(this).find('.qs-option-name').text());
                                $('#search_mini_form').submit();
                            });
                        } else {
                            $('.wpx-search-autocomplete ul li').css('cursor', 'default');
                        }
                    },
                    complete: function(){
                        //Finished processing, hide the Progress!
                        $(".search .control").removeClass("loader-ajax").css('background-image', 'none');
                        var containerWidth     =   $('.container-autocomplete').width(),
                            elementWidth       =   $('.product-list li').width(),
                            elementsDisplayed  =   Math.floor(containerWidth / elementWidth),
                            screenWidth        =   $(window).width();

                        if(screenWidth > 768){
                            $('.modal .horizontally .product-list li').each(function( index ) {
                                if(index == elementsDisplayed){
                                    var cont = elementsDisplayed -1;
                                    $(".modal .horizontally .product-list li:gt(" + cont  + ")").hide();
                                }else{
                                    $(".modal .horizontally .product-list li:gt(" + cont  + ")").show();
                                }
                            });
                        }
                    }
                });
            }
        };

    return searchAutoComplete;
});

/*!
 * jQuery UI Mouse 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/mouse',[
            "jquery",
            "../ie",
            "../version",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    var mouseHandled = false;
    $( document ).on( "mouseup", function() {
        mouseHandled = false;
    } );

    return $.widget( "ui.mouse", {
        version: "1.13.2",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var that = this;

            this.element
                .on( "mousedown." + this.widgetName, function( event ) {
                    return that._mouseDown( event );
                } )
                .on( "click." + this.widgetName, function( event ) {
                    if ( true === $.data( event.target, that.widgetName + ".preventClickEvent" ) ) {
                        $.removeData( event.target, that.widgetName + ".preventClickEvent" );
                        event.stopImmediatePropagation();
                        return false;
                    }
                } );

            this.started = false;
        },

        // TODO: make sure destroying one instance of mouse doesn't mess with
        // other instances of mouse
        _mouseDestroy: function() {
            this.element.off( "." + this.widgetName );
            if ( this._mouseMoveDelegate ) {
                this.document
                    .off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
                    .off( "mouseup." + this.widgetName, this._mouseUpDelegate );
            }
        },

        _mouseDown: function( event ) {

            // don't let more than one widget handle mouseStart
            if ( mouseHandled ) {
                return;
            }

            this._mouseMoved = false;

            // We may have missed mouseup (out of window)
            if ( this._mouseStarted ) {
                this._mouseUp( event );
            }

            this._mouseDownEvent = event;

            var that = this,
                btnIsLeft = ( event.which === 1 ),

                // event.target.nodeName works around a bug in IE 8 with
                // disabled inputs (#7620)
                elIsCancel = ( typeof this.options.cancel === "string" && event.target.nodeName ?
                    $( event.target ).closest( this.options.cancel ).length : false );
            if ( !btnIsLeft || elIsCancel || !this._mouseCapture( event ) ) {
                return true;
            }

            this.mouseDelayMet = !this.options.delay;
            if ( !this.mouseDelayMet ) {
                this._mouseDelayTimer = setTimeout( function() {
                    that.mouseDelayMet = true;
                }, this.options.delay );
            }

            if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
                this._mouseStarted = ( this._mouseStart( event ) !== false );
                if ( !this._mouseStarted ) {
                    event.preventDefault();
                    return true;
                }
            }

            // Click event may never have fired (Gecko & Opera)
            if ( true === $.data( event.target, this.widgetName + ".preventClickEvent" ) ) {
                $.removeData( event.target, this.widgetName + ".preventClickEvent" );
            }

            // These delegates are required to keep context
            this._mouseMoveDelegate = function( event ) {
                return that._mouseMove( event );
            };
            this._mouseUpDelegate = function( event ) {
                return that._mouseUp( event );
            };

            this.document
                .on( "mousemove." + this.widgetName, this._mouseMoveDelegate )
                .on( "mouseup." + this.widgetName, this._mouseUpDelegate );

            event.preventDefault();

            mouseHandled = true;
            return true;
        },

        _mouseMove: function( event ) {

            // Only check for mouseups outside the document if you've moved inside the document
            // at least once. This prevents the firing of mouseup in the case of IE<9, which will
            // fire a mousemove event if content is placed under the cursor. See #7778
            // Support: IE <9
            if ( this._mouseMoved ) {

                // IE mouseup check - mouseup happened when mouse was out of window
                if ( $.ui.ie && ( !document.documentMode || document.documentMode < 9 ) &&
                    !event.button ) {
                    return this._mouseUp( event );

                    // Iframe mouseup check - mouseup occurred in another document
                } else if ( !event.which ) {

                    // Support: Safari <=8 - 9
                    // Safari sets which to 0 if you press any of the following keys
                    // during a drag (#14461)
                    if ( event.originalEvent.altKey || event.originalEvent.ctrlKey ||
                        event.originalEvent.metaKey || event.originalEvent.shiftKey ) {
                        this.ignoreMissingWhich = true;
                    } else if ( !this.ignoreMissingWhich ) {
                        return this._mouseUp( event );
                    }
                }
            }

            if ( event.which || event.button ) {
                this._mouseMoved = true;
            }

            if ( this._mouseStarted ) {
                this._mouseDrag( event );
                return event.preventDefault();
            }

            if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
                this._mouseStarted =
                    ( this._mouseStart( this._mouseDownEvent, event ) !== false );
                if ( this._mouseStarted ) {
                    this._mouseDrag( event );
                } else {
                    this._mouseUp( event );
                }
            }

            return !this._mouseStarted;
        },

        _mouseUp: function( event ) {
            this.document
                .off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
                .off( "mouseup." + this.widgetName, this._mouseUpDelegate );

            if ( this._mouseStarted ) {
                this._mouseStarted = false;

                if ( event.target === this._mouseDownEvent.target ) {
                    $.data( event.target, this.widgetName + ".preventClickEvent", true );
                }

                this._mouseStop( event );
            }

            if ( this._mouseDelayTimer ) {
                clearTimeout( this._mouseDelayTimer );
                delete this._mouseDelayTimer;
            }

            this.ignoreMissingWhich = false;
            mouseHandled = false;
            event.preventDefault();
        },

        _mouseDistanceMet: function( event ) {
            return ( Math.max(
                    Math.abs( this._mouseDownEvent.pageX - event.pageX ),
                    Math.abs( this._mouseDownEvent.pageY - event.pageY )
                ) >= this.options.distance
            );
        },

        _mouseDelayMet: function( /* event */ ) {
            return this.mouseDelayMet;
        },

        // These are placeholder methods, to be overriden by extending plugin
        _mouseStart: function( /* event */ ) {},
        _mouseDrag: function( /* event */ ) {},
        _mouseStop: function( /* event */ ) {},
        _mouseCapture: function( /* event */ ) {
            return true;
        }
    } );

} );

/*!
 * jQuery UI Draggable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Draggable
//>>group: Interactions
//>>description: Enables dragging functionality for any element.
//>>docs: http://api.jqueryui.com/draggable/
//>>demos: http://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/draggable',[
            "jquery",
            "./mouse",
            "../data",
            "../plugin",
            "../safe-active-element",
            "../safe-blur",
            "../scroll-parent",
            "../version",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    $.widget( "ui.draggable", $.ui.mouse, {
        version: "1.13.2",
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false,

            // Callbacks
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {

            if ( this.options.helper === "original" ) {
                this._setPositionRelative();
            }
            if ( this.options.addClasses ) {
                this._addClass( "ui-draggable" );
            }
            this._setHandleClassName();

            this._mouseInit();
        },

        _setOption: function( key, value ) {
            this._super( key, value );
            if ( key === "handle" ) {
                this._removeHandleClassName();
                this._setHandleClassName();
            }
        },

        _destroy: function() {
            if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
                this.destroyOnClear = true;
                return;
            }
            this._removeHandleClassName();
            this._mouseDestroy();
        },

        _mouseCapture: function( event ) {
            var o = this.options;

            // Among others, prevent a drag on a resizable-handle
            if ( this.helper || o.disabled ||
                $( event.target ).closest( ".ui-resizable-handle" ).length > 0 ) {
                return false;
            }

            //Quit if we're not on a valid handle
            this.handle = this._getHandle( event );
            if ( !this.handle ) {
                return false;
            }

            this._blurActiveElement( event );

            this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

            return true;

        },

        _blockFrames: function( selector ) {
            this.iframeBlocks = this.document.find( selector ).map( function() {
                var iframe = $( this );

                return $( "<div>" )
                    .css( "position", "absolute" )
                    .appendTo( iframe.parent() )
                    .outerWidth( iframe.outerWidth() )
                    .outerHeight( iframe.outerHeight() )
                    .offset( iframe.offset() )[ 0 ];
            } );
        },

        _unblockFrames: function() {
            if ( this.iframeBlocks ) {
                this.iframeBlocks.remove();
                delete this.iframeBlocks;
            }
        },

        _blurActiveElement: function( event ) {
            var activeElement = $.ui.safeActiveElement( this.document[ 0 ] ),
                target = $( event.target );

            // Don't blur if the event occurred on an element that is within
            // the currently focused element
            // See #10527, #12472
            if ( target.closest( activeElement ).length ) {
                return;
            }

            // Blur any element that currently has focus, see #4261
            $.ui.safeBlur( activeElement );
        },

        _mouseStart: function( event ) {

            var o = this.options;

            //Create and append the visible helper
            this.helper = this._createHelper( event );

            this._addClass( this.helper, "ui-draggable-dragging" );

            //Cache the helper size
            this._cacheHelperProportions();

            //If ddmanager is used for droppables, set the global draggable
            if ( $.ui.ddmanager ) {
                $.ui.ddmanager.current = this;
            }

            /*
             * - Position generation -
             * This block generates everything position related - it's the core of draggables.
             */

            //Cache the margins of the original element
            this._cacheMargins();

            //Store the helper's css position
            this.cssPosition = this.helper.css( "position" );
            this.scrollParent = this.helper.scrollParent( true );
            this.offsetParent = this.helper.offsetParent();
            this.hasFixedAncestor = this.helper.parents().filter( function() {
                return $( this ).css( "position" ) === "fixed";
            } ).length > 0;

            //The element's absolute position on the page minus margins
            this.positionAbs = this.element.offset();
            this._refreshOffsets( event );

            //Generate the original position
            this.originalPosition = this.position = this._generatePosition( event, false );
            this.originalPageX = event.pageX;
            this.originalPageY = event.pageY;

            //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
            if ( o.cursorAt ) {
                this._adjustOffsetFromHelper( o.cursorAt );
            }

            //Set a containment if given in the options
            this._setContainment();

            //Trigger event + callbacks
            if ( this._trigger( "start", event ) === false ) {
                this._clear();
                return false;
            }

            //Recache the helper size
            this._cacheHelperProportions();

            //Prepare the droppable offsets
            if ( $.ui.ddmanager && !o.dropBehaviour ) {
                $.ui.ddmanager.prepareOffsets( this, event );
            }

            // Execute the drag once - this causes the helper not to be visible before getting its
            // correct position
            this._mouseDrag( event, true );

            // If the ddmanager is used for droppables, inform the manager that dragging has started
            // (see #5003)
            if ( $.ui.ddmanager ) {
                $.ui.ddmanager.dragStart( this, event );
            }

            return true;
        },

        _refreshOffsets: function( event ) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: false,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            };

            this.offset.click = {
                left: event.pageX - this.offset.left,
                top: event.pageY - this.offset.top
            };
        },

        _mouseDrag: function( event, noPropagation ) {

            // reset any necessary cached properties (see #5009)
            if ( this.hasFixedAncestor ) {
                this.offset.parent = this._getParentOffset();
            }

            //Compute the helpers position
            this.position = this._generatePosition( event, true );
            this.positionAbs = this._convertPositionTo( "absolute" );

            //Call plugins and callbacks and use the resulting position if something is returned
            if ( !noPropagation ) {
                var ui = this._uiHash();
                if ( this._trigger( "drag", event, ui ) === false ) {
                    this._mouseUp( new $.Event( "mouseup", event ) );
                    return false;
                }
                this.position = ui.position;
            }

            this.helper[ 0 ].style.left = this.position.left + "px";
            this.helper[ 0 ].style.top = this.position.top + "px";

            if ( $.ui.ddmanager ) {
                $.ui.ddmanager.drag( this, event );
            }

            return false;
        },

        _mouseStop: function( event ) {

            //If we are using droppables, inform the manager about the drop
            var that = this,
                dropped = false;
            if ( $.ui.ddmanager && !this.options.dropBehaviour ) {
                dropped = $.ui.ddmanager.drop( this, event );
            }

            //if a drop comes from outside (a sortable)
            if ( this.dropped ) {
                dropped = this.dropped;
                this.dropped = false;
            }

            if ( ( this.options.revert === "invalid" && !dropped ) ||
                ( this.options.revert === "valid" && dropped ) ||
                this.options.revert === true || ( typeof this.options.revert === "function" &&
                    this.options.revert.call( this.element, dropped ) )
            ) {
                $( this.helper ).animate(
                    this.originalPosition,
                    parseInt( this.options.revertDuration, 10 ),
                    function() {
                        if ( that._trigger( "stop", event ) !== false ) {
                            that._clear();
                        }
                    }
                );
            } else {
                if ( this._trigger( "stop", event ) !== false ) {
                    this._clear();
                }
            }

            return false;
        },

        _mouseUp: function( event ) {
            this._unblockFrames();

            // If the ddmanager is used for droppables, inform the manager that dragging has stopped
            // (see #5003)
            if ( $.ui.ddmanager ) {
                $.ui.ddmanager.dragStop( this, event );
            }

            // Only need to focus if the event occurred on the draggable itself, see #10527
            if ( this.handleElement.is( event.target ) ) {

                // The interaction is over; whether or not the click resulted in a drag,
                // focus the element
                this.element.trigger( "focus" );
            }

            return $.ui.mouse.prototype._mouseUp.call( this, event );
        },

        cancel: function() {

            if ( this.helper.is( ".ui-draggable-dragging" ) ) {
                this._mouseUp( new $.Event( "mouseup", { target: this.element[ 0 ] } ) );
            } else {
                this._clear();
            }

            return this;

        },

        _getHandle: function( event ) {
            return this.options.handle ?
                !!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
                true;
        },

        _setHandleClassName: function() {
            this.handleElement = this.options.handle ?
                this.element.find( this.options.handle ) : this.element;
            this._addClass( this.handleElement, "ui-draggable-handle" );
        },

        _removeHandleClassName: function() {
            this._removeClass( this.handleElement, "ui-draggable-handle" );
        },

        _createHelper: function( event ) {

            var o = this.options,
                helperIsFunction = typeof o.helper === "function",
                helper = helperIsFunction ?
                    $( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
                    ( o.helper === "clone" ?
                        this.element.clone().removeAttr( "id" ) :
                        this.element );

            if ( !helper.parents( "body" ).length ) {
                helper.appendTo( ( o.appendTo === "parent" ?
                    this.element[ 0 ].parentNode :
                    o.appendTo ) );
            }

            // Http://bugs.jqueryui.com/ticket/9446
            // a helper function can return the original element
            // which wouldn't have been set to relative in _create
            if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
                this._setPositionRelative();
            }

            if ( helper[ 0 ] !== this.element[ 0 ] &&
                !( /(fixed|absolute)/ ).test( helper.css( "position" ) ) ) {
                helper.css( "position", "absolute" );
            }

            return helper;

        },

        _setPositionRelative: function() {
            if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
                this.element[ 0 ].style.position = "relative";
            }
        },

        _adjustOffsetFromHelper: function( obj ) {
            if ( typeof obj === "string" ) {
                obj = obj.split( " " );
            }
            if ( Array.isArray( obj ) ) {
                obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
            }
            if ( "left" in obj ) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ( "right" in obj ) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ( "top" in obj ) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ( "bottom" in obj ) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },

        _isRootNode: function( element ) {
            return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
        },

        _getParentOffset: function() {

            //Get the offsetParent and cache its position
            var po = this.offsetParent.offset(),
                document = this.document[ 0 ];

            // This is a special case where we need to modify a offset calculated on start, since the
            // following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the
            // next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
            // the document, which means that the scroll is included in the initial calculation of the
            // offset of the parent, and never recalculated upon drag
            if ( this.cssPosition === "absolute" && this.scrollParent[ 0 ] !== document &&
                $.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) {
                po.left += this.scrollParent.scrollLeft();
                po.top += this.scrollParent.scrollTop();
            }

            if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
                po = { top: 0, left: 0 };
            }

            return {
                top: po.top + ( parseInt( this.offsetParent.css( "borderTopWidth" ), 10 ) || 0 ),
                left: po.left + ( parseInt( this.offsetParent.css( "borderLeftWidth" ), 10 ) || 0 )
            };

        },

        _getRelativeOffset: function() {
            if ( this.cssPosition !== "relative" ) {
                return { top: 0, left: 0 };
            }

            var p = this.element.position(),
                scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

            return {
                top: p.top - ( parseInt( this.helper.css( "top" ), 10 ) || 0 ) +
                    ( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
                left: p.left - ( parseInt( this.helper.css( "left" ), 10 ) || 0 ) +
                    ( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
            };

        },

        _cacheMargins: function() {
            this.margins = {
                left: ( parseInt( this.element.css( "marginLeft" ), 10 ) || 0 ),
                top: ( parseInt( this.element.css( "marginTop" ), 10 ) || 0 ),
                right: ( parseInt( this.element.css( "marginRight" ), 10 ) || 0 ),
                bottom: ( parseInt( this.element.css( "marginBottom" ), 10 ) || 0 )
            };
        },

        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },

        _setContainment: function() {

            var isUserScrollable, c, ce,
                o = this.options,
                document = this.document[ 0 ];

            this.relativeContainer = null;

            if ( !o.containment ) {
                this.containment = null;
                return;
            }

            if ( o.containment === "window" ) {
                this.containment = [
                    $( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
                    $( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                    $( window ).scrollLeft() + $( window ).width() -
                    this.helperProportions.width - this.margins.left,
                    $( window ).scrollTop() +
                    ( $( window ).height() || document.body.parentNode.scrollHeight ) -
                    this.helperProportions.height - this.margins.top
                ];
                return;
            }

            if ( o.containment === "document" ) {
                this.containment = [
                    0,
                    0,
                    $( document ).width() - this.helperProportions.width - this.margins.left,
                    ( $( document ).height() || document.body.parentNode.scrollHeight ) -
                    this.helperProportions.height - this.margins.top
                ];
                return;
            }

            if ( o.containment.constructor === Array ) {
                this.containment = o.containment;
                return;
            }

            if ( o.containment === "parent" ) {
                o.containment = this.helper[ 0 ].parentNode;
            }

            c = $( o.containment );
            ce = c[ 0 ];

            if ( !ce ) {
                return;
            }

            isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

            this.containment = [
                ( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) +
                ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
                ( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) +
                ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
                ( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
                ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
                ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
                this.helperProportions.width -
                this.margins.left -
                this.margins.right,
                ( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
                ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
                ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
                this.helperProportions.height -
                this.margins.top -
                this.margins.bottom
            ];
            this.relativeContainer = c;
        },

        _convertPositionTo: function( d, pos ) {

            if ( !pos ) {
                pos = this.position;
            }

            var mod = d === "absolute" ? 1 : -1,
                scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

            return {
                top: (

                    // The absolute mouse position
                    pos.top	+

                    // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.relative.top * mod +

                    // The offsetParent's offset without borders (offset + border)
                    this.offset.parent.top * mod -
                    ( ( this.cssPosition === "fixed" ?
                        -this.offset.scroll.top :
                        ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod )
                ),
                left: (

                    // The absolute mouse position
                    pos.left +

                    // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.relative.left * mod +

                    // The offsetParent's offset without borders (offset + border)
                    this.offset.parent.left * mod	-
                    ( ( this.cssPosition === "fixed" ?
                        -this.offset.scroll.left :
                        ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod )
                )
            };

        },

        _generatePosition: function( event, constrainPosition ) {

            var containment, co, top, left,
                o = this.options,
                scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
                pageX = event.pageX,
                pageY = event.pageY;

            // Cache the scroll
            if ( !scrollIsRootNode || !this.offset.scroll ) {
                this.offset.scroll = {
                    top: this.scrollParent.scrollTop(),
                    left: this.scrollParent.scrollLeft()
                };
            }

            /*
             * - Position constraining -
             * Constrain the position to a mix of grid, containment.
             */

            // If we are not dragging yet, we won't check for options
            if ( constrainPosition ) {
                if ( this.containment ) {
                    if ( this.relativeContainer ) {
                        co = this.relativeContainer.offset();
                        containment = [
                            this.containment[ 0 ] + co.left,
                            this.containment[ 1 ] + co.top,
                            this.containment[ 2 ] + co.left,
                            this.containment[ 3 ] + co.top
                        ];
                    } else {
                        containment = this.containment;
                    }

                    if ( event.pageX - this.offset.click.left < containment[ 0 ] ) {
                        pageX = containment[ 0 ] + this.offset.click.left;
                    }
                    if ( event.pageY - this.offset.click.top < containment[ 1 ] ) {
                        pageY = containment[ 1 ] + this.offset.click.top;
                    }
                    if ( event.pageX - this.offset.click.left > containment[ 2 ] ) {
                        pageX = containment[ 2 ] + this.offset.click.left;
                    }
                    if ( event.pageY - this.offset.click.top > containment[ 3 ] ) {
                        pageY = containment[ 3 ] + this.offset.click.top;
                    }
                }

                if ( o.grid ) {

                    //Check for grid elements set to 0 to prevent divide by 0 error causing invalid
                    // argument errors in IE (see ticket #6950)
                    top = o.grid[ 1 ] ? this.originalPageY + Math.round( ( pageY -
                        this.originalPageY ) / o.grid[ 1 ] ) * o.grid[ 1 ] : this.originalPageY;
                    pageY = containment ? ( ( top - this.offset.click.top >= containment[ 1 ] ||
                        top - this.offset.click.top > containment[ 3 ] ) ?
                        top :
                        ( ( top - this.offset.click.top >= containment[ 1 ] ) ?
                            top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) : top;

                    left = o.grid[ 0 ] ? this.originalPageX +
                        Math.round( ( pageX - this.originalPageX ) / o.grid[ 0 ] ) * o.grid[ 0 ] :
                        this.originalPageX;
                    pageX = containment ? ( ( left - this.offset.click.left >= containment[ 0 ] ||
                        left - this.offset.click.left > containment[ 2 ] ) ?
                        left :
                        ( ( left - this.offset.click.left >= containment[ 0 ] ) ?
                            left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) : left;
                }

                if ( o.axis === "y" ) {
                    pageX = this.originalPageX;
                }

                if ( o.axis === "x" ) {
                    pageY = this.originalPageY;
                }
            }

            return {
                top: (

                    // The absolute mouse position
                    pageY -

                    // Click offset (relative to the element)
                    this.offset.click.top -

                    // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.relative.top -

                    // The offsetParent's offset without borders (offset + border)
                    this.offset.parent.top +
                    ( this.cssPosition === "fixed" ?
                        -this.offset.scroll.top :
                        ( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
                ),
                left: (

                    // The absolute mouse position
                    pageX -

                    // Click offset (relative to the element)
                    this.offset.click.left -

                    // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.relative.left -

                    // The offsetParent's offset without borders (offset + border)
                    this.offset.parent.left +
                    ( this.cssPosition === "fixed" ?
                        -this.offset.scroll.left :
                        ( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
                )
            };

        },

        _clear: function() {
            this._removeClass( this.helper, "ui-draggable-dragging" );
            if ( this.helper[ 0 ] !== this.element[ 0 ] && !this.cancelHelperRemoval ) {
                this.helper.remove();
            }
            this.helper = null;
            this.cancelHelperRemoval = false;
            if ( this.destroyOnClear ) {
                this.destroy();
            }
        },

        // From now on bulk stuff - mainly helpers

        _trigger: function( type, event, ui ) {
            ui = ui || this._uiHash();
            $.ui.plugin.call( this, type, [ event, ui, this ], true );

            // Absolute position and offset (see #6884 ) have to be recalculated after plugins
            if ( /^(drag|start|stop)/.test( type ) ) {
                this.positionAbs = this._convertPositionTo( "absolute" );
                ui.offset = this.positionAbs;
            }
            return $.Widget.prototype._trigger.call( this, type, event, ui );
        },

        plugins: {},

        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            };
        }

    } );

    $.ui.plugin.add( "draggable", "connectToSortable", {
        start: function( event, ui, draggable ) {
            var uiSortable = $.extend( {}, ui, {
                item: draggable.element
            } );

            draggable.sortables = [];
            $( draggable.options.connectToSortable ).each( function() {
                var sortable = $( this ).sortable( "instance" );

                if ( sortable && !sortable.options.disabled ) {
                    draggable.sortables.push( sortable );

                    // RefreshPositions is called at drag start to refresh the containerCache
                    // which is used in drag. This ensures it's initialized and synchronized
                    // with any changes that might have happened on the page since initialization.
                    sortable.refreshPositions();
                    sortable._trigger( "activate", event, uiSortable );
                }
            } );
        },
        stop: function( event, ui, draggable ) {
            var uiSortable = $.extend( {}, ui, {
                item: draggable.element
            } );

            draggable.cancelHelperRemoval = false;

            $.each( draggable.sortables, function() {
                var sortable = this;

                if ( sortable.isOver ) {
                    sortable.isOver = 0;

                    // Allow this sortable to handle removing the helper
                    draggable.cancelHelperRemoval = true;
                    sortable.cancelHelperRemoval = false;

                    // Use _storedCSS To restore properties in the sortable,
                    // as this also handles revert (#9675) since the draggable
                    // may have modified them in unexpected ways (#8809)
                    sortable._storedCSS = {
                        position: sortable.placeholder.css( "position" ),
                        top: sortable.placeholder.css( "top" ),
                        left: sortable.placeholder.css( "left" )
                    };

                    sortable._mouseStop( event );

                    // Once drag has ended, the sortable should return to using
                    // its original helper, not the shared helper from draggable
                    sortable.options.helper = sortable.options._helper;
                } else {

                    // Prevent this Sortable from removing the helper.
                    // However, don't set the draggable to remove the helper
                    // either as another connected Sortable may yet handle the removal.
                    sortable.cancelHelperRemoval = true;

                    sortable._trigger( "deactivate", event, uiSortable );
                }
            } );
        },
        drag: function( event, ui, draggable ) {
            $.each( draggable.sortables, function() {
                var innermostIntersecting = false,
                    sortable = this;

                // Copy over variables that sortable's _intersectsWith uses
                sortable.positionAbs = draggable.positionAbs;
                sortable.helperProportions = draggable.helperProportions;
                sortable.offset.click = draggable.offset.click;

                if ( sortable._intersectsWith( sortable.containerCache ) ) {
                    innermostIntersecting = true;

                    $.each( draggable.sortables, function() {

                        // Copy over variables that sortable's _intersectsWith uses
                        this.positionAbs = draggable.positionAbs;
                        this.helperProportions = draggable.helperProportions;
                        this.offset.click = draggable.offset.click;

                        if ( this !== sortable &&
                            this._intersectsWith( this.containerCache ) &&
                            $.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
                            innermostIntersecting = false;
                        }

                        return innermostIntersecting;
                    } );
                }

                if ( innermostIntersecting ) {

                    // If it intersects, we use a little isOver variable and set it once,
                    // so that the move-in stuff gets fired only once.
                    if ( !sortable.isOver ) {
                        sortable.isOver = 1;

                        // Store draggable's parent in case we need to reappend to it later.
                        draggable._parent = ui.helper.parent();

                        sortable.currentItem = ui.helper
                            .appendTo( sortable.element )
                            .data( "ui-sortable-item", true );

                        // Store helper option to later restore it
                        sortable.options._helper = sortable.options.helper;

                        sortable.options.helper = function() {
                            return ui.helper[ 0 ];
                        };

                        // Fire the start events of the sortable with our passed browser event,
                        // and our own helper (so it doesn't create a new one)
                        event.target = sortable.currentItem[ 0 ];
                        sortable._mouseCapture( event, true );
                        sortable._mouseStart( event, true, true );

                        // Because the browser event is way off the new appended portlet,
                        // modify necessary variables to reflect the changes
                        sortable.offset.click.top = draggable.offset.click.top;
                        sortable.offset.click.left = draggable.offset.click.left;
                        sortable.offset.parent.left -= draggable.offset.parent.left -
                            sortable.offset.parent.left;
                        sortable.offset.parent.top -= draggable.offset.parent.top -
                            sortable.offset.parent.top;

                        draggable._trigger( "toSortable", event );

                        // Inform draggable that the helper is in a valid drop zone,
                        // used solely in the revert option to handle "valid/invalid".
                        draggable.dropped = sortable.element;

                        // Need to refreshPositions of all sortables in the case that
                        // adding to one sortable changes the location of the other sortables (#9675)
                        $.each( draggable.sortables, function() {
                            this.refreshPositions();
                        } );

                        // Hack so receive/update callbacks work (mostly)
                        draggable.currentItem = draggable.element;
                        sortable.fromOutside = draggable;
                    }

                    if ( sortable.currentItem ) {
                        sortable._mouseDrag( event );

                        // Copy the sortable's position because the draggable's can potentially reflect
                        // a relative position, while sortable is always absolute, which the dragged
                        // element has now become. (#8809)
                        ui.position = sortable.position;
                    }
                } else {

                    // If it doesn't intersect with the sortable, and it intersected before,
                    // we fake the drag stop of the sortable, but make sure it doesn't remove
                    // the helper by using cancelHelperRemoval.
                    if ( sortable.isOver ) {

                        sortable.isOver = 0;
                        sortable.cancelHelperRemoval = true;

                        // Calling sortable's mouseStop would trigger a revert,
                        // so revert must be temporarily false until after mouseStop is called.
                        sortable.options._revert = sortable.options.revert;
                        sortable.options.revert = false;

                        sortable._trigger( "out", event, sortable._uiHash( sortable ) );
                        sortable._mouseStop( event, true );

                        // Restore sortable behaviors that were modfied
                        // when the draggable entered the sortable area (#9481)
                        sortable.options.revert = sortable.options._revert;
                        sortable.options.helper = sortable.options._helper;

                        if ( sortable.placeholder ) {
                            sortable.placeholder.remove();
                        }

                        // Restore and recalculate the draggable's offset considering the sortable
                        // may have modified them in unexpected ways. (#8809, #10669)
                        ui.helper.appendTo( draggable._parent );
                        draggable._refreshOffsets( event );
                        ui.position = draggable._generatePosition( event, true );

                        draggable._trigger( "fromSortable", event );

                        // Inform draggable that the helper is no longer in a valid drop zone
                        draggable.dropped = false;

                        // Need to refreshPositions of all sortables just in case removing
                        // from one sortable changes the location of other sortables (#9675)
                        $.each( draggable.sortables, function() {
                            this.refreshPositions();
                        } );
                    }
                }
            } );
        }
    } );

    $.ui.plugin.add( "draggable", "cursor", {
        start: function( event, ui, instance ) {
            var t = $( "body" ),
                o = instance.options;

            if ( t.css( "cursor" ) ) {
                o._cursor = t.css( "cursor" );
            }
            t.css( "cursor", o.cursor );
        },
        stop: function( event, ui, instance ) {
            var o = instance.options;
            if ( o._cursor ) {
                $( "body" ).css( "cursor", o._cursor );
            }
        }
    } );

    $.ui.plugin.add( "draggable", "opacity", {
        start: function( event, ui, instance ) {
            var t = $( ui.helper ),
                o = instance.options;
            if ( t.css( "opacity" ) ) {
                o._opacity = t.css( "opacity" );
            }
            t.css( "opacity", o.opacity );
        },
        stop: function( event, ui, instance ) {
            var o = instance.options;
            if ( o._opacity ) {
                $( ui.helper ).css( "opacity", o._opacity );
            }
        }
    } );

    $.ui.plugin.add( "draggable", "scroll", {
        start: function( event, ui, i ) {
            if ( !i.scrollParentNotHidden ) {
                i.scrollParentNotHidden = i.helper.scrollParent( false );
            }

            if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] &&
                i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
                i.overflowOffset = i.scrollParentNotHidden.offset();
            }
        },
        drag: function( event, ui, i  ) {

            var o = i.options,
                scrolled = false,
                scrollParent = i.scrollParentNotHidden[ 0 ],
                document = i.document[ 0 ];

            if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
                if ( !o.axis || o.axis !== "x" ) {
                    if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY <
                        o.scrollSensitivity ) {
                        scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
                    } else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
                        scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
                    }
                }

                if ( !o.axis || o.axis !== "y" ) {
                    if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX <
                        o.scrollSensitivity ) {
                        scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
                    } else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
                        scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
                    }
                }

            } else {

                if ( !o.axis || o.axis !== "x" ) {
                    if ( event.pageY - $( document ).scrollTop() < o.scrollSensitivity ) {
                        scrolled = $( document ).scrollTop( $( document ).scrollTop() - o.scrollSpeed );
                    } else if ( $( window ).height() - ( event.pageY - $( document ).scrollTop() ) <
                        o.scrollSensitivity ) {
                        scrolled = $( document ).scrollTop( $( document ).scrollTop() + o.scrollSpeed );
                    }
                }

                if ( !o.axis || o.axis !== "y" ) {
                    if ( event.pageX - $( document ).scrollLeft() < o.scrollSensitivity ) {
                        scrolled = $( document ).scrollLeft(
                            $( document ).scrollLeft() - o.scrollSpeed
                        );
                    } else if ( $( window ).width() - ( event.pageX - $( document ).scrollLeft() ) <
                        o.scrollSensitivity ) {
                        scrolled = $( document ).scrollLeft(
                            $( document ).scrollLeft() + o.scrollSpeed
                        );
                    }
                }

            }

            if ( scrolled !== false && $.ui.ddmanager && !o.dropBehaviour ) {
                $.ui.ddmanager.prepareOffsets( i, event );
            }

        }
    } );

    $.ui.plugin.add( "draggable", "snap", {
        start: function( event, ui, i ) {

            var o = i.options;

            i.snapElements = [];

            $( o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap )
                .each( function() {
                    var $t = $( this ),
                        $o = $t.offset();
                    if ( this !== i.element[ 0 ] ) {
                        i.snapElements.push( {
                            item: this,
                            width: $t.outerWidth(), height: $t.outerHeight(),
                            top: $o.top, left: $o.left
                        } );
                    }
                } );

        },
        drag: function( event, ui, inst ) {

            var ts, bs, ls, rs, l, r, t, b, i, first,
                o = inst.options,
                d = o.snapTolerance,
                x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
                y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

            for ( i = inst.snapElements.length - 1; i >= 0; i-- ) {

                l = inst.snapElements[ i ].left - inst.margins.left;
                r = l + inst.snapElements[ i ].width;
                t = inst.snapElements[ i ].top - inst.margins.top;
                b = t + inst.snapElements[ i ].height;

                if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d ||
                    !$.contains( inst.snapElements[ i ].item.ownerDocument,
                        inst.snapElements[ i ].item ) ) {
                    if ( inst.snapElements[ i ].snapping ) {
                        if ( inst.options.snap.release ) {
                            inst.options.snap.release.call(
                                inst.element,
                                event,
                                $.extend( inst._uiHash(), { snapItem: inst.snapElements[ i ].item } )
                            );
                        }
                    }
                    inst.snapElements[ i ].snapping = false;
                    continue;
                }

                if ( o.snapMode !== "inner" ) {
                    ts = Math.abs( t - y2 ) <= d;
                    bs = Math.abs( b - y1 ) <= d;
                    ls = Math.abs( l - x2 ) <= d;
                    rs = Math.abs( r - x1 ) <= d;
                    if ( ts ) {
                        ui.position.top = inst._convertPositionTo( "relative", {
                            top: t - inst.helperProportions.height,
                            left: 0
                        } ).top;
                    }
                    if ( bs ) {
                        ui.position.top = inst._convertPositionTo( "relative", {
                            top: b,
                            left: 0
                        } ).top;
                    }
                    if ( ls ) {
                        ui.position.left = inst._convertPositionTo( "relative", {
                            top: 0,
                            left: l - inst.helperProportions.width
                        } ).left;
                    }
                    if ( rs ) {
                        ui.position.left = inst._convertPositionTo( "relative", {
                            top: 0,
                            left: r
                        } ).left;
                    }
                }

                first = ( ts || bs || ls || rs );

                if ( o.snapMode !== "outer" ) {
                    ts = Math.abs( t - y1 ) <= d;
                    bs = Math.abs( b - y2 ) <= d;
                    ls = Math.abs( l - x1 ) <= d;
                    rs = Math.abs( r - x2 ) <= d;
                    if ( ts ) {
                        ui.position.top = inst._convertPositionTo( "relative", {
                            top: t,
                            left: 0
                        } ).top;
                    }
                    if ( bs ) {
                        ui.position.top = inst._convertPositionTo( "relative", {
                            top: b - inst.helperProportions.height,
                            left: 0
                        } ).top;
                    }
                    if ( ls ) {
                        ui.position.left = inst._convertPositionTo( "relative", {
                            top: 0,
                            left: l
                        } ).left;
                    }
                    if ( rs ) {
                        ui.position.left = inst._convertPositionTo( "relative", {
                            top: 0,
                            left: r - inst.helperProportions.width
                        } ).left;
                    }
                }

                if ( !inst.snapElements[ i ].snapping && ( ts || bs || ls || rs || first ) ) {
                    if ( inst.options.snap.snap ) {
                        inst.options.snap.snap.call(
                            inst.element,
                            event,
                            $.extend( inst._uiHash(), {
                                snapItem: inst.snapElements[ i ].item
                            } ) );
                    }
                }
                inst.snapElements[ i ].snapping = ( ts || bs || ls || rs || first );

            }

        }
    } );

    $.ui.plugin.add( "draggable", "stack", {
        start: function( event, ui, instance ) {
            var min,
                o = instance.options,
                group = $.makeArray( $( o.stack ) ).sort( function( a, b ) {
                    return ( parseInt( $( a ).css( "zIndex" ), 10 ) || 0 ) -
                        ( parseInt( $( b ).css( "zIndex" ), 10 ) || 0 );
                } );

            if ( !group.length ) {
                return;
            }

            min = parseInt( $( group[ 0 ] ).css( "zIndex" ), 10 ) || 0;
            $( group ).each( function( i ) {
                $( this ).css( "zIndex", min + i );
            } );
            this.css( "zIndex", ( min + group.length ) );
        }
    } );

    $.ui.plugin.add( "draggable", "zIndex", {
        start: function( event, ui, instance ) {
            var t = $( ui.helper ),
                o = instance.options;

            if ( t.css( "zIndex" ) ) {
                o._zIndex = t.css( "zIndex" );
            }
            t.css( "zIndex", o.zIndex );
        },
        stop: function( event, ui, instance ) {
            var o = instance.options;

            if ( o._zIndex ) {
                $( ui.helper ).css( "zIndex", o._zIndex );
            }
        }
    } );

    return $.ui.draggable;

} );

define('Algolia_AlgoliaSearch/internals/template/autocomplete/additional-section',[], function () {
    return {
        getNoResultHtml: function ({html}) {
            return html`<p>${algoliaConfig.translations.noResults}</p>`;
        },

        getHeaderHtml: function ({section}) {
            return section.label || section.name;
        },

        getItemHtml: function ({item, components, html, section}) {
            return html`<a class="aa-ItemLink"
                           href="${algoliaConfig.resultPageUrl}?q=${encodeURIComponent(item.query)}&${section.name}=${encodeURIComponent(item.value)}"
                           data-objectId="${item.objectID}"
                           data-position="${item.position}"
                           data-index="${item.__autocomplete_indexName}"
                           data-queryId="${item.__autocomplete_queryID}">
                ${components.Highlight({ hit: item, attribute: 'value' })}
            </a>`;

        },

        getFooterHtml: function () {
            return "";
        }
    };
});

/*!
 * jQuery UI Position 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

//>>label: Position
//>>group: Core
//>>description: Positions elements relative to other elements.
//>>docs: http://api.jqueryui.com/position/
//>>demos: http://jqueryui.com/position/

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/position',[ "jquery", "./version" ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    ( function() {
        var cachedScrollbarWidth,
            max = Math.max,
            abs = Math.abs,
            rhorizontal = /left|center|right/,
            rvertical = /top|center|bottom/,
            roffset = /[\+\-]\d+(\.[\d]+)?%?/,
            rposition = /^\w+/,
            rpercent = /%$/,
            _position = $.fn.position;

        function getOffsets( offsets, width, height ) {
            return [
                parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
                parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
            ];
        }

        function parseCss( element, property ) {
            return parseInt( $.css( element, property ), 10 ) || 0;
        }

        function isWindow( obj ) {
            return obj != null && obj === obj.window;
        }

        function getDimensions( elem ) {
            var raw = elem[ 0 ];
            if ( raw.nodeType === 9 ) {
                return {
                    width: elem.width(),
                    height: elem.height(),
                    offset: { top: 0, left: 0 }
                };
            }
            if ( isWindow( raw ) ) {
                return {
                    width: elem.width(),
                    height: elem.height(),
                    offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
                };
            }
            if ( raw.preventDefault ) {
                return {
                    width: 0,
                    height: 0,
                    offset: { top: raw.pageY, left: raw.pageX }
                };
            }
            return {
                width: elem.outerWidth(),
                height: elem.outerHeight(),
                offset: elem.offset()
            };
        }

        $.position = {
            scrollbarWidth: function() {
                if ( cachedScrollbarWidth !== undefined ) {
                    return cachedScrollbarWidth;
                }
                var w1, w2,
                    div = $( "<div style=" +
                        "'display:block;position:absolute;width:200px;height:200px;overflow:hidden;'>" +
                        "<div style='height:300px;width:auto;'></div></div>" ),
                    innerDiv = div.children()[ 0 ];

                $( "body" ).append( div );
                w1 = innerDiv.offsetWidth;
                div.css( "overflow", "scroll" );

                w2 = innerDiv.offsetWidth;

                if ( w1 === w2 ) {
                    w2 = div[ 0 ].clientWidth;
                }

                div.remove();

                return ( cachedScrollbarWidth = w1 - w2 );
            },
            getScrollInfo: function( within ) {
                var overflowX = within.isWindow || within.isDocument ? "" :
                        within.element.css( "overflow-x" ),
                    overflowY = within.isWindow || within.isDocument ? "" :
                        within.element.css( "overflow-y" ),
                    hasOverflowX = overflowX === "scroll" ||
                        ( overflowX === "auto" && within.width < within.element[ 0 ].scrollWidth ),
                    hasOverflowY = overflowY === "scroll" ||
                        ( overflowY === "auto" && within.height < within.element[ 0 ].scrollHeight );
                return {
                    width: hasOverflowY ? $.position.scrollbarWidth() : 0,
                    height: hasOverflowX ? $.position.scrollbarWidth() : 0
                };
            },
            getWithinInfo: function( element ) {
                var withinElement = $( element || window ),
                    isElemWindow = isWindow( withinElement[ 0 ] ),
                    isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9,
                    hasOffset = !isElemWindow && !isDocument;
                return {
                    element: withinElement,
                    isWindow: isElemWindow,
                    isDocument: isDocument,
                    offset: hasOffset ? $( element ).offset() : { left: 0, top: 0 },
                    scrollLeft: withinElement.scrollLeft(),
                    scrollTop: withinElement.scrollTop(),
                    width: withinElement.outerWidth(),
                    height: withinElement.outerHeight()
                };
            }
        };

        $.fn.position = function( options ) {
            if ( !options || !options.of ) {
                return _position.apply( this, arguments );
            }

            // Make a copy, we don't want to modify arguments
            options = $.extend( {}, options );

            var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,

                // Make sure string options are treated as CSS selectors
                target = typeof options.of === "string" ?
                    $( document ).find( options.of ) :
                    $( options.of ),

                within = $.position.getWithinInfo( options.within ),
                scrollInfo = $.position.getScrollInfo( within ),
                collision = ( options.collision || "flip" ).split( " " ),
                offsets = {};

            dimensions = getDimensions( target );
            if ( target[ 0 ].preventDefault ) {

                // Force left top to allow flipping
                options.at = "left top";
            }
            targetWidth = dimensions.width;
            targetHeight = dimensions.height;
            targetOffset = dimensions.offset;

            // Clone to reuse original targetOffset later
            basePosition = $.extend( {}, targetOffset );

            // Force my and at to have valid horizontal and vertical positions
            // if a value is missing or invalid, it will be converted to center
            $.each( [ "my", "at" ], function() {
                var pos = ( options[ this ] || "" ).split( " " ),
                    horizontalOffset,
                    verticalOffset;

                if ( pos.length === 1 ) {
                    pos = rhorizontal.test( pos[ 0 ] ) ?
                        pos.concat( [ "center" ] ) :
                        rvertical.test( pos[ 0 ] ) ?
                            [ "center" ].concat( pos ) :
                            [ "center", "center" ];
                }
                pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
                pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

                // Calculate offsets
                horizontalOffset = roffset.exec( pos[ 0 ] );
                verticalOffset = roffset.exec( pos[ 1 ] );
                offsets[ this ] = [
                    horizontalOffset ? horizontalOffset[ 0 ] : 0,
                    verticalOffset ? verticalOffset[ 0 ] : 0
                ];

                // Reduce to just the positions without the offsets
                options[ this ] = [
                    rposition.exec( pos[ 0 ] )[ 0 ],
                    rposition.exec( pos[ 1 ] )[ 0 ]
                ];
            } );

            // Normalize collision option
            if ( collision.length === 1 ) {
                collision[ 1 ] = collision[ 0 ];
            }

            if ( options.at[ 0 ] === "right" ) {
                basePosition.left += targetWidth;
            } else if ( options.at[ 0 ] === "center" ) {
                basePosition.left += targetWidth / 2;
            }

            if ( options.at[ 1 ] === "bottom" ) {
                basePosition.top += targetHeight;
            } else if ( options.at[ 1 ] === "center" ) {
                basePosition.top += targetHeight / 2;
            }

            atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
            basePosition.left += atOffset[ 0 ];
            basePosition.top += atOffset[ 1 ];

            return this.each( function() {
                var collisionPosition, using,
                    elem = $( this ),
                    elemWidth = elem.outerWidth(),
                    elemHeight = elem.outerHeight(),
                    marginLeft = parseCss( this, "marginLeft" ),
                    marginTop = parseCss( this, "marginTop" ),
                    collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) +
                        scrollInfo.width,
                    collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) +
                        scrollInfo.height,
                    position = $.extend( {}, basePosition ),
                    myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

                if ( options.my[ 0 ] === "right" ) {
                    position.left -= elemWidth;
                } else if ( options.my[ 0 ] === "center" ) {
                    position.left -= elemWidth / 2;
                }

                if ( options.my[ 1 ] === "bottom" ) {
                    position.top -= elemHeight;
                } else if ( options.my[ 1 ] === "center" ) {
                    position.top -= elemHeight / 2;
                }

                position.left += myOffset[ 0 ];
                position.top += myOffset[ 1 ];

                collisionPosition = {
                    marginLeft: marginLeft,
                    marginTop: marginTop
                };

                $.each( [ "left", "top" ], function( i, dir ) {
                    if ( $.ui.position[ collision[ i ] ] ) {
                        $.ui.position[ collision[ i ] ][ dir ]( position, {
                            targetWidth: targetWidth,
                            targetHeight: targetHeight,
                            elemWidth: elemWidth,
                            elemHeight: elemHeight,
                            collisionPosition: collisionPosition,
                            collisionWidth: collisionWidth,
                            collisionHeight: collisionHeight,
                            offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                            my: options.my,
                            at: options.at,
                            within: within,
                            elem: elem
                        } );
                    }
                } );

                if ( options.using ) {

                    // Adds feedback as second argument to using callback, if present
                    using = function( props ) {
                        var left = targetOffset.left - position.left,
                            right = left + targetWidth - elemWidth,
                            top = targetOffset.top - position.top,
                            bottom = top + targetHeight - elemHeight,
                            feedback = {
                                target: {
                                    element: target,
                                    left: targetOffset.left,
                                    top: targetOffset.top,
                                    width: targetWidth,
                                    height: targetHeight
                                },
                                element: {
                                    element: elem,
                                    left: position.left,
                                    top: position.top,
                                    width: elemWidth,
                                    height: elemHeight
                                },
                                horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                                vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                            };
                        if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                            feedback.horizontal = "center";
                        }
                        if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                            feedback.vertical = "middle";
                        }
                        if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                            feedback.important = "horizontal";
                        } else {
                            feedback.important = "vertical";
                        }
                        options.using.call( this, props, feedback );
                    };
                }

                elem.offset( $.extend( position, { using: using } ) );
            } );
        };

        $.ui.position = {
            fit: {
                left: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                        outerWidth = within.width,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = withinOffset - collisionPosLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                        newOverRight;

                    // Element is wider than within
                    if ( data.collisionWidth > outerWidth ) {

                        // Element is initially over the left side of within
                        if ( overLeft > 0 && overRight <= 0 ) {
                            newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
                                withinOffset;
                            position.left += overLeft - newOverRight;

                            // Element is initially over right side of within
                        } else if ( overRight > 0 && overLeft <= 0 ) {
                            position.left = withinOffset;

                            // Element is initially over both left and right sides of within
                        } else {
                            if ( overLeft > overRight ) {
                                position.left = withinOffset + outerWidth - data.collisionWidth;
                            } else {
                                position.left = withinOffset;
                            }
                        }

                        // Too far left -> align with left edge
                    } else if ( overLeft > 0 ) {
                        position.left += overLeft;

                        // Too far right -> align with right edge
                    } else if ( overRight > 0 ) {
                        position.left -= overRight;

                        // Adjust based on position and margin
                    } else {
                        position.left = max( position.left - collisionPosLeft, position.left );
                    }
                },
                top: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                        outerHeight = data.within.height,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = withinOffset - collisionPosTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                        newOverBottom;

                    // Element is taller than within
                    if ( data.collisionHeight > outerHeight ) {

                        // Element is initially over the top of within
                        if ( overTop > 0 && overBottom <= 0 ) {
                            newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
                                withinOffset;
                            position.top += overTop - newOverBottom;

                            // Element is initially over bottom of within
                        } else if ( overBottom > 0 && overTop <= 0 ) {
                            position.top = withinOffset;

                            // Element is initially over both top and bottom of within
                        } else {
                            if ( overTop > overBottom ) {
                                position.top = withinOffset + outerHeight - data.collisionHeight;
                            } else {
                                position.top = withinOffset;
                            }
                        }

                        // Too far up -> align with top
                    } else if ( overTop > 0 ) {
                        position.top += overTop;

                        // Too far down -> align with bottom edge
                    } else if ( overBottom > 0 ) {
                        position.top -= overBottom;

                        // Adjust based on position and margin
                    } else {
                        position.top = max( position.top - collisionPosTop, position.top );
                    }
                }
            },
            flip: {
                left: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.offset.left + within.scrollLeft,
                        outerWidth = within.width,
                        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                        overLeft = collisionPosLeft - offsetLeft,
                        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                        myOffset = data.my[ 0 ] === "left" ?
                            -data.elemWidth :
                            data.my[ 0 ] === "right" ?
                                data.elemWidth :
                                0,
                        atOffset = data.at[ 0 ] === "left" ?
                            data.targetWidth :
                            data.at[ 0 ] === "right" ?
                                -data.targetWidth :
                                0,
                        offset = -2 * data.offset[ 0 ],
                        newOverRight,
                        newOverLeft;

                    if ( overLeft < 0 ) {
                        newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
                            outerWidth - withinOffset;
                        if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                            position.left += myOffset + atOffset + offset;
                        }
                    } else if ( overRight > 0 ) {
                        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
                            atOffset + offset - offsetLeft;
                        if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                            position.left += myOffset + atOffset + offset;
                        }
                    }
                },
                top: function( position, data ) {
                    var within = data.within,
                        withinOffset = within.offset.top + within.scrollTop,
                        outerHeight = within.height,
                        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                        collisionPosTop = position.top - data.collisionPosition.marginTop,
                        overTop = collisionPosTop - offsetTop,
                        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                        top = data.my[ 1 ] === "top",
                        myOffset = top ?
                            -data.elemHeight :
                            data.my[ 1 ] === "bottom" ?
                                data.elemHeight :
                                0,
                        atOffset = data.at[ 1 ] === "top" ?
                            data.targetHeight :
                            data.at[ 1 ] === "bottom" ?
                                -data.targetHeight :
                                0,
                        offset = -2 * data.offset[ 1 ],
                        newOverTop,
                        newOverBottom;
                    if ( overTop < 0 ) {
                        newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
                            outerHeight - withinOffset;
                        if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
                            position.top += myOffset + atOffset + offset;
                        }
                    } else if ( overBottom > 0 ) {
                        newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
                            offset - offsetTop;
                        if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
                            position.top += myOffset + atOffset + offset;
                        }
                    }
                }
            },
            flipfit: {
                left: function() {
                    $.ui.position.flip.left.apply( this, arguments );
                    $.ui.position.fit.left.apply( this, arguments );
                },
                top: function() {
                    $.ui.position.flip.top.apply( this, arguments );
                    $.ui.position.fit.top.apply( this, arguments );
                }
            }
        };

    } )();

    return $.ui.position;

} );


define('text!Magento_Checkout/template/minicart/item/default.html',[],function () { return '<!--\n/**\n * Copyright © Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<li class="item product product-item" data-role="product-item">\n    <div class="product">\n        <!-- ko if: product_has_url -->\n        <a data-bind="attr: {href: product_url, title: product_name}, click: function(){window.location.href = product_url}" tabindex="-1" class="product-item-photo">\n            <!-- ko foreach: $parent.getRegion(\'itemImage\') -->\n                <!-- ko template: {name: getTemplate(), data: item.product_image} --><!-- /ko -->\n            <!-- /ko -->\n        </a>\n        <!-- /ko -->\n        <!-- ko ifnot: product_has_url -->\n        <span class="product-item-photo">\n            <!-- ko foreach: $parent.getRegion(\'itemImage\') -->\n                <!-- ko template: {name: getTemplate(), data: item.product_image} --><!-- /ko -->\n            <!-- /ko -->\n        </span>\n        <!-- /ko -->\n\n        <div class="product-item-details">\n            <strong class="product-item-name">\n                <!-- ko if: product_has_url -->\n                <a data-bind="attr: {href: product_url}, html: product_name, click: function(){window.location.href = product_url}"></a>\n                <!-- /ko -->\n                <!-- ko ifnot: product_has_url -->\n                    <!-- ko text: product_name --><!-- /ko -->\n                <!-- /ko -->\n            </strong>\n\n            <!-- ko if: options.length -->\n            <div class="product options" >\n                <div data-role="content" class="content">\n                    <strong class="subtitle"><!-- ko i18n: \'Options Details\' --><!-- /ko --></strong>\n                    <dl class="product options list">\n                        <!-- ko foreach: { data: options, as: \'option\' } -->\n                        <dt class="label"><!-- ko text: option.label --><!-- /ko --></dt>\n                        <dd class="values">\n                            <!-- ko if: Array.isArray(option.value) -->\n                                <span data-bind="html: option.value.join(\'<br>\')"></span>\n                            <!-- /ko -->\n                            <!-- ko ifnot: Array.isArray(option.value) -->\n                                <span data-bind="text: option.value"></span>\n                            <!-- /ko -->\n                        </dd>\n                        <!-- /ko -->\n                    </dl>\n                </div>\n            </div>\n            <!-- /ko -->\n\n            <div class="product-item-pricing">\n\n                <div class="details-qty qty">\n                    <label class="label" data-bind="i18n: \'Qty\', attr: {\n                           for: \'cart-item-\'+item_id+\'-qty\'}"></label>\n                    <span>\n                        <!-- ko text: qty --><!-- /ko -->\n                    </span>\n                </div>\n            </div>\n\n            <div class="product-item-pricing">\n                <!-- ko if: canApplyMsrp -->\n\n                <div class="details-map">\n                    <span class="label" data-bind="i18n: \'Price\'"></span>\n                    <span class="value" data-bind="i18n: \'See price before order confirmation.\'"></span>\n                </div>\n                <!-- /ko -->\n                <!-- ko ifnot: canApplyMsrp -->\n                <!-- ko foreach: $parent.getRegion(\'priceSidebar\') -->\n                <!-- ko template: {name: getTemplate(), data: item.product_price, as: \'price\'} --><!-- /ko -->\n                <!-- /ko -->\n                <!-- /ko -->\n            </div>\n\n            <div class="product actions">\n                <!-- ko if: is_visible_in_site_visibility -->\n                <div class="primary">\n                    <a data-bind="attr: {href: configure_url, title: $t(\'Edit item\')}" class="action edit">\n                        <span data-bind="i18n: \'Edit\'"></span>\n                    </a>\n                </div>\n                <!-- /ko -->\n                <div class="secondary">\n                    <a href="#" data-bind="attr: {\'data-cart-item\': item_id, title: $t(\'Remove item\')}"\n                       class="action delete">\n                        <span data-bind="i18n: \'Remove\'"></span>\n                    </a>\n                </div>\n            </div>\n        </div>\n    </div>\n</li>\n';});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('Magento_Customer/js/model/authentication-popup',[
    'jquery',
    'Magento_Ui/js/modal/modal'
], function ($, modal) {
    'use strict';

    return {
        modalWindow: null,

        /**
         * Create popUp window for provided element
         *
         * @param {HTMLElement} element
         */
        createPopUp: function (element) {
            var options = {
                'type': 'popup',
                'modalClass': 'popup-authentication',
                'focus': '[name=username]',
                'responsive': true,
                'innerScroll': true,
                'trigger': '.proceed-to-checkout',
                'buttons': []
            };

            this.modalWindow = element;
            modal(options, $(this.modalWindow));
        },

        /** Show login popup window */
        showModal: function () {
            $(this.modalWindow).modal('openModal').trigger('contentUpdated');
        }
    };
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define('Magento_Ui/js/modal/alert',[
    'jquery',
    'underscore',
    'jquery-ui-modules/widget',
    'Magento_Ui/js/modal/confirm',
    'mage/translate'
], function ($, _) {
    'use strict';

    $.widget('mage.alert', $.mage.confirm, {
        options: {
            modalClass: 'confirm',
            title: $.mage.__('Attention'),
            actions: {

                /**
                 * Callback always - called on all actions.
                 */
                always: function () {}
            },
            buttons: [{
                text: $.mage.__('OK'),
                class: 'action-primary action-accept',

                /**
                 * Click handler.
                 */
                click: function () {
                    this.closeModal(true);
                }
            }]
        },

        /**
         * Close modal window.
         */
        closeModal: function () {
            this.options.actions.always();
            this.element.on('alertclosed', _.bind(this._remove, this));

            return this._super();
        }
    });

    return function (config) {
        return $('<div></div>').html(config.content).alert(config);
    };
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable strict */
define('mage/decorate',[
    'jquery',
    'mage/translate'
], function ($) {
    var methods = {
        /**
         * Decorate a list (e.g. a <ul> containing <li>) recursively if specified.
         * @param {Boolean} isRecursive
         */
        list: function (isRecursive) {
            return this.each(function () {
                var list = $(this),
                    items;

                if (list.length > 0) {
                    items = typeof isRecursive === 'undefined' || isRecursive ?
                        list.find('li') :
                        list.children();
                    items.decorate('generic', ['odd', 'even', 'last']);
                }
            });
        },

        /**
         * Annotate a set of DOM elements with decorator classes.
         * @param {Array} decoratorParams
         */
        generic: function (decoratorParams) {
            var elements = $(this),
                allSupportedParams;

            if (elements) {
                allSupportedParams = {
                    even: 'odd', // Flip jQuery odd/even so that index 0 is odd.
                    odd: 'even',
                    last: 'last',
                    first: 'first'
                };

                decoratorParams = decoratorParams || allSupportedParams;

                $.each(decoratorParams, function (index, param) {
                    if (param === 'even' || param === 'odd') {
                        elements.filter(':' + param).removeClass('odd even').addClass(allSupportedParams[param]);
                    } else {
                        elements.filter(':' + param).addClass(allSupportedParams[param]);
                    }
                });
            }

            return this;
        },

        /**
         * Decorate DOM elements in an HTML table with specified classes.
         * @param {Object} instanceOptions
         */
        table: function (instanceOptions) {
            return this.each(function () {
                var table = $(this),
                    options;

                if (table.length > 0) {
                    options = {
                        'tbody': false,
                        'tbody tr': ['odd', 'even', 'first', 'last'],
                        'thead tr': ['first', 'last'],
                        'tfoot tr': ['first', 'last'],
                        'tr td': ['last']
                    };

                    $.extend(options, instanceOptions || {});

                    $.each(options, function (key, value) {
                        if (options[key]) {
                            if (key === 'tr td') {
                                $.each(table.find('tr'), function () {
                                    $(this).find('td').decorate('generic', options['tr td']);
                                });
                            } else {
                                table.find(key).decorate('generic', value);
                            }
                        }
                    });
                }
            });
        },

        /**
         * Annotate data list elements with CSS classes.
         */
        dataList: function () {
            return this.each(function () {
                var list = $(this);

                if (list) {
                    list.find('dt').decorate('generic', ['odd', 'even', 'last']);
                    list.find('dd').decorate('generic', ['odd', 'even', 'last']);
                }
            });
        }
    };

    /**
     * @param {String} method
     * @return {*}
     */
    $.fn.decorate = function (method) {
        var message;

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        message = $.mage.__('Method %s does not exist on jQuery.decorate');
        // eslint-disable-next-line jquery-no-event-shorthand
        $.error(message.replace('%s', method));
    };
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('Kemana_Checkout/js/sidebar',[
    'jquery',
    'mage/translate',
    'Magento_Customer/js/model/authentication-popup',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/modal/confirm',
    'underscore',
    'jquery/ui',
    'mage/decorate',
    'mage/collapsible',
    'mage/cookies'
], function ($, $t, authenticationPopup, customerData, alert, confirm, _) {
    'use strict';

    $.widget('mage.sidebar', {
        options: {
            isRecursive: true,
            minicart: {
                maxItemsVisible: 3
            },
            'item': {
                'min': ':button.less',
                'max': ':button.more'
            }
        },
        scrollHeight: 0,
        shoppingCartUrl: window.checkout.shoppingCartUrl,

        /**
         * Create sidebar.
         * @private
         */
        _create: function () {
            this._initContent();
        },

        /**
         * Update sidebar block.
         */
        update: function () {
            $(this.options.targetElement).trigger('contentUpdated');
            this._calcHeight();
            this._isOverflowed();
        },

        /**
         * @private
         */
        _initContent: function () {
            var self = this,
                events = {};

            this.element.decorate('list', this.options.isRecursive);

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.button.close] = function (event) {
                event.stopPropagation();
                $(self.options.targetElement).dropdownDialog('close');
            };
            events['click ' + this.options.button.checkout] = $.proxy(function () {
                var cart = customerData.get('cart'),
                    customer = customerData.get('customer'),
                    element = $(this.options.button.checkout);

                if (!customer().firstname && cart().isGuestCheckoutAllowed === false) {
                    // set URL for redirect on successful login/registration. It's postprocessed on backend.
                    $.cookie('login_redirect', this.options.url.checkout);

                    if (this.options.url.isRedirectRequired) {
                        element.prop('disabled', true);
                        location.href = this.options.url.loginUrl;
                    } else {
                        authenticationPopup.showModal();
                    }

                    return false;
                }
                element.prop('disabled', true);
                location.href = this.options.url.checkout;
            }, this);

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.button.remove] =  function (event) {
                event.stopPropagation();
                self._removeItem($(event.currentTarget));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['keyup ' + this.options.item.qty] = function (event) {
                self._showItemButton($(event.target));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['change ' + this.options.item.qty] = function (event) {
                self._showItemButton($(event.target));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.item.button] = function (event) {
                event.stopPropagation();
                self._updateItemQty($(event.currentTarget));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.item.min] = function (event) {
                event.stopPropagation();
                self._setQtyValue($(event.currentTarget),'-');
                self._showItemButton($(event.currentTarget));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.item.max] = function (event) {
                event.stopPropagation();
                self._setQtyValue($(event.currentTarget),'+');
                self._showItemButton($(event.currentTarget));
            };

            /**
             * @param {jQuery.Event} event
             */
            events['focusout ' + this.options.item.qty] = function (event) {
                self._validateQty($(event.currentTarget));
            };

            this._on(this.element, events);
            this._calcHeight();
            this._isOverflowed();
        },

        _setQtyValue: function(elem, operator){

            var itemId = elem.data('cart-item');
            var qtyItem = parseInt($('#cart-item-' + itemId + '-qty').val());
            if(operator == '-'){
                qtyItem = qtyItem - 1;
                if(qtyItem <= 0){
                    qtyItem = 1;
                }
            }

            if(operator == '+'){
                qtyItem = qtyItem + 1;
            }

            $('#cart-item-' + itemId + '-qty').val(qtyItem);
        },

        /**
         * Add 'overflowed' class to minicart items wrapper element
         *
         * @private
         */
        _isOverflowed: function () {
            var list = $(this.options.minicart.list),
                cssOverflowClass = 'overflowed';

            if (this.scrollHeight > list.innerHeight()) {
                list.parent().addClass(cssOverflowClass);
            } else {
                list.parent().removeClass(cssOverflowClass);
            }
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _showItemButton: function (elem) {
            var itemId = elem.data('cart-item');
            var inputOty = $('#cart-item-' + itemId + '-qty');
            var itemQty = inputOty.data('item-qty');

            if (this._isValidQty(itemQty, inputOty.val())) {
                $('#update-cart-item-' + itemId).show('fade', 300);
            } else if (elem.val() == 0) { //eslint-disable-line eqeqeq
                this._hideItemButton(elem);
            } else {
                this._hideItemButton(elem);
            }
        },

        /**
         * @param {*} origin - origin qty. 'data-item-qty' attribute.
         * @param {*} changed - new qty.
         * @returns {Boolean}
         * @private
         */
        _isValidQty: function (origin, changed) {
            return origin != changed && //eslint-disable-line eqeqeq
                changed.length > 0 &&
                changed - 0 == changed && //eslint-disable-line eqeqeq
                changed - 0 > 0;
        },

        /**
         * @param {Object} elem
         * @private
         */
        _validateQty: function (elem) {
            var itemQty = elem.data('item-qty');

            if (!this._isValidQty(itemQty, elem.val())) {
                elem.val(itemQty);
            }
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _hideItemButton: function (elem) {
            var itemId = elem.data('cart-item');
            console.log('hide update button func');
            $('#update-cart-item-' + itemId).hide('fade', 300);
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _updateItemQty: function (elem) {
            var itemId = elem.data('cart-item');

            this._ajax(this.options.url.update, {
                'item_id': itemId,
                'item_qty': $('#cart-item-' + itemId + '-qty').val()
            }, elem, this._updateItemQtyAfter);
        },

        /**
         * Update content after update qty
         *
         * @param {HTMLElement} elem
         */
        _updateItemQtyAfter: function (elem) {
            var productData = this._getProductById(Number(elem.data('cart-item')));

            if (!_.isUndefined(productData)) {
                $(document).trigger('ajax:updateCartItemQty');

                if (window.location.href === this.shoppingCartUrl) {
                    window.location.reload(false);
                }
            }
            this._hideItemButton(elem);
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _removeItem: function (elem) {
            var itemId = elem.data('cart-item');

            this._ajax(this.options.url.remove, {
                'item_id': itemId
            }, elem, this._removeItemAfter);
        },

        /**
         * Update content after item remove
         *
         * @param {Object} elem
         * @private
         */
        _removeItemAfter: function (elem) {
            var productData = this._getProductById(Number(elem.data('cart-item')));

            if (!_.isUndefined(productData)) {
                $(document).trigger('ajax:removeFromCart', {
                    productIds: [productData['product_id']]
                });
                $('#minicart-error-message').html('<i class="fa fa-close" aria-hidden="true"></i>' + $t(' REMOVED SUCCESSFULLY'));
                setTimeout(function () {
                    $('#minicart-error-message').empty();
                }, 5000);
            }
        },

        /**
         * Retrieves product data by Id.
         *
         * @param {Number} productId - product Id
         * @returns {Object|undefined}
         * @private
         */
        _getProductById: function (productId) {
            return _.find(customerData.get('cart')().items, function (item) {
                return productId === Number(item['item_id']);
            });
        },

        /**
         * @param {String} url - ajax url
         * @param {Object} data - post data for ajax call
         * @param {Object} elem - element that initiated the event
         * @param {Function} callback - callback method to execute after AJAX success
         */
        _ajax: function (url, data, elem, callback) {
            $.extend(data, {
                'form_key': $.mage.cookies.get('form_key')
            });

            $.ajax({
                url: url,
                data: data,
                type: 'post',
                dataType: 'json',
                context: this,

                /** @inheritdoc */
                beforeSend: function () {
                    elem.attr('disabled', 'disabled');
                },

                /** @inheritdoc */
                complete: function () {
                    elem.attr('disabled', null);
                }
            })
                .done(function (response) {
                    var msg;

                    if (response.success) {
                        callback.call(this, elem, response);
                    } else {
                        msg = response['error_message'];

                        if (msg) {
                            alert({
                                content: msg
                            });
                        }
                    }
                })
                .fail(function (error) {
                    console.log(JSON.stringify(error));
                });
        },

        /**
         * Calculate height of minicart list
         *
         * @private
         */
        _calcHeight: function () {
            var self = this,
                height = 0,
                counter = this.options.minicart.maxItemsVisible,
                target = $(this.options.minicart.list),
                outerHeight;

            self.scrollHeight = 0;
            target.children().each(function () {

                if ($(this).find('.options').length > 0) {
                    $(this).collapsible();
                }
                outerHeight = $(this).outerHeight();

                if (counter-- > 0) {
                    height += outerHeight;
                }
                self.scrollHeight += outerHeight;
            });

            target.parent().height(height);
        }
    });

    return $.mage.sidebar;
});

/*!
 * jQuery UI Controlgroup 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Controlgroup
//>>group: Widgets
//>>description: Visually groups form control widgets
//>>docs: http://api.jqueryui.com/controlgroup/
//>>demos: http://jqueryui.com/controlgroup/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/controlgroup.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/controlgroup',[
            "jquery",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    var controlgroupCornerRegex = /ui-corner-([a-z]){2,6}/g;

    return $.widget( "ui.controlgroup", {
        version: "1.13.2",
        defaultElement: "<div>",
        options: {
            direction: "horizontal",
            disabled: null,
            onlyVisible: true,
            items: {
                "button": "input[type=button], input[type=submit], input[type=reset], button, a",
                "controlgroupLabel": ".ui-controlgroup-label",
                "checkboxradio": "input[type='checkbox'], input[type='radio']",
                "selectmenu": "select",
                "spinner": ".ui-spinner-input"
            }
        },

        _create: function() {
            this._enhance();
        },

        // To support the enhanced option in jQuery Mobile, we isolate DOM manipulation
        _enhance: function() {
            this.element.attr( "role", "toolbar" );
            this.refresh();
        },

        _destroy: function() {
            this._callChildMethod( "destroy" );
            this.childWidgets.removeData( "ui-controlgroup-data" );
            this.element.removeAttr( "role" );
            if ( this.options.items.controlgroupLabel ) {
                this.element
                    .find( this.options.items.controlgroupLabel )
                    .find( ".ui-controlgroup-label-contents" )
                    .contents().unwrap();
            }
        },

        _initWidgets: function() {
            var that = this,
                childWidgets = [];

            // First we iterate over each of the items options
            $.each( this.options.items, function( widget, selector ) {
                var labels;
                var options = {};

                // Make sure the widget has a selector set
                if ( !selector ) {
                    return;
                }

                if ( widget === "controlgroupLabel" ) {
                    labels = that.element.find( selector );
                    labels.each( function() {
                        var element = $( this );

                        if ( element.children( ".ui-controlgroup-label-contents" ).length ) {
                            return;
                        }
                        element.contents()
                            .wrapAll( "<span class='ui-controlgroup-label-contents'></span>" );
                    } );
                    that._addClass( labels, null, "ui-widget ui-widget-content ui-state-default" );
                    childWidgets = childWidgets.concat( labels.get() );
                    return;
                }

                // Make sure the widget actually exists
                if ( !$.fn[ widget ] ) {
                    return;
                }

                // We assume everything is in the middle to start because we can't determine
                // first / last elements until all enhancments are done.
                if ( that[ "_" + widget + "Options" ] ) {
                    options = that[ "_" + widget + "Options" ]( "middle" );
                } else {
                    options = { classes: {} };
                }

                // Find instances of this widget inside controlgroup and init them
                that.element
                    .find( selector )
                    .each( function() {
                        var element = $( this );
                        var instance = element[ widget ]( "instance" );

                        // We need to clone the default options for this type of widget to avoid
                        // polluting the variable options which has a wider scope than a single widget.
                        var instanceOptions = $.widget.extend( {}, options );

                        // If the button is the child of a spinner ignore it
                        // TODO: Find a more generic solution
                        if ( widget === "button" && element.parent( ".ui-spinner" ).length ) {
                            return;
                        }

                        // Create the widget if it doesn't exist
                        if ( !instance ) {
                            instance = element[ widget ]()[ widget ]( "instance" );
                        }
                        if ( instance ) {
                            instanceOptions.classes =
                                that._resolveClassesValues( instanceOptions.classes, instance );
                        }
                        element[ widget ]( instanceOptions );

                        // Store an instance of the controlgroup to be able to reference
                        // from the outermost element for changing options and refresh
                        var widgetElement = element[ widget ]( "widget" );
                        $.data( widgetElement[ 0 ], "ui-controlgroup-data",
                            instance ? instance : element[ widget ]( "instance" ) );

                        childWidgets.push( widgetElement[ 0 ] );
                    } );
            } );

            this.childWidgets = $( $.uniqueSort( childWidgets ) );
            this._addClass( this.childWidgets, "ui-controlgroup-item" );
        },

        _callChildMethod: function( method ) {
            this.childWidgets.each( function() {
                var element = $( this ),
                    data = element.data( "ui-controlgroup-data" );
                if ( data && data[ method ] ) {
                    data[ method ]();
                }
            } );
        },

        _updateCornerClass: function( element, position ) {
            var remove = "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all";
            var add = this._buildSimpleOptions( position, "label" ).classes.label;

            this._removeClass( element, null, remove );
            this._addClass( element, null, add );
        },

        _buildSimpleOptions: function( position, key ) {
            var direction = this.options.direction === "vertical";
            var result = {
                classes: {}
            };
            result.classes[ key ] = {
                "middle": "",
                "first": "ui-corner-" + ( direction ? "top" : "left" ),
                "last": "ui-corner-" + ( direction ? "bottom" : "right" ),
                "only": "ui-corner-all"
            }[ position ];

            return result;
        },

        _spinnerOptions: function( position ) {
            var options = this._buildSimpleOptions( position, "ui-spinner" );

            options.classes[ "ui-spinner-up" ] = "";
            options.classes[ "ui-spinner-down" ] = "";

            return options;
        },

        _buttonOptions: function( position ) {
            return this._buildSimpleOptions( position, "ui-button" );
        },

        _checkboxradioOptions: function( position ) {
            return this._buildSimpleOptions( position, "ui-checkboxradio-label" );
        },

        _selectmenuOptions: function( position ) {
            var direction = this.options.direction === "vertical";
            return {
                width: direction ? "auto" : false,
                classes: {
                    middle: {
                        "ui-selectmenu-button-open": "",
                        "ui-selectmenu-button-closed": ""
                    },
                    first: {
                        "ui-selectmenu-button-open": "ui-corner-" + ( direction ? "top" : "tl" ),
                        "ui-selectmenu-button-closed": "ui-corner-" + ( direction ? "top" : "left" )
                    },
                    last: {
                        "ui-selectmenu-button-open": direction ? "" : "ui-corner-tr",
                        "ui-selectmenu-button-closed": "ui-corner-" + ( direction ? "bottom" : "right" )
                    },
                    only: {
                        "ui-selectmenu-button-open": "ui-corner-top",
                        "ui-selectmenu-button-closed": "ui-corner-all"
                    }

                }[ position ]
            };
        },

        _resolveClassesValues: function( classes, instance ) {
            var result = {};
            $.each( classes, function( key ) {
                var current = instance.options.classes[ key ] || "";
                current = String.prototype.trim.call( current.replace( controlgroupCornerRegex, "" ) );
                result[ key ] = ( current + " " + classes[ key ] ).replace( /\s+/g, " " );
            } );
            return result;
        },

        _setOption: function( key, value ) {
            if ( key === "direction" ) {
                this._removeClass( "ui-controlgroup-" + this.options.direction );
            }

            this._super( key, value );
            if ( key === "disabled" ) {
                this._callChildMethod( value ? "disable" : "enable" );
                return;
            }

            this.refresh();
        },

        refresh: function() {
            var children,
                that = this;

            this._addClass( "ui-controlgroup ui-controlgroup-" + this.options.direction );

            if ( this.options.direction === "horizontal" ) {
                this._addClass( null, "ui-helper-clearfix" );
            }
            this._initWidgets();

            children = this.childWidgets;

            // We filter here because we need to track all childWidgets not just the visible ones
            if ( this.options.onlyVisible ) {
                children = children.filter( ":visible" );
            }

            if ( children.length ) {

                // We do this last because we need to make sure all enhancment is done
                // before determining first and last
                $.each( [ "first", "last" ], function( index, value ) {
                    var instance = children[ value ]().data( "ui-controlgroup-data" );

                    if ( instance && that[ "_" + instance.widgetName + "Options" ] ) {
                        var options = that[ "_" + instance.widgetName + "Options" ](
                            children.length === 1 ? "only" : value
                        );
                        options.classes = that._resolveClassesValues( options.classes, instance );
                        instance.element[ instance.widgetName ]( options );
                    } else {
                        that._updateCornerClass( children[ value ](), value );
                    }
                } );

                // Finally call the refresh method on each of the child widgets.
                this._callChildMethod( "refresh" );
            }
        }
    } );
} );

/*!
 * jQuery UI Checkboxradio 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Checkboxradio
//>>group: Widgets
//>>description: Enhances a form with multiple themeable checkboxes or radio buttons.
//>>docs: http://api.jqueryui.com/checkboxradio/
//>>demos: http://jqueryui.com/checkboxradio/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.structure: ../../themes/base/checkboxradio.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/checkboxradio',[
            "jquery",
            "../form-reset-mixin",
            "../labels",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    $.widget( "ui.checkboxradio", [ $.ui.formResetMixin, {
        version: "1.13.2",
        options: {
            disabled: null,
            label: null,
            icon: true,
            classes: {
                "ui-checkboxradio-label": "ui-corner-all",
                "ui-checkboxradio-icon": "ui-corner-all"
            }
        },

        _getCreateOptions: function() {
            var disabled, labels, labelContents;
            var options = this._super() || {};

            // We read the type here, because it makes more sense to throw a element type error first,
            // rather then the error for lack of a label. Often if its the wrong type, it
            // won't have a label (e.g. calling on a div, btn, etc)
            this._readType();

            labels = this.element.labels();

            // If there are multiple labels, use the last one
            this.label = $( labels[ labels.length - 1 ] );
            if ( !this.label.length ) {
                $.error( "No label found for checkboxradio widget" );
            }

            this.originalLabel = "";

            // We need to get the label text but this may also need to make sure it does not contain the
            // input itself.
            // The label contents could be text, html, or a mix. We wrap all elements
            // and read the wrapper's `innerHTML` to get a string representation of
            // the label, without the input as part of it.
            labelContents = this.label.contents().not( this.element[ 0 ] );

            if ( labelContents.length ) {
                this.originalLabel += labelContents
                    .clone()
                    .wrapAll( "<div></div>" )
                    .parent()
                    .html();
            }

            // Set the label option if we found label text
            if ( this.originalLabel ) {
                options.label = this.originalLabel;
            }

            disabled = this.element[ 0 ].disabled;
            if ( disabled != null ) {
                options.disabled = disabled;
            }
            return options;
        },

        _create: function() {
            var checked = this.element[ 0 ].checked;

            this._bindFormResetHandler();

            if ( this.options.disabled == null ) {
                this.options.disabled = this.element[ 0 ].disabled;
            }

            this._setOption( "disabled", this.options.disabled );
            this._addClass( "ui-checkboxradio", "ui-helper-hidden-accessible" );
            this._addClass( this.label, "ui-checkboxradio-label", "ui-button ui-widget" );

            if ( this.type === "radio" ) {
                this._addClass( this.label, "ui-checkboxradio-radio-label" );
            }

            if ( this.options.label && this.options.label !== this.originalLabel ) {
                this._updateLabel();
            } else if ( this.originalLabel ) {
                this.options.label = this.originalLabel;
            }

            this._enhance();

            if ( checked ) {
                this._addClass( this.label, "ui-checkboxradio-checked", "ui-state-active" );
            }

            this._on( {
                change: "_toggleClasses",
                focus: function() {
                    this._addClass( this.label, null, "ui-state-focus ui-visual-focus" );
                },
                blur: function() {
                    this._removeClass( this.label, null, "ui-state-focus ui-visual-focus" );
                }
            } );
        },

        _readType: function() {
            var nodeName = this.element[ 0 ].nodeName.toLowerCase();
            this.type = this.element[ 0 ].type;
            if ( nodeName !== "input" || !/radio|checkbox/.test( this.type ) ) {
                $.error( "Can't create checkboxradio on element.nodeName=" + nodeName +
                    " and element.type=" + this.type );
            }
        },

        // Support jQuery Mobile enhanced option
        _enhance: function() {
            this._updateIcon( this.element[ 0 ].checked );
        },

        widget: function() {
            return this.label;
        },

        _getRadioGroup: function() {
            var group;
            var name = this.element[ 0 ].name;
            var nameSelector = "input[name='" + $.escapeSelector( name ) + "']";

            if ( !name ) {
                return $( [] );
            }

            if ( this.form.length ) {
                group = $( this.form[ 0 ].elements ).filter( nameSelector );
            } else {

                // Not inside a form, check all inputs that also are not inside a form
                group = $( nameSelector ).filter( function() {
                    return $( this )._form().length === 0;
                } );
            }

            return group.not( this.element );
        },

        _toggleClasses: function() {
            var checked = this.element[ 0 ].checked;
            this._toggleClass( this.label, "ui-checkboxradio-checked", "ui-state-active", checked );

            if ( this.options.icon && this.type === "checkbox" ) {
                this._toggleClass( this.icon, null, "ui-icon-check ui-state-checked", checked )
                    ._toggleClass( this.icon, null, "ui-icon-blank", !checked );
            }

            if ( this.type === "radio" ) {
                this._getRadioGroup()
                    .each( function() {
                        var instance = $( this ).checkboxradio( "instance" );

                        if ( instance ) {
                            instance._removeClass( instance.label,
                                "ui-checkboxradio-checked", "ui-state-active" );
                        }
                    } );
            }
        },

        _destroy: function() {
            this._unbindFormResetHandler();

            if ( this.icon ) {
                this.icon.remove();
                this.iconSpace.remove();
            }
        },

        _setOption: function( key, value ) {

            // We don't allow the value to be set to nothing
            if ( key === "label" && !value ) {
                return;
            }

            this._super( key, value );

            if ( key === "disabled" ) {
                this._toggleClass( this.label, null, "ui-state-disabled", value );
                this.element[ 0 ].disabled = value;

                // Don't refresh when setting disabled
                return;
            }
            this.refresh();
        },

        _updateIcon: function( checked ) {
            var toAdd = "ui-icon ui-icon-background ";

            if ( this.options.icon ) {
                if ( !this.icon ) {
                    this.icon = $( "<span>" );
                    this.iconSpace = $( "<span> </span>" );
                    this._addClass( this.iconSpace, "ui-checkboxradio-icon-space" );
                }

                if ( this.type === "checkbox" ) {
                    toAdd += checked ? "ui-icon-check ui-state-checked" : "ui-icon-blank";
                    this._removeClass( this.icon, null, checked ? "ui-icon-blank" : "ui-icon-check" );
                } else {
                    toAdd += "ui-icon-blank";
                }
                this._addClass( this.icon, "ui-checkboxradio-icon", toAdd );
                if ( !checked ) {
                    this._removeClass( this.icon, null, "ui-icon-check ui-state-checked" );
                }
                this.icon.prependTo( this.label ).after( this.iconSpace );
            } else if ( this.icon !== undefined ) {
                this.icon.remove();
                this.iconSpace.remove();
                delete this.icon;
            }
        },

        _updateLabel: function() {

            // Remove the contents of the label ( minus the icon, icon space, and input )
            var contents = this.label.contents().not( this.element[ 0 ] );
            if ( this.icon ) {
                contents = contents.not( this.icon[ 0 ] );
            }
            if ( this.iconSpace ) {
                contents = contents.not( this.iconSpace[ 0 ] );
            }
            contents.remove();

            this.label.append( this.options.label );
        },

        refresh: function() {
            var checked = this.element[ 0 ].checked,
                isDisabled = this.element[ 0 ].disabled;

            this._updateIcon( checked );
            this._toggleClass( this.label, "ui-checkboxradio-checked", "ui-state-active", checked );
            if ( this.options.label !== null ) {
                this._updateLabel();
            }

            if ( isDisabled !== this.options.disabled ) {
                this._setOptions( { "disabled": isDisabled } );
            }
        }

    } ] );

    return $.ui.checkboxradio;

} );

/*!
 * jQuery UI Button 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Button
//>>group: Widgets
//>>description: Enhances a form with themeable buttons.
//>>docs: http://api.jqueryui.com/button/
//>>demos: http://jqueryui.com/button/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/button',[
            "jquery",

            // These are only for backcompat
            // TODO: Remove after 1.12
            "./controlgroup",
            "./checkboxradio",

            "../keycode",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    $.widget( "ui.button", {
        version: "1.13.2",
        defaultElement: "<button>",
        options: {
            classes: {
                "ui-button": "ui-corner-all"
            },
            disabled: null,
            icon: null,
            iconPosition: "beginning",
            label: null,
            showLabel: true
        },

        _getCreateOptions: function() {
            var disabled,

                // This is to support cases like in jQuery Mobile where the base widget does have
                // an implementation of _getCreateOptions
                options = this._super() || {};

            this.isInput = this.element.is( "input" );

            disabled = this.element[ 0 ].disabled;
            if ( disabled != null ) {
                options.disabled = disabled;
            }

            this.originalLabel = this.isInput ? this.element.val() : this.element.html();
            if ( this.originalLabel ) {
                options.label = this.originalLabel;
            }

            return options;
        },

        _create: function() {
            if ( !this.option.showLabel & !this.options.icon ) {
                this.options.showLabel = true;
            }

            // We have to check the option again here even though we did in _getCreateOptions,
            // because null may have been passed on init which would override what was set in
            // _getCreateOptions
            if ( this.options.disabled == null ) {
                this.options.disabled = this.element[ 0 ].disabled || false;
            }

            this.hasTitle = !!this.element.attr( "title" );

            // Check to see if the label needs to be set or if its already correct
            if ( this.options.label && this.options.label !== this.originalLabel ) {
                if ( this.isInput ) {
                    this.element.val( this.options.label );
                } else {
                    this.element.html( this.options.label );
                }
            }
            this._addClass( "ui-button", "ui-widget" );
            this._setOption( "disabled", this.options.disabled );
            this._enhance();

            if ( this.element.is( "a" ) ) {
                this._on( {
                    "keyup": function( event ) {
                        if ( event.keyCode === $.ui.keyCode.SPACE ) {
                            event.preventDefault();

                            // Support: PhantomJS <= 1.9, IE 8 Only
                            // If a native click is available use it so we actually cause navigation
                            // otherwise just trigger a click event
                            if ( this.element[ 0 ].click ) {
                                this.element[ 0 ].click();
                            } else {
                                this.element.trigger( "click" );
                            }
                        }
                    }
                } );
            }
        },

        _enhance: function() {
            if ( !this.element.is( "button" ) ) {
                this.element.attr( "role", "button" );
            }

            if ( this.options.icon ) {
                this._updateIcon( "icon", this.options.icon );
                this._updateTooltip();
            }
        },

        _updateTooltip: function() {
            this.title = this.element.attr( "title" );

            if ( !this.options.showLabel && !this.title ) {
                this.element.attr( "title", this.options.label );
            }
        },

        _updateIcon: function( option, value ) {
            var icon = option !== "iconPosition",
                position = icon ? this.options.iconPosition : value,
                displayBlock = position === "top" || position === "bottom";

            // Create icon
            if ( !this.icon ) {
                this.icon = $( "<span>" );

                this._addClass( this.icon, "ui-button-icon", "ui-icon" );

                if ( !this.options.showLabel ) {
                    this._addClass( "ui-button-icon-only" );
                }
            } else if ( icon ) {

                // If we are updating the icon remove the old icon class
                this._removeClass( this.icon, null, this.options.icon );
            }

            // If we are updating the icon add the new icon class
            if ( icon ) {
                this._addClass( this.icon, null, value );
            }

            this._attachIcon( position );

            // If the icon is on top or bottom we need to add the ui-widget-icon-block class and remove
            // the iconSpace if there is one.
            if ( displayBlock ) {
                this._addClass( this.icon, null, "ui-widget-icon-block" );
                if ( this.iconSpace ) {
                    this.iconSpace.remove();
                }
            } else {

                // Position is beginning or end so remove the ui-widget-icon-block class and add the
                // space if it does not exist
                if ( !this.iconSpace ) {
                    this.iconSpace = $( "<span> </span>" );
                    this._addClass( this.iconSpace, "ui-button-icon-space" );
                }
                this._removeClass( this.icon, null, "ui-wiget-icon-block" );
                this._attachIconSpace( position );
            }
        },

        _destroy: function() {
            this.element.removeAttr( "role" );

            if ( this.icon ) {
                this.icon.remove();
            }
            if ( this.iconSpace ) {
                this.iconSpace.remove();
            }
            if ( !this.hasTitle ) {
                this.element.removeAttr( "title" );
            }
        },

        _attachIconSpace: function( iconPosition ) {
            this.icon[ /^(?:end|bottom)/.test( iconPosition ) ? "before" : "after" ]( this.iconSpace );
        },

        _attachIcon: function( iconPosition ) {
            this.element[ /^(?:end|bottom)/.test( iconPosition ) ? "append" : "prepend" ]( this.icon );
        },

        _setOptions: function( options ) {
            var newShowLabel = options.showLabel === undefined ?
                    this.options.showLabel :
                    options.showLabel,
                newIcon = options.icon === undefined ? this.options.icon : options.icon;

            if ( !newShowLabel && !newIcon ) {
                options.showLabel = true;
            }
            this._super( options );
        },

        _setOption: function( key, value ) {
            if ( key === "icon" ) {
                if ( value ) {
                    this._updateIcon( key, value );
                } else if ( this.icon ) {
                    this.icon.remove();
                    if ( this.iconSpace ) {
                        this.iconSpace.remove();
                    }
                }
            }

            if ( key === "iconPosition" ) {
                this._updateIcon( key, value );
            }

            // Make sure we can't end up with a button that has neither text nor icon
            if ( key === "showLabel" ) {
                this._toggleClass( "ui-button-icon-only", null, !value );
                this._updateTooltip();
            }

            if ( key === "label" ) {
                if ( this.isInput ) {
                    this.element.val( value );
                } else {

                    // If there is an icon, append it, else nothing then append the value
                    // this avoids removal of the icon when setting label text
                    this.element.html( value );
                    if ( this.icon ) {
                        this._attachIcon( this.options.iconPosition );
                        this._attachIconSpace( this.options.iconPosition );
                    }
                }
            }

            this._super( key, value );

            if ( key === "disabled" ) {
                this._toggleClass( null, "ui-state-disabled", value );
                this.element[ 0 ].disabled = value;
                if ( value ) {
                    this.element.trigger( "blur" );
                }
            }
        },

        refresh: function() {

            // Make sure to only check disabled if its an element that supports this otherwise
            // check for the disabled class to determine state
            var isDisabled = this.element.is( "input, button" ) ?
                this.element[ 0 ].disabled : this.element.hasClass( "ui-button-disabled" );

            if ( isDisabled !== this.options.disabled ) {
                this._setOptions( { disabled: isDisabled } );
            }

            this._updateTooltip();
        }
    } );

// DEPRECATED
    if ( $.uiBackCompat !== false ) {

        // Text and Icons options
        $.widget( "ui.button", $.ui.button, {
            options: {
                text: true,
                icons: {
                    primary: null,
                    secondary: null
                }
            },

            _create: function() {
                if ( this.options.showLabel && !this.options.text ) {
                    this.options.showLabel = this.options.text;
                }
                if ( !this.options.showLabel && this.options.text ) {
                    this.options.text = this.options.showLabel;
                }
                if ( !this.options.icon && ( this.options.icons.primary ||
                    this.options.icons.secondary ) ) {
                    if ( this.options.icons.primary ) {
                        this.options.icon = this.options.icons.primary;
                    } else {
                        this.options.icon = this.options.icons.secondary;
                        this.options.iconPosition = "end";
                    }
                } else if ( this.options.icon ) {
                    this.options.icons.primary = this.options.icon;
                }
                this._super();
            },

            _setOption: function( key, value ) {
                if ( key === "text" ) {
                    this._super( "showLabel", value );
                    return;
                }
                if ( key === "showLabel" ) {
                    this.options.text = value;
                }
                if ( key === "icon" ) {
                    this.options.icons.primary = value;
                }
                if ( key === "icons" ) {
                    if ( value.primary ) {
                        this._super( "icon", value.primary );
                        this._super( "iconPosition", "beginning" );
                    } else if ( value.secondary ) {
                        this._super( "icon", value.secondary );
                        this._super( "iconPosition", "end" );
                    }
                }
                this._superApply( arguments );
            }
        } );

        $.fn.button = ( function( orig ) {
            return function( options ) {
                var isMethodCall = typeof options === "string";
                var args = Array.prototype.slice.call( arguments, 1 );
                var returnValue = this;

                if ( isMethodCall ) {

                    // If this is an empty collection, we need to have the instance method
                    // return undefined instead of the jQuery instance
                    if ( !this.length && options === "instance" ) {
                        returnValue = undefined;
                    } else {
                        this.each( function() {
                            var methodValue;
                            var type = $( this ).attr( "type" );
                            var name = type !== "checkbox" && type !== "radio" ?
                                "button" :
                                "checkboxradio";
                            var instance = $.data( this, "ui-" + name );

                            if ( options === "instance" ) {
                                returnValue = instance;
                                return false;
                            }

                            if ( !instance ) {
                                return $.error( "cannot call methods on button" +
                                    " prior to initialization; " +
                                    "attempted to call method '" + options + "'" );
                            }

                            if ( typeof instance[ options ] !== "function" ||
                                options.charAt( 0 ) === "_" ) {
                                return $.error( "no such method '" + options + "' for button" +
                                    " widget instance" );
                            }

                            methodValue = instance[ options ].apply( instance, args );

                            if ( methodValue !== instance && methodValue !== undefined ) {
                                returnValue = methodValue && methodValue.jquery ?
                                    returnValue.pushStack( methodValue.get() ) :
                                    methodValue;
                                return false;
                            }
                        } );
                    }
                } else {

                    // Allow multiple hashes to be passed on init
                    if ( args.length ) {
                        options = $.widget.extend.apply( null, [ options ].concat( args ) );
                    }

                    this.each( function() {
                        var type = $( this ).attr( "type" );
                        var name = type !== "checkbox" && type !== "radio" ? "button" : "checkboxradio";
                        var instance = $.data( this, "ui-" + name );

                        if ( instance ) {
                            instance.option( options || {} );
                            if ( instance._init ) {
                                instance._init();
                            }
                        } else {
                            if ( name === "button" ) {
                                orig.call( $( this ), options );
                                return;
                            }

                            $( this ).checkboxradio( $.extend( { icon: false }, options ) );
                        }
                    } );
                }

                return returnValue;
            };
        } )( $.fn.button );

        $.fn.buttonset = function() {
            if ( !$.ui.controlgroup ) {
                $.error( "Controlgroup widget missing" );
            }
            if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" && arguments[ 2 ] ) {
                return this.controlgroup.apply( this,
                    [ arguments[ 0 ], "items.button", arguments[ 2 ] ] );
            }
            if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" ) {
                return this.controlgroup.apply( this, [ arguments[ 0 ], "items.button" ] );
            }
            if ( typeof arguments[ 0 ] === "object" && arguments[ 0 ].items ) {
                arguments[ 0 ].items = {
                    button: arguments[ 0 ].items
                };
            }
            return this.controlgroup.apply( this, arguments );
        };
    }

    return $.ui.button;

} );

/*!
 * jQuery UI Resizable 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Resizable
//>>group: Interactions
//>>description: Enables resize functionality for any element.
//>>docs: http://api.jqueryui.com/resizable/
//>>demos: http://jqueryui.com/resizable/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/resizable.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/resizable',[
            "jquery",
            "./mouse",
            "../disable-selection",
            "../plugin",
            "../version",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    $.widget( "ui.resizable", $.ui.mouse, {
        version: "1.13.2",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: false,
            animate: false,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: false,
            autoHide: false,
            classes: {
                "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
            },
            containment: false,
            ghost: false,
            grid: false,
            handles: "e,s,se",
            helper: false,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,

            // See #7960
            zIndex: 90,

            // Callbacks
            resize: null,
            start: null,
            stop: null
        },

        _num: function( value ) {
            return parseFloat( value ) || 0;
        },

        _isNumber: function( value ) {
            return !isNaN( parseFloat( value ) );
        },

        _hasScroll: function( el, a ) {

            if ( $( el ).css( "overflow" ) === "hidden" ) {
                return false;
            }

            var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
                has = false;

            if ( el[ scroll ] > 0 ) {
                return true;
            }

            // TODO: determine which cases actually cause this to happen
            // if the element doesn't have the scroll set, see if it's possible to
            // set the scroll
            try {
                el[ scroll ] = 1;
                has = ( el[ scroll ] > 0 );
                el[ scroll ] = 0;
            } catch ( e ) {

                // `el` might be a string, then setting `scroll` will throw
                // an error in strict mode; ignore it.
            }
            return has;
        },

        _create: function() {

            var margins,
                o = this.options,
                that = this;
            this._addClass( "ui-resizable" );

            $.extend( this, {
                _aspectRatio: !!( o.aspectRatio ),
                aspectRatio: o.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
            } );

            // Wrap the element if it cannot hold child nodes
            if ( this.element[ 0 ].nodeName.match( /^(canvas|textarea|input|select|button|img)$/i ) ) {

                this.element.wrap(
                    $( "<div class='ui-wrapper'></div>" ).css( {
                        overflow: "hidden",
                        position: this.element.css( "position" ),
                        width: this.element.outerWidth(),
                        height: this.element.outerHeight(),
                        top: this.element.css( "top" ),
                        left: this.element.css( "left" )
                    } )
                );

                this.element = this.element.parent().data(
                    "ui-resizable", this.element.resizable( "instance" )
                );

                this.elementIsWrapper = true;

                margins = {
                    marginTop: this.originalElement.css( "marginTop" ),
                    marginRight: this.originalElement.css( "marginRight" ),
                    marginBottom: this.originalElement.css( "marginBottom" ),
                    marginLeft: this.originalElement.css( "marginLeft" )
                };

                this.element.css( margins );
                this.originalElement.css( "margin", 0 );

                // support: Safari
                // Prevent Safari textarea resize
                this.originalResizeStyle = this.originalElement.css( "resize" );
                this.originalElement.css( "resize", "none" );

                this._proportionallyResizeElements.push( this.originalElement.css( {
                    position: "static",
                    zoom: 1,
                    display: "block"
                } ) );

                // Support: IE9
                // avoid IE jump (hard set the margin)
                this.originalElement.css( margins );

                this._proportionallyResize();
            }

            this._setupHandles();

            if ( o.autoHide ) {
                $( this.element )
                    .on( "mouseenter", function() {
                        if ( o.disabled ) {
                            return;
                        }
                        that._removeClass( "ui-resizable-autohide" );
                        that._handles.show();
                    } )
                    .on( "mouseleave", function() {
                        if ( o.disabled ) {
                            return;
                        }
                        if ( !that.resizing ) {
                            that._addClass( "ui-resizable-autohide" );
                            that._handles.hide();
                        }
                    } );
            }

            this._mouseInit();
        },

        _destroy: function() {

            this._mouseDestroy();
            this._addedHandles.remove();

            var wrapper,
                _destroy = function( exp ) {
                    $( exp )
                        .removeData( "resizable" )
                        .removeData( "ui-resizable" )
                        .off( ".resizable" );
                };

            // TODO: Unwrap at same DOM position
            if ( this.elementIsWrapper ) {
                _destroy( this.element );
                wrapper = this.element;
                this.originalElement.css( {
                    position: wrapper.css( "position" ),
                    width: wrapper.outerWidth(),
                    height: wrapper.outerHeight(),
                    top: wrapper.css( "top" ),
                    left: wrapper.css( "left" )
                } ).insertAfter( wrapper );
                wrapper.remove();
            }

            this.originalElement.css( "resize", this.originalResizeStyle );
            _destroy( this.originalElement );

            return this;
        },

        _setOption: function( key, value ) {
            this._super( key, value );

            switch ( key ) {
                case "handles":
                    this._removeHandles();
                    this._setupHandles();
                    break;
                case "aspectRatio":
                    this._aspectRatio = !!value;
                    break;
                default:
                    break;
            }
        },

        _setupHandles: function() {
            var o = this.options, handle, i, n, hname, axis, that = this;
            this.handles = o.handles ||
                ( !$( ".ui-resizable-handle", this.element ).length ?
                    "e,s,se" : {
                        n: ".ui-resizable-n",
                        e: ".ui-resizable-e",
                        s: ".ui-resizable-s",
                        w: ".ui-resizable-w",
                        se: ".ui-resizable-se",
                        sw: ".ui-resizable-sw",
                        ne: ".ui-resizable-ne",
                        nw: ".ui-resizable-nw"
                    } );

            this._handles = $();
            this._addedHandles = $();
            if ( this.handles.constructor === String ) {

                if ( this.handles === "all" ) {
                    this.handles = "n,e,s,w,se,sw,ne,nw";
                }

                n = this.handles.split( "," );
                this.handles = {};

                for ( i = 0; i < n.length; i++ ) {

                    handle = String.prototype.trim.call( n[ i ] );
                    hname = "ui-resizable-" + handle;
                    axis = $( "<div>" );
                    this._addClass( axis, "ui-resizable-handle " + hname );

                    axis.css( { zIndex: o.zIndex } );

                    this.handles[ handle ] = ".ui-resizable-" + handle;
                    if ( !this.element.children( this.handles[ handle ] ).length ) {
                        this.element.append( axis );
                        this._addedHandles = this._addedHandles.add( axis );
                    }
                }

            }

            this._renderAxis = function( target ) {

                var i, axis, padPos, padWrapper;

                target = target || this.element;

                for ( i in this.handles ) {

                    if ( this.handles[ i ].constructor === String ) {
                        this.handles[ i ] = this.element.children( this.handles[ i ] ).first().show();
                    } else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
                        this.handles[ i ] = $( this.handles[ i ] );
                        this._on( this.handles[ i ], { "mousedown": that._mouseDown } );
                    }

                    if ( this.elementIsWrapper &&
                        this.originalElement[ 0 ]
                            .nodeName
                            .match( /^(textarea|input|select|button)$/i ) ) {
                        axis = $( this.handles[ i ], this.element );

                        padWrapper = /sw|ne|nw|se|n|s/.test( i ) ?
                            axis.outerHeight() :
                            axis.outerWidth();

                        padPos = [ "padding",
                            /ne|nw|n/.test( i ) ? "Top" :
                                /se|sw|s/.test( i ) ? "Bottom" :
                                    /^e$/.test( i ) ? "Right" : "Left" ].join( "" );

                        target.css( padPos, padWrapper );

                        this._proportionallyResize();
                    }

                    this._handles = this._handles.add( this.handles[ i ] );
                }
            };

            // TODO: make renderAxis a prototype function
            this._renderAxis( this.element );

            this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
            this._handles.disableSelection();

            this._handles.on( "mouseover", function() {
                if ( !that.resizing ) {
                    if ( this.className ) {
                        axis = this.className.match( /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i );
                    }
                    that.axis = axis && axis[ 1 ] ? axis[ 1 ] : "se";
                }
            } );

            if ( o.autoHide ) {
                this._handles.hide();
                this._addClass( "ui-resizable-autohide" );
            }
        },

        _removeHandles: function() {
            this._addedHandles.remove();
        },

        _mouseCapture: function( event ) {
            var i, handle,
                capture = false;

            for ( i in this.handles ) {
                handle = $( this.handles[ i ] )[ 0 ];
                if ( handle === event.target || $.contains( handle, event.target ) ) {
                    capture = true;
                }
            }

            return !this.options.disabled && capture;
        },

        _mouseStart: function( event ) {

            var curleft, curtop, cursor,
                o = this.options,
                el = this.element;

            this.resizing = true;

            this._renderProxy();

            curleft = this._num( this.helper.css( "left" ) );
            curtop = this._num( this.helper.css( "top" ) );

            if ( o.containment ) {
                curleft += $( o.containment ).scrollLeft() || 0;
                curtop += $( o.containment ).scrollTop() || 0;
            }

            this.offset = this.helper.offset();
            this.position = { left: curleft, top: curtop };

            this.size = this._helper ? {
                width: this.helper.width(),
                height: this.helper.height()
            } : {
                width: el.width(),
                height: el.height()
            };

            this.originalSize = this._helper ? {
                width: el.outerWidth(),
                height: el.outerHeight()
            } : {
                width: el.width(),
                height: el.height()
            };

            this.sizeDiff = {
                width: el.outerWidth() - el.width(),
                height: el.outerHeight() - el.height()
            };

            this.originalPosition = { left: curleft, top: curtop };
            this.originalMousePosition = { left: event.pageX, top: event.pageY };

            this.aspectRatio = ( typeof o.aspectRatio === "number" ) ?
                o.aspectRatio :
                ( ( this.originalSize.width / this.originalSize.height ) || 1 );

            cursor = $( ".ui-resizable-" + this.axis ).css( "cursor" );
            $( "body" ).css( "cursor", cursor === "auto" ? this.axis + "-resize" : cursor );

            this._addClass( "ui-resizable-resizing" );
            this._propagate( "start", event );
            return true;
        },

        _mouseDrag: function( event ) {

            var data, props,
                smp = this.originalMousePosition,
                a = this.axis,
                dx = ( event.pageX - smp.left ) || 0,
                dy = ( event.pageY - smp.top ) || 0,
                trigger = this._change[ a ];

            this._updatePrevProperties();

            if ( !trigger ) {
                return false;
            }

            data = trigger.apply( this, [ event, dx, dy ] );

            this._updateVirtualBoundaries( event.shiftKey );
            if ( this._aspectRatio || event.shiftKey ) {
                data = this._updateRatio( data, event );
            }

            data = this._respectSize( data, event );

            this._updateCache( data );

            this._propagate( "resize", event );

            props = this._applyChanges();

            if ( !this._helper && this._proportionallyResizeElements.length ) {
                this._proportionallyResize();
            }

            if ( !$.isEmptyObject( props ) ) {
                this._updatePrevProperties();
                this._trigger( "resize", event, this.ui() );
                this._applyChanges();
            }

            return false;
        },

        _mouseStop: function( event ) {

            this.resizing = false;
            var pr, ista, soffseth, soffsetw, s, left, top,
                o = this.options, that = this;

            if ( this._helper ) {

                pr = this._proportionallyResizeElements;
                ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName );
                soffseth = ista && this._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height;
                soffsetw = ista ? 0 : that.sizeDiff.width;

                s = {
                    width: ( that.helper.width()  - soffsetw ),
                    height: ( that.helper.height() - soffseth )
                };
                left = ( parseFloat( that.element.css( "left" ) ) +
                    ( that.position.left - that.originalPosition.left ) ) || null;
                top = ( parseFloat( that.element.css( "top" ) ) +
                    ( that.position.top - that.originalPosition.top ) ) || null;

                if ( !o.animate ) {
                    this.element.css( $.extend( s, { top: top, left: left } ) );
                }

                that.helper.height( that.size.height );
                that.helper.width( that.size.width );

                if ( this._helper && !o.animate ) {
                    this._proportionallyResize();
                }
            }

            $( "body" ).css( "cursor", "auto" );

            this._removeClass( "ui-resizable-resizing" );

            this._propagate( "stop", event );

            if ( this._helper ) {
                this.helper.remove();
            }

            return false;

        },

        _updatePrevProperties: function() {
            this.prevPosition = {
                top: this.position.top,
                left: this.position.left
            };
            this.prevSize = {
                width: this.size.width,
                height: this.size.height
            };
        },

        _applyChanges: function() {
            var props = {};

            if ( this.position.top !== this.prevPosition.top ) {
                props.top = this.position.top + "px";
            }
            if ( this.position.left !== this.prevPosition.left ) {
                props.left = this.position.left + "px";
            }
            if ( this.size.width !== this.prevSize.width ) {
                props.width = this.size.width + "px";
            }
            if ( this.size.height !== this.prevSize.height ) {
                props.height = this.size.height + "px";
            }

            this.helper.css( props );

            return props;
        },

        _updateVirtualBoundaries: function( forceAspectRatio ) {
            var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
                o = this.options;

            b = {
                minWidth: this._isNumber( o.minWidth ) ? o.minWidth : 0,
                maxWidth: this._isNumber( o.maxWidth ) ? o.maxWidth : Infinity,
                minHeight: this._isNumber( o.minHeight ) ? o.minHeight : 0,
                maxHeight: this._isNumber( o.maxHeight ) ? o.maxHeight : Infinity
            };

            if ( this._aspectRatio || forceAspectRatio ) {
                pMinWidth = b.minHeight * this.aspectRatio;
                pMinHeight = b.minWidth / this.aspectRatio;
                pMaxWidth = b.maxHeight * this.aspectRatio;
                pMaxHeight = b.maxWidth / this.aspectRatio;

                if ( pMinWidth > b.minWidth ) {
                    b.minWidth = pMinWidth;
                }
                if ( pMinHeight > b.minHeight ) {
                    b.minHeight = pMinHeight;
                }
                if ( pMaxWidth < b.maxWidth ) {
                    b.maxWidth = pMaxWidth;
                }
                if ( pMaxHeight < b.maxHeight ) {
                    b.maxHeight = pMaxHeight;
                }
            }
            this._vBoundaries = b;
        },

        _updateCache: function( data ) {
            this.offset = this.helper.offset();
            if ( this._isNumber( data.left ) ) {
                this.position.left = data.left;
            }
            if ( this._isNumber( data.top ) ) {
                this.position.top = data.top;
            }
            if ( this._isNumber( data.height ) ) {
                this.size.height = data.height;
            }
            if ( this._isNumber( data.width ) ) {
                this.size.width = data.width;
            }
        },

        _updateRatio: function( data ) {

            var cpos = this.position,
                csize = this.size,
                a = this.axis;

            if ( this._isNumber( data.height ) ) {
                data.width = ( data.height * this.aspectRatio );
            } else if ( this._isNumber( data.width ) ) {
                data.height = ( data.width / this.aspectRatio );
            }

            if ( a === "sw" ) {
                data.left = cpos.left + ( csize.width - data.width );
                data.top = null;
            }
            if ( a === "nw" ) {
                data.top = cpos.top + ( csize.height - data.height );
                data.left = cpos.left + ( csize.width - data.width );
            }

            return data;
        },

        _respectSize: function( data ) {

            var o = this._vBoundaries,
                a = this.axis,
                ismaxw = this._isNumber( data.width ) && o.maxWidth && ( o.maxWidth < data.width ),
                ismaxh = this._isNumber( data.height ) && o.maxHeight && ( o.maxHeight < data.height ),
                isminw = this._isNumber( data.width ) && o.minWidth && ( o.minWidth > data.width ),
                isminh = this._isNumber( data.height ) && o.minHeight && ( o.minHeight > data.height ),
                dw = this.originalPosition.left + this.originalSize.width,
                dh = this.originalPosition.top + this.originalSize.height,
                cw = /sw|nw|w/.test( a ), ch = /nw|ne|n/.test( a );
            if ( isminw ) {
                data.width = o.minWidth;
            }
            if ( isminh ) {
                data.height = o.minHeight;
            }
            if ( ismaxw ) {
                data.width = o.maxWidth;
            }
            if ( ismaxh ) {
                data.height = o.maxHeight;
            }

            if ( isminw && cw ) {
                data.left = dw - o.minWidth;
            }
            if ( ismaxw && cw ) {
                data.left = dw - o.maxWidth;
            }
            if ( isminh && ch ) {
                data.top = dh - o.minHeight;
            }
            if ( ismaxh && ch ) {
                data.top = dh - o.maxHeight;
            }

            // Fixing jump error on top/left - bug #2330
            if ( !data.width && !data.height && !data.left && data.top ) {
                data.top = null;
            } else if ( !data.width && !data.height && !data.top && data.left ) {
                data.left = null;
            }

            return data;
        },

        _getPaddingPlusBorderDimensions: function( element ) {
            var i = 0,
                widths = [],
                borders = [
                    element.css( "borderTopWidth" ),
                    element.css( "borderRightWidth" ),
                    element.css( "borderBottomWidth" ),
                    element.css( "borderLeftWidth" )
                ],
                paddings = [
                    element.css( "paddingTop" ),
                    element.css( "paddingRight" ),
                    element.css( "paddingBottom" ),
                    element.css( "paddingLeft" )
                ];

            for ( ; i < 4; i++ ) {
                widths[ i ] = ( parseFloat( borders[ i ] ) || 0 );
                widths[ i ] += ( parseFloat( paddings[ i ] ) || 0 );
            }

            return {
                height: widths[ 0 ] + widths[ 2 ],
                width: widths[ 1 ] + widths[ 3 ]
            };
        },

        _proportionallyResize: function() {

            if ( !this._proportionallyResizeElements.length ) {
                return;
            }

            var prel,
                i = 0,
                element = this.helper || this.element;

            for ( ; i < this._proportionallyResizeElements.length; i++ ) {

                prel = this._proportionallyResizeElements[ i ];

                // TODO: Seems like a bug to cache this.outerDimensions
                // considering that we are in a loop.
                if ( !this.outerDimensions ) {
                    this.outerDimensions = this._getPaddingPlusBorderDimensions( prel );
                }

                prel.css( {
                    height: ( element.height() - this.outerDimensions.height ) || 0,
                    width: ( element.width() - this.outerDimensions.width ) || 0
                } );

            }

        },

        _renderProxy: function() {

            var el = this.element, o = this.options;
            this.elementOffset = el.offset();

            if ( this._helper ) {

                this.helper = this.helper || $( "<div></div>" ).css( { overflow: "hidden" } );

                this._addClass( this.helper, this._helper );
                this.helper.css( {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight(),
                    position: "absolute",
                    left: this.elementOffset.left + "px",
                    top: this.elementOffset.top + "px",
                    zIndex: ++o.zIndex //TODO: Don't modify option
                } );

                this.helper
                    .appendTo( "body" )
                    .disableSelection();

            } else {
                this.helper = this.element;
            }

        },

        _change: {
            e: function( event, dx ) {
                return { width: this.originalSize.width + dx };
            },
            w: function( event, dx ) {
                var cs = this.originalSize, sp = this.originalPosition;
                return { left: sp.left + dx, width: cs.width - dx };
            },
            n: function( event, dx, dy ) {
                var cs = this.originalSize, sp = this.originalPosition;
                return { top: sp.top + dy, height: cs.height - dy };
            },
            s: function( event, dx, dy ) {
                return { height: this.originalSize.height + dy };
            },
            se: function( event, dx, dy ) {
                return $.extend( this._change.s.apply( this, arguments ),
                    this._change.e.apply( this, [ event, dx, dy ] ) );
            },
            sw: function( event, dx, dy ) {
                return $.extend( this._change.s.apply( this, arguments ),
                    this._change.w.apply( this, [ event, dx, dy ] ) );
            },
            ne: function( event, dx, dy ) {
                return $.extend( this._change.n.apply( this, arguments ),
                    this._change.e.apply( this, [ event, dx, dy ] ) );
            },
            nw: function( event, dx, dy ) {
                return $.extend( this._change.n.apply( this, arguments ),
                    this._change.w.apply( this, [ event, dx, dy ] ) );
            }
        },

        _propagate: function( n, event ) {
            $.ui.plugin.call( this, n, [ event, this.ui() ] );
            if ( n !== "resize" ) {
                this._trigger( n, event, this.ui() );
            }
        },

        plugins: {},

        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            };
        }

    } );

    /*
     * Resizable Extensions
     */

    $.ui.plugin.add( "resizable", "animate", {

        stop: function( event ) {
            var that = $( this ).resizable( "instance" ),
                o = that.options,
                pr = that._proportionallyResizeElements,
                ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName ),
                soffseth = ista && that._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height,
                soffsetw = ista ? 0 : that.sizeDiff.width,
                style = {
                    width: ( that.size.width - soffsetw ),
                    height: ( that.size.height - soffseth )
                },
                left = ( parseFloat( that.element.css( "left" ) ) +
                    ( that.position.left - that.originalPosition.left ) ) || null,
                top = ( parseFloat( that.element.css( "top" ) ) +
                    ( that.position.top - that.originalPosition.top ) ) || null;

            that.element.animate(
                $.extend( style, top && left ? { top: top, left: left } : {} ), {
                    duration: o.animateDuration,
                    easing: o.animateEasing,
                    step: function() {

                        var data = {
                            width: parseFloat( that.element.css( "width" ) ),
                            height: parseFloat( that.element.css( "height" ) ),
                            top: parseFloat( that.element.css( "top" ) ),
                            left: parseFloat( that.element.css( "left" ) )
                        };

                        if ( pr && pr.length ) {
                            $( pr[ 0 ] ).css( { width: data.width, height: data.height } );
                        }

                        // Propagating resize, and updating values for each animation step
                        that._updateCache( data );
                        that._propagate( "resize", event );

                    }
                }
            );
        }

    } );

    $.ui.plugin.add( "resizable", "containment", {

        start: function() {
            var element, p, co, ch, cw, width, height,
                that = $( this ).resizable( "instance" ),
                o = that.options,
                el = that.element,
                oc = o.containment,
                ce = ( oc instanceof $ ) ?
                    oc.get( 0 ) :
                    ( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

            if ( !ce ) {
                return;
            }

            that.containerElement = $( ce );

            if ( /document/.test( oc ) || oc === document ) {
                that.containerOffset = {
                    left: 0,
                    top: 0
                };
                that.containerPosition = {
                    left: 0,
                    top: 0
                };

                that.parentData = {
                    element: $( document ),
                    left: 0,
                    top: 0,
                    width: $( document ).width(),
                    height: $( document ).height() || document.body.parentNode.scrollHeight
                };
            } else {
                element = $( ce );
                p = [];
                $( [ "Top", "Right", "Left", "Bottom" ] ).each( function( i, name ) {
                    p[ i ] = that._num( element.css( "padding" + name ) );
                } );

                that.containerOffset = element.offset();
                that.containerPosition = element.position();
                that.containerSize = {
                    height: ( element.innerHeight() - p[ 3 ] ),
                    width: ( element.innerWidth() - p[ 1 ] )
                };

                co = that.containerOffset;
                ch = that.containerSize.height;
                cw = that.containerSize.width;
                width = ( that._hasScroll( ce, "left" ) ? ce.scrollWidth : cw );
                height = ( that._hasScroll( ce ) ? ce.scrollHeight : ch );

                that.parentData = {
                    element: ce,
                    left: co.left,
                    top: co.top,
                    width: width,
                    height: height
                };
            }
        },

        resize: function( event ) {
            var woset, hoset, isParent, isOffsetRelative,
                that = $( this ).resizable( "instance" ),
                o = that.options,
                co = that.containerOffset,
                cp = that.position,
                pRatio = that._aspectRatio || event.shiftKey,
                cop = {
                    top: 0,
                    left: 0
                },
                ce = that.containerElement,
                continueResize = true;

            if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
                cop = co;
            }

            if ( cp.left < ( that._helper ? co.left : 0 ) ) {
                that.size.width = that.size.width +
                    ( that._helper ?
                        ( that.position.left - co.left ) :
                        ( that.position.left - cop.left ) );

                if ( pRatio ) {
                    that.size.height = that.size.width / that.aspectRatio;
                    continueResize = false;
                }
                that.position.left = o.helper ? co.left : 0;
            }

            if ( cp.top < ( that._helper ? co.top : 0 ) ) {
                that.size.height = that.size.height +
                    ( that._helper ?
                        ( that.position.top - co.top ) :
                        that.position.top );

                if ( pRatio ) {
                    that.size.width = that.size.height * that.aspectRatio;
                    continueResize = false;
                }
                that.position.top = that._helper ? co.top : 0;
            }

            isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
            isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

            if ( isParent && isOffsetRelative ) {
                that.offset.left = that.parentData.left + that.position.left;
                that.offset.top = that.parentData.top + that.position.top;
            } else {
                that.offset.left = that.element.offset().left;
                that.offset.top = that.element.offset().top;
            }

            woset = Math.abs( that.sizeDiff.width +
                ( that._helper ?
                    that.offset.left - cop.left :
                    ( that.offset.left - co.left ) ) );

            hoset = Math.abs( that.sizeDiff.height +
                ( that._helper ?
                    that.offset.top - cop.top :
                    ( that.offset.top - co.top ) ) );

            if ( woset + that.size.width >= that.parentData.width ) {
                that.size.width = that.parentData.width - woset;
                if ( pRatio ) {
                    that.size.height = that.size.width / that.aspectRatio;
                    continueResize = false;
                }
            }

            if ( hoset + that.size.height >= that.parentData.height ) {
                that.size.height = that.parentData.height - hoset;
                if ( pRatio ) {
                    that.size.width = that.size.height * that.aspectRatio;
                    continueResize = false;
                }
            }

            if ( !continueResize ) {
                that.position.left = that.prevPosition.left;
                that.position.top = that.prevPosition.top;
                that.size.width = that.prevSize.width;
                that.size.height = that.prevSize.height;
            }
        },

        stop: function() {
            var that = $( this ).resizable( "instance" ),
                o = that.options,
                co = that.containerOffset,
                cop = that.containerPosition,
                ce = that.containerElement,
                helper = $( that.helper ),
                ho = helper.offset(),
                w = helper.outerWidth() - that.sizeDiff.width,
                h = helper.outerHeight() - that.sizeDiff.height;

            if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
                $( this ).css( {
                    left: ho.left - cop.left - co.left,
                    width: w,
                    height: h
                } );
            }

            if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
                $( this ).css( {
                    left: ho.left - cop.left - co.left,
                    width: w,
                    height: h
                } );
            }
        }
    } );

    $.ui.plugin.add( "resizable", "alsoResize", {

        start: function() {
            var that = $( this ).resizable( "instance" ),
                o = that.options;

            $( o.alsoResize ).each( function() {
                var el = $( this );
                el.data( "ui-resizable-alsoresize", {
                    width: parseFloat( el.width() ), height: parseFloat( el.height() ),
                    left: parseFloat( el.css( "left" ) ), top: parseFloat( el.css( "top" ) )
                } );
            } );
        },

        resize: function( event, ui ) {
            var that = $( this ).resizable( "instance" ),
                o = that.options,
                os = that.originalSize,
                op = that.originalPosition,
                delta = {
                    height: ( that.size.height - os.height ) || 0,
                    width: ( that.size.width - os.width ) || 0,
                    top: ( that.position.top - op.top ) || 0,
                    left: ( that.position.left - op.left ) || 0
                };

            $( o.alsoResize ).each( function() {
                var el = $( this ), start = $( this ).data( "ui-resizable-alsoresize" ), style = {},
                    css = el.parents( ui.originalElement[ 0 ] ).length ?
                        [ "width", "height" ] :
                        [ "width", "height", "top", "left" ];

                $.each( css, function( i, prop ) {
                    var sum = ( start[ prop ] || 0 ) + ( delta[ prop ] || 0 );
                    if ( sum && sum >= 0 ) {
                        style[ prop ] = sum || null;
                    }
                } );

                el.css( style );
            } );
        },

        stop: function() {
            $( this ).removeData( "ui-resizable-alsoresize" );
        }
    } );

    $.ui.plugin.add( "resizable", "ghost", {

        start: function() {

            var that = $( this ).resizable( "instance" ), cs = that.size;

            that.ghost = that.originalElement.clone();
            that.ghost.css( {
                opacity: 0.25,
                display: "block",
                position: "relative",
                height: cs.height,
                width: cs.width,
                margin: 0,
                left: 0,
                top: 0
            } );

            that._addClass( that.ghost, "ui-resizable-ghost" );

            // DEPRECATED
            // TODO: remove after 1.12
            if ( $.uiBackCompat !== false && typeof that.options.ghost === "string" ) {

                // Ghost option
                that.ghost.addClass( this.options.ghost );
            }

            that.ghost.appendTo( that.helper );

        },

        resize: function() {
            var that = $( this ).resizable( "instance" );
            if ( that.ghost ) {
                that.ghost.css( {
                    position: "relative",
                    height: that.size.height,
                    width: that.size.width
                } );
            }
        },

        stop: function() {
            var that = $( this ).resizable( "instance" );
            if ( that.ghost && that.helper ) {
                that.helper.get( 0 ).removeChild( that.ghost.get( 0 ) );
            }
        }

    } );

    $.ui.plugin.add( "resizable", "grid", {

        resize: function() {
            var outerDimensions,
                that = $( this ).resizable( "instance" ),
                o = that.options,
                cs = that.size,
                os = that.originalSize,
                op = that.originalPosition,
                a = that.axis,
                grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
                gridX = ( grid[ 0 ] || 1 ),
                gridY = ( grid[ 1 ] || 1 ),
                ox = Math.round( ( cs.width - os.width ) / gridX ) * gridX,
                oy = Math.round( ( cs.height - os.height ) / gridY ) * gridY,
                newWidth = os.width + ox,
                newHeight = os.height + oy,
                isMaxWidth = o.maxWidth && ( o.maxWidth < newWidth ),
                isMaxHeight = o.maxHeight && ( o.maxHeight < newHeight ),
                isMinWidth = o.minWidth && ( o.minWidth > newWidth ),
                isMinHeight = o.minHeight && ( o.minHeight > newHeight );

            o.grid = grid;

            if ( isMinWidth ) {
                newWidth += gridX;
            }
            if ( isMinHeight ) {
                newHeight += gridY;
            }
            if ( isMaxWidth ) {
                newWidth -= gridX;
            }
            if ( isMaxHeight ) {
                newHeight -= gridY;
            }

            if ( /^(se|s|e)$/.test( a ) ) {
                that.size.width = newWidth;
                that.size.height = newHeight;
            } else if ( /^(ne)$/.test( a ) ) {
                that.size.width = newWidth;
                that.size.height = newHeight;
                that.position.top = op.top - oy;
            } else if ( /^(sw)$/.test( a ) ) {
                that.size.width = newWidth;
                that.size.height = newHeight;
                that.position.left = op.left - ox;
            } else {
                if ( newHeight - gridY <= 0 || newWidth - gridX <= 0 ) {
                    outerDimensions = that._getPaddingPlusBorderDimensions( this );
                }

                if ( newHeight - gridY > 0 ) {
                    that.size.height = newHeight;
                    that.position.top = op.top - oy;
                } else {
                    newHeight = gridY - outerDimensions.height;
                    that.size.height = newHeight;
                    that.position.top = op.top + os.height - newHeight;
                }
                if ( newWidth - gridX > 0 ) {
                    that.size.width = newWidth;
                    that.position.left = op.left - ox;
                } else {
                    newWidth = gridX - outerDimensions.width;
                    that.size.width = newWidth;
                    that.position.left = op.left + os.width - newWidth;
                }
            }
        }

    } );

    return $.ui.resizable;

} );

/*!
 * jQuery UI Dialog 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Dialog
//>>group: Widgets
//>>description: Displays customizable dialog windows.
//>>docs: http://api.jqueryui.com/dialog/
//>>demos: http://jqueryui.com/dialog/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/dialog.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/dialog',[
            "jquery",
            "./button",
            "./draggable",
            "./mouse",
            "./resizable",
            "../focusable",
            "../keycode",
            "../position",
            "../safe-active-element",
            "../safe-blur",
            "../tabbable",
            "../unique-id",
            "../version",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    $.widget( "ui.dialog", {
        version: "1.13.2",
        options: {
            appendTo: "body",
            autoOpen: true,
            buttons: [],
            classes: {
                "ui-dialog": "ui-corner-all",
                "ui-dialog-titlebar": "ui-corner-all"
            },
            closeOnEscape: true,
            closeText: "Close",
            draggable: true,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: false,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",

                // Ensure the titlebar is always visible
                using: function( pos ) {
                    var topOffset = $( this ).css( pos ).offset().top;
                    if ( topOffset < 0 ) {
                        $( this ).css( "top", pos.top - topOffset );
                    }
                }
            },
            resizable: true,
            show: null,
            title: null,
            width: 300,

            // Callbacks
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },

        sizeRelatedOptions: {
            buttons: true,
            height: true,
            maxHeight: true,
            maxWidth: true,
            minHeight: true,
            minWidth: true,
            width: true
        },

        resizableRelatedOptions: {
            maxHeight: true,
            maxWidth: true,
            minHeight: true,
            minWidth: true
        },

        _create: function() {
            this.originalCss = {
                display: this.element[ 0 ].style.display,
                width: this.element[ 0 ].style.width,
                minHeight: this.element[ 0 ].style.minHeight,
                maxHeight: this.element[ 0 ].style.maxHeight,
                height: this.element[ 0 ].style.height
            };
            this.originalPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index( this.element )
            };
            this.originalTitle = this.element.attr( "title" );
            if ( this.options.title == null && this.originalTitle != null ) {
                this.options.title = this.originalTitle;
            }

            // Dialogs can't be disabled
            if ( this.options.disabled ) {
                this.options.disabled = false;
            }

            this._createWrapper();

            this.element
                .show()
                .removeAttr( "title" )
                .appendTo( this.uiDialog );

            this._addClass( "ui-dialog-content", "ui-widget-content" );

            this._createTitlebar();
            this._createButtonPane();

            if ( this.options.draggable && $.fn.draggable ) {
                this._makeDraggable();
            }
            if ( this.options.resizable && $.fn.resizable ) {
                this._makeResizable();
            }

            this._isOpen = false;

            this._trackFocus();
        },

        _init: function() {
            if ( this.options.autoOpen ) {
                this.open();
            }
        },

        _appendTo: function() {
            var element = this.options.appendTo;
            if ( element && ( element.jquery || element.nodeType ) ) {
                return $( element );
            }
            return this.document.find( element || "body" ).eq( 0 );
        },

        _destroy: function() {
            var next,
                originalPosition = this.originalPosition;

            this._untrackInstance();
            this._destroyOverlay();

            this.element
                .removeUniqueId()
                .css( this.originalCss )

                // Without detaching first, the following becomes really slow
                .detach();

            this.uiDialog.remove();

            if ( this.originalTitle ) {
                this.element.attr( "title", this.originalTitle );
            }

            next = originalPosition.parent.children().eq( originalPosition.index );

            // Don't try to place the dialog next to itself (#8613)
            if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
                next.before( this.element );
            } else {
                originalPosition.parent.append( this.element );
            }
        },

        widget: function() {
            return this.uiDialog;
        },

        disable: $.noop,
        enable: $.noop,

        close: function( event ) {
            var that = this;

            if ( !this._isOpen || this._trigger( "beforeClose", event ) === false ) {
                return;
            }

            this._isOpen = false;
            this._focusedElement = null;
            this._destroyOverlay();
            this._untrackInstance();

            if ( !this.opener.filter( ":focusable" ).trigger( "focus" ).length ) {

                // Hiding a focused element doesn't trigger blur in WebKit
                // so in case we have nothing to focus on, explicitly blur the active element
                // https://bugs.webkit.org/show_bug.cgi?id=47182
                $.ui.safeBlur( $.ui.safeActiveElement( this.document[ 0 ] ) );
            }

            this._hide( this.uiDialog, this.options.hide, function() {
                that._trigger( "close", event );
            } );
        },

        isOpen: function() {
            return this._isOpen;
        },

        moveToTop: function() {
            this._moveToTop();
        },

        _moveToTop: function( event, silent ) {
            var moved = false,
                zIndices = this.uiDialog.siblings( ".ui-front:visible" ).map( function() {
                    return +$( this ).css( "z-index" );
                } ).get(),
                zIndexMax = Math.max.apply( null, zIndices );

            if ( zIndexMax >= +this.uiDialog.css( "z-index" ) ) {
                this.uiDialog.css( "z-index", zIndexMax + 1 );
                moved = true;
            }

            if ( moved && !silent ) {
                this._trigger( "focus", event );
            }
            return moved;
        },

        open: function() {
            var that = this;
            if ( this._isOpen ) {
                if ( this._moveToTop() ) {
                    this._focusTabbable();
                }
                return;
            }

            this._isOpen = true;
            this.opener = $( $.ui.safeActiveElement( this.document[ 0 ] ) );

            this._size();
            this._position();
            this._createOverlay();
            this._moveToTop( null, true );

            // Ensure the overlay is moved to the top with the dialog, but only when
            // opening. The overlay shouldn't move after the dialog is open so that
            // modeless dialogs opened after the modal dialog stack properly.
            if ( this.overlay ) {
                this.overlay.css( "z-index", this.uiDialog.css( "z-index" ) - 1 );
            }

            this._show( this.uiDialog, this.options.show, function() {
                that._focusTabbable();
                that._trigger( "focus" );
            } );

            // Track the dialog immediately upon opening in case a focus event
            // somehow occurs outside of the dialog before an element inside the
            // dialog is focused (#10152)
            this._makeFocusTarget();

            this._trigger( "open" );
        },

        _focusTabbable: function() {

            // Set focus to the first match:
            // 1. An element that was focused previously
            // 2. First element inside the dialog matching [autofocus]
            // 3. Tabbable element inside the content element
            // 4. Tabbable element inside the buttonpane
            // 5. The close button
            // 6. The dialog itself
            var hasFocus = this._focusedElement;
            if ( !hasFocus ) {
                hasFocus = this.element.find( "[autofocus]" );
            }
            if ( !hasFocus.length ) {
                hasFocus = this.element.find( ":tabbable" );
            }
            if ( !hasFocus.length ) {
                hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
            }
            if ( !hasFocus.length ) {
                hasFocus = this.uiDialogTitlebarClose.filter( ":tabbable" );
            }
            if ( !hasFocus.length ) {
                hasFocus = this.uiDialog;
            }
            hasFocus.eq( 0 ).trigger( "focus" );
        },

        _restoreTabbableFocus: function() {
            var activeElement = $.ui.safeActiveElement( this.document[ 0 ] ),
                isActive = this.uiDialog[ 0 ] === activeElement ||
                    $.contains( this.uiDialog[ 0 ], activeElement );
            if ( !isActive ) {
                this._focusTabbable();
            }
        },

        _keepFocus: function( event ) {
            event.preventDefault();
            this._restoreTabbableFocus();

            // support: IE
            // IE <= 8 doesn't prevent moving focus even with event.preventDefault()
            // so we check again later
            this._delay( this._restoreTabbableFocus );
        },

        _createWrapper: function() {
            this.uiDialog = $( "<div>" )
                .hide()
                .attr( {

                    // Setting tabIndex makes the div focusable
                    tabIndex: -1,
                    role: "dialog"
                } )
                .appendTo( this._appendTo() );

            this._addClass( this.uiDialog, "ui-dialog", "ui-widget ui-widget-content ui-front" );
            this._on( this.uiDialog, {
                keydown: function( event ) {
                    if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
                        event.keyCode === $.ui.keyCode.ESCAPE ) {
                        event.preventDefault();
                        this.close( event );
                        return;
                    }

                    // Prevent tabbing out of dialogs
                    if ( event.keyCode !== $.ui.keyCode.TAB || event.isDefaultPrevented() ) {
                        return;
                    }
                    var tabbables = this.uiDialog.find( ":tabbable" ),
                        first = tabbables.first(),
                        last = tabbables.last();

                    if ( ( event.target === last[ 0 ] || event.target === this.uiDialog[ 0 ] ) &&
                        !event.shiftKey ) {
                        this._delay( function() {
                            first.trigger( "focus" );
                        } );
                        event.preventDefault();
                    } else if ( ( event.target === first[ 0 ] ||
                        event.target === this.uiDialog[ 0 ] ) && event.shiftKey ) {
                        this._delay( function() {
                            last.trigger( "focus" );
                        } );
                        event.preventDefault();
                    }
                },
                mousedown: function( event ) {
                    if ( this._moveToTop( event ) ) {
                        this._focusTabbable();
                    }
                }
            } );

            // We assume that any existing aria-describedby attribute means
            // that the dialog content is marked up properly
            // otherwise we brute force the content as the description
            if ( !this.element.find( "[aria-describedby]" ).length ) {
                this.uiDialog.attr( {
                    "aria-describedby": this.element.uniqueId().attr( "id" )
                } );
            }
        },

        _createTitlebar: function() {
            var uiDialogTitle;

            this.uiDialogTitlebar = $( "<div>" );
            this._addClass( this.uiDialogTitlebar,
                "ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix" );
            this._on( this.uiDialogTitlebar, {
                mousedown: function( event ) {

                    // Don't prevent click on close button (#8838)
                    // Focusing a dialog that is partially scrolled out of view
                    // causes the browser to scroll it into view, preventing the click event
                    if ( !$( event.target ).closest( ".ui-dialog-titlebar-close" ) ) {

                        // Dialog isn't getting focus when dragging (#8063)
                        this.uiDialog.trigger( "focus" );
                    }
                }
            } );

            // Support: IE
            // Use type="button" to prevent enter keypresses in textboxes from closing the
            // dialog in IE (#9312)
            this.uiDialogTitlebarClose = $( "<button type='button'></button>" )
                .button( {
                    label: $( "<a>" ).text( this.options.closeText ).html(),
                    icon: "ui-icon-closethick",
                    showLabel: false
                } )
                .appendTo( this.uiDialogTitlebar );

            this._addClass( this.uiDialogTitlebarClose, "ui-dialog-titlebar-close" );
            this._on( this.uiDialogTitlebarClose, {
                click: function( event ) {
                    event.preventDefault();
                    this.close( event );
                }
            } );

            uiDialogTitle = $( "<span>" ).uniqueId().prependTo( this.uiDialogTitlebar );
            this._addClass( uiDialogTitle, "ui-dialog-title" );
            this._title( uiDialogTitle );

            this.uiDialogTitlebar.prependTo( this.uiDialog );

            this.uiDialog.attr( {
                "aria-labelledby": uiDialogTitle.attr( "id" )
            } );
        },

        _title: function( title ) {
            if ( this.options.title ) {
                title.text( this.options.title );
            } else {
                title.html( "&#160;" );
            }
        },

        _createButtonPane: function() {
            this.uiDialogButtonPane = $( "<div>" );
            this._addClass( this.uiDialogButtonPane, "ui-dialog-buttonpane",
                "ui-widget-content ui-helper-clearfix" );

            this.uiButtonSet = $( "<div>" )
                .appendTo( this.uiDialogButtonPane );
            this._addClass( this.uiButtonSet, "ui-dialog-buttonset" );

            this._createButtons();
        },

        _createButtons: function() {
            var that = this,
                buttons = this.options.buttons;

            // If we already have a button pane, remove it
            this.uiDialogButtonPane.remove();
            this.uiButtonSet.empty();

            if ( $.isEmptyObject( buttons ) || ( Array.isArray( buttons ) && !buttons.length ) ) {
                this._removeClass( this.uiDialog, "ui-dialog-buttons" );
                return;
            }

            $.each( buttons, function( name, props ) {
                var click, buttonOptions;
                props = typeof props === "function" ?
                    { click: props, text: name } :
                    props;

                // Default to a non-submitting button
                props = $.extend( { type: "button" }, props );

                // Change the context for the click callback to be the main element
                click = props.click;
                buttonOptions = {
                    icon: props.icon,
                    iconPosition: props.iconPosition,
                    showLabel: props.showLabel,

                    // Deprecated options
                    icons: props.icons,
                    text: props.text
                };

                delete props.click;
                delete props.icon;
                delete props.iconPosition;
                delete props.showLabel;

                // Deprecated options
                delete props.icons;
                if ( typeof props.text === "boolean" ) {
                    delete props.text;
                }

                $( "<button></button>", props )
                    .button( buttonOptions )
                    .appendTo( that.uiButtonSet )
                    .on( "click", function() {
                        click.apply( that.element[ 0 ], arguments );
                    } );
            } );
            this._addClass( this.uiDialog, "ui-dialog-buttons" );
            this.uiDialogButtonPane.appendTo( this.uiDialog );
        },

        _makeDraggable: function() {
            var that = this,
                options = this.options;

            function filteredUi( ui ) {
                return {
                    position: ui.position,
                    offset: ui.offset
                };
            }

            this.uiDialog.draggable( {
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function( event, ui ) {
                    that._addClass( $( this ), "ui-dialog-dragging" );
                    that._blockFrames();
                    that._trigger( "dragStart", event, filteredUi( ui ) );
                },
                drag: function( event, ui ) {
                    that._trigger( "drag", event, filteredUi( ui ) );
                },
                stop: function( event, ui ) {
                    var left = ui.offset.left - that.document.scrollLeft(),
                        top = ui.offset.top - that.document.scrollTop();

                    options.position = {
                        my: "left top",
                        at: "left" + ( left >= 0 ? "+" : "" ) + left + " " +
                            "top" + ( top >= 0 ? "+" : "" ) + top,
                        of: that.window
                    };
                    that._removeClass( $( this ), "ui-dialog-dragging" );
                    that._unblockFrames();
                    that._trigger( "dragStop", event, filteredUi( ui ) );
                }
            } );
        },

        _makeResizable: function() {
            var that = this,
                options = this.options,
                handles = options.resizable,

                // .ui-resizable has position: relative defined in the stylesheet
                // but dialogs have to use absolute or fixed positioning
                position = this.uiDialog.css( "position" ),
                resizeHandles = typeof handles === "string" ?
                    handles :
                    "n,e,s,w,se,sw,ne,nw";

            function filteredUi( ui ) {
                return {
                    originalPosition: ui.originalPosition,
                    originalSize: ui.originalSize,
                    position: ui.position,
                    size: ui.size
                };
            }

            this.uiDialog.resizable( {
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight,
                minWidth: options.minWidth,
                minHeight: this._minHeight(),
                handles: resizeHandles,
                start: function( event, ui ) {
                    that._addClass( $( this ), "ui-dialog-resizing" );
                    that._blockFrames();
                    that._trigger( "resizeStart", event, filteredUi( ui ) );
                },
                resize: function( event, ui ) {
                    that._trigger( "resize", event, filteredUi( ui ) );
                },
                stop: function( event, ui ) {
                    var offset = that.uiDialog.offset(),
                        left = offset.left - that.document.scrollLeft(),
                        top = offset.top - that.document.scrollTop();

                    options.height = that.uiDialog.height();
                    options.width = that.uiDialog.width();
                    options.position = {
                        my: "left top",
                        at: "left" + ( left >= 0 ? "+" : "" ) + left + " " +
                            "top" + ( top >= 0 ? "+" : "" ) + top,
                        of: that.window
                    };
                    that._removeClass( $( this ), "ui-dialog-resizing" );
                    that._unblockFrames();
                    that._trigger( "resizeStop", event, filteredUi( ui ) );
                }
            } )
                .css( "position", position );
        },

        _trackFocus: function() {
            this._on( this.widget(), {
                focusin: function( event ) {
                    this._makeFocusTarget();
                    this._focusedElement = $( event.target );
                }
            } );
        },

        _makeFocusTarget: function() {
            this._untrackInstance();
            this._trackingInstances().unshift( this );
        },

        _untrackInstance: function() {
            var instances = this._trackingInstances(),
                exists = $.inArray( this, instances );
            if ( exists !== -1 ) {
                instances.splice( exists, 1 );
            }
        },

        _trackingInstances: function() {
            var instances = this.document.data( "ui-dialog-instances" );
            if ( !instances ) {
                instances = [];
                this.document.data( "ui-dialog-instances", instances );
            }
            return instances;
        },

        _minHeight: function() {
            var options = this.options;

            return options.height === "auto" ?
                options.minHeight :
                Math.min( options.minHeight, options.height );
        },

        _position: function() {

            // Need to show the dialog to get the actual offset in the position plugin
            var isVisible = this.uiDialog.is( ":visible" );
            if ( !isVisible ) {
                this.uiDialog.show();
            }
            this.uiDialog.position( this.options.position );
            if ( !isVisible ) {
                this.uiDialog.hide();
            }
        },

        _setOptions: function( options ) {
            var that = this,
                resize = false,
                resizableOptions = {};

            $.each( options, function( key, value ) {
                that._setOption( key, value );

                if ( key in that.sizeRelatedOptions ) {
                    resize = true;
                }
                if ( key in that.resizableRelatedOptions ) {
                    resizableOptions[ key ] = value;
                }
            } );

            if ( resize ) {
                this._size();
                this._position();
            }
            if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
                this.uiDialog.resizable( "option", resizableOptions );
            }
        },

        _setOption: function( key, value ) {
            var isDraggable, isResizable,
                uiDialog = this.uiDialog;

            if ( key === "disabled" ) {
                return;
            }

            this._super( key, value );

            if ( key === "appendTo" ) {
                this.uiDialog.appendTo( this._appendTo() );
            }

            if ( key === "buttons" ) {
                this._createButtons();
            }

            if ( key === "closeText" ) {
                this.uiDialogTitlebarClose.button( {

                    // Ensure that we always pass a string
                    label: $( "<a>" ).text( "" + this.options.closeText ).html()
                } );
            }

            if ( key === "draggable" ) {
                isDraggable = uiDialog.is( ":data(ui-draggable)" );
                if ( isDraggable && !value ) {
                    uiDialog.draggable( "destroy" );
                }

                if ( !isDraggable && value ) {
                    this._makeDraggable();
                }
            }

            if ( key === "position" ) {
                this._position();
            }

            if ( key === "resizable" ) {

                // currently resizable, becoming non-resizable
                isResizable = uiDialog.is( ":data(ui-resizable)" );
                if ( isResizable && !value ) {
                    uiDialog.resizable( "destroy" );
                }

                // Currently resizable, changing handles
                if ( isResizable && typeof value === "string" ) {
                    uiDialog.resizable( "option", "handles", value );
                }

                // Currently non-resizable, becoming resizable
                if ( !isResizable && value !== false ) {
                    this._makeResizable();
                }
            }

            if ( key === "title" ) {
                this._title( this.uiDialogTitlebar.find( ".ui-dialog-title" ) );
            }
        },

        _size: function() {

            // If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
            // divs will both have width and height set, so we need to reset them
            var nonContentHeight, minContentHeight, maxContentHeight,
                options = this.options;

            // Reset content sizing
            this.element.show().css( {
                width: "auto",
                minHeight: 0,
                maxHeight: "none",
                height: 0
            } );

            if ( options.minWidth > options.width ) {
                options.width = options.minWidth;
            }

            // Reset wrapper sizing
            // determine the height of all the non-content elements
            nonContentHeight = this.uiDialog.css( {
                height: "auto",
                width: options.width
            } )
                .outerHeight();
            minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
            maxContentHeight = typeof options.maxHeight === "number" ?
                Math.max( 0, options.maxHeight - nonContentHeight ) :
                "none";

            if ( options.height === "auto" ) {
                this.element.css( {
                    minHeight: minContentHeight,
                    maxHeight: maxContentHeight,
                    height: "auto"
                } );
            } else {
                this.element.height( Math.max( 0, options.height - nonContentHeight ) );
            }

            if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
                this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
            }
        },

        _blockFrames: function() {
            this.iframeBlocks = this.document.find( "iframe" ).map( function() {
                var iframe = $( this );

                return $( "<div>" )
                    .css( {
                        position: "absolute",
                        width: iframe.outerWidth(),
                        height: iframe.outerHeight()
                    } )
                    .appendTo( iframe.parent() )
                    .offset( iframe.offset() )[ 0 ];
            } );
        },

        _unblockFrames: function() {
            if ( this.iframeBlocks ) {
                this.iframeBlocks.remove();
                delete this.iframeBlocks;
            }
        },

        _allowInteraction: function( event ) {
            if ( $( event.target ).closest( ".ui-dialog" ).length ) {
                return true;
            }

            // TODO: Remove hack when datepicker implements
            // the .ui-front logic (#8989)
            return !!$( event.target ).closest( ".ui-datepicker" ).length;
        },

        _createOverlay: function() {
            if ( !this.options.modal ) {
                return;
            }

            var jqMinor = $.fn.jquery.substring( 0, 4 );

            // We use a delay in case the overlay is created from an
            // event that we're going to be cancelling (#2804)
            var isOpening = true;
            this._delay( function() {
                isOpening = false;
            } );

            if ( !this.document.data( "ui-dialog-overlays" ) ) {

                // Prevent use of anchors and inputs
                // This doesn't use `_on()` because it is a shared event handler
                // across all open modal dialogs.
                this.document.on( "focusin.ui-dialog", function( event ) {
                    if ( isOpening ) {
                        return;
                    }

                    var instance = this._trackingInstances()[ 0 ];
                    if ( !instance._allowInteraction( event ) ) {
                        event.preventDefault();
                        instance._focusTabbable();

                        // Support: jQuery >=3.4 <3.6 only
                        // Focus re-triggering in jQuery 3.4/3.5 makes the original element
                        // have its focus event propagated last, breaking the re-targeting.
                        // Trigger focus in a delay in addition if needed to avoid the issue
                        // See https://github.com/jquery/jquery/issues/4382
                        if ( jqMinor === "3.4." || jqMinor === "3.5." ) {
                            instance._delay( instance._restoreTabbableFocus );
                        }
                    }
                }.bind( this ) );
            }

            this.overlay = $( "<div>" )
                .appendTo( this._appendTo() );

            this._addClass( this.overlay, null, "ui-widget-overlay ui-front" );
            this._on( this.overlay, {
                mousedown: "_keepFocus"
            } );
            this.document.data( "ui-dialog-overlays",
                ( this.document.data( "ui-dialog-overlays" ) || 0 ) + 1 );
        },

        _destroyOverlay: function() {
            if ( !this.options.modal ) {
                return;
            }

            if ( this.overlay ) {
                var overlays = this.document.data( "ui-dialog-overlays" ) - 1;

                if ( !overlays ) {
                    this.document.off( "focusin.ui-dialog" );
                    this.document.removeData( "ui-dialog-overlays" );
                } else {
                    this.document.data( "ui-dialog-overlays", overlays );
                }

                this.overlay.remove();
                this.overlay = null;
            }
        }
    } );

// DEPRECATED
// TODO: switch return back to widget declaration at top of file when this is removed
    if ( $.uiBackCompat !== false ) {

        // Backcompat for dialogClass option
        $.widget( "ui.dialog", $.ui.dialog, {
            options: {
                dialogClass: ""
            },
            _createWrapper: function() {
                this._super();
                this.uiDialog.addClass( this.options.dialogClass );
            },
            _setOption: function( key, value ) {
                if ( key === "dialogClass" ) {
                    this.uiDialog
                        .removeClass( this.options.dialogClass )
                        .addClass( value );
                }
                this._superApply( arguments );
            }
        } );
    }

    return $.ui.dialog;

} );

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('mage/dropdown',[
    'jquery',
    'jquery-ui-modules/dialog',
    'mage/translate'
], function ($) {
    'use strict';

    var timer = null;

    /**
     * Dropdown Widget - this widget is a wrapper for the jQuery UI Dialog
     */
    $.widget('mage.dropdownDialog', $.ui.dialog, {
        options: {
            triggerEvent: 'click',
            triggerClass: null,
            parentClass: null,
            triggerTarget: null,
            defaultDialogClass: 'mage-dropdown-dialog',
            dialogContentClass: null,
            shadowHinter: null,
            closeOnMouseLeave: true,
            closeOnClickOutside: true,
            minHeight: null,
            minWidth: null,
            width: null,
            modal: false,
            timeout: null,
            autoOpen: false,
            createTitleBar: false,
            autoPosition: false,
            autoSize: false,
            draggable: false,
            resizable: false,
            bodyClass: '',
            buttons: [
                {
                    'class': 'action close',
                    'text': $.mage.__('Close'),

                    /**
                     * Click action.
                     */
                    'click': function () {
                        $(this).dropdownDialog('close');
                    }
                }
            ]
        },

        /**
         * extend default functionality to bind the opener for dropdown
         * @private
         */
        _create: function () {
            var _self = this;

            this._super();
            this.uiDialog.addClass(this.options.defaultDialogClass);

            if (_self.options.triggerTarget) {
                $(_self.options.triggerTarget).on(_self.options.triggerEvent, function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!_self._isOpen) {
                        $('.' + _self.options.defaultDialogClass + ' > .ui-dialog-content').dropdownDialog('close');
                        _self.open();
                    } else {
                        _self.close(event);
                    }
                });
            }

            if (_self.options.shadowHinter) {
                _self.hinter = $('<div class="' + _self.options.shadowHinter + '"></div>');
                _self.element.append(_self.hinter);
            }
        },

        /**
         * Extend default functionality to close the dropdown
         * with custom delay on mouse out and also to close when clicking outside
         */
        open: function () {
            var _self = this;

            this._super();

            if (_self.options.dialogContentClass) {
                _self.element.addClass(_self.options.dialogContentClass);
            }

            if (_self.options.closeOnMouseLeave) {

                this._mouseEnter(_self.uiDialog);
                this._mouseLeave(_self.uiDialog);

                if (_self.options.triggerTarget) {
                    this._mouseLeave($(_self.options.triggerTarget));
                }
            }

            if (_self.options.closeOnClickOutside) {
                $('body').on('click.outsideDropdown', function (event) {
                    if (_self._isOpen && !$(event.target).closest('.ui-dialog').length) {
                        if (timer) {
                            clearTimeout(timer);
                        }
                        _self.close(event);
                    }
                });
            }
            // adding the class on the opener and parent element for dropdown
            if (_self.options.triggerClass) {
                $(_self.options.triggerTarget).addClass(_self.options.triggerClass);
            }

            if (_self.options.parentClass) {
                $(_self.options.appendTo).addClass(_self.options.parentClass);
            }

            if (_self.options.bodyClass) {
                $('body').addClass(_self.options.bodyClass);
            }

            if (_self.options.shadowHinter) {
                _self._setShadowHinterPosition();
            }
        },

        /**
         * extend default functionality to reset the timer and remove the active class for opener
         */
        close: function () {
            this._super();

            if (this.options.dialogContentClass) {
                this.element.removeClass(this.options.dialogContentClass);
            }

            if (this.options.triggerClass) {
                $(this.options.triggerTarget).removeClass(this.options.triggerClass);
            }

            if (this.options.parentClass) {
                $(this.options.appendTo).removeClass(this.options.parentClass);
            }

            if (this.options.bodyClass) {
                $('body').removeClass(this.options.bodyClass);
            }

            if (timer) {
                clearTimeout(timer);
            }

            if (this.options.triggerTarget) {
                $(this.options.triggerTarget).off('mouseleave');
            }
            this.uiDialog.off('mouseenter');
            this.uiDialog.off('mouseleave');
            $('body').off('click.outsideDropdown');
        },

        /**
         * _setShadowHinterPosition
         * @private
         */
        _setShadowHinterPosition: function () {
            var _self = this,
                offset;

            offset = _self.options.position.of.offset().left -
                _self.element.offset().left +
                _self.options.position.of.outerWidth() / 2;
            offset = isNaN(offset) ? 0 : Math.floor(offset);
            _self.hinter.css('left', offset);
        },

        /**
         * @private
         */
        _position: function () {
            if (this.options.autoPosition) {
                this._super();
            }
        },

        /**
         * @private
         */
        _createTitlebar: function () {
            if (this.options.createTitleBar) {
                this._super();
            } else {
                // the title bar close button is referenced
                // in _focusTabbable function, so to prevent errors it must be declared
                this.uiDialogTitlebarClose = $('<div></div>');
            }
        },

        /**
         * @private
         */
        _size: function () {
            if (this.options.autoSize) {
                this._super();
            }
        },

        /**
         * @param {Object} handler
         * @private
         */
        _mouseLeave: function (handler) {
            var _self = this;

            handler.on('mouseleave', function (event) {
                event.stopPropagation();

                if (_self._isOpen) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function (e) {
                        _self.close(e);
                    }, _self.options.timeout);
                }
            });
        },

        /**
         * @param {Object} handler
         * @private
         */
        _mouseEnter: function (handler) {
            handler.on('mouseenter', function (event) {
                event.stopPropagation();

                if (timer) {
                    clearTimeout(timer);
                }
            });
        },

        /**
         * @param {String} key
         * @param {*} value
         * @private
         */
        _setOption: function (key, value) {
            this._super(key, value);

            if (key === 'triggerTarget') {
                this.options.triggerTarget = value;
            }
        }
    });

    return $.mage.dropdownDialog;
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('Magento_Checkout/js/view/minicart',[
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'jquery',
    'ko',
    'underscore',
    'sidebar',
    'mage/translate',
    'mage/dropdown'
], function (Component, customerData, $, ko, _) {
    'use strict';

    var sidebarInitialized = false,
        addToCartCalls = 0,
        miniCart;

    miniCart = $('[data-block=\'minicart\']');

    /**
     * @return {Boolean}
     */
    function initSidebar() {
        if (miniCart.data('mageSidebar')) {
            miniCart.sidebar('update');
        }

        if (!$('[data-role=product-item]').length) {
            return false;
        }
        miniCart.trigger('contentUpdated');

        if (sidebarInitialized) {
            return false;
        }
        sidebarInitialized = true;
        miniCart.sidebar({
            'targetElement': 'div.block.block-minicart',
            'url': {
                'checkout': window.checkout.checkoutUrl,
                'update': window.checkout.updateItemQtyUrl,
                'remove': window.checkout.removeItemUrl,
                'loginUrl': window.checkout.customerLoginUrl,
                'isRedirectRequired': window.checkout.isRedirectRequired
            },
            'button': {
                'checkout': '#top-cart-btn-checkout',
                'remove': '#mini-cart a.action.delete',
                'close': '#btn-minicart-close'
            },
            'showcart': {
                'parent': 'span.counter',
                'qty': 'span.counter-number',
                'label': 'span.counter-label'
            },
            'minicart': {
                'list': '#mini-cart',
                'content': '#minicart-content-wrapper',
                'qty': 'div.items-total',
                'subtotal': 'div.subtotal span.price',
                'maxItemsVisible': window.checkout.minicartMaxItemsVisible
            },
            'item': {
                'qty': ':input.cart-item-qty',
                'button': ':button.update-cart-item'
            },
            'confirmMessage': $.mage.__('Are you sure you would like to remove this item from the shopping cart?')
        });
    }

    miniCart.on('dropdowndialogopen', function () {
        initSidebar();
        if ($(window).width() < 768){
        $('body').addClass('custom-minicart-active');        
      }
    });
    miniCart.on('dropdowndialogclose', function () {
      if ($(window).width() < 768){
        $('body').removeClass('custom-minicart-active');
      }
    });

    return Component.extend({
        shoppingCartUrl: window.checkout.shoppingCartUrl,
        maxItemsToDisplay: window.checkout.maxItemsToDisplay,
        cart: {},

        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        /**
         * @override
         */
        initialize: function () {
            var self = this,
                cartData = customerData.get('cart');

            this.update(cartData());
            cartData.subscribe(function (updatedCart) {
                addToCartCalls--;
                this.isLoading(addToCartCalls > 0);
                sidebarInitialized = false;
                this.update(updatedCart);
                initSidebar();
            }, this);
            $('[data-block="minicart"]').on('contentLoading', function () {
                addToCartCalls++;
                self.isLoading(true);
            });

            if (
                cartData().website_id !== window.checkout.websiteId && cartData().website_id !== undefined ||
                cartData().storeId !== window.checkout.storeId && cartData().storeId !== undefined
            ) {
                customerData.reload(['cart'], false);
            }

            return this._super();
        },
        //jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        isLoading: ko.observable(false),
        initSidebar: initSidebar,

        /**
         * Close mini shopping cart.
         */
        closeMinicart: function () {
            $('[data-block="minicart"]').find('[data-role="dropdownDialog"]').dropdownDialog('close');
        },

        /**
         * @return {Boolean}
         */
        closeSidebar: function () {
            var minicart = $('[data-block="minicart"]');

            minicart.on('click', '[data-action="close"]', function (event) {
                event.stopPropagation();
                minicart.find('[data-role="dropdownDialog"]').dropdownDialog('close');
            });

            return true;
        },

        /**
         * @param {String} productType
         * @return {*|String}
         */
        getItemRenderer: function (productType) {
            return this.itemRenderer[productType] || 'defaultRenderer';
        },

        /**
         * Update mini shopping cart content.
         *
         * @param {Object} updatedCart
         * @returns void
         */
        update: function (updatedCart) {
            _.each(updatedCart, function (value, key) {
                if (!this.cart.hasOwnProperty(key)) {
                    this.cart[key] = ko.observable();
                }
                this.cart[key](value);
            }, this);
        },

        /**
         * Get cart param by name.
         * @param {String} name
         * @returns {*}
         */
        getCartParam: function (name) {
            if (!_.isUndefined(name)) {
                if (!this.cart.hasOwnProperty(name)) {
                    this.cart[name] = ko.observable();
                }
            }

            return this.cart[name]();
        },

        /**
         * Returns array of cart items, limited by 'maxItemsToDisplay' setting
         * @returns []
         */
        getCartItems: function () {
            var items = this.getCartParam('items') || [];

            items = items.slice(parseInt(-this.maxItemsToDisplay, 10));

            return items;
        },

        /**
         * Returns count of cart line items
         * @returns {Number}
         */
        getCartLineItemsCount: function () {
            var items = this.getCartParam('items') || [];

            return parseInt(items.length, 10);
        }
    });
});

define('Algolia_AlgoliaSearch/internals/template/autocomplete/pages',[], function () {
    return {
        getNoResultHtml: function ({html}) {
            return html`<p>${algoliaConfig.translations.noResults}</p>`;
        },

        getHeaderHtml: function ({section}) {
            return section.label;
        },

        getItemHtml: function ({item, components, html}) {
            return html`<a class="algoliasearch-autocomplete-hit"
                           href="${item.url}"
                           data-objectId="${item.objectID}"
                           data-position="${item.position}"
                           data-index="${item.__autocomplete_indexName}"
                           data-queryId="${item.__autocomplete_queryID}">
                <div class="info-without-thumb">
                    ${components.Highlight({hit: item, attribute: 'name'})}
                    <div class="details">
                        ${components.Highlight({hit: item, attribute: 'content'})}
                    </div>
                </div>
                <div class="algolia-clearfix"></div>
            </a>`;
        },

        getFooterHtml: function () {
            return "";
        }
    };
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */

define('Magento_Tax/js/view/checkout/minicart/subtotal/totals',[
    'ko',
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function (ko, Component, customerData) {
    'use strict';

    return Component.extend({
        displaySubtotal: ko.observable(true),

        /**
         * @override
         */
        initialize: function () {
            this._super();
            this.cart = customerData.get('cart');
        }
    });
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */

define('Magento_Msrp/js/view/checkout/minicart/subtotal/totals',[
    'Magento_Tax/js/view/checkout/minicart/subtotal/totals',
    'underscore'
], function (Component, _) {
    'use strict';

    return Component.extend({

        /**
         * @override
         */
        initialize: function () {
            this._super();
            this.displaySubtotal(this.isMsrpApplied(this.cart().items));
            this.cart.subscribe(function (updatedCart) {

                this.displaySubtotal(this.isMsrpApplied(updatedCart.items));
            }, this);
        },

        /**
         * Determine if subtotal should be hidden.
         * @param {Array} cartItems
         * @return {Boolean}
         */
        isMsrpApplied: function (cartItems) {
            return !_.find(cartItems, function (item) {
                if (_.has(item, 'canApplyMsrp')) {
                    return item.canApplyMsrp;
                }

                return false;
            });
        }
    });
});

/*!
 * jQuery UI Menu 1.13.2
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Menu
//>>group: Widgets
//>>description: Creates nestable menus.
//>>docs: http://api.jqueryui.com/menu/
//>>demos: http://jqueryui.com/menu/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/menu.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
    "use strict";

    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( 'jquery/ui-modules/widgets/menu',[
            "jquery",
            "../keycode",
            "../position",
            "../safe-active-element",
            "../unique-id",
            "../version",
            "../widget"
        ], factory );
    } else {

        // Browser globals
        factory( jQuery );
    }
} )( function( $ ) {
    "use strict";

    return $.widget( "ui.menu", {
        version: "1.13.2",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-caret-1-e"
            },
            items: "> *",
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",

            // Callbacks
            blur: null,
            focus: null,
            select: null
        },

        _create: function() {
            this.activeMenu = this.element;

            // Flag used to prevent firing of the click handler
            // as the event bubbles up through nested menus
            this.mouseHandled = false;
            this.lastMousePosition = { x: null, y: null };
            this.element
                .uniqueId()
                .attr( {
                    role: this.options.role,
                    tabIndex: 0
                } );

            this._addClass( "ui-menu", "ui-widget ui-widget-content" );
            this._on( {

                // Prevent focus from sticking to links inside menu after clicking
                // them (focus should always stay on UL during navigation).
                "mousedown .ui-menu-item": function( event ) {
                    event.preventDefault();

                    this._activateItem( event );
                },
                "click .ui-menu-item": function( event ) {
                    var target = $( event.target );
                    var active = $( $.ui.safeActiveElement( this.document[ 0 ] ) );
                    if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
                        this.select( event );

                        // Only set the mouseHandled flag if the event will bubble, see #9469.
                        if ( !event.isPropagationStopped() ) {
                            this.mouseHandled = true;
                        }

                        // Open submenu on click
                        if ( target.has( ".ui-menu" ).length ) {
                            this.expand( event );
                        } else if ( !this.element.is( ":focus" ) &&
                            active.closest( ".ui-menu" ).length ) {

                            // Redirect focus to the menu
                            this.element.trigger( "focus", [ true ] );

                            // If the active item is on the top level, let it stay active.
                            // Otherwise, blur the active item since it is no longer visible.
                            if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
                                clearTimeout( this.timer );
                            }
                        }
                    }
                },
                "mouseenter .ui-menu-item": "_activateItem",
                "mousemove .ui-menu-item": "_activateItem",
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function( event, keepActiveItem ) {

                    // If there's already an active item, keep it active
                    // If not, activate the first item
                    var item = this.active || this._menuItems().first();

                    if ( !keepActiveItem ) {
                        this.focus( event, item );
                    }
                },
                blur: function( event ) {
                    this._delay( function() {
                        var notContained = !$.contains(
                            this.element[ 0 ],
                            $.ui.safeActiveElement( this.document[ 0 ] )
                        );
                        if ( notContained ) {
                            this.collapseAll( event );
                        }
                    } );
                },
                keydown: "_keydown"
            } );

            this.refresh();

            // Clicks outside of a menu collapse any open menus
            this._on( this.document, {
                click: function( event ) {
                    if ( this._closeOnDocumentClick( event ) ) {
                        this.collapseAll( event, true );
                    }

                    // Reset the mouseHandled flag
                    this.mouseHandled = false;
                }
            } );
        },

        _activateItem: function( event ) {

            // Ignore mouse events while typeahead is active, see #10458.
            // Prevents focusing the wrong item when typeahead causes a scroll while the mouse
            // is over an item in the menu
            if ( this.previousFilter ) {
                return;
            }

            // If the mouse didn't actually move, but the page was scrolled, ignore the event (#9356)
            if ( event.clientX === this.lastMousePosition.x &&
                event.clientY === this.lastMousePosition.y ) {
                return;
            }

            this.lastMousePosition = {
                x: event.clientX,
                y: event.clientY
            };

            var actualTarget = $( event.target ).closest( ".ui-menu-item" ),
                target = $( event.currentTarget );

            // Ignore bubbled events on parent items, see #11641
            if ( actualTarget[ 0 ] !== target[ 0 ] ) {
                return;
            }

            // If the item is already active, there's nothing to do
            if ( target.is( ".ui-state-active" ) ) {
                return;
            }

            // Remove ui-state-active class from siblings of the newly focused menu item
            // to avoid a jump caused by adjacent elements both having a class with a border
            this._removeClass( target.siblings().children( ".ui-state-active" ),
                null, "ui-state-active" );
            this.focus( event, target );
        },

        _destroy: function() {
            var items = this.element.find( ".ui-menu-item" )
                    .removeAttr( "role aria-disabled" ),
                submenus = items.children( ".ui-menu-item-wrapper" )
                    .removeUniqueId()
                    .removeAttr( "tabIndex role aria-haspopup" );

            // Destroy (sub)menus
            this.element
                .removeAttr( "aria-activedescendant" )
                .find( ".ui-menu" ).addBack()
                .removeAttr( "role aria-labelledby aria-expanded aria-hidden aria-disabled " +
                    "tabIndex" )
                .removeUniqueId()
                .show();

            submenus.children().each( function() {
                var elem = $( this );
                if ( elem.data( "ui-menu-submenu-caret" ) ) {
                    elem.remove();
                }
            } );
        },

        _keydown: function( event ) {
            var match, prev, character, skip,
                preventDefault = true;

            switch ( event.keyCode ) {
                case $.ui.keyCode.PAGE_UP:
                    this.previousPage( event );
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    this.nextPage( event );
                    break;
                case $.ui.keyCode.HOME:
                    this._move( "first", "first", event );
                    break;
                case $.ui.keyCode.END:
                    this._move( "last", "last", event );
                    break;
                case $.ui.keyCode.UP:
                    this.previous( event );
                    break;
                case $.ui.keyCode.DOWN:
                    this.next( event );
                    break;
                case $.ui.keyCode.LEFT:
                    this.collapse( event );
                    break;
                case $.ui.keyCode.RIGHT:
                    if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
                        this.expand( event );
                    }
                    break;
                case $.ui.keyCode.ENTER:
                case $.ui.keyCode.SPACE:
                    this._activate( event );
                    break;
                case $.ui.keyCode.ESCAPE:
                    this.collapse( event );
                    break;
                default:
                    preventDefault = false;
                    prev = this.previousFilter || "";
                    skip = false;

                    // Support number pad values
                    character = event.keyCode >= 96 && event.keyCode <= 105 ?
                        ( event.keyCode - 96 ).toString() : String.fromCharCode( event.keyCode );

                    clearTimeout( this.filterTimer );

                    if ( character === prev ) {
                        skip = true;
                    } else {
                        character = prev + character;
                    }

                    match = this._filterMenuItems( character );
                    match = skip && match.index( this.active.next() ) !== -1 ?
                        this.active.nextAll( ".ui-menu-item" ) :
                        match;

                    // If no matches on the current filter, reset to the last character pressed
                    // to move down the menu to the first item that starts with that character
                    if ( !match.length ) {
                        character = String.fromCharCode( event.keyCode );
                        match = this._filterMenuItems( character );
                    }

                    if ( match.length ) {
                        this.focus( event, match );
                        this.previousFilter = character;
                        this.filterTimer = this._delay( function() {
                            delete this.previousFilter;
                        }, 1000 );
                    } else {
                        delete this.previousFilter;
                    }
            }

            if ( preventDefault ) {
                event.preventDefault();
            }
        },

        _activate: function( event ) {
            if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
                if ( this.active.children( "[aria-haspopup='true']" ).length ) {
                    this.expand( event );
                } else {
                    this.select( event );
                }
            }
        },

        refresh: function() {
            var menus, items, newSubmenus, newItems, newWrappers,
                that = this,
                icon = this.options.icons.submenu,
                submenus = this.element.find( this.options.menus );

            this._toggleClass( "ui-menu-icons", null, !!this.element.find( ".ui-icon" ).length );

            // Initialize nested menus
            newSubmenus = submenus.filter( ":not(.ui-menu)" )
                .hide()
                .attr( {
                    role: this.options.role,
                    "aria-hidden": "true",
                    "aria-expanded": "false"
                } )
                .each( function() {
                    var menu = $( this ),
                        item = menu.prev(),
                        submenuCaret = $( "<span>" ).data( "ui-menu-submenu-caret", true );

                    that._addClass( submenuCaret, "ui-menu-icon", "ui-icon " + icon );
                    item
                        .attr( "aria-haspopup", "true" )
                        .prepend( submenuCaret );
                    menu.attr( "aria-labelledby", item.attr( "id" ) );
                } );

            this._addClass( newSubmenus, "ui-menu", "ui-widget ui-widget-content ui-front" );

            menus = submenus.add( this.element );
            items = menus.find( this.options.items );

            // Initialize menu-items containing spaces and/or dashes only as dividers
            items.not( ".ui-menu-item" ).each( function() {
                var item = $( this );
                if ( that._isDivider( item ) ) {
                    that._addClass( item, "ui-menu-divider", "ui-widget-content" );
                }
            } );

            // Don't refresh list items that are already adapted
            newItems = items.not( ".ui-menu-item, .ui-menu-divider" );
            newWrappers = newItems.children()
                .not( ".ui-menu" )
                .uniqueId()
                .attr( {
                    tabIndex: -1,
                    role: this._itemRole()
                } );
            this._addClass( newItems, "ui-menu-item" )
                ._addClass( newWrappers, "ui-menu-item-wrapper" );

            // Add aria-disabled attribute to any disabled menu item
            items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

            // If the active item has been removed, blur the menu
            if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
                this.blur();
            }
        },

        _itemRole: function() {
            return {
                menu: "menuitem",
                listbox: "option"
            }[ this.options.role ];
        },

        _setOption: function( key, value ) {
            if ( key === "icons" ) {
                var icons = this.element.find( ".ui-menu-icon" );
                this._removeClass( icons, null, this.options.icons.submenu )
                    ._addClass( icons, null, value.submenu );
            }
            this._super( key, value );
        },

        _setOptionDisabled: function( value ) {
            this._super( value );

            this.element.attr( "aria-disabled", String( value ) );
            this._toggleClass( null, "ui-state-disabled", !!value );
        },

        focus: function( event, item ) {
            var nested, focused, activeParent;
            this.blur( event, event && event.type === "focus" );

            this._scrollIntoView( item );

            this.active = item.first();

            focused = this.active.children( ".ui-menu-item-wrapper" );
            this._addClass( focused, null, "ui-state-active" );

            // Only update aria-activedescendant if there's a role
            // otherwise we assume focus is managed elsewhere
            if ( this.options.role ) {
                this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
            }

            // Highlight active parent menu item, if any
            activeParent = this.active
                .parent()
                .closest( ".ui-menu-item" )
                .children( ".ui-menu-item-wrapper" );
            this._addClass( activeParent, null, "ui-state-active" );

            if ( event && event.type === "keydown" ) {
                this._close();
            } else {
                this.timer = this._delay( function() {
                    this._close();
                }, this.delay );
            }

            nested = item.children( ".ui-menu" );
            if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
                this._startOpening( nested );
            }
            this.activeMenu = item.parent();

            this._trigger( "focus", event, { item: item } );
        },

        _scrollIntoView: function( item ) {
            var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
            if ( this._hasScroll() ) {
                borderTop = parseFloat( $.css( this.activeMenu[ 0 ], "borderTopWidth" ) ) || 0;
                paddingTop = parseFloat( $.css( this.activeMenu[ 0 ], "paddingTop" ) ) || 0;
                offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
                scroll = this.activeMenu.scrollTop();
                elementHeight = this.activeMenu.height();
                itemHeight = item.outerHeight();

                if ( offset < 0 ) {
                    this.activeMenu.scrollTop( scroll + offset );
                } else if ( offset + itemHeight > elementHeight ) {
                    this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
                }
            }
        },

        blur: function( event, fromFocus ) {
            if ( !fromFocus ) {
                clearTimeout( this.timer );
            }

            if ( !this.active ) {
                return;
            }

            this._removeClass( this.active.children( ".ui-menu-item-wrapper" ),
                null, "ui-state-active" );

            this._trigger( "blur", event, { item: this.active } );
            this.active = null;
        },

        _startOpening: function( submenu ) {
            clearTimeout( this.timer );

            // Don't open if already open fixes a Firefox bug that caused a .5 pixel
            // shift in the submenu position when mousing over the caret icon
            if ( submenu.attr( "aria-hidden" ) !== "true" ) {
                return;
            }

            this.timer = this._delay( function() {
                this._close();
                this._open( submenu );
            }, this.delay );
        },

        _open: function( submenu ) {
            var position = $.extend( {
                of: this.active
            }, this.options.position );

            clearTimeout( this.timer );
            this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
                .hide()
                .attr( "aria-hidden", "true" );

            submenu
                .show()
                .removeAttr( "aria-hidden" )
                .attr( "aria-expanded", "true" )
                .position( position );
        },

        collapseAll: function( event, all ) {
            clearTimeout( this.timer );
            this.timer = this._delay( function() {

                // If we were passed an event, look for the submenu that contains the event
                var currentMenu = all ? this.element :
                    $( event && event.target ).closest( this.element.find( ".ui-menu" ) );

                // If we found no valid submenu ancestor, use the main menu to close all
                // sub menus anyway
                if ( !currentMenu.length ) {
                    currentMenu = this.element;
                }

                this._close( currentMenu );

                this.blur( event );

                // Work around active item staying active after menu is blurred
                this._removeClass( currentMenu.find( ".ui-state-active" ), null, "ui-state-active" );

                this.activeMenu = currentMenu;
            }, all ? 0 : this.delay );
        },

        // With no arguments, closes the currently active menu - if nothing is active
        // it closes all menus.  If passed an argument, it will search for menus BELOW
        _close: function( startMenu ) {
            if ( !startMenu ) {
                startMenu = this.active ? this.active.parent() : this.element;
            }

            startMenu.find( ".ui-menu" )
                .hide()
                .attr( "aria-hidden", "true" )
                .attr( "aria-expanded", "false" );
        },

        _closeOnDocumentClick: function( event ) {
            return !$( event.target ).closest( ".ui-menu" ).length;
        },

        _isDivider: function( item ) {

            // Match hyphen, em dash, en dash
            return !/[^\-\u2014\u2013\s]/.test( item.text() );
        },

        collapse: function( event ) {
            var newItem = this.active &&
                this.active.parent().closest( ".ui-menu-item", this.element );
            if ( newItem && newItem.length ) {
                this._close();
                this.focus( event, newItem );
            }
        },

        expand: function( event ) {
            var newItem = this.active && this._menuItems( this.active.children( ".ui-menu" ) ).first();

            if ( newItem && newItem.length ) {
                this._open( newItem.parent() );

                // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
                this._delay( function() {
                    this.focus( event, newItem );
                } );
            }
        },

        next: function( event ) {
            this._move( "next", "first", event );
        },

        previous: function( event ) {
            this._move( "prev", "last", event );
        },

        isFirstItem: function() {
            return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
        },

        isLastItem: function() {
            return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
        },

        _menuItems: function( menu ) {
            return ( menu || this.element )
                .find( this.options.items )
                .filter( ".ui-menu-item" );
        },

        _move: function( direction, filter, event ) {
            var next;
            if ( this.active ) {
                if ( direction === "first" || direction === "last" ) {
                    next = this.active
                        [ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
                        .last();
                } else {
                    next = this.active
                        [ direction + "All" ]( ".ui-menu-item" )
                        .first();
                }
            }
            if ( !next || !next.length || !this.active ) {
                next = this._menuItems( this.activeMenu )[ filter ]();
            }

            this.focus( event, next );
        },

        nextPage: function( event ) {
            var item, base, height;

            if ( !this.active ) {
                this.next( event );
                return;
            }
            if ( this.isLastItem() ) {
                return;
            }
            if ( this._hasScroll() ) {
                base = this.active.offset().top;
                height = this.element.innerHeight();

                // jQuery 3.2 doesn't include scrollbars in innerHeight, add it back.
                if ( $.fn.jquery.indexOf( "3.2." ) === 0 ) {
                    height += this.element[ 0 ].offsetHeight - this.element.outerHeight();
                }

                this.active.nextAll( ".ui-menu-item" ).each( function() {
                    item = $( this );
                    return item.offset().top - base - height < 0;
                } );

                this.focus( event, item );
            } else {
                this.focus( event, this._menuItems( this.activeMenu )
                    [ !this.active ? "first" : "last" ]() );
            }
        },

        previousPage: function( event ) {
            var item, base, height;
            if ( !this.active ) {
                this.next( event );
                return;
            }
            if ( this.isFirstItem() ) {
                return;
            }
            if ( this._hasScroll() ) {
                base = this.active.offset().top;
                height = this.element.innerHeight();

                // jQuery 3.2 doesn't include scrollbars in innerHeight, add it back.
                if ( $.fn.jquery.indexOf( "3.2." ) === 0 ) {
                    height += this.element[ 0 ].offsetHeight - this.element.outerHeight();
                }

                this.active.prevAll( ".ui-menu-item" ).each( function() {
                    item = $( this );
                    return item.offset().top - base + height > 0;
                } );

                this.focus( event, item );
            } else {
                this.focus( event, this._menuItems( this.activeMenu ).first() );
            }
        },

        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop( "scrollHeight" );
        },

        select: function( event ) {

            // TODO: It should never be possible to not have an active item at this
            // point, but the tests don't trigger mouseenter before click.
            this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
            var ui = { item: this.active };
            if ( !this.active.has( ".ui-menu" ).length ) {
                this.collapseAll( event, true );
            }
            this._trigger( "select", event, ui );
        },

        _filterMenuItems: function( character ) {
            var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
                regex = new RegExp( "^" + escapedCharacter, "i" );

            return this.activeMenu
                .find( this.options.items )

                // Only match on items, not dividers or other content (#10571)
                .filter( ".ui-menu-item" )
                .filter( function() {
                    return regex.test(
                        String.prototype.trim.call(
                            $( this ).children( ".ui-menu-item-wrapper" ).text() ) );
                } );
        }
    } );

} );

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('mage/menu',[
    'jquery',
    'matchMedia',
    'jquery-ui-modules/menu',
    'mage/translate'
], function ($, mediaCheck) {
    'use strict';

    /**
     * Menu Widget - this widget is a wrapper for the jQuery UI Menu
     */
    $.widget('mage.menu', $.ui.menu, {
        options: {
            responsive: false,
            expanded: false,
            showDelay: 42,
            hideDelay: 300,
            delay: 0,
            mediaBreakpoint: '(max-width: 768px)'
        },

        /**
         * @private
         */
        _create: function () {
            var self = this;

            this.delay = this.options.delay;

            this._super();
            $(window).on('resize', function () {
                self.element.find('.submenu-reverse').removeClass('submenu-reverse');
            });
        },

        /**
         * @private
         */
        _init: function () {
            this._super();

            if (this.options.expanded === true) {
                this.isExpanded();
            }

            if (this.options.responsive === true) {
                mediaCheck({
                    media: this.options.mediaBreakpoint,
                    entry: $.proxy(function () {
                        this._toggleMobileMode();
                    }, this),
                    exit: $.proxy(function () {
                        this._toggleDesktopMode();
                    }, this)
                });
            }

            this._assignControls()._listen();
            this._setActiveMenu();
        },

        /**
         * @return {Object}
         * @private
         */
        _assignControls: function () {
            this.controls = {
                toggleBtn: $('[data-action="toggle-nav"]')
            };

            return this;
        },

        /**
         * @private
         */
        _listen: function () {
            var controls = this.controls,
                toggle = this.toggle;

            controls.toggleBtn.off('click');
            controls.toggleBtn.on('click', toggle.bind(this));
        },

        /**
         * Toggle.
         */
        toggle: function () {
            var html = $('html');

            if (html.hasClass('nav-open')) {
                html.removeClass('nav-open');
                setTimeout(function () {
                    html.removeClass('nav-before-open');
                }, this.options.hideDelay);
            } else {
                html.addClass('nav-before-open');
                setTimeout(function () {
                    html.addClass('nav-open');
                }, this.options.showDelay);
            }
        },

        /**
         * Tries to figure out the active category for current page and add appropriate classes:
         *  - 'active' class for active category
         *  - 'has-active' class for all parents of active category
         *
         *  First, checks whether current URL is URL of category page,
         *  otherwise tries to retrieve category URL in case of current URL is product view page URL
         *  which has category tree path in it.
         *
         * @return void
         * @private
         */
        _setActiveMenu: function () {
            var currentUrl = window.location.href.split('?')[0];

            if (!this._setActiveMenuForCategory(currentUrl)) {
                this._setActiveMenuForProduct(currentUrl);
            }
        },

        /**
         * Looks for category with provided URL and adds 'active' CSS class to it if it was not set before.
         * If menu item has parent categories, sets 'has-active' class to all af them.
         *
         * @param {String} url - possible category URL
         * @returns {Boolean} - true if active category was founded by provided URL, otherwise return false
         * @private
         */
        _setActiveMenuForCategory: function (url) {
            var activeCategoryLink = this.element.find('a[href="' + url + '"]'),
                classes,
                classNav;

            if (!activeCategoryLink || !activeCategoryLink.hasClass('ui-menu-item-wrapper')) {

                //category was not found by provided URL
                return false;
            } else if (!activeCategoryLink.parent().hasClass('active')) {
                activeCategoryLink.parent().addClass('active');
                classes = activeCategoryLink.parent().attr('class');
                classNav = classes.match(/(nav\-)[0-9]+(\-[0-9]+)+/gi);

                if (classNav) {
                    this._setActiveParent(classNav[0]);
                }
            }

            return true;
        },

        /**
         * Sets 'has-active' CSS class to all parent categories which have part of provided class in childClassName
         *
         * @example
         *  childClassName - 'nav-1-2-3'
         *  CSS class 'has-active' will be added to categories have 'nav-1-2' and 'nav-1' classes
         *
         * @param {String} childClassName - Class name of active category <li> element
         * @return void
         * @private
         */
        _setActiveParent: function (childClassName) {
            var parentElement,
                parentClass = childClassName.substr(0, childClassName.lastIndexOf('-'));

            if (parentClass.lastIndexOf('-') !== -1) {
                parentElement = this.element.find('.' + parentClass);

                if (parentElement) {
                    parentElement.addClass('has-active');
                }
                this._setActiveParent(parentClass);
            }
        },

        /**
         * Tries to retrieve category URL from current URL and mark this category as active
         * @see _setActiveMenuForCategory(url)
         *
         * @example
         *  currentUrl - http://magento.com/category1/category12/product.html,
         *  category URLs has extensions .phtml - http://magento.com/category1.phtml
         *  method sets active category which has URL http://magento.com/category1/category12.phtml
         *
         * @param {String} currentUrl - current page URL without parameters
         * @return void
         * @private
         */
        _setActiveMenuForProduct: function (currentUrl) {
            var categoryUrlExtension,
                lastUrlSection,
                possibleCategoryUrl,
                //retrieve first category URL to know what extension is used for category URLs
                firstCategoryUrl = this.element.find('> li a').attr('href');

            if (firstCategoryUrl) {
                lastUrlSection = firstCategoryUrl.substr(firstCategoryUrl.lastIndexOf('/'));
                categoryUrlExtension = lastUrlSection.lastIndexOf('.') !== -1 ?
                    lastUrlSection.substr(lastUrlSection.lastIndexOf('.')) : '';

                possibleCategoryUrl = currentUrl.substr(0, currentUrl.lastIndexOf('/')) + categoryUrlExtension;
                this._setActiveMenuForCategory(possibleCategoryUrl);
            }
        },

        /**
         * Add class for expanded option.
         */
        isExpanded: function () {
            var subMenus = this.element.find(this.options.menus),
                expandedMenus = subMenus.find(this.options.menus);

            expandedMenus.addClass('expanded');
        },

        /**
         * @param {jQuery.Event} event
         * @private
         */
        _activate: function (event) {
            window.location.href = this.active.find('> a').attr('href');
            this.collapseAll(event);
        },

        /**
         * @param {jQuery.Event} event
         * @private
         */
        _keydown: function (event) {
            var match, prev, character, skip, regex,
                preventDefault = true;

            /* eslint-disable max-depth */
            /**
             * @param {String} value
             */
            function escape(value) {
                return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            }

            if (this.active.closest(this.options.menus).attr('aria-expanded') != 'true') { //eslint-disable-line eqeqeq

                switch (event.keyCode) {
                    case $.ui.keyCode.PAGE_UP:
                        this.previousPage(event);
                        break;

                    case $.ui.keyCode.PAGE_DOWN:
                        this.nextPage(event);
                        break;

                    case $.ui.keyCode.HOME:
                        this._move('first', 'first', event);
                        break;

                    case $.ui.keyCode.END:
                        this._move('last', 'last', event);
                        break;

                    case $.ui.keyCode.UP:
                        this.previous(event);
                        break;

                    case $.ui.keyCode.DOWN:
                        if (this.active && !this.active.is('.ui-state-disabled')) {
                            this.expand(event);
                        }
                        break;

                    case $.ui.keyCode.LEFT:
                        this.previous(event);
                        break;

                    case $.ui.keyCode.RIGHT:
                        this.next(event);
                        break;

                    case $.ui.keyCode.ENTER:
                    case $.ui.keyCode.SPACE:
                        this._activate(event);
                        break;

                    case $.ui.keyCode.ESCAPE:
                        this.collapse(event);
                        break;
                    default:
                        preventDefault = false;
                        prev = this.previousFilter || '';
                        character = String.fromCharCode(event.keyCode);
                        skip = false;

                        clearTimeout(this.filterTimer);

                        if (character === prev) {
                            skip = true;
                        } else {
                            character = prev + character;
                        }

                        regex = new RegExp('^' + escape(character), 'i');
                        match = this.activeMenu.children('.ui-menu-item').filter(function () {
                            return regex.test($(this).children('a').text());
                        });
                        match = skip && match.index(this.active.next()) !== -1 ?
                            this.active.nextAll('.ui-menu-item') :
                            match;

                        // If no matches on the current filter, reset to the last character pressed
                        // to move down the menu to the first item that starts with that character
                        if (!match.length) {
                            character = String.fromCharCode(event.keyCode);
                            regex = new RegExp('^' + escape(character), 'i');
                            match = this.activeMenu.children('.ui-menu-item').filter(function () {
                                return regex.test($(this).children('a').text());
                            });
                        }

                        if (match.length) {
                            this.focus(event, match);

                            if (match.length > 1) {
                                this.previousFilter = character;
                                this.filterTimer = this._delay(function () {
                                    delete this.previousFilter;
                                }, 1000);
                            } else {
                                delete this.previousFilter;
                            }
                        } else {
                            delete this.previousFilter;
                        }
                }
            } else {
                switch (event.keyCode) {
                    case $.ui.keyCode.DOWN:
                        this.next(event);
                        break;

                    case $.ui.keyCode.UP:
                        this.previous(event);
                        break;

                    case $.ui.keyCode.RIGHT:
                        if (this.active && !this.active.is('.ui-state-disabled')) {
                            this.expand(event);
                        }
                        break;

                    case $.ui.keyCode.ENTER:
                    case $.ui.keyCode.SPACE:
                        this._activate(event);
                        break;

                    case $.ui.keyCode.LEFT:
                    case $.ui.keyCode.ESCAPE:
                        this.collapse(event);
                        break;
                    default:
                        preventDefault = false;
                        prev = this.previousFilter || '';
                        character = String.fromCharCode(event.keyCode);
                        skip = false;

                        clearTimeout(this.filterTimer);

                        if (character === prev) {
                            skip = true;
                        } else {
                            character = prev + character;
                        }

                        regex = new RegExp('^' + escape(character), 'i');
                        match = this.activeMenu.children('.ui-menu-item').filter(function () {
                            return regex.test($(this).children('a').text());
                        });
                        match = skip && match.index(this.active.next()) !== -1 ?
                            this.active.nextAll('.ui-menu-item') :
                            match;

                        // If no matches on the current filter, reset to the last character pressed
                        // to move down the menu to the first item that starts with that character
                        if (!match.length) {
                            character = String.fromCharCode(event.keyCode);
                            regex = new RegExp('^' + escape(character), 'i');
                            match = this.activeMenu.children('.ui-menu-item').filter(function () {
                                return regex.test($(this).children('a').text());
                            });
                        }

                        if (match.length) {
                            this.focus(event, match);

                            if (match.length > 1) {
                                this.previousFilter = character;
                                this.filterTimer = this._delay(function () {
                                    delete this.previousFilter;
                                }, 1000);
                            } else {
                                delete this.previousFilter;
                            }
                        } else {
                            delete this.previousFilter;
                        }
                }
            }

            /* eslint-enable max-depth */
            if (preventDefault) {
                event.preventDefault();
            }
        },

        /**
         * @private
         */
        _toggleMobileMode: function () {
            var subMenus;

            $(this.element).off('mouseenter mouseleave');
            this._on({

                /**
                 * @param {jQuery.Event} event
                 */
                'click .ui-menu-item:has(a)': function (event) {
                    var target;

                    event.preventDefault();
                    target = $(event.target).closest('.ui-menu-item');
                    target.get(0).scrollIntoView();

                    if (!target.hasClass('level-top') || !target.has('.ui-menu').length) {
                        window.location.href = target.find('> a').attr('href');
                    }
                },

                /**
                 * @param {jQuery.Event} event
                 */
                'click .ui-menu-item:has(.ui-state-active)': function (event) {
                    this.collapseAll(event, true);
                }
            });

            subMenus = this.element.find('.level-top');
            $.each(subMenus, $.proxy(function (index, item) {
                var category = $(item).find('> a span').not('.ui-menu-icon').text(),
                    categoryUrl = $(item).find('> a').attr('href'),
                    menu = $(item).find('> .ui-menu');

                this.categoryLink = $('<a>')
                    .attr('href', categoryUrl)
                    .text($.mage.__('All %1').replace('%1', category));

                this.categoryParent = $('<li>')
                    .addClass('ui-menu-item all-category')
                    .html(this.categoryLink);

                if (menu.find('.all-category').length === 0) {
                    menu.prepend(this.categoryParent);
                }

            }, this));
        },

        /**
         * @private
         */
        _toggleDesktopMode: function () {
            var categoryParent, html;

            $(this.element).off('click mousedown mouseenter mouseleave');
            this._on({

                /**
                 * Prevent focus from sticking to links inside menu after clicking
                 * them (focus should always stay on UL during navigation).
                 */
                'mousedown .ui-menu-item > a': function (event) {
                    event.preventDefault();
                },

                /**
                 * Prevent focus from sticking to links inside menu after clicking
                 * them (focus should always stay on UL during navigation).
                 */
                'click .ui-state-disabled > a': function (event) {
                    event.preventDefault();
                },

                /**
                 * @param {jQuer.Event} event
                 */
                'click .ui-menu-item:has(a)': function (event) {
                    var target = $(event.target).closest('.ui-menu-item');

                    if (!this.mouseHandled && target.not('.ui-state-disabled').length) {
                        this.select(event);

                        // Only set the mouseHandled flag if the event will bubble, see #9469.
                        if (!event.isPropagationStopped()) {
                            this.mouseHandled = true;
                        }

                        // Open submenu on click
                        if (target.has('.ui-menu').length) {
                            this.expand(event);
                        } else if (!this.element.is(':focus') &&
                            $(this.document[0].activeElement).closest('.ui-menu').length
                        ) {
                            // Redirect focus to the menu
                            this.element.trigger('focus', [true]);

                            // If the active item is on the top level, let it stay active.
                            // Otherwise, blur the active item since it is no longer visible.
                            if (this.active && this.active.parents('.ui-menu').length === 1) { //eslint-disable-line
                                clearTimeout(this.timer);
                            }
                        }
                    }
                },

                /**
                 * @param {jQuery.Event} event
                 */
                'mouseenter .ui-menu-item': function (event) {
                    var target = $(event.currentTarget),
                        submenu = this.options.menus,
                        ulElement,
                        ulElementWidth,
                        width,
                        targetPageX,
                        rightBound;

                    if (target.has(submenu)) {
                        ulElement = target.find(submenu);
                        ulElementWidth = ulElement.outerWidth(true);
                        width = target.outerWidth() * 2;
                        targetPageX = target.offset().left;
                        rightBound = $(window).width();

                        if (ulElementWidth + width + targetPageX > rightBound) {
                            ulElement.addClass('submenu-reverse');
                        }

                        if (targetPageX - ulElementWidth < 0) {
                            ulElement.removeClass('submenu-reverse');
                        }
                    }

                    // Remove ui-state-active class from siblings of the newly focused menu item
                    // to avoid a jump caused by adjacent elements both having a class with a border
                    target.siblings().children('.ui-state-active').removeClass('ui-state-active');
                    this.focus(event, target);
                },

                /**
                 * @param {jQuery.Event} event
                 */
                'mouseleave': function (event) {
                    this.collapseAll(event, true);
                },

                /**
                 * Mouse leave.
                 */
                'mouseleave .ui-menu': 'collapseAll'
            });

            categoryParent = this.element.find('.all-category');
            html = $('html');

            categoryParent.remove();

            if (html.hasClass('nav-open')) {
                html.removeClass('nav-open');
                setTimeout(function () {
                    html.removeClass('nav-before-open');
                }, this.options.hideDelay);
            }
        },

        /**
         * @param {*} handler
         * @param {Number} delay
         * @return {Number}
         * @private
         */
        _delay: function (handler, delay) {
            var instance = this,

                /**
                 * @return {*}
                 */
                handlerProxy = function () {
                    return (typeof handler === 'string' ? instance[handler] : handler).apply(instance, arguments);
                };

            return setTimeout(handlerProxy, delay || 0);
        },

        /**
         * @param {jQuery.Event} event
         */
        expand: function (event) {
            var newItem = this.active &&
                this.active
                    .children('.ui-menu')
                    .children('.ui-menu-item')
                    .first();

            if (newItem && newItem.length) {
                if (newItem.closest('.ui-menu').is(':visible') &&
                    newItem.closest('.ui-menu').has('.all-categories')
                ) {
                    return;
                }

                // remove the active state class from the siblings
                this.active.siblings().children('.ui-state-active').removeClass('ui-state-active');

                this._open(newItem.parent());

                // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
                this._delay(function () {
                    this.focus(event, newItem);
                });
            }
        },

        /**
         * @param {jQuery.Event} event
         */
        select: function (event) {
            var ui;

            this.active = this.active || $(event.target).closest('.ui-menu-item');

            if (this.active.is('.all-category')) {
                this.active = $(event.target).closest('.ui-menu-item');
            }
            ui = {
                item: this.active
            };

            if (!this.active.has('.ui-menu').length) {
                this.collapseAll(event, true);
            }
            this._trigger('select', event, ui);
        }
    });

    $.widget('mage.navigation', $.mage.menu, {
        options: {
            responsiveAction: 'wrap', //option for responsive handling
            maxItems: null, //option to set max number of menu items
            container: '#menu', //container to check against navigation length
            moreText: $.mage.__('more'),
            breakpoint: 768
        },

        /**
         * @private
         */
        _init: function () {
            var that, responsive;

            this._super();

            that = this;
            responsive = this.options.responsiveAction;

            this.element
                .addClass('ui-menu-responsive')
                .attr('responsive', 'main');

            this.setupMoreMenu();
            this.setMaxItems();

            //check responsive option
            if (responsive == 'onResize') { //eslint-disable-line eqeqeq
                $(window).on('resize', function () {
                    if ($(window).width() > that.options.breakpoint) {
                        that._responsive();
                        $('[responsive=more]').show();
                    } else {
                        that.element.children().show();
                        $('[responsive=more]').hide();
                    }
                });
            } else if (responsive == 'onReload') { //eslint-disable-line eqeqeq
                this._responsive();
            }
        },

        /**
         * Setup more menu.
         */
        setupMoreMenu: function () {
            var moreListItems = this.element.children().clone(),
                moreLink = $('<a>' + this.options.moreText + '</a>');

            moreListItems.hide();

            moreLink.attr('href', '#');

            this.moreItemsList = $('<ul>')
                .append(moreListItems);

            this.moreListContainer = $('<li>')
                .append(moreLink)
                .append(this.moreItemsList);

            this.responsiveMenu = $('<ul>')
                .addClass('ui-menu-more')
                .attr('responsive', 'more')
                .append(this.moreListContainer)
                .menu({
                    position: {
                        my: 'right top',
                        at: 'right bottom'
                    }
                })
                .insertAfter(this.element);
        },

        /**
         * @private
         */
        _responsive: function () {
            var container = $(this.options.container),
                containerSize = container.width(),
                width = 0,
                items = this.element.children('li'),
                more = $('.ui-menu-more > li > ul > li a');

            items = items.map(function () {
                var item = {};

                item.item = $(this);
                item.itemSize = $(this).outerWidth();

                return item;
            });

            $.each(items, function (index) {
                var itemText = items[index].item
                    .find('a:first')
                    .text();

                width += parseInt(items[index].itemSize, null); //eslint-disable-line radix

                if (width < containerSize) {
                    items[index].item.show();

                    more.each(function () {
                        var text = $(this).text();

                        if (text === itemText) {
                            $(this).parent().hide();
                        }
                    });
                } else if (width > containerSize) {
                    items[index].item.hide();

                    more.each(function () {
                        var text = $(this).text();

                        if (text === itemText) {
                            $(this).parent().show();
                        }
                    });
                }
            });
        },

        /**
         * Set max items.
         */
        setMaxItems: function () {
            var items = this.element.children('li'),
                itemsCount = items.length,
                maxItems = this.options.maxItems,
                overflow = itemsCount - maxItems,
                overflowItems = items.slice(overflow);

            overflowItems.hide();

            overflowItems.each(function () {
                var itemText = $(this).find('a:first').text();

                $(this).hide();

                $('.ui-menu-more > li > ul > li a').each(function () {
                    var text = $(this).text();

                    if (text === itemText) {
                        $(this).parent().show();
                    }
                });
            });
        }
    });

    return {
        menu: $.mage.menu,
        navigation: $.mage.navigation
    };
});

define('Algolia_AlgoliaSearch/internals/template/autocomplete/categories',[], function () {
    return {
        getNoResultHtml: function ({html}) {
            return html`<p>${algoliaConfig.translations.noResults}</p>`;
        },

        getHeaderHtml: function ({section}) {
            return section.label;
        },

        getItemHtml: function ({item, components, html}) {
            return html `<a class="algoliasearch-autocomplete-hit"
                            href="${item.url}"
                            data-objectId="${item.objectID}"
                            data-position="${item.position}"
                            data-index="${item.__autocomplete_indexName}"
                            data-queryId="${item.__autocomplete_queryID}">
                ${components.Highlight({ hit: item, attribute: 'path' })} (${item.product_count})
            </a>`;
        },

        getFooterHtml: function () {
            return "";
        },
    };
});

define('Born_Newsletter/js/newsletter-subscription',[
    'jquery',
    'mage/translate',
    'jquery/ui',
    'mage/mage',
    'mage/cookies'
], function ($, $t) {
    'use strict';

    $.widget('born.Newsletter', {
        /** @inheritdoc */
        _create: function () {
            this._bindSubmit();
        },
        /**
         * @private
         */
        _bindSubmit: function () {
            var self = this;

            this.element.on('submit', function (e) {
                e.preventDefault();
                if ($(this).validation('isValid')) {
                    self.submitForm($(this));
                }
            });
        },
        /**
         * Handler for the form 'submit' event
         *
         * @param {Object} form
         */
        submitForm: function (form) {
            var self = this;
            var formData = form.serializeArray();
            formData[0]['value'] = $.mage.cookies.get('form_key');
            $.ajax({
                url: form.attr('action'),
                data: formData,
                type: 'post',
                dataType: 'json',
                showLoader: true,
                /** @inheritdoc */
                beforeSend: function () {
                    self.element.parent().find('.messages').remove();
                },
                success: function (response) {
                    console.log(response);
                    var isErrorMessage = '';
                    if (response.error) {
                        var isErrorMessage = 'mage-error';
                        self.element.after('<div class="messages"><div class="message message-' + response.status + ' ' + response.status + ' '+isErrorMessage+' "><div>' + response.message + '</div></div></div>');
                        setTimeout(function () {
                            self.element.parent().find('.messages').remove();
                        }, 6000);
                    } else {
                        self.element.find('input').val('');
                        self.element.after('<div class="messages"><div class="message message-success success"><div>'+response.message+'</div></div></div>');
                        setTimeout(function(){
                          self.element.parent().find('.messages').remove();
                        }, 6000);
                    }
                },
                error: function() {
                    self.element.after('<div class="messages"><div class="message message-error error mage-error"><div>'+$t('An error occurred, please try again later.')+'</div></div></div>');
                    setTimeout(function(){
                      self.element.parent().find('.messages').remove();
                    }, 6000);
                }
            });
        }
    });

    return $.born.Newsletter;
});

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define('Magento_Checkout/js/view/cart-item-renderer',[
    'uiComponent'
], function (Component) {
    'use strict';

    return Component.extend({
        /**
         * Prepare the product name value to be rendered as HTML
         *
         * @param {String} productName
         * @return {String}
         */
        getProductNameUnsanitizedHtml: function (productName) {
            // product name has already escaped on backend
            return productName;
        },

        /**
         * Prepare the given option value to be rendered as HTML
         *
         * @param {String} optionValue
         * @return {String}
         */
        getOptionValueUnsanitizedHtml: function (optionValue) {
            // option value has already escaped on backend
            return optionValue;
        }
    });
});

/**
 * A simple jQuery plugin for creating animated drilldown menus.
 *
 * @name jQuery Drilldown
 * @version 1.1.1
 * @requires jQuery v1.7+
 * @author Aleksandras Nelkinas
 * @license [MIT]{@link http://opensource.org/licenses/mit-license.php}
 *
 * Copyright (c) 2015 Aleksandras Nelkinas
 */

 ;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define('jquery.drilldown',['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($, undefined) {

  'use strict';

  var PLUGIN_NAME = 'drilldown';
  var TRACK_PARENT_ATTR = 'data-next-parent';

  var defaults = {
    event: 'click',
    selector: 'a',
    speed: 100,
    cssClass: {
      container: PLUGIN_NAME + '-container',
      root: PLUGIN_NAME + '-root',
      sub: PLUGIN_NAME + '-sub',
      back: PLUGIN_NAME + '-back'
    }
  };

  var Plugin = (function () {

    function Plugin(element, options) {
      var inst = this;

      this._name = PLUGIN_NAME;
      this._defaults = defaults;

      this.element = element;
      this.$element = $(element);

      this.options = $.extend({}, defaults, options);

      this._history = [];
      this._css = {
        float: 'left',
        width: null
      };

      this.$container = this.$element.find('.' + this.options.cssClass.container);
      this.$element.on(this.options.event + '.' + PLUGIN_NAME, this.options.selector, function (e) {
        $('.' + inst.options.cssClass.container).removeClass('loaded');
        if ($(window).width() < 800) {
            $('.nav-sections-item-content').css({"transition": "0.3s","opacity": "0.3"});
        }
        var $trigger = $(this).parent();
        handleAction.call(inst, e, $trigger);
        setTimeout(function(){
          $('.' + inst.options.cssClass.container).addClass('loaded');
            if ($(window).width() < 801) {
                $('.nav-sections-item-content').css({"transition": "0.3s","opacity": "1"});
            }
        }, inst.options.speed);
      });
    }

    Plugin.prototype = {

      /**
       * Destroys plugin instance.
       */
       destroy: function () {
        this.reset();

        this.$element.off(this.options.event + '.' + PLUGIN_NAME, this.options.selector);
      },

      /**
       * Resets drilldown to its initial state.
       */
       reset: function () {
        var iter;

        for (iter = this._history.length; iter > 0; iter--) {
          up.call(this, { speed: 0 });
        }

        this._history = [];
        this._css = {
          float: 'left',
          width: null
        };
      }
    };

    /**
     * Handles user action and decides whether or not and where to drill.
     *
     * @param {jQuery.Event} e
     * @param {jQuery}       $trigger
     * @private
     */
     function handleAction(e, $trigger) {
      var $parent = $('.' + this.options.cssClass.sub).parent();

      var $next = $trigger.nextAll('.' + this.options.cssClass.sub);


      var $title = $trigger.children('span').html();
      // $next.find('.drilldown-back .current-cat').eq(0).html($title);
      $next.find('.drilldown-back .current-cat').eq(0).html("BACK");

      var preventDefault = true;
      if ($next.length) {
        down.call(this, $next);
      } else if ($trigger.closest('.' + this.options.cssClass.back).length) {
        up.call(this);
      } else {
        preventDefault = false;
      }

      if (preventDefault && $trigger.prop('tagName') === 'A') {
        e.preventDefault();
      }
    }

    /**
     * Drills down (deeper).
     *
     * @param {jQuery} $next
     * @param {Object} opts
     * @private
     */
     function down($next, opts) {
      var speed = (opts && opts.speed !== undefined) ? opts.speed : this.options.speed;

      if (!$next.length) {
        return;
      }

      this._css.width = this.$element.outerWidth();
      this.$container.width(this._css.width * 2);

      // Track parent of the opened node
      $next.parent().attr(TRACK_PARENT_ATTR, true);

      $next = $next
      .removeClass(this.options.cssClass.sub)
      .addClass(this.options.cssClass.root);

      $next.hide();
      this.$container.append($next);


      animateDrilling.call(this, { marginLeft: 0 * this._css.width, speed: speed }, function () {
        var $current = $next.prev();

        this._history.push($current.detach());
          $next.show();
        restoreState.call(this, $next);
      }.bind(this));
    }

    /**
     * Drills up (back).
     *
     * @private
     */
     function up(opts) {
      var speed = (opts && opts.speed !== undefined) ? opts.speed : this.options.speed;
      var $next = this._history.pop();

      this._css.width = this.$element.outerWidth();
      this.$container.width(this._css.width * 2);

      this.$container.prepend($next);
      $next.css("display","none");
      animateDrilling.call(this, { marginLeft: 0, speed: speed }, function () {
        var $current = $next.next();

        $current
        .addClass(this.options.cssClass.sub)
        .removeClass(this.options.cssClass.root);

        // Restore the node at its initial position in the DOM
        this.$container.find('[' + TRACK_PARENT_ATTR + ']').last()
        .removeAttr(TRACK_PARENT_ATTR)
        .append($current);
          $next.css("display","block");
          $next.find('.submenu').css("display","none");
        restoreState.call(this, $next);
      }.bind(this));
    }

    /**
     * Animates drilling process.
     *
     * @param {Object}   opts
     * @param {Function} callback
     * @private
     */
     function animateDrilling(opts, callback) {
      var $menus = this.$container.children('.' + this.options.cssClass.root);

      $menus.css(this._css);

      $menus.first().animate({ marginLeft: opts.marginLeft }, opts.speed, callback);
    }

    /**
     * Restores initial menu's state.
     *
     * @param {jQuery} $menu
     * @private
     */
     function restoreState($menu) {
      $menu.css({
        float: '',
        width: '',
        marginLeft: ''
      });

      this.$container.css('width', '');
    }

    return Plugin;

  })();

  $.fn[PLUGIN_NAME] = function (options) {
    return this.each(function () {
      var inst = $.data(this, PLUGIN_NAME);
      var method = options;

      if (!inst) {
        $.data(this, PLUGIN_NAME, new Plugin(this, options));
      } else if (typeof method === 'string') {
        if (method === 'destroy') {
          $.removeData(this,  PLUGIN_NAME);
        }
        if (typeof inst[method] === 'function') {
          inst[method]();
        }
      }
    });
  };

}));


define('text!Magento_Checkout/template/minicart/item/price.html',[],function () { return '<!--\n/**\n * Copyright © Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class="price-container">\n  <span class="price-wrapper" data-bind="html: price"></span>\n</div>\n';});

define('WeltPixel_NavigationLinks/js/menu-mixin',['jquery'], function($) {
    'use strict';

    return function(navigationMenu) {
        $.widget('mage.menu', navigationMenu.menu, {
            options: {
                mediaBreakpoint: '(max-width: ' + window.widthThreshold + 'px)'
            },
            _toggleMobileMode: function () {
                this._super();
                $('.navigation ul > li.level0.mm-no-children > ul.hide-all-category').remove();
            },
            /**
             * Toggle.
             */
            toggle: function () {
                if ($(window).width() <= window.widthThreshold || window.widthThreshold === undefined) {
                    var html = $('html');
                    if (html.hasClass('nav-open')) {
                        html.removeClass('nav-open');
                        setTimeout(function () {
                            html.removeClass('nav-before-open');
                        }, this.options.hideDelay);
                    } else {
                        html.addClass('nav-before-open');
                        setTimeout(function () {
                            html.addClass('nav-open');
                        }, this.options.showDelay);
                    }
                }
            }
        });
        return {
            menu: $.mage.menu,
            navigation: $.mage.navigation
        }
    }
});

define('WeltPixel_SocialLogin/js/action/login',[
    'jquery',
    'mage/storage',
    'Magento_Ui/js/model/messageList',
    'Magento_Customer/js/customer-data'
], function ($, storage, globalMessageList, customerData) {
    'use strict';

    var callbacks = [],

        /**
         * @param {Object} loginData
         * @param {String} redirectUrl
         * @param {*} isGlobal
         * @param {Object} messageContainer
         */
        action = function (loginData, redirectUrl, isGlobal, messageContainer) {
            messageContainer = messageContainer || globalMessageList;

            return storage.post(
                'sociallogin/ajax/login',
                JSON.stringify(loginData),
                isGlobal
            ).done(function (response) {
                if (response.errors) {
                    messageContainer.addErrorMessage({
                        'message':response.message
                    });
                    callbacks.forEach(function (callback) {
                        callback(loginData);
                    });
                } else {
                    callbacks.forEach(function (callback) {
                        callback(loginData);
                    });
                    customerData.invalidate(['customer']);

                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else if (response.redirectUrl) {
                        window.location.href = response.redirectUrl;
                    } else {
                        location.reload();
                    }
                }
            }).fail(function () {
                messageContainer.addErrorMessage({
                    'message': 'Could not authenticate. Please try again later'
                });
                callbacks.forEach(function (callback) {
                    callback(loginData);
                });
            });
        };

    /**
     * @param {Function} callback
     */
    action.registerLoginCallback = function (callback) {
        callbacks.push(callback);
    };

    return action;
});
define('WeltPixel_SocialLogin/js/view/authentication-popup',[
    'jquery',
    'ko',
    'Magento_Ui/js/form/form',
    'WeltPixel_SocialLogin/js/action/login',
    'Magento_Customer/js/customer-data',
    'Magento_Customer/js/model/authentication-popup',
    'mage/translate',
    'mage/url',
    'Magento_Ui/js/modal/alert',
    'mage/validation'
], function ($, ko, Component, loginAction, customerData, authenticationPopup, $t, url, alert) {
    'use strict';

    return Component.extend({
        registerUrl: window.authenticationPopup.customerRegisterUrl,
        forgotPasswordUrl: window.authenticationPopup.customerForgotPasswordUrl,
        autocomplete: window.authenticationPopup.autocomplete,
        modalWindow: null,
        isLoading: ko.observable(false),

        defaults: {
            template: 'WeltPixel_SocialLogin/authentication-popup'
        },
        socialloginButtons: window.socialloginButtons,

        /**
         * Init
         */
        initialize: function () {
            var self = this;

            this._super();
            url.setBaseUrl(window.authenticationPopup.baseUrl);
            loginAction.registerLoginCallback(function () {
                self.isLoading(false);
            });
        },

        /** Init popup login window */
        setAjaxModelElement: function (element) {
            if (window.isSlGuestCheckoutEnabled && parseInt(window.isSlGuestCheckoutEnabled)) {
                return false;
            }
            if (authenticationPopup.modalWindow == null) {
                authenticationPopup.createPopUp(element);
            }
        },

        /** Init popup login window */
        setModalElement: function (element) {
            if (window.isSlGuestCheckoutEnabled && parseInt(window.isSlGuestCheckoutEnabled)) {
                return false;
            }
            if (authenticationPopup.modalWindow == null) {
                authenticationPopup.createPopUp(element);
            }
        },

        /** Is login form enabled for current customer */
        isActive: function () {
            var customer = customerData.get('customer');

            return customer() == false; //eslint-disable-line eqeqeq
        },

        /** Show login popup window */
        showModal: function () {
            if (this.modalWindow) {
                $(this.modalWindow).modal('openModal');
            } else {
                alert({
                    content: $t('Guest checkout is disabled.')
                });
            }
        },

        /**
         * Provide login action
         *
         * @return {Boolean}
         */
        login: function (formUiElement, event) {
            var loginData = {},
                formElement = $(event.currentTarget),
                formDataArray = formElement.serializeArray();

            event.stopPropagation();
            formDataArray.forEach(function (entry) {
                loginData[entry.name] = entry.value;
            });

            if (formElement.validation() &&
                formElement.validation('isValid')
            ) {
                this.isLoading(true);
                loginAction(loginData);
            }

            return false;
        }

    });
});


define('text!Magento_Checkout/template/minicart/content.html',[],function () { return '<!--\n/**\n * Copyright © Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<a class="action showcart desktop" data-bind="attr: {href: shoppingCartUrl,scope: \'minicart_content\'}">\n     <span class="text"> <!-- ko i18n: \'My Cart\' --><!-- /ko --></span>\n     <span class="counter qty empty"\n           data-bind="css: { empty: !!getCartParam(\'summary_count\') == false && !isLoading() }, blockLoader: isLoading">\n         <span class="counter-number"><!-- ko text: getCartParam(\'summary_count\') --><!-- /ko --></span>\n         <span class="counter-label">\n         <!-- ko if: getCartParam(\'summary_count\') -->\n             <!-- ko text: getCartParam(\'summary_count\') --><!-- /ko -->\n             <!-- ko i18n: \'items\' --><!-- /ko -->\n         <!-- /ko -->\n         </span>\n     </span>\n </a>\n<div class="icon--close-wrapper">\n    <svg class="icon--close" role="none" focusable="false" aria-hidden="true"><use xlink:href="#icon--close"><svg id="icon--close" viewBox="0 0 37 37">\n        <path fill-rule="nonzero" d="M36.533 3.533L33 0 18.267 14.733 3.533 0 0 3.533l14.733 14.734L0 33l3.533 3.533L18.267 21.8 33 36.533 36.533 33 21.8 18.267z"></path>\n    </svg></use></svg>\n</div>\n<div class="block-title desktop">\n    <!-- ko if: getCartParam(\'summary_count\') -->\n    <strong>\n        <span class="cart-qty"> (<!-- ko text: getCartParam(\'summary_count\') --><!-- /ko -->)</span>\n        <!-- ko if: getCartParam(\'summary_count\') == 1 -->\n        <span class="text"> <!-- ko i18n: \' item in your cart\' --><!-- /ko --></span>\n        <!-- /ko -->\n        <!-- ko ifnot: getCartParam(\'summary_count\') == 1 -->\n        <span class="text"> <!-- ko i18n: \' items in your cart\' --><!-- /ko --></span>\n        <!-- /ko -->\n        </span>\n    </strong>\n    <span data-bind="html: getCartParam(\'subtotal\')"></span>\n    <!-- /ko -->\n</div>\n<div class="block-title mobile">\n    <!-- ko if: getCartParam(\'summary_count\') -->\n    <strong>\n        <span class="text"> <!-- ko i18n: \'(1) new item in cart\' --><!-- /ko --></span>\n        </span>\n    </strong>\n\n    <span data-bind="html: getCartParam(\'subtotal\')"></span>\n    <!-- /ko -->\n</div>\n\n<div class="block-content">\n    <button type="button"\n            id="btn-minicart-close"\n            class="action close"\n            data-action="close"\n            data-bind="attr: { title: $t(\'Close\') }">\n        <span translate="\'Close\'"></span>\n    </button>\n\n    <!-- ko if: getCartParam(\'summary_count\') -->\n    <strong class="subtitle"><!-- ko i18n: \'Recently added item(s)\' --><!-- /ko --></strong>\n    <div data-action="scroll" class="minicart-items-wrapper">\n        <ol id="mini-cart" class="minicart-items" data-bind="foreach: { data: getCartItems(), as: \'item\' }">\n            <!-- ko foreach: $parent.getRegion($parent.getItemRenderer(item.product_type)) -->\n                <!-- ko template: {name: getTemplate(), data: item, afterRender: function() {$parents[1].initSidebar()}} --><!-- /ko -->\n            <!-- /ko -->\n        </ol>\n    </div>\n    <!-- /ko -->\n\n    <ifnot args="getCartParam(\'summary_count\')">\n        <strong class="subtitle empty"\n                data-bind="visible: closeSidebar()"\n                translate="\'You have no items in your shopping cart.\'"\n        ></strong>\n        <if args="getCartParam(\'cart_empty_message\')">\n            <p class="minicart empty text" text="getCartParam(\'cart_empty_message\')"></p>\n            <div class="actions">\n                <div class="secondary">\n                    <a class="action viewcart" data-bind="attr: {href: shoppingCartUrl}">\n                        <span translate="\'View and Edit Cart\'"></span>\n                    </a>\n                </div>\n            </div>\n        </if>\n    </ifnot>\n\n    <if args="getCartParam(\'summary_count\')">\n\n        <!-- ko if: getCartParam(\'possible_onepage_checkout\') -->\n            <!-- ko foreach: getRegion(\'subtotalContainer\') -->\n                <!-- ko template: getTemplate() --><!-- /ko -->\n            <!-- /ko -->\n        <!-- /ko -->\n\n        <!-- ko foreach: getRegion(\'extraInfo\') -->\n            <!-- ko template: getTemplate() --><!-- /ko -->\n        <!-- /ko -->\n\n        <!-- ko if: getCartParam(\'possible_onepage_checkout\') -->\n        <div class="actions">\n            <div class="primary" if="getCartParam(\'possible_onepage_checkout\')">\n                <button\n                        id="top-cart-btn-checkout"\n                        class="action primary checkout">\n                        <span><!-- ko i18n: \'Checkout\' --><!-- /ko --></span>\n                </button>\n                <div data-bind="html: getCartParam(\'extra_actions\')"></div>\n            </div>\n        </div>\n        <!-- /ko -->\n    </if>\n\n    <div class="actions" if="getCartParam(\'summary_count\')">\n        <div class="secondary">\n            <button id="btn-view-cart-mobile" class="action viewcart mobile" onclick="window.location.href=jQuery(this).attr(\'data-href\')" data-bind="attr: {\'data-href\': shoppingCartUrl}">\n                <span translate="\'View cart\'"></span>\n                (<!-- ko text: getCartParam(\'summary_count\') --><!-- /ko -->)\n            </button>\n        </div>\n    </div>\n\n    <div class="actions" if="getCartParam(\'summary_count\')">\n        <div class="secondary">\n            <a id="mini-cart-view-link-desktop" class="action-link viewcart desktop"\n               onclick="window.location.href=jQuery(this).attr(\'data-href\')"\n               data-bind="attr: {\'data-href\': shoppingCartUrl}">\n                <span class="full-cart-link"><!-- ko i18n: \'See full cart\' --><!-- /ko --></span>\n            </a>\n            <span class="text"><!-- ko i18n: \'to enter promo codes and gift options.\' --><!-- /ko --></span>\n\n        </div>\n    </div>\n\n    <div id="minicart-widgets" class="minicart-widgets" if="getRegion(\'promotion\').length">\n        <each args="getRegion(\'promotion\')" render=""></each>\n    </div>\n</div>\n<each args="getRegion(\'sign-in-popup\')" render=""></each>\n';});


define('text!WeltPixel_SocialLogin/template/authentication-popup.html',[],function () { return '<div class="block-authentication"\n     data-bind="afterRender: setModalElement, blockLoader: isLoading"\n     style="display: none">\n    <div class="block block-new-customer"\n         data-bind="attr: {\'data-label\': $t(\'or\')}">\n        <div class="block-title">\n            <strong id="block-new-customer-heading"\n                    role="heading"\n                    aria-level="2"\n                    data-bind="i18n: \'Checkout out as a new customer\'"></strong>\n        </div>\n        <div class="block-content" aria-labelledby="block-new-customer-heading">\n            <p data-bind="i18n: \'Creating an account has many benefits:\'"></p>\n            <ul>\n                <li data-bind="i18n: \'See order and shipping status\'"></li>\n                <li data-bind="i18n: \'Track order history\'"></li>\n                <li data-bind="i18n: \'Check out faster\'"></li>\n            </ul>\n            <div class="actions-toolbar">\n                <div class="primary">\n                    <a class="action action-register primary" data-bind="attr: {href: registerUrl}">\n                        <span data-bind="i18n: \'Create Account\'"></span>\n                    </a>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="block block-customer-login"\n         data-bind="attr: {\'data-label\': $t(\'or\')}">\n        <div class="block-title">\n            <strong id="block-customer-login-heading"\n                    role="heading"\n                    aria-level="2"\n                    data-bind="i18n: \'Checkout out using your account\'"></strong>\n        </div>\n        <!-- ko foreach: getRegion(\'messages\') -->\n        <!-- ko template: getTemplate() --><!-- /ko -->\n        <!--/ko-->\n        <!-- ko foreach: getRegion(\'before\') -->\n        <!-- ko template: getTemplate() --><!-- /ko -->\n        <!-- /ko -->\n        <div class="block-content" aria-labelledby="block-customer-login-heading">\n            <form class="form form-login"\n                  method="post"\n                  data-bind="event: {submit: login }"\n                  id="login-form">\n                <div class="fieldset login" data-bind="attr: {\'data-hasrequired\': $t(\'* Required Fields\')}">\n                    <div class="field email required">\n                        <label class="label" for="email"><span data-bind="i18n: \'Email Address\'"></span></label>\n                        <div class="control">\n                            <input name="username"\n                                   id="email"\n                                   type="email"\n                                   class="input-text"\n                                   data-bind="attr: {autocomplete: autocomplete}"\n                                   data-validate="{required:true, \'validate-email\':true}">\n                        </div>\n                    </div>\n                    <div class="field password required">\n                        <label for="pass" class="label"><span data-bind="i18n: \'Password\'"></span></label>\n                        <div class="control">\n                            <input name="password"\n                                   type="password"\n                                   class="input-text"\n                                   id="pass"\n                                   data-bind="attr: {autocomplete: autocomplete}"\n                                   data-validate="{required:true, \'validate-password\':true}">\n                        </div>\n                    </div>\n                    <!-- ko foreach: getRegion(\'additional-login-form-fields\') -->\n                    <!-- ko template: getTemplate() --><!-- /ko -->\n                    <!-- /ko -->\n                    </div>\n                    <div class="actions-toolbar">\n                        <input name="context" type="hidden" value="checkout" />\n                        <div class="primary">\n                            <button type="submit" class="action action-login secondary" name="send" id="send2">\n                                <span data-bind="i18n: \'Sign In\'"></span>\n                            </button>\n                        </div>\n                        <div class="secondary">\n                            <a class="action" data-bind="attr: {href: forgotPasswordUrl}">\n                                <span data-bind="i18n: \'Forgot Your Password?\'"></span>\n                            </a>\n                        </div>\n\n                        <div class="sociallogin-or">\n                            <span data-bind="i18: \'OR\'"></span>\n                        </div>\n                        <div data-bind="html: socialloginButtons"></div>\n\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n';});


define("bundles/home-category-product-cart", function(){});

//# sourceMappingURL=home-category-product-cart.js.map