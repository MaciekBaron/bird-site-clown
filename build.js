/* eslint-disable import/no-extraneous-dependencies */
const esbuild = require('esbuild');
const fs = require('fs-extra');
const { version } = require('./package.json');

const OUTPUT_DIR = './extension';

const manifest = {
  manifest_version: 2,
  name: 'Bird Site Clown',
  version,
  description: 'Clownifies NFT bird site',
  permissions: ['<all_urls>'],
  browser_action: {
    default_popup: 'popup.html',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['content.js'],
    },
  ],
  icons: {
    48: '48-icon.png',
    128: '128-icon.png',
  },
};

const prepareContent = async () => {
  try {
    await fs.emptyDir(OUTPUT_DIR);
    await Promise.all([
      fs.writeFile(`${OUTPUT_DIR}/manifest.json`, JSON.stringify(manifest)),
      fs.copy('./extension_content', OUTPUT_DIR),
      esbuild.build({
        entryPoints: ['./src/content.ts'],
        bundle: true,
        minify: true,
        outfile: `${OUTPUT_DIR}/content.js`,
        plugins: [],
      }),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

prepareContent();
