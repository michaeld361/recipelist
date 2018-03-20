// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 7000; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://michaeld:admin123@ds163918.mlab.com:63918/recipelist'); // connect to our database

var Recipe     = require('./app/models/recipe');
var List     = require('./app/models/lists');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Lets make some food!');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


// on routes that end in /recipes/:recipe_id
// ----------------------------------------------------


router.route('/recipe')

    // create a recipe (accessed at POST http://localhost:8080/recipes)
    .post(function(req, res) {
        
        var recipe = new Recipe();      // create a new instance of the Recipe model
        recipe.name = req.body.name;  // set the recipes name (comes from the request)
        recipe.lists.push(req.body.lists);
        
        recipe.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'recipe created!' });
        });

        
    })

    // get all the recipes (accessed at GET http://localhost:8080/api/recipes)
    .get(function(req, res) {
        Recipe.find(function(err, recipe) {
            if (err)
                res.send(err);

            res.json(recipe);
        });
    });



router.route('/recipe/:recipe_id/:key')

    // get the recipe with that id
    .get(function(req, res) {
        Recipe.findById(req.params.recipe_id, function(err, recipe) {
            if (err)
                res.send(err);

            if(recipe[req.params.key]){
                res.json(recipe[req.params.key]);
            }else{
                res.json({"message":"KEY DOES NOT EXIST"});
            }
            
        });
    })

    // update the recipe with this id
    .post(function(req, res) {
        Recipe.findById(req.params.recipe_id, function(err, recipe) {

            if (err)
                res.send(err);

            //list[req.params.key] = "test";
            console.log(req.body.lists);
            recipe.lists.push(req.body.lists);
            recipe.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'List updated!' });
            });
        });
    })

    // delete the recipe with this id
    .delete(function(req, res) {
        Recipe.remove({
            _id: req.params.recipe_id
        }, function(err, recipe) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
