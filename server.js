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
<<<<<<< HEAD
const path = require('path');
const bcrypt = require('bcryptjs');
=======

const UserSession = require('./models/UserSession');
>>>>>>> 24065a0746cf7d3a1f3ef5997ea15d6a91f18689

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
<<<<<<< HEAD
// app.post("/login", (req, res) => {
//     console.log(req.body);
//     login.login(req.body, res);
// });
=======
app.post("/login", (req, res) => {
  console.log(req.body);
  login.login(req.body, res);
});
>>>>>>> 24065a0746cf7d3a1f3ef5997ea15d6a91f18689
app.get("/verify/:token", (req, res) => {
  verify.verify(req.params.token, res);
});

app.post("/insert", (req, res) => {
  insert.insert(req.body, res);
});

app.get("/user/retrieve", (req, res) => {
  user.find({}, (err, data) => {
    if (err) {
      return res.status(404).send("Error while getting list of services!");
    }
    return res.send({ data });
  });
});

// app.post("/user/create", (req, res) => {
//   console.log("test");
//   try {
//     const data = new user(req.body);
//     data.save((err, dbres) => {
//       if (err) return res.status(404).send({ message: err.message });
//       console.log(dbres);
//       return res.send({ info: dbres, status: true });
//     });
//   } catch (err) {
//     res.send({ message: err.message });
//   }
// });


/*
 * Sign up
 */
app.post('/user/signup', (req, res, next) => {
  const { body } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  user.find({
    email: email
  }, (err, previousUsers) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    } else if (previousUsers.length > 0) {
      return res.send({
        success: false,
        message: 'Error: Account already exist.'
      });
    }
    // Save the new user
    try {
      const data = new user(req.body);
      data.save((err, dbres) => {
        if (err) return res.status(404).send({ message: err.message });
        console.log(dbres);
        return res.send({ info: dbres, status: true });
      });
    } catch (err) {
      res.send({ message: err.message });
    }
  });
})

<<<<<<< HEAD
  app.post("/login", (req, res)=> {
    console.log('login test')
    user.findOne({ userName: req.body.userName })
      .then(user => {
        console.log("User from login", user)
        if (!user) res.sendStatus(204);
        else {
          bcrypt.compare(req.body.password, user.password)
            .then(passwordMatch => passwordMatch ? res.sendStatus(200) : res.sendStatus(204))
        }
      })
  });
  app.get("/getUser" ,(req, res) => {
    console.log("getuser test")
    user.findOne(req.body.userName, (err, user) => {
      if (err) { res.send(err) }
      else { res.send(user) };
    })
  });

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
=======
app.post('/user/login', (req, res, next) => {
  console.log("login test")
  const { body } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  user.find({
    email: email
  }, (err, users) => {
    if (err) {
      console.log('err 2:', err);
      return res.send({
        success: false,
        message: 'Error: server error'
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
>>>>>>> 24065a0746cf7d3a1f3ef5997ea15d6a91f18689
    }
    // const user = users[0];
    // if (!user.validPassword(password)) {
    //   return res.send({
    //     success: false,
    //     message: 'Error: Invalid'
    //   });
    // }
    // Otherwise correct user
    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      return res.send({
        success: true,
        message: 'Valid sign in',
        token: doc._id
      });
    });
  });
});
app.get('/user/verify', (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (sessions.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    } else {
      // DO ACTION
      return res.send({
        success: true,
        message: 'Good'
      });
    }
  });
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


