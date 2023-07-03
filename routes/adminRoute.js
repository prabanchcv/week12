const adminController = require("../controllers/adminController");
// const adminDashboard = require('../controllers/adminDashboard')
const express = require("express");
const adminAuth= require('../middleware/adminAuth');
const store = require("../middleware/multer");
const admin_route = express();
admin_route.set("views", "./Views/adminView");
const nocache=require('nocache')




//admin lgin logout
admin_route.get('/',adminAuth.isLogout ,adminController.loadLogin)
admin_route.post('/login',adminController.verifyLogin)
admin_route.get('/logout',adminController.adminLogout)


admin_route.get("/admindash",adminController.loadDashboard);




admin_route.get("/users", adminAuth.isLogin, adminController.loadUsers)
admin_route.get("/blockUser/:id", adminAuth.isLogin, adminController.blockUser);


// admin_route.get("/orders",adminController.loadOrders)
// admin_route.post('/updateOrder', adminController.updateOrder)
// admin_route.get('/orderDetails', adminController.orderDetails)



admin_route.get("/categories", adminAuth.isLogin, adminController.loadCategories)
admin_route.get('/addCategory', adminAuth.isLogin, adminController.addCategory)
admin_route.post('/addCategory', adminAuth.isLogin, store.single('image') , adminController.addNewCategory)
admin_route.get('/editCategory/:id', adminAuth.isLogin, adminController.editCategory)
admin_route.post('/updateCategory/:id', adminAuth.isLogin, store.single('image') , adminController.updateCategory)
admin_route.get('/unlistCategory/:id', adminAuth.isLogin, adminController.unlistCategory)




module.exports=admin_route