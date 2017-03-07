const path = require('path');

module.exports = {
    entry: './compiled/client/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'client.bundle.js',
    },
};