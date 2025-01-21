import mongoose, { mongo } from "mongoose";

const orderSchema=new mongoose.Schema({
    userId:{type:String},
    product:{type:Object},
    quantity:{type:String},
    totalPrice:{type:String}
    
});
export default mongoose.model.order||mongoose.model("orders",orderSchema);