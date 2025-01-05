import mongoose, { mongo } from "mongoose";

const orderSchema=new mongoose.Schema({
    userId:{type:String},
    productId:{type:String},
    quantity:{type:String},
    housename:{type:String},
    totalPrice:{type:String},
    
});
export default mongoose.model.order||mongoose.model("orders",orderSchema);