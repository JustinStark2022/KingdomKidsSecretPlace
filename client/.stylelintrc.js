module.exports = {
    extends: [
      "stylelint-config-standard",
      "stylelint-config-tailwindcss"
    ],
    plugins: ["stylelint-order"],
    rules: {
      "at-rule-no-unknown": [
        true,
        {
          ignoreAtRules: [
            "tailwind",
            "apply",
            "layer",
            "variants",
            "responsive",
            "screen"
          ]
        }
      ]
    },
    ignoreFiles: ["**/*.ts", "**/*.tsx", "**/*.js"]
  };