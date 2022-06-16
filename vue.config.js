const { argv } = require("yargs")
module.exports = {
   chainWebpack: config => {
      config.plugin("define").tap(options => {
          options[0]["process.env"].INTEGRATION_TEST_MODE = argv.test
          return options;
      })
   }
}
