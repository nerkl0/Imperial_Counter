import json 

with open('../Data/database-ext.json') as f1, open('../Data/transactions-ext.json') as f2:
    customer_data = json.load(f1)
    transaction_data = json.load(f2)

# global dictionary lookup to speed up searches
customer_id_lookup = {c['customer_id']: c for c in customer_data}
customer_email_ids = {cust['email']: cust['customer_id'] for cust in customer_data}

def main(): 
    tx = calculate_customer_transactions()
    top_customers, amount = get_highest_spenders(tx)
   
    for c in top_customers:
        dets = get_customer_details(c)
        if dets is None:
            dets = top_customers
        print_result(dets)
    print(f'Total: ${amount}')


def calculate_customer_transactions():
    cust_transactions = {}

    for tx in transaction_data: 
        e = tx['customer']['email']
        total = sum(p['quantity'] * p['unit_price'] for p in tx['products'])
        cust_transactions[e] = cust_transactions.get(e, 0) + total
    
    return cust_transactions

def get_highest_spenders(data):
    if not data:
        return 0
    
    highest_value = max(data.values())
    highest_spenders = [cust for cust, total in data.items() if total == highest_value]
    return highest_spenders, highest_value

def get_customer_details(email):
    e_to_id = customer_email_ids.get(email)
    
    if e_to_id is None:
        print(f'{email} not found in database')
        return e_to_id
    
    return customer_id_lookup.get(e_to_id)

def print_result(cust):
    if isinstance(cust, list):
        return print(f"Email: {cust[0]}")
    print(f"Customer Id: {cust['customer_id']}")
    print(f"Name: {cust['name']}")
    print(f"Email: {cust['email']}")

main()