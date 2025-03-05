import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";

const inputFolder = "src/assets/img/";
const outputFolder = "dist/assets/img/";

// Dimensiuni pentru diferite ecrane
const sizes = [
    { name: "mobile", width: 480 },
    { name: "laptop", width: 1024 },
    { name: "desktop", width: 1920 },
];

// Funcție pentru a scana recursiv fișierele dintr-un folder
async function getFilesRecursively(dir) {
    let results = [];
    const list = await fs.readdir(dir);

    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            const subFiles = await getFilesRecursively(filePath);
            results = results.concat(subFiles);
        } else {
            results.push(filePath);
        }
    }
    return results;
}

async function optimizeAndResizeImages() {
    const files = await getFilesRecursively(inputFolder);

    for (const filePath of files) {
        const ext = path.extname(filePath).toLowerCase();
        const relativePath = path.relative(inputFolder, filePath);
        const outputDir = path.join(outputFolder, path.dirname(relativePath));
        const baseName = path.basename(filePath, ext);

        if (![".jpg", ".jpeg", ".png"].includes(ext)) {
            console.log(`⚠️ Skipping ${relativePath} (not an image)`);
            continue;
        }

        await fs.ensureDir(outputDir);

        // Optimizează originalul
        const optimizedImage = await imagemin([filePath], {
            destination: outputDir,
            plugins: [
                imageminMozjpeg({ quality: 75 }),
                imageminPngquant({ quality: [0.6, 0.8] }),
            ],
        });

        console.log(`✅ ${relativePath} optimizat!`);

        // Convertire în WebP și redimensionare
        for (const size of sizes) {
            const outputPath = path.join(outputDir, `${baseName}-${size.name}.webp`);

            await sharp(filePath)
                .resize({ width: size.width })
                .toFormat("webp")
                .toFile(outputPath);

            console.log(`✅ ${relativePath} redimensionat (${size.name}) și convertit în WebP!`);
        }
    }

    console.log("🚀 Toate imaginile au fost procesate!");
}

optimizeAndResizeImages();