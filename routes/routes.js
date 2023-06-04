const express = require('express');
const router = express.Router();
const User =require('../models/users');
const multer = require('multer');
// const session = require('express-session')
const fs = require('fs');

// image storage
var storage = multer.diskStorage({
    destination:function (req,file,callBack){
        callBack(null,'./uploads');
    },
    filename: function(req,file,callBack){
        callBack(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
        // callBack(null,file.fieldname+"a"+file.originalname);
    }
})
// middleware
var upload = multer({
    storage:storage
}).single('image');

// insert a user into database
router.post('/add',upload,(req,res)=>{
    try {
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            image:req.file.filename
        })
        user.save();
        req.session.message={
            type:"success",
            message:"User added successfully"
        }
        res.redirect('/');
        
    } catch (error) {
        res.json({message:error.message,type:'danger'});
        console.log(error);
        
    }
//     const user = new User({
//     name:req.body.name,
//     email:req.body.email,
//     phone:req.body.phone,
//     image:req.file.filename
// })
//     user.save((err)=>{
//         if(err){
//             res.json({message:err.message,type:'danger'});
//         }else{
//             req.session.message={
//                 type:"success",
//                 message:"User added successfully",
//             }
//             res.redirect('/');
//         }
//     });
});


// Get all users
router.get('/', async(req,res)=>{
    try {
        const result = await User.find();
        // console.log(result);
        res.render('index',{users:result,title:"Home Page"});
    } catch (error) {
        res.json({message:err.message});
    }

})
// router.get('/',async(req,res)=>{
//     // res.send("Home Page");
//         // User.find().exec((err,users)=>{
//         // if(err){
//         //     res.json({message:err.message});
//         // }else{
//         //     res.render('index',{
//         //         title:"Home Page",
//         //         users:users
//         //     })
//         // }

//     });
//     res.render('index',{title:"Home Page"});
// })
router.get('/add',(req,res)=>{
    // res.send("Home Page");
    res.render('add_user',{title:"Add Users"});
})

// edit a user route
router.get('/edit/:id',async(req,res)=>{
    //  console.log(req.params.id);
// this method is not working 
    //  let id = req.params.id;
    //  User.findById(id,(err,user)=>{
    //     if(err){
    //         res.redirect('/');
    //     }else{
    //         if(user == null ){
    //             res.redirect('/');
    //         }else{
    //             res.render('/edit_users',{
    //                 title:"Edit User",
    //                 user:user
    //             })
    //         }

    //     }
    //  })

// this is ok 
     try {
        
        const result = await User.findById(req.params.id);
        // console.log(result);
        res.render('edit_users',{user:result,title:"Edit User"});
    } catch (error) {
        console.log(error);
        
    }
});

// update the user
router.post('/update/:id', upload, async(req,res)=>{
    try {
        let id =req.params.id;
        let new_image='';
        if(req.file){
            new_image = req.file.filename;
            try{
                fs.unlinkSync('./uploads/'+req.body.old_image);
            }catch (error){
                console.log(error)
            }
        }else{
            new_image=req.body.old_image;
        }
        console.log(new_image);
        
        await User.findByIdAndUpdate(id,{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            image:new_image
        });
        req.session.message={
            type:"success",
            message:`User ${req.body.name} is updated successfully `
        }
        // console.log(result);
    } catch (error) {
        res.json({message:error.message, type:'danger'});
    }
    res.redirect('/');

});

// Deleter user route
router.get('/delete/:id',async(req,res)=>{
    try {
        let id =req.params.id;
        const result = await User.findByIdAndRemove(id);
        if(result.image !=''){

            try {
                fs.unlinkSync('./uploads/'+result.image);

                
            } catch (error) {
                console.log(error);                
            }
        }
        req.session.message={
            type:"success",
            message:`User deleted successfully `
        }
        // console.log(result);
    } catch (error) {
        res.json({message:error.message, type:'danger'});
    }
    res.redirect('/');

})

module.exports=router;