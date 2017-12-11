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
	supOptions();
});

function supOptions(){
	inquirer.prompt([
	{
		name: "supChoice",
        type: "list",
        message: "Please choose an option below to supervise your store:",
        choices: ["View Product Sales by Department", "Create New Department"]
	}
	]).then(function(answers){
		switch (answers.supChoice){
			case "View Product Sales by Department":
			deptSales();
			break;

			case "Create New Department":
			newDept();
			break;
		}
		});
};

function deptSales(){
	console.log("view dept sales")
}

function newDept(){
	console.log("new department")
}