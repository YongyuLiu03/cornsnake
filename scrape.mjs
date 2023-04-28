import axios from 'axios';
import * as cheerio from 'cheerio';
import { response } from 'express';
import fs, { copyFileSync } from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const BASE_URL = 'https://iansvivarium.com/morphs';
const TYPE_MAP = {
  'Wildtypes': 0,
  'Single Recessive': 1,
  'Double Trait': 2,
  'Triple Trait': 3,
  'Quad Trait': 4,
  'Five Trait': 5,
  'Six Trait': 6,
  'Single Dominant': 7,
  'Single Incomplete Dominant': 7,
  'Selectively Bred': 8,
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function clean(href) {
    const url = new URL(href, BASE_URL);
    const searchParams = new URLSearchParams(url.search);
    searchParams.delete('sid');
    url.search = searchParams.toString();
    const updatedHref = url.pathname + url.search;
    return updatedHref;
}

async function downloadImage(url, filename, subfolder) {
    let success = 0;
    await axios.get(url, { responseType: 'arraybuffer', headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
        "Referer": "https://www.google.com/"
    }})
        .then(async (response) => {
            const filepath = path.join(__dirname, subfolder, filename);
            fs.writeFileSync(filepath, response.data, 'binary');
            await sleep(10000);
            success = 1;
        })
        .catch(async (error) => {
            if ((error.response) && error.response.status!=404) {
                console.log(error.code);
                console.log(error.message);
                console.log(url, subfolder);
                if (error.response) {
                    console.log(error.response.status);
                }
            }
            await sleep(5000);
        });
    return success;
}

async function scrapeMorphs() {
  const response = await axios.get(BASE_URL);
  const $ = cheerio.load(response.data);
  let currentHeader = '';

  $('.morphlist-row').each(async (index, element) => {
    const imgSrc = new URL(clean($(element).find('img').attr('src')), BASE_URL).href;
    const nameLink = $(element).find('a');
    const name = nameLink.text();
    const traits = $(element).find('.ivcombo').text().split(' + ');
    const thumbnailFilename = path.basename(imgSrc);
    let previous = $(element).prev();
    while (previous.length && !previous.hasClass('morphlist-header')) {
      previous = previous.prev();
    }
    if (previous.length) {
      currentHeader = previous.text();
    }
    if (!TYPE_MAP[currentHeader]) {
        return;
    }
    
    await downloadImage(imgSrc, thumbnailFilename, 'thumbnails');
    await sleep(5000);

    const filename = clean(nameLink.attr('href')).substring(4);
    const morphUrl = `${BASE_URL}/${filename}/pics`;
    const hatchlingImgFilename = `${filename.split("_").join('')}-a.jpg`;
    const adultImgFilename = `${filename.split("_").join('')}-h.jpg`;
    
    const hSuccess = await downloadImage(`${morphUrl}/${hatchlingImgFilename}`, hatchlingImgFilename, 'pics');
    await sleep(5000);
    const aSuccess = await downloadImage(`${morphUrl}/${adultImgFilename}`, adultImgFilename, 'pics');
    await sleep(5000);

    const jsonData = {
      name,
      type: TYPE_MAP[currentHeader],
      traits,
      thumbnail: `./thumbnails/${thumbnailFilename}`,
      hatchlingImg: hSuccess? `./pics/${hatchlingImgFilename}`: "",
      adultImg: aSuccess? `./pics/${adultImgFilename}`: ""
    };

    fs.writeFileSync(path.join(__dirname, "json", `${filename}.json`), JSON.stringify(jsonData, null, 2));
  });
}

scrapeMorphs();
