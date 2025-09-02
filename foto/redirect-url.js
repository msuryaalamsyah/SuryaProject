/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */


define(["jquery","jquery-ui-modules/widget"],function(t){"use strict";return t.widget("mage.redirectUrl",{options:{event:"click",url:void 0},_bind:function(){var t={};t[this.options.event]="_onEvent",this._on(t)},_create:function(){this._bind()},_onEvent:function(){this.options.url?location.href=this.options.url:location.href=this.element.val()}}),t.mage.redirectUrl});
//# sourceMappingURL=redirect-url.js.map