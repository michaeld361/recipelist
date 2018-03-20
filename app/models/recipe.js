var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RecipeSchema   = new Schema({
	name: String,
    lists: []
});

module.exports = mongoose.model('Recipe', RecipeSchema);