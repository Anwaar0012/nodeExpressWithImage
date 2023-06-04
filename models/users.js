const mongoose  = require("mongoose")

// Defining Schema
const usersSchema = new mongoose.Schema({
    name:{type:String, required:true,trim:true },
    email:{type:String, required:true},
    phone:{type:String, required:true},
    image:{type:String, required:true},
    action:{type:Date, required:true, default:Date.now},
});
// Model
module.exports= mongoose.model('User',usersSchema);

