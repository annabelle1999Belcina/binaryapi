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
//saves images to database
ImageRouter.route("/uploadmulter")
.post(upload.single('image'), (req, res, next) => {
    console.log(req.file);
    console.log(req.file.filename);
    if(!req.files){
        var file = fs.readFileSync(req.file.path);
        console.log(file)
        // var encode_image = file.toString('base64');
    }
    let url = 'http://localhost:4000/'+req.file.filename;

    const newPost = new post({
        foodName: req.body.foodName,
        description:req.body.description,
        image:url,
        ingredients:req.body.ingredients,
        procedure:req.body.procedure,
    });
    newPost.save(
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
    .sort({created_at: 'desc'});
});




module.exports = ImageRouter