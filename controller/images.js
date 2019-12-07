var express = require('express');
var post = require('../models/PostSchema');
var ImageRouter = express.Router();
// const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './images/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    // limits: {   
    //     fieldSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter
});

ImageRouter.route("/uploadmulter")
.post(upload.single('image'), (req, res, next) => {
    // console.log(req.file.filename);
    // const newImage = new Image({})
    if(!req.files){
        var file = fs.readFileSync(req.file.path);
        // var encode_image = file.toString('base64');
    }
    let url = 'http://localhost:4000/'+req.file.filename;

    const newImage = new post({
        user:req.body.user,
        foodName: req.body.foodName,
        description:req.body.description,
        image:url,
        imageData : req.file.path,
        ingredients:req.body.ingredients,
        procedure:req.body.procedure,
        postDate:new Date()
    });
    newImage.save()
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            success: true,
            document: result
        });
    })
    .catch((err) => next(err));
});


ImageRouter.get('/post', function(req, res) {
    post.find({},
        (err,data) => {
            if(err){
                console.log(err);
                res.send(err)
            }
            else{
                console.log(data);
                res.send(data)
            }
        }
        )
    .sort({postDate: 'desc'});
});

module.exports = ImageRouter