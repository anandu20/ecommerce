import { Router } from "express";
import * as p from './requestHandler.js'
import Auth from "./middleware/Auth.js";
const router=Router();
router.route("/signin").post(p.signIn);
router.route("/signup").post(p.signUp);
router.route("/verify").post(p.verifyMail);
router.route("/home").get(Auth,p.Home);
router.route("/seller").get(Auth,p.Seller); 
router.route("/editseller").post(Auth,p.editSeller);
router.route("/getseller").get(Auth,p.getSeller);
router.route("/addproduct").post(p.addProduct);
router.route("/getproducts").get(Auth,p.getProduct);
router.route("/adduser").post(Auth,p.addUser);
router.route("/getuser").get(Auth,p.getUser)
router.route("/updateuser").put(Auth,p.updateUser);
router.route("/addaddress").post(Auth,p.addAddress);
router.route("/getaddress").get(Auth,p.getAddress)
router.route("/deleteaddress").post(Auth,p.deleteAddress)
router.route("/addcat").post(p.addCategory);
router.route("/getcat").get(Auth,p.getCategory);
router.route("/getpcat/:category").get(p.getCatProduct)
router.route("/getallproducts").get(Auth,p.getAllProducts);
router.route("/getproducte/:id").get(p.getProductE);
router.route("/editproduct/:id").put(p.editProduct);
router.route("/deleteproduct/:id").delete(p.deleteProduct);
router.route("/deletep/:id").delete(p.deleteProduct);
router.route("/addtocart").post(Auth,p.addToCart);
router.route("/updatecart/:id").put(p.updateCart)
router.route("/getcart").get(Auth,p.getCart);
router.route("/deletecart/:id").delete(p.deleteCart);
router.route("/addtowishlist").post(Auth,p.addToWishlist)
router.route("/removefromwishlist/:productId").delete(Auth,p.removeFromWishlist)
router.route("/getorder/:id").get(p.getOrder);
router.route("/getwishlist").get(Auth,p.getWishlist);
router.route("/editquantity").post(Auth,p.editQuantity);
router.route("/addorder").post(Auth,p.addOrder);
router.route("/addallorders").post(Auth,p.addAllOrders);
router.route("/getorders").get(Auth,p.getOrders);


export default router;