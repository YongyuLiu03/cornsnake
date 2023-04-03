// 1ST DRAFT DATA MODEL
import mongoose from 'mongoose';

const url = "mongodb+srv://yl8126:TVIOtiU6JRkg7jVE@cornsnake.qlxudo6.mongodb.net/?retryWrites=true&w=majority";

// Morph
const Morph = new mongoose.Schema({
    name: {type: String,},
    type: {type: Number},
    traits: [String],
    hatchlingImg: {data: Buffer, contentType: String},
    adultImg: {data: Buffer, contentType: String},
    hits: {type: Number, default: 0}
},  {_id: true});

// User
const User = new mongoose.Schema({
    // username provided by authentication plugin
    // password hash provided by authentication plugin
    collect: [{type: mongoose.Schema.Types.ObjectId, ref: 'Morph'}]
});

mongoose.model('Morph', Morph);
mongoose.model('User', User);
// TODO: add remainder of setup for slugs, connection, registering models, etc. below