from typing import Union
from fastapi import FastAPI, HTTPException
import json
import os
import httpx
import time
import asyncio

app = FastAPI()

def load_products():
    try:
        with open("products.json", "r") as f:
            products = json.load(f)
        return products
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="products.json file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="products.json is not a valid JSON file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error loading products: {str(e)}")

cached_gold_price = None
cache_time = 0
CACHE_TTL = 10 #10 seconds to test ttl

async def get_gold_price():
    global cached_gold_price, cache_time
    now = time.time()
    api_key = os.getenv("GOLD_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOLD_API_KEY environment variable not set.")
    #if there isn't a cached value or the cached value is older than the ttl
    if cached_gold_price is None or now - cache_time > CACHE_TTL:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("https://www.goldapi.io/api/XAU/USD", headers={"x-access-token": api_key})
                response.raise_for_status()
                data = response.json()
                cached_gold_price = data['price_gram_24k']
                #update the cache time
                cache_time = now
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching gold price: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error fetching gold price: {str(e)}")
    # if the condition is met returns the new price if not
    # returns the already cached price
    return cached_gold_price

def product_price(popularity_score: float, weight, gold_price) -> float:
    price = (popularity_score + 1) * weight * gold_price
    return price

@app.get("/products")
async def get_products():
    try:
        products = await asyncio.to_thread(load_products) # offloads the io operation to a new thread to not block the event loop
    except Exception as e:
        # load_products already raises HTTPException, but catch any unexpected error
        raise HTTPException(status_code=500, detail=f"Error loading products: {str(e)}")
    try:
        gold_price = await get_gold_price()
    except Exception as e:
        # get_gold_price already raises HTTPException, but catch any unexpected error
        raise HTTPException(status_code=500, detail=f"Error getting gold price: {str(e)}")
    products_output = []
    try:
        for product in products:
            popularity = product['popularityScore']
            weight = product['weight']
            priceUSD = product_price(popularity, weight, gold_price)
            # Round to 2 decimals
            product['price'] = round(priceUSD, 2)
            products_output.append(product)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing products: {str(e)}")
    return products_output