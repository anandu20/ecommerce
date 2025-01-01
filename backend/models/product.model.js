import mongoose, { mongo } from "mongoose";

const productSchema=new mongoose.Schema({
    sellerId:{type:String},
    category:{type:String},
    pname:{type:String},
    brand:{type:String},
    size:{type:String},
    price:{type:String},
    pname:{type:String},
    pimages:{type:Array}

    

});
export default mongoose.model.product||mongoose.model("product",productSchema);