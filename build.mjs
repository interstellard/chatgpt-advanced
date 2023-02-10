import esbuild from "esbuild";
import archiver from "archiver";
import fs from "fs-extra";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssPlugin from "esbuild-style-plugin";
import copyStaticFilesPlugin from "esbuild-copy-files-plugin";
import path from 'path';

// Define the build directory and whether the build should be minified or not
const buildDir = "build";
const minify = process.argv.includes("--minify");

// Function to clean the build directory before building the project
async function cleanBuildDir() {  
  // Read the entries in the build directory
  const entries = await fs.readdir(buildDir);
  // Loop through the entries and remove everything except for .zip files
  for (const entry of entries) {
    if (path.extname(entry) === ".zip") continue;
    await fs.remove(`${buildDir}/${entry}`);
  }
}
// Function to build the project with esbuild
async function runEsbuild() {
  // Specify the entry points for esbuild to process
  await esbuild.build({
    entryPoints: [
      "src/content-scripts/mainUI.tsx",
      "src/background/bg.ts",
      "src/options/options.tsx",
    ],
    // Specify the output directory for esbuild to write the processed files to
    outdir: buildDir,
    // Bundle the output into a single file
    bundle: true,
    // Minify the output, only enabled if --minify is passed as an argument
    minify: minify,
    // Use tree shaking to remove unused code
    treeShaking: true,
    // Define environment variables for the build
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    // Set the JSX factory function to 'h'
    jsxFactory: "h",
    // Set the JSX fragment to 'Fragment'
    jsxFragment: "Fragment",
    // Automatically detect JSX syntax in TypeScript files
    jsx: "automatic",
    // Load .png files as data URLs
    loader: {
      ".png": "dataurl",
    },
    // Add plugins to the esbuild build process
    plugins: [
      // Use postcss to process CSS with tailwindcss and autoprefixer
      postcssPlugin({
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      }),
      // Copy the manifest.json, assets and locales folders to the build directory
      copyStaticFilesPlugin({
        source: ["src/manifest.json", "src/assets/"],
        target: buildDir,
        copyWithFolder: false,
      }),
      // Use the esbuild-copy-files-plugin to copy the options.html file
      copyStaticFilesPlugin({
        // Source file to copy
        source: ["src/options/options.html"],
        // Target directory
        target: buildDir + "/options",
        copyWithFolder: false,
      }),
      copyStaticFilesPlugin({
        source: ["src/_locales/"],
        target: buildDir,
        copyWithFolder: true,
      }),
    ],
  });
}

async function createZipExtensionForBrowser(browser) {
  // Read the manifest.json file in the build directory
  const manifest = await fs.readJson(`${buildDir}/manifest.json`);
  // Get the version from the manifest file
  const version = manifest.version;
  // Create the archive name using the version and browser name
  let archiveName = `build/webchatgpt-${version}-${browser}.zip`;

  // Create a new zip archive using the archiver library
  const archive = archiver("zip", { zlib: { level: 9 } });
  // Create a write stream for the archive file
  const stream = fs.createWriteStream(archiveName);

  // Pipe the archive data to the write stream
  archive.pipe(stream);

  // Add files to the zip archive
  await addFilesToZip(archive, browser);

  // Log a message indicating that the zip archive is being created
  console.log(`Creating ${archiveName}…`);
  // Finalize the archive and write all data to the archive file
  archive.finalize();
}

async function addFilesToZip(archive, browser) {
  // Read the entries in the build directory
  const entries = await fs.readdir("build");
  // Loop through each entry
  for (const entry of entries) {
    // Get the entry's stat information
    const entryStat = await fs.stat(`build/${entry}`);

    // Check if the entry is a directory
    if (entryStat.isDirectory()) {
      // If so, add the directory to the archive
      archive.directory(`build/${entry}`, entry);
    } else {
      // If not, check if the entry is a zip file or the manifest.json file
      if (path.extname(entry) === ".zip") continue;
      if (entry === "manifest.json") continue;
      // If not, add the file to the archive
      archive.file(`build/${entry}`, { name: entry });
    }
  }
  // Check if the browser is firefox
  if (browser === "firefox") {
    // If so, add the firefox-specific manifest file to the archive
    archive.file("src/manifest.v2.json", { name: "manifest.json" });
  // Check if the browser is chrome
  } else if (browser === "chrome") {
    // If so, add the chrome-specific manifest file to the archive
    archive.file("build/manifest.json", { name: "manifest.json" });
  }
}

async function build() {
  // Clean up the build directory
  await cleanBuildDir();
  // Compile the code using esbuild
  await runEsbuild();

  // Check if the --create-zips flag is present in the command line arguments
  const createZips = process.argv.includes("--create-zips");
  // If the flag is present, create the ZIP extensions for Chrome and Firefo
  if (createZips) {
    try {
      // Delete any existing ZIP files in the build folde
      await deleteZipsInBuildFolder();

      // Create the ZIP extension for Chrome 
      await createZipExtensionForBrowser("chrome");
      // Create the ZIP extension for Firefox 
      await createZipExtensionForBrowser("firefox");
      // Log any errors that occur during the process 
    } catch (error) {
      console.error(error);
    }
  }
  // Log that the build process is complete
  console.log("Build complete");

  async function deleteZipsInBuildFolder() {
    // Read the entries in the build folder
    const entries = await fs.readdir("build");
    // Iterate over each entry
    for (const entry of entries) {
      // If the entry is a ZIP file
      if (path.extname(entry) === ".zip") {
        // Delete the ZIP file
        await fs.remove(`build/${entry}`);
      }
    }
  }
}

build();