const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./controller/connectDb");
// const login = require("./controller/login");
// const insert = require("./controller/insert");
// const verify = require("./controller/verify");
const user = require("./models/User");
const imgRoutes = require('./controller/images')
const multer = require('multer')
// const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); //to create token(encrypted string) for authentication
const Posts = require("./models/PostSchema");
// const fs = require('fs');
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

app.get("/posts/retrieve", (req, res) => {
  Posts.find({}, (err, data) => {
    if (err) {
      return res.status(404).send("Error while getting list of services!");
    }
    return res.send(data);
  });
});
app.get("/posts/retrieve:_id", (req, res) => {
  Posts.findOne({ _id: req.params._id })
    .then(user => {
      res.send(user)
    })
    .catch(error => {
      res.send(error)
    })
});
app.put("/user/update/:_id", (req, res) => {
  console.log(req.body);
  user.findByIdAndUpdate(
    req.params._id,//from database
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

app.delete("/post/:id", (request, response) => {
  Posts.findByIdAndDelete(request.params.id)
    .then(() => {
      console.log(`${request.params.id} has been deleted`);
      response.json({ message: `${request.params.id} has been deleted` });
    })
    .catch(error => {
      console.log("Error: ", error);
      response.status(400).json({ message: error });
    });
});

app.put('/addComment/:_id',(req, res) =>{
	Posts.findByIdAndUpdate(req.params._id,
		{ $push: { comments: req.body } },
		{ safe: true, upsert: true },
		// console.log(req.body.comment),
		function (err, comments) {
			if (err) {
				console.log(err);
			} else {
				res.send(comments)
				console.log(req.body)
			}
		})
})

// app.post("/addPost",(req, res)=> {
// 	let post = new Posts(req.body);

// 	post.save()
// 		.then(post => {
// 			res.sendStatus(200);
// 			console.log(post)
// 		})
// 		.catch(err => {
// 			res.status(400).send("Failed to add post");
// 		})
// })
