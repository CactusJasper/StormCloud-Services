let fs = require('fs');
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const csso = require('@node-minify/csso');

let jsFiles = [
    'js/navbar.js',
    'js/utils.js',
    'js/leaderboard.js',
    'js/home.js',
    'js/default.js',
    'js/polls/poll_list.js',
    'js/polls/view_poll.js',
    'js/application/application_create.js',
    'js/application/application_view.js',
    'js/admin/dashboard.js',
    'js/admin/polls/create_poll.js',
    'js/admin/polls/manage_polls.js',
    'js/admin/polls/approve_polls.js',
    'js/admin/roles/manage_mod_roles.js',
    'js/admin/roles/manage_rewards.js',
    'js/admin/manage/manage_users.js',
    'js/admin/manage/manage_user.js',
    'js/admin/manage/manage_events.js',
    'js/admin/manage/manage_event.js',
    'js/planner/create_event.js',
    'js/planner/planner.js',
    'js/planner/past_events.js',
    'js/planner/view_event.js'
];

let cssFiles = [
    'css/grid.css',
    'css/main.css',
    'css/modal.css',
    'css/navbar.css',
    'css/poll_view.css',
    'css/utils.css',
    'css/themes/dark.css',
    'css/themes/light.css',
];

let toCopy = [
    'js/libs/jquery-3.5.1.min.js',
    'js/libs/socket.io.min.js',
    'js/libs/socket.io.min.js.map'
];

let distDirs = [
    'js/admin/polls',
    'js/admin/roles',
    'js/admin/manage',
    'js/application',
    'js/polls',
    'js/libs',
    'js/planner',
    'css/themes',
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