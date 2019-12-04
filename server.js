const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./controller/connectDb");
const login = require("./controller/login");
const insert = require("./controller/insert");
const verify = require("./controller/verify");
const user = require("./models/User");
const imgRoutes = require('./controller/images')
const multer = require('multer')
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); //to create token(encrypted string) for authentication
const Post = require("./models/PostSchema");

const PORT = process.env.PORT || 4000;
//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use('/uploads', imgRoutes);
app.use(express.static('./images'));

// Database

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running in PORT..," + PORT);
});

app.get("/", (req, res) => {
  console.log("hello world!");
  res.send("API");
});
app.post("/login", (req, res) => {
  user.findOne({ userName: req.body.userName })
    .then(user => {
      console.log("User from login", user)
      // if (!user) res.sendStatus(204);
      if (user) {
        var match = bcrypt.compare(req.body.password, user.password)
        if (match) {
          var acc_token = jwt.sign({ user }, "token1234", { expiresIn: "12h" })
          res.send({
            status: true,
            auth: true,
            user: user,
            token: acc_token
          })
          res.sendStatus(200)
        }
        else {
          res.sendStatus(204)
        }
        // .then(passwordMatch => passwordMatch ? res.sendStatus(200) : res.sendStatus(204))
      }
      else {
        res.sendStatus(204);
      }
    })
});


app.get("/getUser/:userName", (req, res) => {
  user.findOne({ userName: req.params.userName })
    .then(user => {
      res.send(user)
    })
    .catch(error => {
      res.send(error)
    })
});

app.get("/user/retrieve", (req, res) => {
  user.find({}, (err, data) => {
    if (err) {
      return res.status(404).send("Error while getting list of services!");
    }
    return res.send({ data });
  });
});



app.post("/user/create", (req, res) => {
  let register = new user(req.body);
  register.save()
    .then(register => {
      res.sendStatus(200);
      console.log(register);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Failed to store to database");
    });
});
// Username validation Router
app.post("/user/validate", (req, res) => {
  user.findOne({ userName: req.body.userName })
    .then(user => user ? res.sendStatus(204) : res.sendStatus(200))
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

app.post('/user/post', upload.single('photo'), (req, res, next) => {
  console.log('hello')
})

app.post("/user/update/:id", (req, res) => {
  console.log(req.body);
  user.findByIdAndUpdate(
    req.params.id,//from database
    req.body,//from the front end
    { new: true },
    (err, data) => {
      if (err) return res.status(404).send({ error: err.message });
      return res.send({ message: "Service is successfully updated", data });
    }
  );
});

app.delete("/user/delete/:id", (request, response) => {
  user.findByIdAndDelete(request.params.id)
    .then(() => {
      console.log(`${request.params.id} has been deleted`);
      response.json({ message: `${request.params.id} has been deleted` });
    })
    .catch(error => {
      console.log("Error: ", error);
      response.status(400).json({ message: error });
    });
});


app.post("/addPost",(req, res)=> {
	let post = new Posts(req.body);

	post.save()
		.then(post => {
			res.sendStatus(200);
			console.log(post)
		})
		.catch(err => {
			res.status(400).send("Failed to add post");
		})
})
