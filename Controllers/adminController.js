const moment = require("moment");



//admin login

const credentials = {
   
    email: "prabanch@gmail.com",
    password: "Prabanch123*",
};

const loadLogin = async (req, res) => {
    res.render('admindash')
    // try {
    //     if (req.session.wrongAdmin) {
    //         res.render("login", { invalid: "invalid details" });
    //         req.session.wrongAdmin = false;
    //     } else {
    //         res.render("login");
    //     }
    // } catch (error) {
    //     console.log(error.message);
    // }
};

const adminLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
};

const   verifyLogin = async (req, res) => {
    try {
        if (req.body.email == credentials.email && req.body.password == credentials.password) {
            req.session.admin = req.body.email;
            res.redirect("/admin/dashboard");
        } else {
            req.session.wrongAdmin = true;
            res.redirect("/admin");
        }
    } catch (error) {
        console.log(error.messaage);
    }
};


module.exports={
    loadLogin,
    adminLogout,
    verifyLogin


}