// SAMPLE PRODUCT MIXIN
define(function () {
  "use strict";

  const mixin = {
    // getHeaderHtml: function () {
    //   return "";
    // },

    getItemHtml: function ({ item, components, html }) {
      return html`<a
        class="algoliasearch-autocomplete-hit"
        href="${item.__autocomplete_queryID != null
          ? item.urlForInsights
          : item.url}"
      >
        <div class="thumb">
          <img src="${item.thumbnail_url || ""}" alt="${item.name || ""}" />
        </div>
        <div class="info">
          ${components.Highlight({ hit: item, attribute: "name" })}

          <div class="algoliasearch-autocomplete-category">
            ${this.getColorHtml(item, components, html)}
            ${this.getCategoriesHtml(item, components, html)}
          </div>

          ${this.getPricingHtml(item, html)}
        </div>
      </a>`;
    },
  };

  return function (target) {
    return { ...target, ...mixin };
  };
});
