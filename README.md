# case_study_renart

A simple **RESTful API** with live gold pricing built with **FastAPI** and a **Next.js frontend** to display and filter products.

## 🚀 Live Demo

- 🧠 **Backend (FastAPI)** → [https://backend-production-b1c8.up.railway.app/](https://backend-production-b1c8.up.railway.app/)
- 🎨 **Frontend (Next.js)** → [https://frontend-production-b63b.up.railway.app/](https://frontend-production-b63b.up.railway.app/)

## 🧩 Features

### 🖥️ Frontend (Next.js)
- Built with **Next.js 15** and **TypeScript**
- Responsive and minimal UI
- Product listing and filtering by color or price
- Fetches data from the FastAPI backend

### ⚙️ Backend (FastAPI)
- RESTful `/products` endpoint returning product data from a JSON file
- Fetches and caches live **gold price**
- Error handling with proper HTTP responses
- Simple in-memory caching
- Filtering data by min/max price/popularity

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | [Next.js](https://nextjs.org/) (React, TypeScript) |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) |
| **Deployment** | [Railway](https://railway.app/) |
| **Language** | Python 3.13 / TypeScript |
| **Styling** | Tailwind CSS |

## ⚡ Running Locally

```bash
docker-compose up
````

## 🧰 Environment Variables

### Backend

- Obtained from: https://www.goldapi.io/
```
GOLD_PRICE_API_URL=<gold price API endpoint>
```

### Frontend
- docker-compose automatic service discovery

```
NEXT_PUBLIC_API_URL=backend:800
```

---

## 🧾 API Example

**Endpoint:** `GET /products?max_popularity=0.86`

**Response:**

```json
[
  {
    "name": "Engagement Ring 1",
    "price": 489.95,
    "popularity": 0.85,
    "weight": 2.1,
    "images": {...}
  },
  ...
]
```
