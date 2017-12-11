var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon",
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	displayStock();
});

function displayStock() {
	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;
		console.log("CURRENT INVENTORY" +
			"\n===========================================================================================================")
		for (var i = 0; i < res.length; i++)  {
		console.log(
			" Item ID: " + res[i].item_id + " | " +
			" Product Name: " + res[i].product_name + " | " +
			" Department: " + res[i].department_name + " | " +
			" Price: " + res[i].price + " | " +
			" Stock: " + res[i].stock_quantity );
	}
		console.log("==========================================================================================================")
		pickPurchase();
	});
}

function pickPurchase(){
	inquirer.prompt([
  {
    name: "productId",
    type: "input",
    message: "What product ID would you like to purchase?"
  },
  {
  	name: "quantity",
  	type: "input",
  	message: "How many would you like to purchase?"
  }
]).then(function(answers) {
		var parsedNum = parseInt(answers.productId)
		var parsedQuan = parseInt(answers.quantity)
	      connection.query("SELECT * FROM products WHERE item_id=?", [answers.productId], function(err, res) {
	      	if (answers.quantity <= res[0].stock_quantity){
	      		var remStock = parseInt(res[0].stock_quantity - answers.quantity)
	      		console.log("Purchasing " + answers.quantity + " of " + res[0].product_name + " for " + (answers.quantity * res[0].price + " dollars"));
	      		connection.query("UPDATE products SET stock_quantity = " + remStock + " WHERE item_id=" + parsedNum + ";" );
	      	}
	      	else if (answers.quantity > res[0].stock_quantity) {
	      		console.log("Sorry, we don't have enough " + res[0].product_name + " to fill that order! Please check inventory quantity and try again.")
	      		pickPurchase();
	      	}
      });
});
}