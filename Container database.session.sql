CREATE SCHEMA expapp;

CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(7, 2) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(255)
)
    
INSERT INTO products (id, title, price, description, imageurl)
    VALUES (
        DEFAULT,
        'book 2',
        23.45,
        'Hello the Text',
        'www.testimage.ch'
    );


SELECT * FROM products