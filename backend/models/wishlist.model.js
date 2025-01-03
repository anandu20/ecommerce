import mongoose, { mongo } from "mongoose";

const wishlistSchema=new mongoose.Schema({
    userId:{type:String},
    productId:{type:String},
    pname:{type:String},
    price:{type:String},
    pimages:{type:Array},
    brand:{type:String}
});
export default mongoose.model.wishlist||mongoose.model("wishlist",wishlistSchema);