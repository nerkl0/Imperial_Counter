// A JavaScript program that loads JSON data and returns the top-spending customer
/* To run:
        In terminal: node app.js
    Requires node.js
*/

const customer_data = require('./data/database.json');
const transaction_data = require('./data/transactions.json');

function main() {
    if(Object.keys(customer_data).length == 0 || Object.keys(transaction_data).length == 0)
        console.log('Warning: One or more files has no data');
    
    const tx = calculate_transactions(transaction_data);
    const { ids, largest } = get_highest_spenders(tx);

    print_results(ids, largest);
}


// amalgamates all customer transanctions with the same email address, returning the total
function calculate_transactions(sales_data) {
    let cust_transactions = {};

    sales_data.forEach(sale => { 
        // map customer ids to their spending across all transactions, if no email address found cust_id stays as email address
        const cust_id_check = get_cust_id(sale.customer.email);
        let cust_id = cust_id_check ? Number(cust_id_check) : sale.customer.email;

        const product_total = sale.products.reduce((sum, p) => {
            return sum + (p.quantity * p.unit_price)
        }, 0)

        // check if customer is already in system. If yes, add to total, else add new entry
        if (cust_transactions[cust_id]) {
            cust_transactions[cust_id] += product_total;
        } else {
            cust_transactions[cust_id] = product_total;
        }
    });

    return cust_transactions
}

// grabs customer id from customer database, returns undefined if email address does not correlate with databsse
function get_cust_id(email) {
    const check_database = customer_data.find(customer => customer.email === email);
    
    if(check_database)
        return Number(check_database.customer_id);
    else {
        console.log(`"${email}" not found in customer database`);
        return undefined;
    }
}

// returns all customer ids with highest spend / equal highest spend
function get_highest_spenders(total_sales) {
    let ids = [];
    let largest = 0;
    
    for(const [key, value] of Object.entries(total_sales)){
        if (value === largest) { 
            ids.push(key);
        } else if (value > largest) {
            ids = [key];
            largest = value;
        }
    }
    return { ids, largest } 
}

function print_results(ids, largest) {
    console.log("===========");
    for(const i of ids) {
        // prints email address if customer id not found in database, otherwise will print customer details
        if(isNaN(i)) {
            console.log(`Email: ${i}`)
        } else {
            cust = customer_data.find(c => c.customer_id == i);
            console.log(`Customer Id: ${cust.customer_id}`);
            console.log(`Name: ${cust.name}`);
        }
        console.log();
    };
    console.log(`Total Spend: $${largest}`);
    console.log("===========");
}

main();