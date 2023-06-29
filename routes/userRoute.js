const userController = require("../controllers/userController");
// const productController = require('../controllers/productController')
// const cartController = require('../controllers/cartController')
// const orderController = require('../controllers/orderController')

// const auth = require("../middleware/userAuth")
const express = require("express");
const user_route = express();
// const { isLogout, isLogin, isCheckout, blockCheck } = auth
user_route.set("views", "./Views/userView");





user_route.get('/',userController.homeload)

//login logout routes
user_route.get("/login",userController.login)
user_route.post('/login',  userController.verifyLogin);
user_route.get('/logout',  userController.doLogout)


//otp verification routes
user_route.get("/register",  userController.signup);
user_route.post('/signup',  userController.sendOtp)
user_route.get('/Otp', userController.showOtp)
user_route.post('/otpEnter',userController.verifyOtp);


user_route.get("/home",userController.homeload);

user_route.get("/404",  userController.err_404);





module.exports=user_route
