import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteStaticCopy } from 'vite-plugin-static-copy';

import ejs from "ejs";
import fs from "fs-extra";

// 1. Compilează EJS → HTML

const head = ejs.render(fs.readFileSync("./src/templates/head.html", "utf8"));
const top = ejs.render(fs.readFileSync("./src/templates/topbar.html", "utf8"));
const banner = ejs.render(fs.readFileSync("./src/templates/banner.html", "utf8"));
const header = ejs.render(fs.readFileSync("./src/templates/header.html", "utf8"));
const sec1 = ejs.render(fs.readFileSync("./src/templates/sectiunea1.html", "utf8"));
const sec2 = ejs.render(fs.readFileSync("./src/templates/sectiunea2.html", "utf8"));
const sec3 = ejs.render(fs.readFileSync("./src/templates/sectiunea3.html", "utf8"));
const sec4 = ejs.render(fs.readFileSync("./src/templates/sectiunea4.html", "utf8"));
const sec5 = ejs.render(fs.readFileSync("./src/templates/sectiunea5.html", "utf8"));
const sec6 = ejs.render(fs.readFileSync("./src/templates/sectiunea6.html", "utf8"));
const sec7 = ejs.render(fs.readFileSync("./src/templates/sectiunea7.html", "utf8"));
const footer = ejs.render(fs.readFileSync("./src/templates/footer.html", "utf8"));

export default defineConfig({
    base: "./",
    plugins: [
        createHtmlPlugin({
            minify: false, // Minimizează HTML
            template: './src/index.html?row',
            inject: {
                data: {
                    head: head,
                    top: top,
                    banner: banner,
                    header: header,
                    sec1: sec1,
                    sec2: sec2,
                    sec3: sec3,
                    sec4: sec4,
                    sec5: sec5,
                    sec6: sec6,
                    sec7: sec7,
                    footer: footer,
                },
                tags: [
                    {
                        tag: 'script',
                        attrs: { type: 'module', src: '/assets/js/main.js' },
                        injectTo: 'body' // Injectează la sfârșitul <body>
                    }
                ],
            },
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'assets/', // Folderul sursă
                    dest: '' // Copiază direct în /dist/
                }
            ]
        })
    ],
    server: {
        mimeTypes: {
            'css': 'text/css',
            'js': 'application/javascript'
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/assets/scss/style.scss";`,
            },
        },
    },

    build: {
        rollupOptions: {
            preserveEntrySignatures: 'strict', // Păstrează fiecare fișier separat
            input: {
                main: './src/index.html', // Se asigură că Vite include toate fișierele din HTML
            },
            output: {
                // assetFileNames: "assets/css/[name]-[hash][extname]", // Optimizare CSS/JS
                // chunkFileNames: "assets/js/[name]-[hash].js",
                // entryFileNames: "assets/js/[name]-[hash].js",
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
                manualChunks: undefined, // Dezactivează gruparea automată a fișierelor
            },
        },
    }

});