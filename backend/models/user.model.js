import mongoose, { mongo } from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    email:{type:String},
    accounttype:{type:String}
});
export default mongoose.model.user||mongoose.model("user",userSchema);