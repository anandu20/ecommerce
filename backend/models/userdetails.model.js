import mongoose, { mongo } from "mongoose";

const userdetailsSchema=new mongoose.Schema({
    userId:{type:String},
    fname:{type:String},
    lname:{type:String},
    mobile:{type:String},
    gender:{type:String}
    
});
export default mongoose.model.userdetails||mongoose.model("userdetails",userdetailsSchema);