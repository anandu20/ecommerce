import mongoose, { mongo } from "mongoose";

const cartSchema=new mongoose.Schema({
    userId:{type:String},
    pname:{type:String},
    price:{type:String},
    pimages:{type:Array},
    quantity:{type:Number},
    productId:{type:String}
});
export default mongoose.model.cart||mongoose.model("cart",cartSchema);