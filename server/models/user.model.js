const {Schema, model} = require('mongoose');

//crate user schema
const UserSchema = new Schema({
    name:{
        type: String,
        required:[true, 'please provide user name'],
        min: 4,
        lowercase: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'please provide an email'],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, 'please provide password'],
        trim: true 
    }
});


module.exports = model('User', UserSchema);