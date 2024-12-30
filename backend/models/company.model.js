import mongoose, { mongo } from "mongoose";

const companySchema=new mongoose.Schema({
    sellerId:{type:String},
    location:{type:String},
    name:{type:String}
});
export default mongoose.model.company||mongoose.model("company",companySchema);