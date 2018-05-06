var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/wishlist', function(request,response){
	var wishlist = new WishList();
	wishlist.title = request.body.title;
	wishlist.save(function(err, savedWishList){

		if(err){
			response.status(500).send({error: "Could not add wishlist"});
		}
		else{
			response.send(savedWishList);
		}
	});

});


app.get('/wishlist', function(request, response){

	WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishList){
		if(err){
			response.status(500).send({error:"Could not populate the products"});
		}
		else{
			response.status(200).send(wishList);
		}
	})
});

app.put('/wishlist/product/add', function(request,response){
	Product.findOne({_id:request.body.productId}, function(err, product){
		if(err){
			response.status(500).send({error:"Could not find the product"});
		}
		else{
			WishList.update({_id:request.body.wishlistId}, {$addToSet:
				{products: product._id}}, function(err, wishList){

					if(err){
							response.status(500).send({error:"Could not find the product in wishList"});
	
					}
					else{
						response.send(wishList);
					}
				});
		}
	})
})

app.post('/product', function(request, response){
	var product = new Product();
	product.title = request.body.title;
	product.price = request.body.price;


	product.save(function(err,savedProduct){
		if(err){
			response.status(500).send({error:"could not save the product"});
		}
		else{
			response.status(200).send(savedProduct);
		}
	})
})

app.get('/product', function(request, response){
	Product.find({}, function(err, products){
		if(err){
			response.status(500).send({error: "Could not fetch products"});

		}
		else{
			response.send(products);
		}
	});
})

app.listen(3000, function(){
	console.log("Swag shop API running on port 3000...");
})