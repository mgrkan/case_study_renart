from typing import Union
from fastapi import FastAPI
import json

app = FastAPI()

def load_products():
    with open("products.json", "r") as f:
        products = json.load(f)
    return products

def gold_dummy():
    return 1234.56

def product_price(popularity_score: float, weight, gold_price) -> float:
    price = (popularity_score + 1) * weight * gold_price
    return price

@app.get("/products")
def read_root():
    products = load_products()
    gold_price = gold_dummy()
    products_output = []
    for product in products:
        popularity = product['popularityScore']
        weight = product['weight']
        priceUSD = product_price(popularity, weight, gold_price)
        product['price'] = priceUSD
        products_output.append(product)
    return products_output