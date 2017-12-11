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
		managerOptions();
	});
}

function managerOptions(){
	inquirer.prompt([
	{
		name: "mgrchoice",
        type: "list",
        message: "Please choose an option below to manage your store:",
        choices: ["View Current Inventory", "View Low Inventory", "Add New Product", "Modify Current Inventory"]
	}
	]).then(function(answers){
		switch (answers.mgrchoice){
			case "View Current Inventory":
			displayStock();
			break;

			case "View Low Inventory":
			lowInventory();
			break;

			case "Add New Product":
			addNewProd();
			break;

			case "Modify Current Inventory":
			modInventory();
			break;
		}
		});
};

function lowInventory(){
	 connection.query("SELECT * FROM products ORDER BY stock_quantity;", function(err, res){
	 	if (err) throw err;
			console.log("ITEMS WITH LOWEST INVENTORY" +
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
			managerOptions();
	 });
};

function addNewProd(){
	    inquirer.prompt([
        {
            name: "Name",
            type: "input",
            message: "What is the name of the item you wish to add?"
        },
        {
        	name: "Department",
        	type: "input",
        	message: "What department will this product be in?"
        },
        {
            name: "Price",
            type: "input",
            message: "How much would you like this to cost?"
        },
        {
            name: "Quantity",
            type: "input",
            message: "How many would you like to add to your inventory?"
        },
    ]).then(function(answers){
    	var name = answers.Name;
    	var department = answers.Department;
    	var price = answers.Price;
    	var quantity = answers.Quantity;
    	connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES("' + name + '","' + department + '",' + price + ',' + quantity +  ')');
    	displayStock();
    });
};

function modInventory(){
	 inquirer.prompt([
        {
            name: "modId",
            type: "input",
            message: "What is the item number of the item you wish to modify?"
        },
        {
        	name: "modNum",
        	type: "input",
        	message: "What would you like to total inventory level to be for this item?"
        }
    ]).then(function(answers){
    	connection.query("UPDATE products SET stock_quantity = " + answers.modNum + " WHERE item_id=" + answers.modId + ";" );
    	displayStock();
    });
}
