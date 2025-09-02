// Copyright © PayMongo
//
// @package    PayMongo_Payments
// @version    1.0.0

// Global Namespace
var paymongo = {
  api: null,
  isInitialized: false,
  createPaymentMethod: function (details) {
    return paymongo.api.post("/payment_methods", details);
  },
  processErrors: function (data) {
    const self = this;
    const errors = [];
    data.errors.forEach(function (error) {
      errors.push(self.parseError(error));
    });

    return errors;
  },
  parseError: function (error) {
    var message = 'Something went wrong. Please contact the merchant or website administrator.'

    if (typeof error === 'object' && Object.keys(error).length > 0) {
        var code = error.code;
        var detail = error.detail;

        switch (code) {
            case 'parameter_format_invalid':
            case 'parameter_invalid': {
              message = this.parseDetail(detail);
              break;
            }
        }
    }

    return { message };
  },
  parseDetail: function (detail) {
    const detailKeyMap = {
      'details.card_number': 'Credit card number',
      'details.exp_year': 'Expiry year'
    }

    return Object.keys(detailKeyMap).reduce(function (message, key) {
      if (!detail.includes(key)) return message;

      return detail.replace(key, detailKeyMap[key])
    }, 'There were invalid data in your submission');
  }
};

var initPayMongo = function (apiKey, axios) {
  paymongo.api = axios.create({
    baseURL: "https://api.paymongo.com/v1/",
    headers: {
      Authorization: "Basic " + btoa(apiKey),
    },
  });
  paymongo.isInitialized = true;
};
