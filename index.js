import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
var postTitle = "";
var postSummary = "";
var postContent = "";
var postId = 1;
var allPosts = [];
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

function getPostData(req, res, next) {
    postTitle = req.body.title;
    postSummary = req.body.summary;
    postContent = req.body.content;
    next();
}

app.use(getPostData);

app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.get('/contact', (req, res) => {
    res.render("contact.ejs");
})

app.get('/create', (req, res) => {
    res.render("create.ejs");
})

app.get('/posts', (req, res) => {
    res.render("posts.ejs", {allBlogPosts: allPosts});
})

app.get('/about', (req, res) => {
    res.render("about.ejs");
})

app.post('/delete', (req, res) => {
    allPosts.splice(req.body.id, 1);
    res.redirect('/posts');
})

app.post('/view', (req, res) => {
    var curPost = req.body.postID;

    var curPostData = {
        curID: curPost,
        curTitle: allPosts[curPost]['title'],
        curSummary: allPosts[curPost]['summary'],
        curContent: allPosts[curPost]['content'],
    };
    res.render('view.ejs', curPostData);
})

app.post('/submit', (req, res) => {
    var data = {
        id: postId,
        title: postTitle,
        summary: postSummary,
        content: postContent,
    };
    allPosts.push(data);
    postId++;
    var finalData = {
        allBlogPosts: allPosts,
    };
    res.render("submit.ejs", finalData);
})

app.post('/submit-update', (req, res) => {
    

    allPosts[req.body.id].title = req.body.title;
    allPosts[req.body.id].summary = req.body.summary;
    allPosts[req.body.id].content = req.body.content;

    res.render("submit-update.ejs");
})

app.post('/update', (req, res) => {
    var updateData = {
        id: req.body.id,
        title: postTitle,
        summary: postSummary,
        content: postContent,
    };
    res.render('update.ejs', updateData);
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})