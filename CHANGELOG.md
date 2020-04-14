# Changelog
All notable changes to this project will be documented in this file.

## [2.1.0] - 2020-02-04

### Added
- The instructions link opens in a new window.

### Fixed
- Filling the bank card expiration date using the Google Pay method.
- Displaying the long order price.
- Some CSS styles.

***

## [2.0.0] - 2019-12-23

### Added
- Updated the `vat_payer` parameter of the settings for the localization in a cart.

### Changed
- The application builds as a standalone SPA without the `paysuper-dashboard` dependency.
- Improved the detailed logging of errors in Sentry.

### Fixed
- Fixed the CVV field behavior in a browser Safari.
- Improved the layout for some resolutions.

***

## [1.0.0] - 2019-12-19

### Added
- Google Analytics for a payment form events.

### Changed
- The close page button added instead of the retry payment button for the previous failed payment.
- Updated README.

### Fixed
- Cross-browser CSS styles.
- Edited some localizations for the payment form.
- Corrected RU localization about a payment order. 
- The VAT rate data gets from the backend instead of calculation on the client-side.