import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../json");
const imagePath = path.join(__dirname, "..");


import "./db.mjs";
import mongodb, { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect().catch((err) => console.log(err));
const db = client.db("dev");
const bucket = new mongodb.GridFSBucket(db);
const morphsCollection = db.collection('morphs');
const jsons = fs.readdirSync(jsonPath);

for (const json of jsons) {
    const morph = JSON.parse(fs.readFileSync(path.join(jsonPath, json), 'utf-8'));
    console.log('JSON data:', morph);
    if (morph.hatchlingImg) {
        const readStream = fs.createReadStream(path.join(imagePath, morph.hatchlingImg));
        const uploadStream = bucket.openUploadStream(path.basename(morph.hatchlingImg));
        readStream.pipe(uploadStream);
        await new Promise((resolve) => {
            uploadStream.on('finish', (uploadedFile) => {
                console.log(`Stored file: ${uploadedFile.filename}`);
                morph.hatchlingImg = uploadedFile._id;
                resolve();
            });
        });
    }
    if (morph.adultImg) {
        const readStream = fs.createReadStream(path.join(imagePath, morph.adultImg));
        const uploadStream = bucket.openUploadStream(path.basename(morph.adultImg));
        readStream.pipe(uploadStream);
        await new Promise((resolve) => {
            uploadStream.on('finish', (uploadedFile) => {
                console.log(`Stored file: ${uploadedFile.filename}`);
                morph.adultImg = uploadedFile._id;
                resolve();
            });
        });

    }
    try {
        const existingMorph = await morphsCollection.findOne({ name: morph.name });
        if (existingMorph) {
            console.log(`Morph with name '${morph.name}' already exists.`);
            continue;
        }
        const result = await morphsCollection.insertOne(morph);
        console.log(`Successfully inserted Morph with _id: ${result.insertedId}`);
      } catch (error) {
        console.error('Error inserting Morph:', error);
      }
    console.log(`Saved morph: ${morph.name}`);
}

