require('babel-register');
const config = require('../../config');

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
    src_folders: ['test/e2e/specs'],
    output_folder: 'test/e2e/reports',
    custom_assertions_path: ['test/e2e/custom-assertions'],

    selenium: {
        start_process: true,
        server_path: require('selenium-server').path,
        host: '192.168.188.95',
        port: 4444,
        cli_args: {
            'webdriver.chrome.driver': require('chromedriver').path,
        },
    },

    test_settings: {
        default: {
            selenium_port: 4444,
            selenium_host: '192.168.188.95',
            silent: true,
            globals: {
                devServerURL: `http://192.168.188.95:${process.env.PORT || config.dev.port}`,
            },
        },

        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
            },
        },

        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true,
            },
        },
    },
};