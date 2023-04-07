import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

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
    username: String,
    password: String,
    collect: [{type: mongoose.Schema.Types.ObjectId, ref: 'Morph'}]
});
User.plugin(passportLocalMongoose);

// Comment 
const Comment = new mongoose.Schema({
    username: {type: String, required: false, default: undefined},
    content: String
}, {timestamps: {createdAt: true, updatedAt: false}});

mongoose.model('Morph', Morph);
mongoose.model('User', User);
mongoose.model('Comment', Comment);
