import sqlite3

# Connect to (or create) ecommerce.db inside backend directory
conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

# 1. Customers Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    join_date DATE NOT NULL
);
""")

# 2. Products Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL
);
""")

# 3. Inventory Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    warehouse_location TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
""")

# 4. Orders Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    order_date DATE NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
""")

# Insert Sample Customers
cursor.executemany("""
INSERT INTO customers (name, email, country, join_date) VALUES (?, ?, ?, ?)
""", [
    ("Alice Smith", "alice@example.com", "USA", "2025-01-15"),
    ("Bob Jones", "bob@example.com", "UK", "2025-02-10"),
    ("Charlie Brown", "charlie@example.com", "Canada", "2025-03-01"),
    ("Diana Prince", "diana@example.com", "USA", "2025-03-12")
])

# Insert Sample Products
cursor.executemany("""
INSERT INTO products (product_name, category, price) VALUES (?, ?, ?)
""", [
    ("Laptop Pro", "Electronics", 1200.00),
    ("Wireless Mouse", "Electronics", 25.50),
    ("Mechanical Keyboard", "Electronics", 85.00),
    ("Ergonomic Chair", "Furniture", 250.00),
    ("Standing Desk", "Furniture", 450.00)
])

# Insert Sample Inventory
cursor.executemany("""
INSERT INTO inventory (product_id, stock_quantity, warehouse_location) VALUES (?, ?, ?)
""", [
    (1, 45, "Warehouse A"),
    (2, 200, "Warehouse A"),
    (3, 120, "Warehouse B"),
    (4, 30, "Warehouse C"),
    (5, 15, "Warehouse C")
])

# Insert Sample Orders
cursor.executemany("""
INSERT INTO orders (customer_id, product_id, quantity, total_price, order_date, status) VALUES (?, ?, ?, ?, ?, ?)
""", [
    (1, 1, 1, 1200.00, "2026-06-01", "Completed"),
    (2, 2, 2, 51.00, "2026-06-05", "Completed"),
    (3, 3, 1, 85.00, "2026-06-10", "Pending"),
    (4, 4, 1, 250.00, "2026-07-01", "Completed"),
    (1, 5, 1, 450.00, "2026-07-15", "Completed"),
    (2, 1, 1, 1200.00, "2026-08-01", "Processing")
])

conn.commit()
conn.close()
print("Database 'ecommerce.db' created successfully with sample tables and data!")