var mongoose = require('mongoose');
var schema = mongoose.Schema;

var objectId = mongoose.Schema.Types.ObjectId;

var wishList = new schema({

	title: {type: String, default: "Cool Wish list"},
	products : [{type: objectId, ref:'Product'}]
});

module.exports = mongoose.model('WishList', wishList);