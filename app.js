var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Hotel           = require("./models/hotels.js"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");

// requiring routes
var commentRoutes       = require("./routes/comments"),
    hotelRoutes    = require("./routes/hotels"),
    authRoutes          = require("./routes/index");


// connect to db
mongoose.connect("mongodb://localhost:27017/ashray", {
	useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});





app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "It can't be if it ain't!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(authRoutes);
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);


app.listen(3000, function(){
    console.log("Server has started!");
});