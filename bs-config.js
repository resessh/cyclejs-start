const modRewrite = require('connect-modrewrite');

module.exports = {
    files: ['public'],
    server: {
        baseDir: ['public'],
        middleware: [modRewrite(['!^/(assets)  /index.html'])]
    },
    reloadDebounce: 500
};
