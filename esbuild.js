const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');
const isDev = process.env.NODE_ENV === 'development';

const buildOptions = {
    entryPoints: ['app/index.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    platform: 'browser',
    target: 'es2020',
    loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.js': 'jsx',
        '.css': 'css'
    },
    sourcemap: isDev,
    minify: !isDev,
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
};

if (isWatch) {
    esbuild.context(buildOptions).then(ctx => {
        ctx.watch();
        console.log('Watching for changes...');
    }).catch(() => process.exit(1));
} else {
    esbuild.build(buildOptions).catch(() => process.exit(1));
}

