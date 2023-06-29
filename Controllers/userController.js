const User=require('../Models/usermodel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const moment = require('moment')




//user controller

const signup = async (req, res) => {
        try {
            res.render("register");
        } catch (error) {
            console.log(error.message);
        }
    };
    
const login = async (req, res) => {
        res.render("login");
        try {
            if (req.session.passwordUpdated) {
                res.render("login", { success: "Password changed successfully!!" });
                req.session.passwordUpdated = false;
            } else {
                res.render("login");
            }
        } catch (error) {
            console.log(error.message);
        }
    };


const err_404=(req,res)=>{
        res.render('404')
}   
//password encryption

const securePassword = async (password) => {
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            return passwordHash;
        } catch (error) {
            console.log(error.message);
        }
    };
    ////user verification
    
let saveOtp;
let name;
let email;
let mobile;
let password;
let forgotPasswordOtp;



    const sendOtp = async (req, res) => {
        try {
            const emailExist = await User.findOne({ email: req.body.email });
            if (!emailExist) {
               
                    const generatedOtp = generateOTP();
                    saveOtp = generatedOtp;
                    firstName = req.body.firstname;
                    lastName=req.body.lastname;
                    email = req.body.email;
                    mobile = req.body.phonenumber;
                    password = req.body.password;
                    sendOtpMail(email, generatedOtp);
                    res.redirect("/Otp");
                
                            
            } else {
                res.render("signup", { alreadyUser: "user already exist" });
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const showOtp = async (req, res) => {
        try {
            res.render("Otp");
        } catch (error) {}
    };

    function generateOTP() {
        let otp = "";
        for (let i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    }

    async function sendOtpMail(email, otp) {
        console.log(otp);
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "itsprabanchcv@gmail.com",
                    pass: "efhzfchvjqstvmkb",
                },
            });
    
            const mailOptions = {
                from: "itsprabanchcv@gmail.com",
                to: email,
                subject: "Your OTP for user verification",
                text: `Your OTP is ${otp} . Please enter this code to verify your account`,
            };
    
            const result = await transporter.sendMail(mailOptions);
            console.log(result);
        } catch (error) {
            console.log(error.message);
        }
    }
    

    const verifyOtp = async (req, res) => {
         
        var txt1=req.body.txt1;
        var txt2 =req.body.txt2
        var txt3=req.body.txt3
        var txt4=req.body.txt4
        const EnteredOtp=txt1+txt2+txt3+txt4
        console.log(`entered otp${EnteredOtp}`);
        console.log(`saveotp${saveOtp}`);
        if (EnteredOtp === saveOtp) {

            const securedPassword = await securePassword(password);        
                
            const newUser = new User({
                firstName: firstName,
                lastName:lastName,
                email: email,
                phoneNumber: mobile,
                password: securedPassword,
                is_blocked: false,
               
            });
            console.log(newUser);
    
           
            try {
                await newUser.save();
                
                    res.render("login", { success: "Successfully registered!" });
                
            } catch (error) {
                console.log(error);
                res.render("Otp", { invalidOtp: "Error registering new user" });
            }
    
        } else {
            res.render("Otp", { invalidOtp: "wrong OTP" });
        }
    };

    const verifyLogin = async (req, res) => {
        try {
               
            const email = req.body.email;
            console.log(email);
            const password = req.body.password;
            const userData = await User.findOne({ email: email });
                console.log(userData);
            if (userData) {
                const passwordMatch = await bcrypt.compare(password, userData.password);
                if (userData.is_blocked === true) {
                    return res.render("login", { blocked: "Your account is blocked - conatct: yara@gmail.com" });
                }
    
                if (passwordMatch) {
                        console.log("verified pass");
                    req.session.user = userData;
                    res.redirect("/home");
                }
                if (!passwordMatch) {
                    res.render("login", { invalid: "Entered password is wrong" });
                }
            } else {
                res.render("login", { invalid: "You are not registered. please register now!!" });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const homeload = async (req, res) => {
        // try {
        // //     const categoryData = await Category.find({ is_blocked: false });
        // //     const subCategoryData = await SubCategory.find({ is_blocked: false });
        // //     const bannerData = await Banner.find({ active: true });
        //     const userData = req.session.user;
        //     console.log("userData:", userData)
        //     const offerProducts = await Products.aggregate([
        //         { $match: { offerlabel: { $ne: [] } } },
        //         { $sample: { size: 4 } },
        //         {
        //             $lookup: {
        //                 from: "categories",
        //                 localField: "category",
        //                 foreignField: "_id",
        //                 as: "category",
        //             },
        //         },{
        //             $unwind: "$category",
        //         },
        //         {
        //             $lookup: {
        //                 from: "subcategories",
        //                 localField: "subCategory",
        //                 foreignField: "_id",
        //                 as: "subCategory",
        //             },
        //         },
        //         {
        //             $unwind: "$subCategory",
        //         }
        //     ]);
    
        //     if (userData) {
        //         const userId = userData._id;
        //         let cartId = null;
        //         const user = await User.findOne({ _id: userId }).populate("cart.product").lean();
        //         console.log("user:", user);
        //         if (user.cart && user.cart.length > 0) {
        //             cartId = user.cart[0]._id;
        //         }
    
        //         res.render("home", { userData, cartId, categoryData, bannerData, subCategoryData, offerProducts });
        //     } else {
        //         res.render("home", { categoryData, subCategoryData, bannerData, offerProducts });
        //     }
        // } catch (error) {
        //     console.log(error.message);
        // }
        res.render('home')
    };











//user logout
    const doLogout = async (req, res) => {
        try {
            req.session.destroy();
            res.redirect("/login");
        } catch (error) {
            console.log(error.message);
        }
    };


module.exports={
    homeload,
    signup,
    login,
    err_404,
    sendOtp,
    showOtp,
    verifyOtp,
    verifyLogin,
    doLogout,
    
}