# ProtocolONE PayOne Payment Form

## Usage
In development

### In production
Define mounting place with id `payone-form` and initial data before attaching the form script
```html
<div id="payone-form"></div>
<script>
window.PAYMENT_FORM_DATA = {
  id: '5c20e1',
  has_vat: true,
  has_user_commission: true,
  project: { ... },
  payment_methods: [ ... ]
}
</script>
<script src="p1payone-form.js"></script>
```

### In development
You can use the package in pair with `payone-js-sdk`.
With `npm run serve` the form will be accessable in `payone-js-sdk` in development mode.

## Development

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies into single js-file
```
npm run build
```

### Like `run build` but with dist file size analysis
```
npm run check-size
```

### Run tests
```
npm run test
```

### Run tests for development in watch mode 
```
npm run test:dev
```
