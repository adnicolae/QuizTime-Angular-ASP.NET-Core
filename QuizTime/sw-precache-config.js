﻿module.exports = {
    staticFileGlobs: [
        '/',
        'Views/**.cshtml',
        'Views/Home/**.cshtml',
        'Views/Shared/**.cshtml',
        'wwwroot/**.js',
        'wwwroot/**.css',
        'wwwroot/**.jpg',
        'wwwroot/**.html',
        'wwwroot/**.png',
        'wwwroot/dist/**.js',
        'wwwroot/dist/**.css',
        'wwwroot/dist/**.png',
        'wwwroot/dist/dist/**.eot',
        'wwwroot/dist/dist/**.woff2',
        'wwwroot/dist/dist/**.svg',
        'wwwroot/dist/dist/**.ttf',
        'wwwroot/dist/dist/**.woff',
        'wwwroot/sounds/**.wav',
        'wwwroot/sounds/**.mp3',
    ],
    root: 'wwwroot/dist',
    stripPrefix: 'wwwroot/dist/',
    navigateFallback: 'Views/Home/Index',
    runtimeCaching: [{ urlPattern: /pointspot\.azurewebsites\.net/, handler: 'networkFirst' }]
};