from typing import Union
from fastapi import FastAPI
import json
import os
import httpx

app = FastAPI()

def load_products():
    with open("products.json", "r") as f:
        products = json.load(f)
    return products

async def get_gold_price():
    api_key = os.getenv("GOLD_API_KEY")
    async with httpx.AsyncClient() as client:
        response = await client.get("https://www.goldapi.io/api/XAU/USD", headers={"x-access-token": api_key})
        response.raise_for_status()
        data = response.json()
        price = data['price_gram_24k']
    return price

def product_price(popularity_score: float, weight, gold_price) -> float:
    price = (popularity_score + 1) * weight * gold_price
    return price

@app.get("/products")
async def read_root():
    products = load_products()
    gold_price = await get_gold_price()
    products_output = []
    for product in products:
        popularity = product['popularityScore']
        weight = product['weight']
        priceUSD = product_price(popularity, weight, gold_price)
        # Round to 2 decimals
        product['price'] = round(priceUSD, 2)
        products_output.append(product)
    return products_output