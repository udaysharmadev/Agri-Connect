var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require("./users");
const postModel = require("./posts");
const upload = require("./multer");

const localstrategy = require("passport-local");

passport.use(new localstrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/feed',async function (req, res, next) {
  const posts = await postModel.find().populate("user");
  res.render('feed' , { footer: true, posts });
});

router.get('/product', function (req, res, next) {
  res.render('product');
});

router.post('/upload',isLoggedIn, upload.single("file"), async function (req, res, next) {
  if(!req.file) {
    return res.status(404).send('No Files Were Uploaded.');
  }
  const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/account");
});

router.get('/account', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  res.render("account", {user});
});

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('home');
});

router.get('/service', isLoggedIn, function (req, res, next) {
  res.render('service');
});

router.get('/news', isLoggedIn, function (req, res, next) {
  res.render('news');
});

router.get('/media', isLoggedIn, function (req, res, next) {
  res.render('media');
});

router.get('/contact', isLoggedIn, function (req, res, next) {
  res.render('contact');
});






router.post('/register', function (req, res, next) {
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret,
    email: req.body.email,
    fullName: req.body.fullName,
    userType: req.body.userType

  });

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      })
    })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res) {
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

router.get('/alluserposts', async function (req, res, next) {
  let user = await userModel
    .findOne({
      _id: "65dc733a493e765eb7791fcf"
    })
    .populate('posts')
  res.send(user);
});

// router.get('/createuser', async function (req, res, next) {
//   let createduser = await userModel.create({
//     username: "akriti",
//     password: "uday",
//     posts: [],
//     email: "adaysharmaaaaa@gmail.com",
//     fullName: "akriti sharma",
//   })
//   res.send(createduser);
// });

// router.get('/createpost', async function (req, res, next) {
//   let createdpost = await postModel.create({
//     postText: "kaise ho guys",
//     user: "65dc733a493e765eb7791fcf"
//   });
//   let user = await userModel.findOne({ _id: "65dc733a493e765eb7791fcf" });
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("done");
// });

module.exports = router;
