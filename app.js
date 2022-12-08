//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
const port = "8080";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connect to your database
mongoose.connect("mongodb+srv://admin-amir:test123@cluster0.gm3nfjf.mongodb.net/blogWebsiteDB");

const postsSchema = {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
};

const Post = mongoose.model("Post", postsSchema);

//Change content of home, about and contact pages from here
const defaultPosts = [
  new Post({title: "home", content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."}),
  new Post({title: "about", content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."}),
  new Post({title: "contact", content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."})
];

// Post.insertMany(defaultPosts, function (err) {
//   if (!err) {
//     console.log("Inserted content of home, about and contact pages.");
//   }
// });


app.get("/", async (req, res) => {
  const posts = await Post.find({title: { $nin: ["about", "contact"]}});
  res.render("home", {
    homeParagraph: posts.find(p => p.title==="home").content,
    posts: posts.filter(p=>p.title!=="home")
   });

});

app.get("/contact", function (req, res) {
  Post.findOne({title: "contact"}, (err, thepost) => {
    if (!err) {
      res.render("contact", {contactContent: thepost.content});

    }
  });
});

app.get("/about", function (req, res) {
  Post.findOne({title: "about"}, (err, thepost) => {
    if (!err) {
      res.render("about", {aboutContent: thepost.content});
  
    }
  });
});

app.get("/compose", function (req, res) {
  res.render("compose", {});

});

app.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;

  //compare requested and restored IDs
  const post = await Post.find({_id: postId});
  if (post) {
    res.render("post", {postTitle: post[0].title, postContent: post[0].content});

  } else {
    res.redirect("not-found", {});
  };
});


app.post("/compose", function (req, res) {
  const newPost = new Post({ 
    title: req.body.postTitle,
    content: req.body.postBody
  });
  newPost.save((err) => {
    if (!err) {
      console.log(`Successfully posted..! Title: ${req.body.postTitle}`);
      res.redirect("/");
    }
  });
});


app.listen(port, function() {
  console.log(`Server successfully started on port ${port}...`);
});
