# PaySuper Payment Form

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://api.travis-ci.org/paysuper/paysuper-payment-form.svg?branch=master)](https://travis-ci.org/paysuper/paysuper-payment-form)
[![codecov](https://codecov.io/gh/paysuper/paysuper-payment-form/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-payment-form)

https://github.com/

## Usage

### Development
The package requires `paysuper-dashboard` backend to be served first (`yarn serve:be` to run).
The form itself runs on `http://localhost:4040/` where you will be redirected to 
`http://localhost:8080/order` page. It's provided by `paysuper-dashboard` backend

#### Modal view
Add `modal=true` into request url to run the form in modal view mode:
`http://localhost:8080/order?modal=true`

#### Dev data preset
Add `devPreset=1` into request url to use default development data preset 
(project + products combination): `http://localhost:8080/order?devPreset=1`

### Production
Define mounting place with id `paysuper-payment-form` and attach the form script library
```html
<div id="paysuper-payment-form"></div>
<script src="https://cdn.pay.super.com/payform/latest/paysuper-form.js"></script>
```

### Library URLs
#### Dev version
https://cdn.pay.super.com/payform/dev/paysuper-form.js
Updates automatically when `develop` branch updates

#### Production release
https://cdn.pay.super.com/payform/latest/paysuper-form.js
https://cdn.pay.super.com/payform/v0.22.0/paysuper-form.js
Updates with actual version release (`v*` tag pushed into repo)

## Development

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies into single js-file
```
yarn build
```

### Like `run build` but with dist file size analysis
```
yarn check-size
```

### Run tests
```
yarn test
```

### Run tests for development in watch mode 
```
yarn test:dev
```


## Contributing
We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

The master branch of this repository contains the latest stable release of this component.

 

### Screenshot testing hint
https://static.protocol.one/paysuper/form/dev/tests/base-button-spec-js-base-button-vue-should-render-content-1-diff.png

Inside `.travis.yml`
`#- set -e` 
vs
`- rclone copy tests/unit/__image_snapshots__/__diff_output__/ :s3://paysuper/form/dev/tests --s3-access-key-id=$S3_ACCESS_KEY --s3-secret-access-key=$S3_SECRET_KEY --s3-endpoint=$S3_HOST`
