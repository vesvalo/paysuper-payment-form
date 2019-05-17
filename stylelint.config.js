module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard',
  ],
  rules: {
    'no-descending-specificity': null,
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'include',
        'mixin',
        'if',
      ],
    }],
  },
};
