import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
var postTitle = "";
var postSummary = "";
var postContent = "";
var allPosts = {};
var allPostsCount = {};
var signedIn = false;
var accounts = {};
var loginErrorMessage = "";
var uname = "";
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

function getPostData(req, res, next) {
    postTitle = req.body.title;
    postSummary = req.body.summary;
    postContent = req.body.content;
    next();
}

app.use(getPostData);

app.use((req, res, next) => {
    res.locals.signedIn = signedIn;
    next();
});

app.get('/', (req, res) => {
    res.render("index.ejs", {
        username: uname
    });
})

app.get('/create', (req, res) => {
    if (!signedIn)
        res.redirect("/signin");
    else
        res.render("create.ejs");
})

app.get('/posts', (req, res) => {
    if (!signedIn)
        res.redirect("/signin");
    else
        res.render("posts.ejs", {
            allBlogPosts: allPosts[uname]
        });
})


app.get("/signin", (req, res) => {
    res.render("signin.ejs");
})

app.get("/createacc", (req, res) => {
    res.render("createacc.ejs");
})

app.post('/delete', (req, res) => {
    allPosts[uname].splice(req.body.id, 1);
    res.redirect('/posts');
})

app.post('/view', (req, res) => {
    var curPost = req.body.postID;

    var curPostData = {
        curID: curPost,
        curTitle: allPosts[uname][curPost]['title'],
        curSummary: allPosts[uname][curPost]['summary'],
        curContent: allPosts[uname][curPost]['content'],
    };
    res.render('view.ejs', curPostData);
})

app.post('/submit', (req, res) => {


    var data = {
        id: allPostsCount.uname,
        title: postTitle,
        summary: postSummary,
        content: postContent,
    };
    allPosts[uname].push(data);
    allPostsCount.uname++;
    var finalData = {
        allBlogPosts: allPosts[uname],
    };
    res.render("submit.ejs", finalData);
})

app.post('/submit-update', (req, res) => {


    allPosts[uname][req.body.id].title = req.body.title;
    allPosts[uname][req.body.id].summary = req.body.summary;
    allPosts[uname][req.body.id].content = req.body.content;

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

app.post('/createacc', (req, res) => {
    uname = req.body.username;
    var pwd = req.body.password;
    if (uname in accounts) {
        loginErrorMessage = "username already exists";
        res.render('createacc.ejs', {
            errorMsg: loginErrorMessage
        });
    } else {
        signedIn = true;
        accounts[uname] = pwd;
        allPosts[uname] = [];
        allPostsCount[uname] = 1;
        
        res.redirect("/");
    }

})

app.post('/signin', (req, res) => {
    uname = req.body.username;
    var pwd = req.body.password;
    if (!(uname in accounts) || (accounts[uname] !== pwd)) {
        loginErrorMessage = "Incorrect username or password";
        res.render('signin.ejs', {
            errorMsg: loginErrorMessage
        });
    } else {
        signedIn = true;
        res.redirect("/");
    }
})

app.post('/', (req, res) => {
    signedIn = false;
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})