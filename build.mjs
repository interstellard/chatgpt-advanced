import esbuild from "esbuild";
import archiver from "archiver";
import fs from "fs-extra";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssPlugin from "esbuild-style-plugin";
import copyStaticFilesPlugin from "esbuild-plugin-copy";

const buildDir = "build";

async function deleteBuildDir() {
  await fs.remove(buildDir);
}

async function runEsbuild() {
  await esbuild.build({
    entryPoints: ["src/content-scripts/cs.tsx", "src/background/bg.ts"],
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
        resolveFrom: "cwd",
        assets: {
          from: ["src/manifest.json"],
          to: [buildDir],
        },
      }),
    ],
  });
}

async function zipExtensionForBrowser(browser) {
  const manifest = await fs.readJson(`${buildDir}/manifest.json`);
  const version = manifest.version;
  let archiveName = `webchatgpt-${version}-${browser}.zip`;

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(archiveName);

  archive.pipe(stream);

  await addFilesToZip(archive, browser);

  console.log(`Creating ${archiveName}…`);
  archive.finalize();
}

async function addFilesToZip(archive, browser) {
  const entries = await fs.readdir("build");
  for (const entry of entries) {
    const entryStat = await fs.stat(`build/${entry}`);

    if (entryStat.isDirectory()) {
      archive.directory(`build/${entry}`, entry);
    } else {
      if (entry === "manifest.json") continue;
      archive.file(`build/${entry}`, { name: entry });
    }
  }
  if (browser === "firefox") {
    archive.file("src/manifest.v2.json", { name: "manifest.json" });
  } else if (browser === "chrome") {
    archive.file("build/manifest.json", { name: "manifest.json" });
  }
}

async function build() {
  await deleteBuildDir();
  await runEsbuild();

  const createZips = process.argv.includes("--create-zips");
  if (createZips) {
    try {
      await zipExtensionForBrowser("chrome");
      await zipExtensionForBrowser("firefox");
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Build complete");
}

build();
