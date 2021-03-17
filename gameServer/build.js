let fs = require('fs');
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const csso = require('@node-minify/csso');

let jsFiles = [
    'js/navbar.js',
    'js/games/2048.js',
    'js/libs/utils.js'
];

let cssFiles = [
    'css/main.css',
    'css/grid.css',
    'css/utils.css',
    'css/navbar.css',
    'css/themes/dark.css',
    'css/themes/light.css',
    'css/games/2048.css'
];

let toCopy = [
    'js/libs/jquery-3.5.1.min.js',
    'js/libs/socket.io.min.js',
    'js/libs/socket.io.min.js.map',
    'images/thumbnails/2048.png'
];

let distDirs = [
    'js/games',
    'js/libs',
    'images/thumbnails',
    'css/themes',
    'css/games'
];

for(let i = 0; i < distDirs.length; i++)
{
    if(!fs.existsSync(`./public/dist/${distDirs[i]}`))
    {
        fs.mkdirSync(`./public/dist/${distDirs[i]}`, {
            recursive: true
        });

        if(i == 0) console.log('\n=============== Creating Dist Dirs ===============\n');
        console.log(`Successfully created /public/dist/${distDirs[i]}`);
    }
}

for(let i = 0; i < jsFiles.length; i++)
{
    minify({
        compressor: uglifyES,
        input: `./public/${jsFiles[i]}`,
        output: `./public/dist/${jsFiles[i]}`,
        options: {
          warnings: true, // pass true to display compressor warnings.
          mangle: true, // pass false to skip mangling names.
          output: {}, // pass an object if you wish to specify additional output options. The defaults are optimized for best compression.
          compress: true // pass false to skip compressing entirely. Pass an object to specify custom compressor options.
        },
        callback: (err, min) => {
            if(i == 0) console.log('\n=============== JS Minifying ===============\n');
            console.log(`Successfully minified /public/${jsFiles[i]} and outputted to /public/dist/${jsFiles[i]}`);
        }
    }).catch(err => console.error(err));
}

for(let i = 0; i < cssFiles.length; i++)
{
    minify({
        compressor: csso,
        input: `./public/${cssFiles[i]}`,
        output: `./public/dist/${cssFiles[i]}`,
        callback: (err, min) => {
            if(i == 0) console.log('\n=============== CSS Minifying ===============\n');
            console.log(`Successfully minified /public/${cssFiles[i]} and outputted to /public/dist/${cssFiles[i]}`);
        }
    }).catch(err => console.error(err));
}

for(let i = 0; i < toCopy.length; i++)
{
    fs.copyFile(`./public/${toCopy[i]}`, `./public/dist/${toCopy[i]}`, () => {
        if(i == 0) console.log('\n=============== File Copying ===============\n');
        console.log(`Successfully coppyed /public/${toCopy[i]} and outputted to /public/dist/${toCopy[i]}`);
    });
}