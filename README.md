# PaySuper Payment Form

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/paysuper/paysuper-payment-form/issues)

[![Build Status](https://api.travis-ci.org/paysuper/paysuper-payment-form.svg?branch=master)](https://travis-ci.org/paysuper/paysuper-payment-form) [![codecov](https://codecov.io/gh/paysuper/paysuper-payment-form/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-payment-form)

PaySuper Javascript SDK is designed to integrate a [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) on your website or a game client.

Learn more about a [payments flow](https://docs.pay.super.com/docs/payments/quick-start) and [PaySuper Checkout integration](https://docs.pay.super.com/docs/payments/sdk-integration).

|   | PaySuper Service Architecture
:---: | :---
✨ | **Checkout integration.** [PaySuper JS SDK](https://github.com/paysuper/paysuper-js-sdk) is designed to integrate a Checkout Form on a merchant's website or a game client.
💵 | **Frontend for a payment form.** [PaySuper Checkout Form](https://github.com/paysuper/paysuper-payment-form) is a frontend for a sigle-page application with a payment form.
📊 | **Frontend for a merchant.** [PaySuper Dashboard](https://github.com/paysuper/paysuper-dashboard) is the BFF server and frontend to interact with all PaySuper related features for merchants.
🔧 | **API Backend.** [PaySuper Management API](https://github.com/paysuper/paysuper-management-api) is a REST API backend for the [PaySuper Dashboard](https://github.com/paysuper/paysuper-management-server) and the [PaySuper Checkout Form](https://github.com/paysuper/paysuper-payment-form). Public API methods are documented in the [API Reference](https://docs.pay.super.com/api).
💳 | **Payment processing.** [Billing Server](https://github.com/paysuper/paysuper-billing-server) is a micro-service that provides with any payment processing business logic.

***

## Features

**Conversion-optimized:** The payment form loads instantly with a single-page layout.

**Payment methods:** VISA, Master Card, AMEX, JCB, China UnionPay, Bitcoin payments, Alipay, QIWI, Bank Wire Transfers.

**Payment types:** Simple Checkout, Items Checkout.

**Authentication:** Dynamic 3D Secure (ready for Strong Customer Authentication).

**Localization:** Localized for [24 languages](https://docs.pay.super.com/docs/payments/localization).

## Table of Contents

- [Demo](#demo)
- [Developing](#developing)
    - [Branches](#branches)
    - [Versioning](#versioning)
    - [Building](#building)
    - [Production](#production)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

## Demo

Try out [the payment sample](https://dashboard.pay.super.com/form-demo) for a [Simple Checkout](https://docs.pay.super.com/docs/payments/#simple-checkout) and a [Products Checkout](https://docs.pay.super.com/docs/payments/#products-checkout).

## Developing

The package requires [Paysuper Dashboard](https://github.com/paysuper/paysuper-management-api) backend to be served first:

```bash
yarn serve:be
```

The form runs on `http://localhost:4040/` where you will be redirected to 
`http://localhost:8080/order` page. It's provided by [Paysuper Dashboard](https://github.com/paysuper/paysuper-management-api) backend.

#### Modal view

Add `modal=true` as a query parameter into the request URL to run the form in a modal view mode:

```http
http://localhost:8080/order?modal=true
```

#### Dev data preset

Add `devPreset=1` as a query parameter into the request URL to use a default development data preset (project + products combination): 

```http
http://localhost:8080/order?devPreset=1
```

### Branches

We use the [GitFlow](https://nvie.com/posts/a-successful-git-branching-model) as a branching model for Git.

## Versioning

`https://cdn.pay.super.com/paysdk/v0.11.0/paysuper.js` is a release version (for example `v0.11.0`) and it updates by releases [paysuper-js-sdk/releases](https://github.com/paysuper/paysuper-js-sdk/releases).

`https://cdn.pay.super.com/paysdk/latest/paysuper.js` is the latest version.

### Building

#### Compiles and hot-reloads for development

```bash
yarn serve
```

#### Compiles and minifies into single js-file

```bash
yarn build
```

####Like `run build` but with dist file size analysis

```bash
yarn check-size
```

### Production

Define a mounting place by attribute `"id = paysuper-payment-form"` and attach the form script library:

```html
<div id="paysuper-payment-form"></div>
<script src="https://cdn.pay.super.com/payform/latest/paysuper-form.js"></script>
```

## Testing

### Run tests

```
yarn test
```

### Run tests for development in a watch mode

```
yarn test:dev
```

### Screenshot testing hint
https://static.protocol.one/paysuper/form/dev/tests/base-button-spec-js-base-button-vue-should-render-content-1-diff.png

Inside `.travis.yml`
```
#- set -e
```

vs

```
- rclone copy tests/unit/__image_snapshots__/__diff_output__/ :s3://paysuper/form/dev/tests --s3-access-key-id=$S3_ACCESS_KEY --s3-secret-access-key=$S3_SECRET_KEY --s3-endpoint=$S3_HOST
```

## Contributing

If you like this project then you can put a ⭐️ on it.

We welcome contributions to PaySuper of any kind including documentation, suggestions, bug reports, pull requests etc. We would love to hear from you. In general, we follow the "fork-and-pull" Git workflow. Learn more about [PaySuper Form Contribution Guide](CONTRIBUTING.md).

We feel that a welcoming community is important and we ask that you follow the PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

## License

The project is available as open source under the terms of the [GPL v3 License](https://www.gnu.org/licenses/gpl-3.0).