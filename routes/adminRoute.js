const adminController = require("../controllers/adminController");
// const adminDashboard = require('../controllers/adminDashboard')
const express = require("express");
// const adminAuth= require('../middleware/adminAuth');
// const store = require("../middleware/multer");
const admin_route = express();
admin_route.set("views", "./views/adminView");



//admin lgin logout
admin_route.get('/',adminController.loadLogin)
// admin_route.post('/login',adminController.verifyLogin)
// admin_route.get('/logout',adminController.adminLogout)


module.exports=admin_route