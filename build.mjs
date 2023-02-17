import esbuild from "esbuild"
import archiver from "archiver"
import fs from "fs-extra"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import postcssPlugin from "esbuild-style-plugin"
import copyStaticFilesPlugin from "esbuild-copy-files-plugin"
import path from 'path'


const buildDir = "build"
const minify = process.argv.includes("--minify")

async function cleanBuildDir() {
  const entries = await fs.readdir(buildDir)
  for (const entry of entries) {
    if (path.extname(entry) === ".zip") continue
    await fs.remove(`${buildDir}/${entry}`)
  }
}
async function runEsbuild() {
  await esbuild.build({
    entryPoints: [
      "src/content-scripts/mainUI.tsx",
      "src/background/bg.ts",
      "src/options/options.tsx",
    ],
    outdir: buildDir,
    bundle: true,
    minify,
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
        source: ["src/manifest.json", "src/assets/"],
        target: buildDir,
        copyWithFolder: false,
      }),
      copyStaticFilesPlugin({
        source: ["src/options/options.html"],
        target: `${buildDir}/options`,
        copyWithFolder: false,
      }),
      copyStaticFilesPlugin({
        source: ["src/_locales/"],
        target: buildDir,
        copyWithFolder: true,
      }),
    ],
  })
}

async function createZipExtensionForBrowser(browser) {
  const manifest = await fs.readJson(`${buildDir}/manifest.json`)
  const version = manifest.version
  let archiveName = `build/webchatgpt-${version}-${browser}.zip`

  const archive = archiver("zip", { zlib: { level: 9 } })
  const stream = fs.createWriteStream(archiveName)

  archive.pipe(stream)

  await addFilesToZip(archive, browser)

  console.log(`Creating ${archiveName}…`)
  archive.finalize()
}

async function addFilesToZip(archive, browser) {
  const entries = await fs.readdir("build")
  for (const entry of entries) {
    const entryStat = await fs.stat(`build/${entry}`)

    if (entryStat.isDirectory()) {
      archive.directory(`build/${entry}`, entry)
    } else {
      if (path.extname(entry) === ".zip") continue
      if (entry === "manifest.json") continue
      archive.file(`build/${entry}`, { name: entry })
    }
  }
  if (browser === "firefox") {
    archive.file("src/manifest.v2.json", { name: "manifest.json" })
  } else if (browser === "chrome") {
    archive.file("build/manifest.json", { name: "manifest.json" })
  }
}

async function build() {
  await cleanBuildDir()
  await runEsbuild()

  const createZips = process.argv.includes("--create-zips")
  if (createZips) {
    try {
      await deleteZipsInBuildFolder()
      await createZipExtensionForBrowser("chrome")
      await createZipExtensionForBrowser("firefox")
    } catch (error) {
      console.error(error)
    }
  }

  console.log("Build complete")

  async function deleteZipsInBuildFolder() {
    const entries = await fs.readdir("build")
    for (const entry of entries) {
      if (path.extname(entry) === ".zip") {
        await fs.remove(`build/${entry}`)
      }
    }
  }
}

build()
