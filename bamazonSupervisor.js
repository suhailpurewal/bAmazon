var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
		 connection.query("SELECT * FROM departments ORDER BY total_profit;", function(err, res){
		if (err) throw err;
			var salesTable = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
            colWidths: [10, 25, 20, 10, 15]
        });
		console.log("===========================================================================================================")
		for (var i = 0; i < res.length; i++)  {
        	salesTable.push(
               [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]
            );
	}
		console.log(salesTable.toString());
		console.log("==========================================================================================================")
		supOptions();
	});
}

function newDept(){
	inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the name of the Department that you want to add?"
        },
        {
        	name: "overhead",
        	type: "input",
        	message: "What is the overhead cost of this new Department?"
        },
        {
            name: "sales",
            type: "input",
            message: "What are the current Sales of this Department?"
        },
        {
            name: "profit",
            type: "input",
            message: "What is the current profit for this Department?"
        },
    ]).then(function(answers){
    	var department = answers.department;
    	var overhead = answers.overhead;
    	var sales = answers.sales;
    	var profit = answers.profit;
    	connection.query('INSERT INTO departments (department_name,over_head_costs,product_sales,total_profit) VALUES("' + department + '","' + overhead + '",' + sales + ',' + profit +  ')');
    	deptSales();
    });
}