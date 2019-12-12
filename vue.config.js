const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const aliasesConfig = require('./aliases.config');

module.exports = {
  css: {
    modules: true,
    extract: false,
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/styles/gui.scss";
          @import "@/assets/styles/mixins.scss";
          @import "@/assets/styles/directional.scss";
        `,
      },
    },
  },

  configureWebpack: {
    entry: [
      'core-js/modules/es.promise',
      'core-js/modules/es.string.includes',
      'core-js/modules/es.array.iterator',
      'core-js/modules/es.object.assign.js',
      path.resolve(__dirname, 'src/main.js'),
    ],
    resolve: {
      alias: aliasesConfig.webpack,
    },
    plugins:
      process.env.CHECK_SIZE === 'true'
        ? [new BundleAnalyzerPlugin()]
        : [],
  },

  transpileDependencies: ['vue-sticky-directive'],

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },

  devServer: {
    port: 4040,
    disableHostCheck: true,
  },
};
