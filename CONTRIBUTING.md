# Contributing

## Development
These are some of the points to keep in mind when contributing.

1. The form supports two views: *page view* and *modal view*.
*The page view* is adaptive and can be used with devices of any size. It switches to a mobile view on screens with resolution lower than 640px by 510px. *The page view* does not support the means to close the form, while the *modal view* does support a form close feature.  However, *the modal view* has a fixed dimension of 640px by 510px. Yet if it opens on a page with a lower resolution, the form automatically switches to the *page view* but has to remain the means to close the form in the UI.
2. The form has to be adaptive, meaning the horizontal scroll bar cannot appear
3. All internal scrollable elements use the custom component `UiScrollboxBar` that is based on  `vue-perfect-scrollbar`
4. The majority of the simple form components, such as selects, buttons, popups, editboxes are already implemented and have `UI` prefix. All new reusable UI components (preloaders, switches etc) shall have the same prefix
5. All icons have `Icon` prefix
6. Clicks and swipes are (in most cases) implemented using `vue2-touch-events` library. All new clicks and swipea-based events have also be implemented using `vue2-touch-events` library.
7. The touch lag is processed by `fastclick` library. You may want to keep it in mind.
8. We use `vue-clickaway` to detect clicks outside of the element  
9. Yout should remember that the form is multilingual (with 2 RTL-languages). Meaning that UI-related code contributions should be tested to accommodate the supported languages, which also includes testing for proper tabs, spaces, arrow directions, element positions, etc. We have relevant SCSS-mixin plugged in. They can be used at any place in the form.
10. As in any cross-browser solution, any small style or markdown fixes can lead to bugs in iOS, IE11 or mobile browsers (often mobile Safari). These are some of the things to keep in mind:
* Does your code transpile well? For JavaScript, any non-supported API (such as JavaScript Array includes()) may result in a non-functional form on some devices/browsers.
* Was your CSS code supplied with styles that actually work with the supported browsers? Sometimes code can be transpiled in non-optimal ways, reply on missing or non-working features. Meaning you have to supply the styles for certain browsers on your own.
* Flex-box requires special attention on iOS, because of custom implementation. Your code sometimes does not transpile well for iOS or IE11 and may have bugs.
* Don't forget about the performance of your UI and the logic.  
* The minimal width of the form is 320px.


## Testing

The product offers the cross-browser compatibility, so it has to be tested according to the requirements below. The UI can be tested via BrowserStack.

Crossbrowser compatibility requirements:
1. IE11+
2. Chrome, Firefox, Safari (latest versions)
3. Mobile browsers Chrome, Firefox, Safari
4. Screens from 320px to 1920px

Often old devices have old browser versions installed and certain bugs may show up. It often makes sense to also test on real devices.

#### The list of devices/browsers that the form shall be tested against after any UI-related changes
* iOS 13: iPhone XS, iPhone 11, iPad (latest Chrome, Safari)
* iOS 12: iPhone XS, iPhone 11, iPhone 7, iPad (latest Chrome, Safari)
* iOS 11: iPhone X, iPhone 8, iPhone 6, iPad (latest Chrome, Safari)
* Android 6-9: the latest Chrome and Firefox for each Android version
* Windows 8-10: the latest IE11, Chrome, Firefox, Opera, Safari, Edge 
* Mac OS X family: the latest Chrome, Firefox, Opera, Safari
