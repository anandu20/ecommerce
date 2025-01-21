import mongoose, { mongo } from "mongoose";

const categorySchema=new mongoose.Schema({
    category:{type:String}
});
export default mongoose.model.category||mongoose.model("category",categorySchema);