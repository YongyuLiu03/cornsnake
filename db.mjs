// 1ST DRAFT DATA MODEL
import mongoose from 'mongoose';

// Morph
// image storing and retrieval ref:
// https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
const Morph = new mongoose.Schema({
    _id: true,
    name: {type: String,},
    type: {type: Numbe},
    traits: [String],
    hatchlingImg: {data: Buffer, contentType: string},
    adultImg: {data: Buffer, contentType: string},
    hits: {type: Number, default: 0}
});

// User
const User = new mongoose.Schema({
    // username provided by authentication plugin
    // password hash provided by authentication plugin
    collection:  [Morph]
});

mongoose.model('Morph', Morph);
mongoose.model('User', User);
// TODO: add remainder of setup for slugs, connection, registering models, etc. below