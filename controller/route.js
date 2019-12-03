const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
let user = require('../models/User');
let post = require('../models/PostSchema');




// Login Router
routes.route('/user/login').post(function (req, res) {
	user.findOne({ user_name: req.body.user_name })
		.then(user => {
			console.log("User from login", user)
			if (!user) res.sendStatus(204);
			else {
				bcrypt.compare(req.body.password, user.password)
					.then(passwordMatch => passwordMatch ? res.sendStatus(200) : res.sendStatus(204))
			}
		})
});

// Username validation Router
routes.route('/validateUsername').post(function (req, res) {
	Registration.findOne({ user_name: req.body.user_name })
		.then(user => user ? res.sendStatus(204) : res.sendStatus(200))
});

// 
routes.route('/getUser').get(function (req, res) {
	Registration.findOne(req.body.user_name, (err, user) => {
		if (err) { res.send(err) }
		else { res.send(user) };
	})
});

// Get allData
routes.route('/allData').get(function (req, res) {
	Registration.find()
		.then(users => res.json(users))
		.catch(err => res.status(400).json('Error: ' + err));
});

routes.route('/addPost').post(function (req, res) {
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

// 
routes.route('/getPosts').get(function (req, res) {
	Posts.find()
		.then(posts => res.send(posts))
		.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = routes;