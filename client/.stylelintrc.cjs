// stylelintrc.cjs
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss",
    "stylelint-config-prettier"
  ],
  plugins: [],
  rules: {
    "at-rule-no-unknown": [true, {
      ignoreAtRules: [
        "tailwind",
        "apply",
        "variants",
        "responsive",
        "screen",
        "layer"
      ]
    }],
    "lightness-notation": null,
    "custom-property-empty-line-before": null,
    "at-rule-no-deprecated": null,
    "at-rule-prelude-no-invalid": null,
    "declaration-property-value-keyword-no-deprecated": null,
    "declaration-empty-line-before": null,
    "at-rule-descriptor-no-unknown": null,
    "at-rule-descriptor-value-no-unknown": null
  }
};
