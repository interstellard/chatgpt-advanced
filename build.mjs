import esbuild from "esbuild"
import archiver from "archiver"
import fs, { copy } from "fs-extra"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import postcssPlugin from "esbuild-style-plugin"
import copyStaticFilesPlugin from "esbuild-plugin-copy"

const buildDir = "build"

async function deleteBuildDir() {
    await fs.remove(buildDir)
}   

async function runEsbuild() {
    await esbuild.build({
        entryPoints: [
            "src/content-scripts/cs.tsx",
            "src/background/bg.ts",
        ],
        outdir: buildDir,
        bundle: true,
        minify: true,
        treeShaking: true,
        define: {
            "process.env.NODE_ENV": '"production"',
        },
        jsxFactory: "h",
        jsxFragment: "Fragment",
        jsx: "automatic",
        loader: {
            ".png": "dataurl",
        },
        plugins: [
            postcssPlugin({
                postcss: {
                    plugins: [tailwindcss, autoprefixer],
                  },
            }),
            copyStaticFilesPlugin({
                resolveFrom: 'cwd',
                assets: {
                    from: ['src/manifest.json','src/manifest.v2.json'],
                    to: [buildDir, buildDir],
                }
            }),
        ],
    })
}


async function zipForBrowser(browser) {

    const manifest = await fs.readJson(`${buildDir}/manifest.v2.json`)
    const version = manifest.version;
    let archiveName = `webchatgpt-${version}-${browser}.zip`;

    const tempDir = `${buildDir}/temp`;
    await fs.ensureDir(tempDir);

    if(browser === 'firefox'){
        await fs.rename(`${tempDir}/manifest.v2.json`, `${tempDir}/manifest.json`);
    }

    const archive = archiver("zip", {
        zlib: { level: 9 }
    });
    const stream = fs.createWriteStream(archiveName);

    archive.pipe(stream);
    archive.directory(tempDir, false);
    if(browser === 'chrome'){
        archive.glob("!manifest.v2.json");
    }
    await archive.finalize();
    await fs.remove(tempDir);
}

async function build() {
    
    await deleteBuildDir()
    await runEsbuild()
    
    const createZips = process.argv.includes('--create-zips');
    if(createZips){
        try {
            await zipForBrowser("chrome");
            await zipForBrowser("firefox");
        } catch (error) {
            console.error(error);
        }
    }
}

build()