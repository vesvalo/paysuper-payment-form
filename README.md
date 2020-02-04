# PaySuper Payment Form

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/paysuper/paysuper-js-sdk/issues)
[![Build Status](https://travis-ci.org/paysuper/paysuper-payment-form.svg?branch=develop)](https://travis-ci.com/paysuper/paysuper-payment-form)
[![codecov](https://codecov.io/gh/paysuper/paysuper-payment-form/branch/develop/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-payment-form)

##### Do not use this module directly, use [paysuper-js-sdk](https://github.com/paysuper/paysuper-js-sdk) instead. 

<p align="center">
<a href="https://pay.super.com/" target="_blank"><img align="center" width="640" height="510" src="https://docs.pay.super.com/images/chreckout-form.gif"></a>
</p>

PaySuper payment form is a PaySuper-hosted mobile browsers-friendly widget that lets you collect payments with just a few lines of code. Learn more about a [payments flow](https://docs.pay.super.com/docs/payments/quick-start) and [PaySuper Checkout integration](https://docs.pay.super.com/docs/payments/sdk-integration).

|   | PaySuper Service Architecture
:---: | :---
✨ | **Checkout integration.** [PaySuper JS SDK](https://github.com/paysuper/paysuper-js-sdk) is designed to integrate a Checkout Form on a merchant's website or a game client.
💵 | **Frontend for a payment form.** [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) is a frontend for a single-page application with a payment form.
📊 | **Frontend for a merchant.** [PaySuper Dashboard](https://github.com/paysuper/paysuper-dashboard) is the BFF server and frontend to interact with all PaySuper related features for merchants.
🔧 | **Payment Form API Backend.** [PaySuper Checkout](https://github.com/paysuper/paysuper-checkout) is a REST API backend for [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) and a billing processing such as purchase receipts and others. Public API methods are documented in the [API Reference](https://docs.pay.super.com/api).
🔧 | **Billing API Backend.** [PaySuper Management API](https://github.com/paysuper/paysuper-management-api) is a REST API backend for [PaySuper Dashboard](https://github.com/paysuper/paysuper-dashboard) and other management API methods. Public API methods are documented in the [API Reference](https://docs.pay.super.com/api).
💳 | **Payment processing.** [PaySuper Billing Server](https://github.com/paysuper/paysuper-billing-server) is a micro-service that provides with any payment processing business logic.

***

## Features

* **Conversion-optimized:** The payment form loads instantly with a single-page layout.
* **Payment methods:** VISA, Master Card, AMEX, JCB, China UnionPay, Bitcoin payments, Alipay, QIWI, Bank Wire Transfers.
* **Payment types:** Simple Checkout, Items Checkout.
* **Authentication:** Dynamic 3D Secure (ready for Strong Customer Authentication).
* **Localization:** Localized for [24 languages](https://docs.pay.super.com/docs/payments/localization).

## Table of Contents

- [Demo](#demo)
- [Usage](#usage)
- [Developing](#developing)
    - [Branches](#branches)
    - [Versioning](#versioning)
    - [Building](#building)
    - [Production](#production)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

## Demo

Try out [the payment sample](https://checkout.pay.super.com/demo/shop) for a [Simple Checkout](https://docs.pay.super.com/docs/payments/#simple-checkout) and a [Products Checkout](https://docs.pay.super.com/docs/payments/#products-checkout).

## Usage

Do not use this module directly, use [paysuper-js-sdk](https://github.com/paysuper/paysuper-js-sdk) instead. PaySuper JS SDK is designed to integrate a [PaySuper Payment Form](https://github.com/paysuper/paysuper-payment-form) on your website or a game client.

## Developing

The package requires [Paysuper Dashboard](https://github.com/paysuper/paysuper-management-api) backend to be served first:

```bash
yarn serve:be
```

The form runs on `http://localhost:4040/` where you will be redirected to 
`http://localhost:8080/order` page. It's provided by [Paysuper Dashboard](https://github.com/paysuper/paysuper-management-api) backend.

#### Modal view

Add `modal=true` as a query parameter in the request URL to run the form in a modal view mode:

```http
http://localhost:8080/order?modal=true
```

#### Dev data preset

Add `devPreset=1` as a query parameter in the request URL to use a default development data preset (project + products combination): 

```http
http://localhost:8080/order?devPreset=1
```

### Branches

We use the [GitFlow](https://nvie.com/posts/a-successful-git-branching-model) as a branching model for Git.

## Versioning

#### Dev version
`https://cdn.pay.super.com/payform/dev/paysuper-form.js` updates automatically by the `develop` branch updates.

#### Production release
`https://cdn.pay.super.com/payform/latest/paysuper-form.js` is a release version. 

`https://cdn.pay.super.com/payform/v0.23.2/paysuper-form.js` updates with an actual version release by a tag starts with `v*` that is pushed into the repository.

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

Define a mounting place by id attribute `"id = paysuper-payment-form"` and attach the form script library:

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

## Contributing, Feature Requests and Support
If you like this project then you can put a ⭐️ on it. It means a lot to us.

If you have an idea of how to improve PaySuper (or any of the product parts) or have general feedback, you're welcome to submit a [feature request](../../issues/new?assignees=&labels=&template=feature_request.md&title=).

Chances are, you like what we have already but you may require a custom integration, a special license or something else big and specific to your needs. We're generally open to such conversations.

If you have a question and can't find the answer yourself, you can [raise an issue](../../issues/new?assignees=&labels=&template=support-request.md&title=I+have+a+question+about+%3Cthis+and+that%3E+%5BSupport%5D) and describe what exactly you're trying to do. We'll do our best to reply in a meaningful time.

We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to [our contribution guide to learn more](CONTRIBUTING.md).

## License

The project is available as open source under the terms of the [GPL v3 License](https://www.gnu.org/licenses/gpl-3.0).
