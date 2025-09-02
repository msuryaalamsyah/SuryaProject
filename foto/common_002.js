define(['jquery', 'algoliaBundle', 'underscore', 'suggestionsHtml', 'productsHtml'], function ($, algoliaBundle, _, suggestionsHtml, productsHtml) {
    console.log('Debug: custom algolia common');
    window.algolia = {
        deprecatedHooks: [
            'beforeAutocompleteProductSourceOptions',
            'beforeAutocompleteSources'
        ],
        allowedHooks: [
            'beforeAutocompleteSources', // Older implementations incompatible with v1 API
            'afterAutocompleteSources',
            'afterAutocompletePlugins',
            'beforeAutocompleteOptions',
            'afterAutocompleteOptions',
            'afterAutocompleteStart',
            'beforeAutocompleteProductSourceOptions',
            'afterAutocompleteProductSourceOptions',
            'beforeInstantsearchInit',
            'beforeWidgetInitialization',
            'beforeInstantsearchStart',
            'afterInstantsearchStart',
            'afterInsightsBindEvents'
        ],
        registeredHooks: [],
        registerHook: function (hookName, callback) {
            if (this.allowedHooks.indexOf(hookName) === -1) {
                throw 'Hook "' + hookName + '" cannot be defined. Please use one of ' + this.allowedHooks.join(', ');
            }

            if (this.deprecatedHooks.indexOf(hookName) > -1) {
                console.warn(`Algolia Autocomplete: ${hookName} has been deprecated and may not be supported in a future release.`);
            }

            if (!this.registeredHooks[hookName]) {
                this.registeredHooks[hookName] = [callback];
            } else {
                this.registeredHooks[hookName].push(callback);
            }
        },
        getRegisteredHooks: function (hookName) {
            if (this.allowedHooks.indexOf(hookName) === -1) {
                throw 'Hook "' + hookName + '" cannot be defined. Please use one of ' + this.allowedHooks.join(', ');
            }

            if (!this.registeredHooks[hookName]) {
                return [];
            }

            return this.registeredHooks[hookName];
        },
        triggerHooks: function () {
            var hookName = arguments[0],
                originalData = arguments[1],
                hookArguments = Array.prototype.slice.call(arguments, 2);

            // console.log("Invoking hook", hookName);

            var data = this.getRegisteredHooks(hookName).reduce(function (currentData, hook) {
                if (Array.isArray(currentData)) {
                    currentData = [currentData];
                }
                var allParameters = [].concat(currentData).concat(hookArguments);
                return hook.apply(null, allParameters);
            }, originalData);

            return data;
        }
    };

    window.isMobile = function () {
        var check = false;

        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);

        return check;
    };

    window.getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }

        return "";
    };

    window.transformHit = function (hit, price_key, helper) {
        if (Array.isArray(hit.categories))
            hit.categories = hit.categories.join(', ');

        if (hit._highlightResult.categories_without_path && Array.isArray(hit.categories_without_path)) {
            hit.categories_without_path = $.map(hit._highlightResult.categories_without_path, function (category) {
                return category.value;
            });

            hit.categories_without_path = hit.categories_without_path.join(', ');
        }

        var matchedColors = [];

        if (helper && algoliaConfig.useAdaptiveImage === true) {
            if (hit.images_data && helper.state.facetsRefinements.color) {
                matchedColors = helper.state.facetsRefinements.color.slice(0); // slice to clone
            }

            if (hit.images_data && helper.state.disjunctiveFacetsRefinements.color) {
                matchedColors = helper.state.disjunctiveFacetsRefinements.color.slice(0); // slice to clone
            }
        }

        if (Array.isArray(hit.color)) {
            var colors = [];

            $.each(hit._highlightResult.color, function (i, color) {
                if (color.matchLevel === undefined || color.matchLevel === 'none') {
                    return;
                }

                colors.push(color);

                if (algoliaConfig.useAdaptiveImage === true) {
                    var matchedColor = color.matchedWords.join(' ');
                    if (hit.images_data && color.fullyHighlighted && color.fullyHighlighted === true) {
                        matchedColors.push(matchedColor);
                    }
                }
            });

            hit._highlightResult.color = colors;
        } else {
            if (hit._highlightResult.color && hit._highlightResult.color.matchLevel === 'none') {
                hit._highlightResult.color = {value: ''};
            }
        }

        if (algoliaConfig.useAdaptiveImage === true) {
            $.each(matchedColors, function (i, color) {
                color = color.toLowerCase();

                if (hit.images_data[color]) {
                    hit.image_url = hit.images_data[color];
                    hit.thumbnail_url = hit.images_data[color];

                    return false;
                }
            });
        }

        if (hit._highlightResult.color && hit._highlightResult.color.value && hit.categories_without_path) {
            if (hit.categories_without_path.indexOf('<em>') === -1 && hit._highlightResult.color.value.indexOf('<em>') !== -1) {
                hit.categories_without_path = '';
            }
        }

        if (Array.isArray(hit._highlightResult.name))
            hit._highlightResult.name = hit._highlightResult.name[0];

        if (Array.isArray(hit.price)) {
            hit.price = hit.price[0];
            if (hit['price'] !== undefined && price_key !== '.' + algoliaConfig.currencyCode + '.default' && hit['price'][algoliaConfig.currencyCode][price_key.substr(1) + '_formated'] !== hit['price'][algoliaConfig.currencyCode]['default_formated']) {
                hit['price'][algoliaConfig.currencyCode][price_key.substr(1) + '_original_formated'] = hit['price'][algoliaConfig.currencyCode]['default_formated'];
            }

            if (hit['price'][algoliaConfig.currencyCode]['default_original_formated']
                && hit['price'][algoliaConfig.currencyCode]['special_to_date']) {
                var priceExpiration = hit['price'][algoliaConfig.currencyCode]['special_to_date'];

                if (algoliaConfig.now > priceExpiration + 1) {
                    hit['price'][algoliaConfig.currencyCode]['default_formated'] = hit['price'][algoliaConfig.currencyCode]['default_original_formated'];
                    hit['price'][algoliaConfig.currencyCode]['default_original_formated'] = false;
                }
            }
        }

        /* Added code to bind default bundle options for add to cart */
        if (hit.default_bundle_options) {
            var default_bundle_option = [];
            for (const property in hit.default_bundle_options) {
                const optionsData = {
                    optionId: property,
                    selectionId : hit.default_bundle_options[property]
                }
                default_bundle_option.push(optionsData);
            }
            hit._highlightResult.default_bundle_options = default_bundle_option;
        }

        // Add to cart parameters
        var action = algoliaConfig.instant.addToCartParams.action + 'product/' + hit.objectID + '/';

        var correctFKey = getCookie('form_key');

        if (correctFKey != "" && algoliaConfig.instant.addToCartParams.formKey != correctFKey) {
            algoliaConfig.instant.addToCartParams.formKey = correctFKey;
        }

        hit.addToCart = {
            'action': action,
            'uenc': AlgoliaBase64.mageEncode(action),
            'formKey': algoliaConfig.instant.addToCartParams.formKey
        };

        if (hit.__queryID) {

            hit.urlForInsights = hit.url;

            if (algoliaConfig.ccAnalytics.enabled
                && algoliaConfig.ccAnalytics.conversionAnalyticsMode !== 'disabled') {
                var insightsDataUrlString = $.param({
                    queryID: hit.__queryID,
                    objectID: hit.objectID,
                    indexName: hit.__indexName
                });
                if (hit.url.indexOf('?') > -1) {
                    hit.urlForInsights += insightsDataUrlString
                } else {
                    hit.urlForInsights += '?' + insightsDataUrlString;
                }
            }
        }

        return hit;
    };

    window.fixAutocompleteCssHeight = function () {
        if ($(document).width() > 768) {
            $(".other-sections").css('min-height', '0');
            $(".aa-dataset-products").css('min-height', '0');
            var height = Math.max($(".other-sections").outerHeight(), $(".aa-dataset-products").outerHeight());
            $(".aa-dataset-products").css('min-height', height);
        }
    };

    window.fixAutocompleteCssSticky = function (menu) {
        var dropdown_menu = $('#algolia-autocomplete-container .aa-dropdown-menu');
        var autocomplete_container = $('#algolia-autocomplete-container');
        autocomplete_container.removeClass('reverse');

        /** Reset computation **/
        dropdown_menu.css('top', '0px');

        /** Stick menu vertically to the input **/
        var targetOffset = Math.round(menu.offset().top + menu.outerHeight());
        var currentOffset = Math.round(autocomplete_container.offset().top);

        dropdown_menu.css('top', (targetOffset - currentOffset) + 'px');

        if (menu.offset().left + menu.outerWidth() / 2 > $(document).width() / 2) {
            /** Stick menu horizontally align on right to the input **/
            dropdown_menu.css('right', '0px');
            dropdown_menu.css('left', 'auto');

            var targetOffset = Math.round(menu.offset().left + menu.outerWidth());
            var currentOffset = Math.round(autocomplete_container.offset().left + autocomplete_container.outerWidth());

            dropdown_menu.css('right', (currentOffset - targetOffset) + 'px');
        } else {
            /** Stick menu horizontally align on left to the input **/
            dropdown_menu.css('left', 'auto');
            dropdown_menu.css('right', '0px');
            autocomplete_container.addClass('reverse');

            var targetOffset = Math.round(menu.offset().left);
            var currentOffset = Math.round(autocomplete_container.offset().left);

            dropdown_menu.css('left', (targetOffset - currentOffset) + 'px');
        }
    };

    window.createISWidgetContainer = function (attributeName) {
        var div = document.createElement('div');
        div.className = 'is-widget-container-' + attributeName.split('.').join('_');
        div.dataset.attr = attributeName;

        return div;
    };

    // The url is now rendered as follows : http://website.com?q=searchquery&facet1=value&facet2=value1~value2
    // "?" and "&" are used to be fetched easily inside Magento for the backend rendering
    // Multivalued facets use "~" as separator
    // Targeted index is defined by sortBy parameter
    window.routing = {
        router: algoliaBundle.instantsearch.routers.history({
            parseURL: function (qsObject) {
                var location = qsObject.location,
                    qsModule = qsObject.qsModule;
                const queryString = location.hash ? location.hash : location.search;
                return qsModule.parse(queryString.slice(1))
            },
            createURL: function (qsObject) {
                var qsModule = qsObject.qsModule,
                    routeState = qsObject.routeState,
                    location = qsObject.location;
                const protocol = location.protocol,
                    hostname = location.hostname,
                    port = location.port ? location.port : '',
                    pathname = location.pathname,
                    hash = location.hash;

                const queryString = qsModule.stringify(routeState);
                const portWithPrefix = port === '' ? '' : ':' + port;
                // IE <= 11 has no location.origin or buggy. Therefore we don't rely on it
                if (!routeState || Object.keys(routeState).length === 0) {
                    return protocol + '//' + hostname + portWithPrefix + pathname;
                } else {
                    if (queryString && queryString != 'q=__empty__') {
                        return protocol + '//' + hostname + portWithPrefix + pathname + '?' + queryString;
                    } else {
                        return protocol + '//' + hostname + portWithPrefix + pathname;
                    }
                }
            },
        }),
        stateMapping: {
            stateToRoute: function (uiState) {
                var productIndexName = algoliaConfig.indexName + '_products';
                var uiStateProductIndex = uiState[productIndexName] || {};
                var routeParameters = {};
                if (algoliaConfig.isCategoryPage) {
                    routeParameters['q'] = uiState[productIndexName].query;
                } else if (algoliaConfig.isLandingPage) {
                    routeParameters['q'] = uiState[productIndexName].query || algoliaConfig.landingPage.query || '__empty__';
                } else {
                    routeParameters['q'] = uiState[productIndexName].query || algoliaConfig.request.query || '__empty__';
                }
                if (algoliaConfig.facets) {
                    for (var i = 0; i < algoliaConfig.facets.length; i++) {
                        var currentFacet = algoliaConfig.facets[i];
                        // Handle refinement facets
                        if (currentFacet.attribute != 'categories' && (currentFacet.type == 'conjunctive' || currentFacet.type == 'disjunctive')) {
                            routeParameters[currentFacet.attribute] = (uiStateProductIndex.refinementList &&
                                uiStateProductIndex.refinementList[currentFacet.attribute] &&
                                uiStateProductIndex.refinementList[currentFacet.attribute].join('~'));
                        }
                        // Handle categories
                        if (currentFacet.attribute == 'categories' && !algoliaConfig.isCategoryPage) {
                            routeParameters[currentFacet.attribute] = (uiStateProductIndex.hierarchicalMenu &&
                                uiStateProductIndex.hierarchicalMenu[currentFacet.attribute + '.level0'] &&
                                uiStateProductIndex.hierarchicalMenu[currentFacet.attribute + '.level0'].join('~'));
                        }
                        // Handle sliders
                        if (currentFacet.type == 'slider' || currentFacet.type == 'priceRanges') {
                            routeParameters[currentFacet.attribute] = (uiStateProductIndex.range &&
                                uiStateProductIndex.range[currentFacet.attribute] &&
                                uiStateProductIndex.range[currentFacet.attribute]);
                        }
                    }

                }
                routeParameters['sortBy'] = uiStateProductIndex.sortBy;
                routeParameters['page'] = uiStateProductIndex.page;
                return routeParameters;
            },
            routeToState: function (routeParameters) {
                var productIndexName = algoliaConfig.indexName + '_products';
                var uiStateProductIndex = {}

                uiStateProductIndex['query'] = routeParameters.q == '__empty__' ? '' : routeParameters.q;
                if (algoliaConfig.isLandingPage && typeof uiStateProductIndex['query'] === 'undefined' && algoliaConfig.landingPage.query != '') {
                    uiStateProductIndex['query'] = algoliaConfig.landingPage.query;
                }

                var landingPageConfig = algoliaConfig.isLandingPage && algoliaConfig.landingPage.configuration ?
                    JSON.parse(algoliaConfig.landingPage.configuration) :
                    {};

                uiStateProductIndex['refinementList'] = {};
                uiStateProductIndex['hierarchicalMenu'] = {};
                uiStateProductIndex['range'] = {};
                if (algoliaConfig.facets) {
                    for (var i = 0; i < algoliaConfig.facets.length; i++) {
                        var currentFacet = algoliaConfig.facets[i];
                        // Handle refinement facets
                        if (currentFacet.attribute != 'categories' && (currentFacet.type == 'conjunctive' || currentFacet.type == 'disjunctive')) {
                            uiStateProductIndex['refinementList'][currentFacet.attribute] = routeParameters[currentFacet.attribute] && routeParameters[currentFacet.attribute].split('~');
                            if (algoliaConfig.isLandingPage &&
                                typeof uiStateProductIndex['refinementList'][currentFacet.attribute] === 'undefined' &&
                                currentFacet.attribute in landingPageConfig) {
                                uiStateProductIndex['refinementList'][currentFacet.attribute] = landingPageConfig[currentFacet.attribute].split('~');
                            }
                        }
                        // Handle categories facet
                        if (currentFacet.attribute == 'categories' && !algoliaConfig.isCategoryPage) {
                            uiStateProductIndex['hierarchicalMenu']['categories.level0'] = routeParameters['categories'] && routeParameters['categories'].split('~');
                            if (algoliaConfig.isLandingPage &&
                                typeof uiStateProductIndex['hierarchicalMenu']['categories.level0'] === 'undefined' &&
                                'categories.level0' in landingPageConfig) {
                                uiStateProductIndex['hierarchicalMenu']['categories.level0'] = landingPageConfig['categories.level0'].split(' /// ');
                            }
                        }
                        if (currentFacet.attribute == 'categories' && algoliaConfig.isCategoryPage) {
                            uiStateProductIndex['hierarchicalMenu']['categories.level0'] = [algoliaConfig.request.path];
                        }
                        // Handle sliders
                        if (currentFacet.type == 'slider' || currentFacet.type == 'priceRanges') {
                            var currentFacetAttribute = currentFacet.attribute;
                            uiStateProductIndex['range'][currentFacetAttribute] = routeParameters[currentFacetAttribute] && routeParameters[currentFacetAttribute];//NOSONAR
                            if (algoliaConfig.isLandingPage &&
                                typeof uiStateProductIndex['range'][currentFacetAttribute] === 'undefined' &&
                                currentFacetAttribute in landingPageConfig) {

                                var facetValue = '';
                                if (typeof landingPageConfig[currentFacetAttribute]['>='] !== "undefined") {
                                    facetValue = landingPageConfig[currentFacetAttribute]['>='][0];
                                }
                                facetValue += ':';
                                if (typeof landingPageConfig[currentFacetAttribute]['<='] !== "undefined") {
                                    facetValue += landingPageConfig[currentFacetAttribute]['<='][0];
                                }
                                uiStateProductIndex['range'][currentFacetAttribute] = facetValue;
                            }
                        }
                    }

                }
                uiStateProductIndex['sortBy'] = routeParameters.sortBy;
                uiStateProductIndex['page'] = routeParameters.page;

                var uiState = {};
                uiState[productIndexName] = uiStateProductIndex;
                return uiState;
            }
        }
    };

    // Taken from Magento's tools.js - not included on frontend, only in backend
    window.AlgoliaBase64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        //'+/=', '-_,'
        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            if (typeof window.btoa === "function") {
                return window.btoa(input);
            }

            input = AlgoliaBase64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }

            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            if (typeof window.atob === "function") {
                return window.atob(input);
            }

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = AlgoliaBase64._utf8_decode(output);
            return output;
        },

        mageEncode: function (input) {
            return this.encode(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ',');
        },

        mageDecode: function (output) {
            output = output.replace(/\-/g, '+').replace(/_/g, '/').replace(/,/g, '=');
            return this.decode(output);
        },

        idEncode: function (input) {
            return this.encode(input).replace(/\+/g, ':').replace(/\//g, '_').replace(/=/g, '-');
        },

        idDecode: function (output) {
            output = output.replace(/\-/g, '=').replace(/_/g, '/').replace(/\:/g, '\+');
            return this.decode(output);
        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    };

    // started custom code for algolia facets issue

    algolia.registerHook(
        "beforeAutocompleteOptions",
        function(options) {
            return options;
        });

    /**
     * InstantSearch hook methods
     * IS.js v2 documentation: https://community.algolia.com/instantsearch.js/
     * IS.js v4 documentation: https://www.algolia.com/doc/api-reference/widgets/instantsearch/js/
     **/
    algolia.registerHook(
        "beforeInstantsearchInit",
        function(instantsearchOptions, algoliaBundle) {
            return instantsearchOptions;
        }
    );

    algolia.registerHook(
        "afterAutocompleteStart",
        function(instantsearchOptions, algoliaBundle) {


            return instantsearchOptions;
        }
    );

    algolia.registerHook(
        "beforeWidgetInitialization",
        function(allWidgetConfiguration, algoliaBundle) {
            // Modify instant search widgets
            function getLabelhtml(itemobjectID) {
                var labelHtml = {};
                var labelUrl = checkout.baseUrl + 'customalgolia/index/amastylabel';
                $.ajax({
                    url: labelUrl,
                    data: {
                        product_id_list: itemobjectID.toString()
                    },
                    method: 'get',
                    cache: false,
                    dataType: 'json',
                    showLoader: false
                }).done(function(data) {
                    $.each(data.result, function(key, value) {
                        $('#amastylabel_' + key).html('');
                        $('#amastylabel_' + key).append(value);
                        labelHtml[key] = value;
                    });
                    localStorage.setItem('amastyLabelData', JSON.stringify(labelHtml));
                });
            }

            function getWishlistProducts() {
                var productIds = [];
                var mageStorage = JSON.parse(localStorage.getItem('mage-cache-storage'));
                if (mageStorage != null && mageStorage.hasOwnProperty('wishlist')) {
                    var wishlistStorage = JSON.parse(localStorage.getItem('mage-cache-storage')).wishlist;
                    if (!_.isEmpty(wishlistStorage) && _.isArray(wishlistStorage.items) && wishlistStorage.items.length) {
                        _.each(wishlistStorage.items, function (item) {
                            productIds.push(parseInt(item.product_id));
                        });
                    }
                }

                return productIds;
            }

            var ing = 0;
            let searchParams = new URLSearchParams(window.location.search);
            let pageNumber = searchParams.get('page');
            let hitsPerPage = algoliaConfig.hitsPerPage;
            var totalProduct = 0;
            window.itemobjectID = [];
            $.each(allWidgetConfiguration, function(widgetType) {
                if (widgetType == 'hits' || widgetType == 'infiniteHits') {
                    window.itemobjectID = [];
                    const callbackTransform = allWidgetConfiguration[widgetType].transformItems;
                    allWidgetConfiguration[widgetType].transformItems = function(items) {
                        items = callbackTransform(items);
                        $.each(items, function(key, value) {
                            if($.inArray(value.objectID, window.itemobjectID) != -1) {
                                return;
                            }
                            window.itemobjectID.push(value.objectID);
                        });
                        totalProduct = $('#numberOfItems').text();
                        if (ing % 2 == 1 && pageNumber == null) {
                            getLabelhtml(window.itemobjectID);
							window.itemobjectID = [];
                        }
                        if((window.itemobjectID.length == hitsPerPage * pageNumber)
                            || (totalProduct == window.itemobjectID.length))
                        {
                            pageNumber = null;
                        }
                        ing += 1;
                        return items.map(function(item) {
                            item.productLabelhtml = 'amastylabel_' + item.objectID;
                            item.isWishlistEnabled = algoliaConfig.wishlist.isWishlistEnabled;
                            var wishlisted = "";
                            var wishlistProducts = getWishlistProducts();
                            if (wishlistProducts.includes(parseInt(item.objectID))) {
                                wishlisted = " wishlisted";
                            }
                            item.isWishlisted = wishlisted;
                            item.wishlist = {
                                'action': algoliaConfig.wishlist.wishlistParams.action,
                                'uenc': algoliaConfig.wishlist.wishlistParams.uenc,
                                'formKey': algoliaConfig.wishlist.wishlistParams.formKey
                            };
                            item.pdp_url = item.url;
                            item.pdp_url_with_queryid = item.urlForInsights;
                            var isSwatchEnalbeOnPLP = algoliaConfig.colorswatch.enableOnPlp;
                            item.isSwatchEnalbeOnPLP = isSwatchEnalbeOnPLP;
                            if (isSwatchEnalbeOnPLP && $.isArray(item.color) && item.color.length > 1) {
                                item.swatches = [];
                                $.each(item.color, function(colorKey, colorValue) {
                                    $.each(item.images_data, function(imageKey, imageValue) {
                                        if (colorValue.toLowerCase() == imageKey.toLowerCase()) {
                                            var is_default_color = '';
                                            var optionId = window.colorConfigData[colorValue].option_id;
                                            if (item.default_color == optionId) {
                                                is_default_color = "selected";
                                                item.image_url = imageValue;
                                                item.url = item.url + '?color=' + optionId;
                                                item.urlForInsights = item.urlForInsights + '&color=' + optionId;
                                            }
                                            item.swatches.push({
                                                "hex_Code": window.colorConfigData[colorValue].hex_Code,
                                                "swatchImages": imageValue,
                                                "option_id": optionId,
                                                "label": colorValue,
                                                "is_default_color": is_default_color
                                            });
                                        }
                                    });
                                });
                            }


                            /* show color count on PLP*/
                            if (isSwatchEnalbeOnPLP && $.isArray(item.color) && item.color.length > 1) {
                                item.color_text = '';
                                if (item.color) {
                                    var color_availabliy = ' colors available';
                                    item.color_text = item.color.length + color_availabliy;
                                }
                            }
                            return item;
                        })
                    }
                }
            });

            /* show color swatch on product hover only */
            $('body').on('mouseenter', '.product-item-info', function() {
                $(this).find('.color-info').hide();
                $(this).find('.swatch-container').show();
            });
            $('body').on('mouseleave', '.product-item-info', function() {
                $(this).find('.swatch-container').hide();
                $(this).find('.color-info').show();
            });

            /* On color swatch click change product image and url - 04-May-2023*/
            $('body').on('click touchend', '.swatch_clr', function() {
                $('.swatch-container').removeClass('selected');
                $(this).parent().addClass('selected');
                $(this).parent().children('.swatch_clr').removeClass('selected');
                $(this).addClass('selected');
                var currentProduct = $(this).data('product-id');
                var swatchOptionId = $(this).data('option-id');
                var swatchProductImage = $(this).data('swatch-image');
                $('.product-item-photo.'+currentProduct).data('main-src', swatchProductImage);
                $('.product-item-photo.'+currentProduct).prop('src', swatchProductImage);
                var productMainUrl = $('.prod-link.'+currentProduct).data('pdp-url');
                var queryID = "queryID";
                var productNewUrl  =  productMainUrl + '?color=' + swatchOptionId;
                if(productMainUrl.indexOf(queryID) != -1){
                    var productNewUrl  =  productMainUrl + '&color=' + swatchOptionId;
                }
                $('.result.' + currentProduct).prop('href', productNewUrl);
            });

            /* On color swatch hover change product image 04-May-2023*/
            $('body').on('mouseenter', '.swatch_clr', function() {
                var currentProduct = $(this).data('product-id');
                var swatchProductImage = $(this).data('swatch-image');
                $('.product-item-photo.'+currentProduct).prop('src', swatchProductImage);
            });

            /* On color swatch unhover change product as it was 04-May-2023*/
            $('body').on('mouseleave', '.swatch-container', function() {
                if (!$(this).hasClass('selected')) {
                    var currentProduct = $(this).children().data('product-id');
                    var mainProdImage = $('.product-item-photo.' + currentProduct).data('main-src');
                    $('.product-item-photo.' + currentProduct).prop('src', mainProdImage);
                }else{
                    var mainProdImage = $(this).children('.selected').data('swatch-image');
                    var currentProduct = $(this).children().data('product-id');
                    $('.product-item-photo.' + currentProduct).prop('src', mainProdImage);
                }
            });

            /** removed is_sale and clear all from applied filters */
            var attributes = [];
            $.each(algoliaConfig.facets, function (i, facet) {
                var name = facet.attribute;

                if (name === 'categories') {
                    name = 'categories.level0';
                }

                if (name === 'price') {
                    name = facet.attribute + algoliaConfig.priceKey
                }

                attributes.push({
                    name: name,
                    label: facet.label ? facet.label : facet.attribute
                });
            });
            allWidgetConfiguration.currentRefinements.includedAttributes = attributes.map(function (attribute) {
                if (!(algoliaConfig.isCategoryPage && attribute.name.indexOf('categories') > -1) && (attribute.name != 'is_sale')) {
                    return attribute.name;
                }
            });
            allWidgetConfiguration.clearRefinements.includedAttributes = attributes.map(function (attribute) {
                if (!(algoliaConfig.isCategoryPage && attribute.name.indexOf('categories') > -1) && (attribute.name != 'is_sale')) {
                    return attribute.name;
                }
            });

            /** add currentRefinement for Mobile */
            const currRefinement = allWidgetConfiguration.currentRefinements;
            delete allWidgetConfiguration.currentRefinements;

            allWidgetConfiguration['currentRefinements'] = allWidgetConfiguration['currentRefinements']?allWidgetConfiguration['currentRefinements']:[];
            allWidgetConfiguration.currentRefinements.push(
                currRefinement
            )
            allWidgetConfiguration.currentRefinements.push(
                {
                    container: '#current-refinements-mb',
                    includedAttributes: currRefinement.includedAttributes,
                    templates: currRefinement.templates,
                    transformItems: currRefinement.transformItems,
                }
            )

            /** add clearRefinement for Mobile */
            const clrRefinement = allWidgetConfiguration.clearRefinements;
            delete allWidgetConfiguration.clearRefinements;

            allWidgetConfiguration['clearRefinements'] = allWidgetConfiguration['clearRefinements']?allWidgetConfiguration['clearRefinements']:[];
            allWidgetConfiguration.clearRefinements.push(
                clrRefinement
            )
            allWidgetConfiguration.clearRefinements.push(
                {
                    container: '#clear-refinements-mb',
                    cssClasses: clrRefinement.cssClasses,
                    includedAttributes: clrRefinement.includedAttributes,
                    templates: clrRefinement.templates,
                    transformItems: clrRefinement.transformItems,
                }
            )

            /** Infinite Scroll with history changes */
            //allWidgetConfiguration.infiniteHits.templates.showMoreText = window.algoliaConfig.wishlist.wishlistParams.loadMoreProduct;
            //const sessionStorageCache = algoliaBundle.instantsearch.createInfiniteHitsSessionStorageCache();
            //allWidgetConfiguration.infiniteHits.cache = sessionStorageCache;

                // Modify color refinement widget
            const colorRefinementIndex = allWidgetConfiguration.refinementList.findIndex(item => item.attribute === 'color');
            if (colorRefinementIndex !== -1) {
                allWidgetConfiguration.refinementList[colorRefinementIndex].transformItems = (items) => {
                    return items.map(item => ({
                        ...item,
                        hex_Code:  typeof window.colorConfigData[item.label]  !== "undefined"
                            ? window.colorConfigData[item.label].hex_Code : '',
                        image_path: typeof window.colorConfigData[item.label]  !== "undefined"
                            ? window.colorConfigData[item.label].image_path : '',
                        option_id: typeof window.colorConfigData[item.label]  !== "undefined"
                            ? window.colorConfigData[item.label].option_id : ''
                    }));
                }
                allWidgetConfiguration.refinementList[colorRefinementIndex].templates.item = `
                    <input type="checkbox" class='hidden' id="{{label}}" {{#isRefined}}checked{{/isRefined}}/>
                    <label for="{{label}}" class="{{#isRefined}}isRefined{{/isRefined}}">{{label}}</label>
                    <div class="swatch-option color" tabindex="-1" option-type="1" option-id="{{option_id}}" option-label="{{label}}"
                    option-tooltip-thumb="" option-tooltip-value="{{label}}" style="{{#image_path}} background-image: url(\'{{image_path}}\'); {{/image_path}} {{#hex_Code}} background: {{hex_Code}}; {{/hex_Code}}" no-repeat center; background-size: initial;"></div>
                `
            }

            // Modify Shoe Style refinement widget
            const shoeStyleRefinementIndex = allWidgetConfiguration.refinementList.findIndex(item => item.attribute === 'shoe_style');
            if (shoeStyleRefinementIndex !== -1) {
                allWidgetConfiguration.refinementList[shoeStyleRefinementIndex].transformItems = (items) => {
                    return items.map(item => ({
                        ...item,
                        image_url: window.globalConfigData[item.label].unselect,
                        image_url_selected: window.globalConfigData[item.label].select,
                    }));
                }
                allWidgetConfiguration.refinementList[shoeStyleRefinementIndex].templates.item = `
                    <input type="checkbox" class='hidden' id="{{label}}" {{#isRefined}}checked{{/isRefined}}/>
                    <img class="shoe-style-img" alt="{{label}}" {{#isRefined}} src="{{ image_url_selected }}"{{/isRefined}} src="{{ image_url }}">
                    <span class="shoe-style-label">{{label}}</span>
                `
            }

            // to make filter widgets collapsible
            function setCollapsed(entry) {
                entry.panelOptions.collapsed = true;
                entry.showMore = window.algoliaConfig.wishlist.showMore.isEnabled;
                entry.limit = window.algoliaConfig.wishlist.showMore.minLimit;
                entry.showMoreLimit = window.algoliaConfig.wishlist.showMore.maxLimit;
            }
            allWidgetConfiguration.refinementList.forEach(setCollapsed);
            allWidgetConfiguration.rangeSlider.forEach(setCollapsed);

            function configureRangeSlider(slider) {
                slider.pips = true;
            }
            allWidgetConfiguration.rangeSlider.forEach(configureRangeSlider);

            window.allWidgetConfiguration = allWidgetConfiguration;
            console.log('debug: custom code beforeWidgetInitialization hook registered');
            return allWidgetConfiguration;
        }
    );

    algolia.registerHook(
        "beforeInstantsearchStart",
        function(search, algoliaBundle) {
            // Modify instant search instance before search started
            window.algoliaSearch = search;

            return search;
        }
    );

    algolia.registerHook('afterAutocompleteOptions', function(options)  {
        options.openOnFocus = true,
        options.debug = true,
        options.placeholder = algoliaConfig.autoCompleteText.placeHolder;
        return options;
    });

    algolia.registerHook(
        "afterAutocompleteSources",
        function (sources, searchClient) {
            var products_source = sources.find(source => source.sourceId === 'products');
            products_source.transformResponse = ({ hits }) => {
                var interval = setInterval(function () {
                    if ($('.aa-Panel .aa-PanelLayout').length) {
                        if(!$('.aa-Source.custom-section').length) {
                            if ($(window).width() > 767) {
                            $('.aa-Panel.productColumn2 .aa-PanelLayout').prepend('<div class="aa-Source custom-section"></div>');
                            }
                            if ($(window).width() < 767) {
                                $('.aa-Panel.productColumn2').append('<div class="aa-Source custom-section visible-xs">' +
                                window.mobile_search_content +'</div>');
                            }

                            var inputField = $('.aa-Input');
                            var productDiv = $('.aa-Panel [data-autocomplete-source-id="products"]');
                            var autocomplteDiv = $('[data-autocomplete-source-id="querySuggestionsPlugin"]');

                            // Show the div again when there's input
                            inputField.on('input', function () {
                                if (inputField.val().length > 0) {
                                    autocomplteDiv.addClass('queries');
                                    $('.aa-Panel').addClass('onlySearch');
                                } else {
                                    autocomplteDiv.removeClass('queries');
                                    $('.aa-Panel').removeClass('onlySearch');
                                }
                            });
                        }
                        clearInterval(interval);
                    }
                }, 150);
                /*$('input.aa-Input').val() ? '' : hits = [];*/
                return hits;
            };

            const transformAutocompleteHit = function (hit, price_key, helper) {
                if (Array.isArray(hit.categories))
                    hit.categories = hit.categories.join(', ');

                if (hit._highlightResult.categories_without_path && Array.isArray(hit.categories_without_path)) {
                    hit.categories_without_path = $.map(hit._highlightResult.categories_without_path, function (category) {
                        return category.value;
                    });

                    hit.categories_without_path = hit.categories_without_path.join(', ');
                }

                let matchedColors = [];

                // TODO: Adapt this migrated code from common.js - helper not utilized
                if (helper && algoliaConfig.useAdaptiveImage === true) {
                    if (hit.images_data && helper.state.facetsRefinements.color) {
                        matchedColors = helper.state.facetsRefinements.color.slice(0); // slice to clone
                    }

                    if (hit.images_data && helper.state.disjunctiveFacetsRefinements.color) {
                        matchedColors = helper.state.disjunctiveFacetsRefinements.color.slice(0); // slice to clone
                    }
                }

                if (Array.isArray(hit.color)) {
                    let colors = [];

                    $.each(hit._highlightResult.color, function (i, color) {
                        if (color.matchLevel === undefined || color.matchLevel === 'none') {
                            return;
                        }

                        colors.push(color.value);

                        if (algoliaConfig.useAdaptiveImage === true) {
                            const matchedColor = color.matchedWords.join(' ');
                            if (hit.images_data && color.fullyHighlighted && color.fullyHighlighted === true) {
                                matchedColors.push(matchedColor);
                            }
                        }
                    });

                    colors = colors.join(', ');
                    hit._highlightResult.color = {value: colors};
                } else {
                    if (hit._highlightResult.color && hit._highlightResult.color.matchLevel === 'none') {
                        hit._highlightResult.color = {value: ''};
                    }
                }

                if (algoliaConfig.useAdaptiveImage === true) {
                    $.each(matchedColors, function (i, color) {
                        color = color.toLowerCase();

                        if (hit.images_data[color]) {
                            hit.image_url = hit.images_data[color];
                            hit.thumbnail_url = hit.images_data[color];

                            return false;
                        }
                    });
                }

                if (hit._highlightResult.color && hit._highlightResult.color.value && hit.categories_without_path) {
                    if (hit.categories_without_path.indexOf('<em>') === -1 && hit._highlightResult.color.value.indexOf('<em>') !== -1) {
                        hit.categories_without_path = '';
                    }
                }

                if (Array.isArray(hit._highlightResult.name))
                    hit._highlightResult.name = hit._highlightResult.name[0];

                if (Array.isArray(hit.price)) {
                    hit.price = hit.price[0];
                    if (hit['price'] !== undefined && price_key !== '.' + algoliaConfig.currencyCode + '.default' && hit['price'][algoliaConfig.currencyCode][price_key.substr(1) + '_formated'] !== hit['price'][algoliaConfig.currencyCode]['default_formated']) {
                        hit['price'][algoliaConfig.currencyCode][price_key.substr(1) + '_original_formated'] = hit['price'][algoliaConfig.currencyCode]['default_formated'];
                    }

                    if (hit['price'][algoliaConfig.currencyCode]['default_original_formated']
                        && hit['price'][algoliaConfig.currencyCode]['special_to_date']) {
                        const priceExpiration = hit['price'][algoliaConfig.currencyCode]['special_to_date'];

                        if (algoliaConfig.now > priceExpiration + 1) {
                            hit['price'][algoliaConfig.currencyCode]['default_formated'] = hit['price'][algoliaConfig.currencyCode]['default_original_formated'];
                            hit['price'][algoliaConfig.currencyCode]['default_original_formated'] = false;
                        }
                    }
                }

                // Add to cart parameters
                const action = algoliaConfig.instant.addToCartParams.action + 'product/' + hit.objectID + '/';

                const correctFKey = getCookie('form_key');

                if (correctFKey != "" && algoliaConfig.instant.addToCartParams.formKey != correctFKey) {
                    algoliaConfig.instant.addToCartParams.formKey = correctFKey;
                }

                hit.addToCart = {
                    'action':  action,
                    'uenc':    AlgoliaBase64.mageEncode(action),
                    'formKey': algoliaConfig.instant.addToCartParams.formKey
                };

                if (hit.__autocomplete_queryID) {

                    hit.urlForInsights = hit.url;

                    if (algoliaConfig.ccAnalytics.enabled
                        && algoliaConfig.ccAnalytics.conversionAnalyticsMode !== 'disabled') {
                        const insightsDataUrlString = $.param({
                            queryID:   hit.__autocomplete_queryID,
                            objectID:  hit.objectID,
                            indexName: hit.__autocomplete_indexName
                        });
                        if (hit.url.indexOf('?') > -1) {
                            hit.urlForInsights += insightsDataUrlString
                        } else {
                            hit.urlForInsights += '?' + insightsDataUrlString;
                        }
                    }
                }

                return hit;
            };

            let suggestionSection = false;
            if (algoliaConfig.autocomplete.nbOfQueriesSuggestions > 0) {
                suggestionSection = true;
            }
            products_source.templates = {
                noResults({html}) {
                    var noResultsTitle =  $('input.aa-Input').val().length < 1 ?
                        '' : algoliaConfig.autoCompleteText.noResult;
                    return noResultsTitle;
                },
                header({items, html}) {
                    var suggestionTitle =  $('input.aa-Input').val().length < 1 ?
                        '' : algoliaConfig.autoCompleteText.topSuggestionTitle;
                    return suggestionTitle;
                },
                item({item, components, html}) {
                    if (suggestionSection) {
                        $('.aa-Panel').addClass('productColumn2');
                        $('.aa-Panel').removeClass('productColumn1');
                    } else {
                        $('.aa-Panel').removeClass('productColumn2');
                        $('.aa-Panel').addClass('productColumn1');
                    }
                    if ($('input.aa-Input').val().length < 1) {
                        return;
                    }
                    const _data = transformAutocompleteHit(item, algoliaConfig.priceKey);
                    return productsHtml.getItemHtml({item: _data, components, html});
                },
                footer({items, html}) {
                    $('[data-autocomplete-source-id="products"] .aa-SourceFooter').html('');
                    if (items.length) {
                        const queryString = $('input.aa-Input').val();
                        if (queryString.length < 1) {
                            $('[data-autocomplete-source-id="products"] .aa-SourceFooter').html('');
                        } else {
                            var viewAllUrl = algoliaConfig.resultPageUrl + '?q=' + queryString;
                            var viewAllTitle = algoliaConfig.autoCompleteText.viewAllTitle;
                            var footerHtml = '<a href="'+ viewAllUrl +'">'+ viewAllTitle +'</a>'
                            $('[data-autocomplete-source-id="products"] .aa-SourceFooter').html(footerHtml);
                        }
                    }
                    return;
                }
            };
            return sources;
        });

    algolia.registerHook('afterAutocompletePlugins', (plugins, searchClient) => {
        const createQuerySuggestionsPlugin = algoliaBundle.createQuerySuggestionsPlugin.createQuerySuggestionsPlugin({
            searchClient,
            indexName: `${algoliaConfig.indexName}_suggestions`,
            transformSource({source}) {
                return {
                    ...source,
                    templates: {
                        ...source.templates,
                        noResults({html}) {
                            return ''; /*suggestionsHtml.getNoResultHtml({html});*/
                        },
                        header({html, items}) {
                            var suggestionTitle =  $('input.aa-Input').val().length < 1 ?
                                algoliaConfig.autoCompleteText.topSearchTitle : '';
                            return suggestionTitle;
                        },
                        item({item, components, html}) {
                            return suggestionsHtml.getItemHtml({item, components, html})
                        },
                        footer({html, items}) {
                            return suggestionsHtml.getFooterHtml({html, items})
                        },
                    }
                }
            }
        });

        plugins.push(createQuerySuggestionsPlugin);

        return plugins;
    });


    algolia.registerHook(
        "afterInstantsearchStart",
        function(search, algoliaBundle) {
            $('body').on('click', '.menu-filter-mobile1', function() {
                if ($(window).width() < 768) {
                    $('body').addClass('filter-active-transition');
                    $('.algolia-sidebar').toggleClass('toggle-active');
                    $(this).toggleClass('toggle-open');
                }
                if ($(window).width() > 768) {
                    $('.algolia-sidebar').toggleClass('toggle-active');
                    $('.custom-algolia-main').toggleClass('toggle--open');
                    $(this).toggleClass('toggle-open');
                    $('.hide-filters').toggleClass('hide');
                }
            });
            $('body').on('click', '.al-fil-close, .al-apply-filter', function() {
                if ($(window).width() < 768) {
                    $('body').removeClass('filter-active-transition');
                    $('.algolia-sidebar').toggleClass('toggle-active');
                }
            });
            $('body').on('click', '.custom-clear-btn', function() {
                $("#clear-refinements-mb .ais-ClearRefinements-button").trigger('click');
            });

            /* Ajax wishlist button */
            $(document).on('click', '.towishlist', function (event) {
                if (typeof JSON.parse(localStorage.getItem('mage-cache-storage')).customer !== 'undefined') {
                    var customerData = JSON.parse(localStorage.getItem('mage-cache-storage')).customer;
                    if (!_.isEmpty(customerData) && !_.isEmpty(customerData.email) && !_.isEmpty(customerData.fullname) && (!_.isEmpty(customerData.firstname) || !_.isEmpty(customerData.lastname))) {
                        var button = event.target;
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        var remove = false;
                        var wishListData = $(button).data('post');
                        wishListData.data.form_key = $("input[name=form_key]").val();
                        window.currentProduct = $(button).closest('.result-sub-content').find('.result-title').text().trim();
                        var whishlistId = $(button).attr('id');

                        if ($('.wl-' + whishlistId).hasClass('wishlisted')) {
                            wishListData.action = window.location.origin + '/wishlist/index/remove/';
                            var wishlistItemId = null;
                            if (typeof JSON.parse(localStorage.getItem('mage-cache-storage')).wishlist !== 'undefined') {
                                var wishlistCollection = JSON.parse(localStorage.getItem('mage-cache-storage')).wishlist;
                                if (!_.isEmpty(wishlistCollection) && _.isArray(wishlistCollection.items) && wishlistCollection.items.length) {
                                    _.each(wishlistCollection.items, function (item) {
                                        if (item.product_id == wishListData.data.product) {
                                            wishlistItemId = item.wishlist_item_id
                                        }
                                    });
                                }
                            }

                            wishListData.data.item = wishlistItemId;
                            remove = true;
                        } else {
                            wishListData.action = window.location.origin + '/wishlist/index/add/';
                        }

                        var $body = $('body');
                        $body.trigger('processStart');

                        $.post(wishListData.action, wishListData.data, function () {
                            $(button)
                                .trigger('processStop')
                                .addClass('added-to-wishlist');
                            $(window).trigger('clear.wishlist', {});
                            if (remove) {
                                $(button).removeClass('wishlisted');
                            } else {
                                $(button).addClass('wishlisted');
                            }

                            $body.trigger('processStop');
                            var storage = $.initNamespaceStorage('mage-cache-storage').localStorage;
                            storage.remove('messages');
                            var wishlistText = window.currentProduct;
                            var wishlistHtmlMsg = '';
                            if (remove) {
                                wishlistHtmlMsg = '<div class="message-success success message show"> ' + wishlistText + ' ' + window.algoliaConfig.wishlist.wishlistParams.removeMessage +  '</div>';
                            } else {
                                wishlistHtmlMsg = '<div class="message-success success message show"> ' + wishlistText + ' ' + window.algoliaConfig.wishlist.wishlistParams.successMessage +  '</div>';
                            }
                            $('.link.wishlist a').removeClass('empty');
                            $('.page.messages').html(wishlistHtmlMsg);
                            window.currentProduct = undefined;
                            var messages = $.cookieStorage.get('mage-messages');
                            if (!_.isEmpty(messages)) {
                                customerData.set('messages', {});
                                $.cookieStorage.set('mage-messages', '');
                            }

                            // var sections = ['messages', 'wishlist'];
                            // customerData.invalidate(sections);
                            // customerData.reload(sections, true);
                        });
                    }
                }


                });

            if ($('body').hasClass('catalog-category-view') || $('body').hasClass('catalogsearch-result-index') || $('body').hasClass('algolia-landingpage-view')) {

                /* if Previous products are not loading by default then load them using this snippet */
                var prevClick = setInterval( function () {
                    if ($('.ais-InfiniteHits-loadPrevious').length) {
                        $('.ais-InfiniteHits-loadPrevious').click();
                    }

                    if ($('.ais-InfiniteHits-loadPrevious--disabled').length) {
                        clearInterval(prevClick);
                    }
                }, 1000);

                let processing;
                $(window).on('scroll', function() {
                    if (processing){
                        return false;
                    }
                    var docViewTop = $(this).scrollTop();
                    var docViewBottom = $(window).height();
                    var elemTop = 0;
                    var elemBottom = 0;
                    if ($('.ais-InfiniteHits-loadMore').length) {
                        elemTop = $('.ais-InfiniteHits-loadMore').offset().top;
                        elemBottom = $('.ais-InfiniteHits-loadMore').outerHeight();
                    }

                    if (docViewTop > ((elemTop + elemBottom) - docViewBottom)) {
                        processing = true;
                        $('#load-more-product-spinner').insertAfter('.ais-InfiniteHits-loadMore');
                        $('.ais-InfiniteHits-loadMore').click();
                        if(!$('.ais-InfiniteHits-loadMore').hasClass('ais-InfiniteHits-loadMore--disabled')){
                            $('#load-more-product-spinner').show();
                            setTimeout(function(e) {
                                $('#load-more-product-spinner').hide();
                            }, 1000);
                        }
                        setTimeout(function(e) {
                            processing = false;
                        }, 1000);

                    }
                });
            }

            function getFilterCount() {
                var ais_filters_count = $('#current-refinements-mb .ais-CurrentRefinements-list .ais-CurrentRefinements-category').length;
                $('#filter-count').html('('+ais_filters_count+')');
                $('#item-count-number').html($('#numberOfItems').html());
            }

            search.on('render', () => {

                /*on page load if filter selected then color selection should selected*/
                let onLoadSelection = setInterval(function () {
                    if ($('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').length) {
                        $('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').each(function() {
                            if ($(this).prev('label').hasClass('isRefined')) {
                                var opt_id = $(this).attr('option-id');
                                $('.ais-InfiniteHits-item #color-swatches span[data-option-id=' + opt_id + ']')
                                    .trigger('click').addClass('selected');

                                /* on page load last selected color should be selected on color swatch product tiles*/
                                var currentUrl = localStorage.getItem('currentUrl');
                                if (window.location.href == currentUrl) {
                                    var opt_id = localStorage.getItem('lastOpt');
                                    $('.ais-InfiniteHits-item #color-swatches span[data-option-id=' + opt_id + ']')
                                        .trigger('click').addClass('selected');
                                }
                            }
                        });
                        clearInterval(onLoadSelection);
                    }
                }, 100);

                /* On removing color (click on 'x') it should show selected filter color only*/
                $('.ais-CurrentRefinements-delete').click(function (){
                    let removecolorInterval = setInterval(function () {
                        if ($('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').length) {
                            $('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').each(function () {
                                if ($(this).prev('label').hasClass('isRefined')) {
                                    var opt_id = $(this).attr('option-id');
                                    $('.ais-InfiniteHits-item #color-swatches span[data-option-id=' + opt_id + ']')
                                        .trigger('click').addClass('selected');
                                }
                            });
                            clearInterval(removecolorInterval);
                        }
                    }, 500);
                });

                /* on filter selection show loader*/
                $('.ais-RefinementList-item').click(function (){
                    var $body = $('body');
                    $body.trigger('processStart');
                    setTimeout(function(e) {
                        $body.trigger('processStop');
                    }, 1000);
                });
                $('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').click(function (){
                    var opt_id = $(this).attr('option-id');
                    if (!$(this).prev('label').hasClass('isRefined')) {
                        let colorInterval = setInterval(function () {
                            if ($('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').length) {
                                if ($('.is-widget-container-color .ais-RefinementList-item .swatch-option.color')
                                    .prev('label').hasClass('isRefined')) {
                                    $('.ais-InfiniteHits-item #color-swatches span[data-option-id=' + opt_id + ']')
                                        .trigger('click').addClass('selected');
                                    localStorage.setItem("lastOpt", opt_id);
                                    setTimeout(function () {
                                        localStorage.setItem("currentUrl", window.location.href);
                                    }, 2000);
                                }
                                clearInterval(colorInterval);
                            }
                        }, 1000);
                    } else {
                        let colorInterval = setInterval(function () {
                            if ($('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').length) {
                                $('.is-widget-container-color .ais-RefinementList-item .swatch-option.color').each(function() {
                                    if ($(this).prev('label').hasClass('isRefined')) {
                                        var opt_id = $(this).attr('option-id');
                                        $('.ais-InfiniteHits-item #color-swatches span[data-option-id=' + opt_id + ']')
                                            .trigger('click').addClass('selected');
                                        localStorage.setItem("lastOpt", opt_id);
                                        setTimeout(function () {
                                            localStorage.setItem("currentUrl", window.location.href);
                                        }, 2000);
                                    }
                                });
                                clearInterval(colorInterval);
                            }
                        }, 500);
                    }
                });

                if($(window).width() < 767) {
                    getFilterCount();
                }
                /* for Amasty label fix */
                setTimeout(function(e) {
                    if (localStorage.getItem('amastyLabelData')) {
                        $.each(JSON.parse(localStorage.getItem('amastyLabelData')), function(key, value) {
                            if (!$('#amastylabel_' + key).find('.amasty-label-container').attr('data-mage-init-label-done')) {
                                $('#amastylabel_' + key).html('');
                                $('#amastylabel_' + key).append(value);
                                $('#amastylabel_' + key).find('.amasty-label-container').attr('data-mage-init-label-done', 'true');
                            }
                        });
                    }

                    $('al-amasty').trigger('contentUpdated');
                    jQuery.mage.init();
                }, 2000);

                let labelInterval = setInterval(function () {
                    if ($('.al-amasty').find('.amasty-label-container').attr('data-mage-init')) {
                        $.mage.init();
                        $('.al-amasty').find('.amasty-label-container').attr('data-mage-init-label-done', 'true');
                        clearInterval(labelInterval);
                    }
                }, 100);
            });
            console.log('debug: custom code afterInstantsearchStart hook registered');
            return search;
        }
    );

    // Custom code ends

    $(function ($) {
        if (typeof algoliaConfig === 'undefined') {
            return;
        }
        $(algoliaConfig.autocomplete.selector).each(function () {
            $(this).closest('form').on('submit', function (e) {
                let query = $(this).find(algoliaConfig.autocomplete.selector).val();

                query = encodeURIComponent(query);

                if (algoliaConfig.instant.enabled && query === '')
                    query = '__empty__';

                window.location = $(this).attr('action') + '?q=' + query;

                return false;
            });
        });

        function handleInputCrossAutocomplete(input) {
            if (input.val().length > 0) {
                input.closest('#algolia-searchbox').find('.clear-query-autocomplete').show();
                input.closest('#algolia-searchbox').find('.magnifying-glass').hide();
            } else {
                input.closest('#algolia-searchbox').find('.clear-query-autocomplete').hide();
                input.closest('#algolia-searchbox').find('.magnifying-glass').show();
            }
        }

        $(document).on('click', '.clear-query-autocomplete', function () {
            var input = $(this).closest('#algolia-searchbox').find('input');

            input.val('');
            input.get(0).dispatchEvent(new Event('input'));

            handleInputCrossAutocomplete(input);
        });

        /** Handle small screen **/
        $('body').on('click', '#refine-toggle', function () {
            $('#instant-search-facets-container').toggleClass('hidden-sm').toggleClass('hidden-xs');
            if ($(this).html().trim()[0] === '+')
                $(this).html('- ' + algoliaConfig.translations.refine);
            else
                $(this).html('+ ' + algoliaConfig.translations.refine);
        });


    });



});
