const moment = require("moment");
const User = require("../Models/usermodel");
const Category = require("../Models/categoryModel");
const SubCategory = require("../Models/subCategoryModel");
const Banner = require('../Models/bannerModel')
// const Product = require("../models/productModel");

const cloudinary = require('../database/cloudinary')
//admin login

const credentials = {
   
    email: "prabanch@gmail.com",
    password: "Prabanch123*",
};

const loadLogin = async (req, res) => {
    // res.render('login')
    try {
        if (req.session.wrongAdmin) {
            res.render("login", { invalid: "invalid details" });
            req.session.wrongAdmin = false;
        } else {
            res.render("login");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const adminLogout = async (req, res) => {
    try {
        req.session.destroy();
        
        res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
};
var email
const   verifyLogin = async (req, res) => {
    try {
        console.log(req.body.email)
        if (req.body.email == credentials.email && req.body.password == credentials.password) {
            req.session.admin = req.body.email;
            email=req.body.email
          
            res.redirect("/admin/admindash");
        } else {
            req.session.wrongAdmin = true;
            res.redirect("/admin");
        }
    } catch (error) {
        console.log(error.messaage);
    }
};
//user load
const loadUsers = async (req, res) => {
    try {
        const userData = await User.find();
        res.render("users", { users: userData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};
//user block

const blockUser = async (req, res) => {
    try {
        const id = req.params.id;

        const blockUser = await User.findById(id);

        await User.findByIdAndUpdate(id, { $set: { is_blocked: !blockUser.is_blocked } }, { new: true });

        res.redirect("/admin/users");
    } catch (error) {
        console.log(error);
    }
};


const  loadDashboard = (req, res) => {
    res.render('admindash',{user:req.session.admin})
}


////////////////////CATEGORIES/////////////////////////////

const loadCategories = async (req, res) => {
    try {
        const categoryData = await Category.find();
        if (req.session.categoryUpdate) {
            res.render("categories", {
                categoryData,
                catNoUpdation: "",
                catUpdated: "Category updated successfully",
                user: req.session.admin,
            });
            req.session.categoryUpdate = false;
        } else if (req.session.categorySave) {
            res.render("categories", {
                categoryData,
                catNoUpdation: "",
                catUpdated: "Category Added successfully",
                user: req.session.admin,
            });
            req.session.categorySave = false;
        } else if (req.session.categoryExist) {
            res.render("categories", {
                categoryData,
                catUpdated: "",
                catNoUpdation: "Category Already Exists!!",
                user: req.session.admin,
            });
            req.session.categoryExist = false;
        } else {
            res.render("categories", { categoryData, user: req.session.admin,catUpdated:"",catNoUpdation: ""});
        }
    } catch (error) {
        console.log(error.message);
    }
};

const addCategory = async (req, res) => {
    try {
        res.render("addCategory", { user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const addNewCategory = async (req, res) => {
    const categoryName = req.body.name;
    const categoryDescription = req.body.categoryDescription;
    const image = req.file;
    const lowerCategoryName = categoryName.toLowerCase();

    try {

        const result = await cloudinary.uploader.upload(image.path,{
            folder: "Categories"
        })

        const categoryExist = await Category.findOne({ category: lowerCategoryName });
        if (!categoryExist) {
            const category = new Category({
                category: lowerCategoryName,
                imageUrl: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                description: categoryDescription,
            });

            await category.save();
            req.session.categorySave = true;
            res.redirect("/admin/categories");
        } else {
            req.session.categoryExist = true;
            res.redirect("/admin/categories");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const editCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const categoryData = await Category.findById({ _id: categoryId });

       return  res.render("editCategory", { categoryData, user: req.session.admin,catUpdated:"" });
    } catch (error) {
        console.log(error.message);
    }
};

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryName = req.body.name;
        const categoryDescription = req.body.categoryDescription;
        const newImage = req.file;

        
        const categoryData = await Category.findById(categoryId);
        const categoryImageUrl = categoryData.imageUrl.url;
        
        let result;

        if (newImage) {
            if (categoryImageUrl) {
                await cloudinary.uploader.destroy(categoryData.imageUrl.public_id);
            }
            result = await cloudinary.uploader.upload(newImage.path, {
                folder: "Categories"
            });
        } else {
            result = {
                public_id: categoryData.imageUrl.public_id,
                secure_url: categoryImageUrl
            };
        }

        const catExist = await Category.findOne({ category: categoryName });
        const imageExist = await Category.findOne({ 'imageUrl.url': result.secure_url });

        if (!catExist || !imageExist) {

            await Category.findByIdAndUpdate(
                categoryId,
                {
                    category: categoryName,
                    imageUrl: {
                        public_id: result.public_id,
                        url: result.secure_url
                    },
                    description: categoryDescription,
                },
                { new: true }
            );
            req.session.categoryUpdate = true;
            res.redirect("/admin/categories");
        } else {
            req.session.categoryExist = true;
            res.redirect("/admin/categories");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const unlistCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const unlistCategory = await Category.findById(categoryId);

        await Category.findByIdAndUpdate(categoryId, { $set: { is_blocked: !unlistCategory.is_blocked } }, { new: true });

        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};

const loadSubCategories = async (req, res) => {
    try {
        const subCategoryData = await SubCategory.find();

        if (req.session.subCategoryUpdate) {
            res.render("subCategories", {
                subCategoryData,
                catUpdated: "Sub-Category updated successfully",
                catNoUpdation:"",
                user: req.session.admin,
            });
            req.session.subCategoryUpdate = false;
        } else if (req.session.subCategorySave) {
            res.render("subCategories", {
                subCategoryData,
                catUpdated: "Sub-Category Added successfully",
                catNoUpdation:"",
                user: req.session.admin,
            });
            req.session.subCategorySave = false;
        } else if (req.session.subCategoryExist) {
            res.render("subCategories", {
                subCategoryData,
                catNoUpdation: "Sub-Category Already Exists!!",
                catUpdated: "",
                user: req.session.admin,
            });
            req.session.subCategoryExist = false;
        } else {
            res.render("subCategories", { subCategoryData,catUpdated: "", catNoUpdation:"", user: req.session.admin });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const addSubCategory = async (req, res) => {
    try {
        res.render("addSubCategory", { catUpdated: "",user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};




const addNewSubCategory = async (req, res) => {
    const subCategoryName = req.body.name;
    const subCategoryDescription = req.body.subCategoryDescription;
    const image = req.file;
    const lowerSubCategoryName = subCategoryName.toLowerCase();

    try {

        const result = await cloudinary.uploader.upload(image.path,{
            folder: "SubCategories"
        })

        const subCategoryExist = await SubCategory.findOne({ subCategory: lowerSubCategoryName });
        if (!subCategoryExist) {
            const subCategory = new SubCategory({
                subCategory: lowerSubCategoryName,
                imageUrl: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                description: subCategoryDescription,
            });

            await subCategory.save();
            req.session.subCategorySave = true;
            res.redirect("/admin/subCategories");
        } else {
            req.session.subCategoryExist = true;
            res.redirect("/admin/subCategories");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const editSubCategory = async (req, res) => {
    const SubCategoryId = req.params.id;

    try {
        const SubCategoryData = await SubCategory.findById({ _id: SubCategoryId });

        res.render("editSubCategory", { SubCategoryData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const subCategoryId = req.params.id;
        const subCategoryName = req.body.name;
        const subCategoryDescription = req.body.subCategoryDescription;
        const newImage = req.file;

        const subCategoryData = await SubCategory.findById(subCategoryId);
        const subCategoryImageUrl = subCategoryData.imageUrl.url;

        let result;

        if (newImage) {
            if (subCategoryImageUrl) {
                await cloudinary.uploader.destroy(subCategoryData.imageUrl.public_id);
            }
            result = await cloudinary.uploader.upload(newImage.path, {
                folder: "SubCategories"
            });
        } else {
            result = {
                public_id: subCategoryData.imageUrl.public_id,
                secure_url: subCategoryImageUrl
            };
        }

        const subCatExist = await SubCategory.findOne({ subCategory: subCategoryName });
        const description = await SubCategory.findOne({ description: subCategoryDescription});
        const imageExist = await SubCategory.findOne({ 'imageUrl.url': result.secure_url });

        if (!subCatExist || !imageExist || !description) {
            await SubCategory.findByIdAndUpdate(
                subCategoryId,
                {
                    subCategory: subCategoryName,
                    imageUrl: {
                        public_id: result.public_id,
                        url: result.secure_url
                    },
                    description: subCategoryDescription,
                },
                { new: true }
            );
            req.session.subCategoryUpdate = true;
            res.redirect("/admin/subCategories");
        } else {
            req.session.subCategoryExist = true;
            res.redirect("/admin/subCategories");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const unlistSubCategory = async (req, res) => {
    try {
        const subCategoryId = req.params.id;

        const unlistSubCategory = await SubCategory.findById(subCategoryId);

        await SubCategory.findByIdAndUpdate(
            subCategoryId,
            { $set: { is_blocked: !unlistSubCategory.is_blocked } },
            { new: true }
        );

        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};


////////////////////BANNERS/////////////////////////////


const loadBanners = async (req, res) => {
    try {
        const bannerData = await Banner.find();

        if (req.session.bannerSave) {
           res.render("banners", {
                bannerData,
                bannerSave: "Banner created successfully!",
                user: req.session.admin,
            });
            req.session.bannerSave = false;
        } else if (req.session.bannerExist) {
            res.render("banners", {
                bannerData,
                bannerSave:"",
                bannerExist: "Banner alreddy exitsts!",
                bannerDelete: "",
                user: req.session.admin,
            });
            req.session.bannerExist = false;
        } else if (req.session.bannerUpdate) {
            res.render("banners", {
                bannerData,
                bannerUpdate: "Banner updated successfully!",
                bannerDelete: "",
                bannerSave:"",
                bannerExist:"",
                user: req.session.admin,
            });
            req.session.bannerUpdate = false;
        }else if (req.session.bannerDelete) {
            res.render("banners", {
                bannerData,
                bannerDelete: "Banner deleted successfully!",
                bannerUpdate:"",
                bannerSave:"",
                bannerExist:"",
                user: req.session.admin,
            });
            req.session.bannerDelete = false;
        }
        else {
            res.render("banners", { bannerData, user: req.session.admin,bannerSave:"",bannerExist:"",bannerUpdate:"", bannerDelete: ""});
        }
    } catch (error) {
        console.log(error.message);
    }
};


const addBanner = async (req, res) => {
    try {
        res.render("addBanner", { user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};


const addNewBanner = async (req,res)=>{
    try {

        const { title, label, bannerSubtitle } = req.body
        const image = req.file

        const existing = await Banner.findOne({ title: title })
        if (existing) {
            req.session.bannerExist = true;
            res.redirect("/admin/banners");
        } else {
            const result = await cloudinary.uploader.upload(image.path, {
                folder: "Banners",
            });

            const banner = new Banner({
                title: title,
                subtitle: bannerSubtitle,
                label: label,
                image: {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            });

            await banner.save();
            req.session.bannerSave = true;
            res.redirect("/admin/banners");
        }
        
    } catch (error) {
        console.log(error.messaage);
    }
}

const editBanner = async (req, res) => {
    
    try {

        const bannerId = req.params.id;
        const bannerData = await Banner.findById({ _id: bannerId });

        res.render("editBanner", { bannerData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};


const updateBanner = async (req, res) => {
    try {

        const { title, label, bannerSubtitle } = req.body
        const bannerId = req.params.id;
        const newImage = req.file;

        const banner = await Banner.findById(bannerId);
        const bannerImageUrl = banner.image.url;
        
        let result;
        if (newImage) {
            if(bannerImageUrl){
                await cloudinary.uploader.destroy(banner.image.public_id);
            }
            result = await cloudinary.uploader.upload(newImage.path, {
                folder: "Banners"
            });
        } else {
            result = {
                public_id: banner.imageUrl.public_id,
                secure_url: bannerImageUrl
            };
        }

        const bannerExist = await Banner.findOne({ title: title });
        const imageExist = await Banner.findOne({ 'image.url': result.secure_url });

        if (!bannerExist || !imageExist) {
            await Banner.findByIdAndUpdate(
                bannerId,
                {
                    title: title,
                    subtitle: bannerSubtitle,
                    label: label,
                    image: {
                        public_id: result.public_id,
                        url: result.secure_url
                    },
                },
                { new: true }
            );
            req.session.bannerUpdate = true;
            res.redirect("/admin/banners");
        } else {
            req.session.bannerExist = true;
            res.redirect("/admin/banners");
        }
    } catch (error) {
        console.log(error.message);
    }
};


const bannerStatus = async (req, res) => {
    try {
        const bannerId = req.params.id;

        const unlistBanner = await Banner.findById(bannerId);

        await Banner.findByIdAndUpdate(
            bannerId,
            { $set: { active: !unlistBanner.active } },
            { new: true }
        );

        res.redirect('/admin/banners')
    } catch (error) {
        console.log(error.message);
    }
};






module.exports={
    loadLogin,
    adminLogout,
    verifyLogin,

    loadUsers,
    blockUser,


    loadDashboard,



    loadCategories,
    addCategory,
    addNewCategory,
    editCategory,
    updateCategory,
    unlistCategory,

    loadSubCategories,
    addSubCategory,
    addNewSubCategory,
    editSubCategory,
    updateSubCategory,
    unlistSubCategory,


    loadBanners,
    addBanner,
    addNewBanner,
    editBanner,
    updateBanner,
    bannerStatus,
    





}