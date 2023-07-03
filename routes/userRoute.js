const userController = require("../controllers/userController");
// const productController = require('../controllers/productController')
// const cartController = require('../controllers/cartController')
// const orderController = require('../controllers/orderController')

const auth = require("../middleware/userAuth")
const express = require("express");
const user_route = express();
const { isLogout, isLogin, isCheckout, blockCheck } = auth
user_route.set("views", "./Views/userView");





user_route.get('/',userController.homeload)

//login logout routes
user_route.get("/login", isLogout,  userController.login)
user_route.post('/login',  userController.verifyLogin);
user_route.get('/logout',  userController.doLogout)


//otp verification routes
user_route.get("/signup", isLogout,  userController.signup);
user_route.post('/signup',  userController.sendOtp)
user_route.get('/showOtp', userController.showOtp)
user_route.post('/otpEnter' ,userController.verifyOtp);

//forgot
user_route.get('/forgotPassword',isLogout,userController.loadForgotPassword)
user_route.post('/verifyEmail',isLogout,userController.verifyForgotEmail)
user_route.get('/forgotOtpEnter',isLogout,userController.showForgotOtp)
user_route.post('/verifyForgotOtp',isLogout,userController.verifyForgotOtp)
user_route.get('/resendForgotPasswordotp', isLogout ,userController.resendForgotOtp)
user_route.post('/newPassword',isLogout, userController.updatePassword)

user_route.get("/home",userController.homeload);

user_route.get("/404",  userController.err_404);





module.exports=user_route
