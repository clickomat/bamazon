//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
})

function start(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department", "End Session"]
  }]).then(function(ans){
    switch(ans.doThing){
      case "View Product Sales by Department": viewProductByDept();
      break;
      case "Create New Department": createNewDept();
      break;
      case "End Session": console.log('Bye!');
    }
  });
}

//view product sales by department
function viewProductByDept(){
  //prints the items for sale and their details
  connection.query('SELECT * FROM departments', function(err, res){
    if(err) throw err;
    console.log('------Product Sales by Department------');
    console.log('----------------------------------------------------------------------------------------------------')

    for(var i = 0; i<res.length;i++){
      console.log("department_ID: " + res[i].department_ID + " | " + "department_name: " + res[i].department_name + " | " + "Over Head Cost: " + (res[i].over_head_costs).toFixed(2) + " | " + "product sales: " + (res[i].total_sales).toFixed(2) + " | " + "total profit: " + (res[i].total_sales - res[i].over_head_costs).toFixed(2));
      console.log('--------------------------------------------------------------------------------------------------')
    }
    start();
  })
}

  //create a new department
  function createNewDept(){
    console.log('------Creating New Department------');
    //prompts to add deptName and numbers. if no value is then by default = 0
    inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: "Department Name: "
    }, {
      type: "input",
      name: "over_head_cost",
      message: "Over Head Cost: ",
      default: 0,
      validate: function(val){
				// isNaN means not a number. to make sure that the val is a number
        if(isNaN(val) === false){return true;}
        else{return false;}
      }
    }, {
      type: "input",
      name: "prodSales",
      message: "Product Sales: ",
      default: 0,
      validate: function(val){
        if(isNaN(val) === false){return true;}
        else{return false;}
      }
    }
    ]).then(function(ans){
      connection.query('INSERT INTO departments SET ?',{
        department_name: ans.deptName,
        over_head_costs: ans.over_head_cost,
        total__sales: ans.prodSales
      }, function(err, res){
        if(err) throw err;
        console.log('Another department was added.');
      })
      start();
    });
  }

start();