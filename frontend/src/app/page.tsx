"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
  price: number;
}

const COLORS = [
  { name: "Yellow Gold", key: "yellow", color: "#E6CA97" },
  { name: "White Gold", key: "white", color: "#D9D9D9" },
  { name: "Rose Gold", key: "rose", color: "#E1A4A9" },
];

function StarRating({ value }: { value: number }) {
  const fullStars = Math.floor(value);
  const halfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="flex items-center gap-0.5">
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="text-orange-300">★</span>
        ))}
      {halfStar && <span className="text-amber-200">☆</span>}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
    </span>
  );
}


type ColorKey = 'yellow' | 'rose' | 'white';
export default function Home() {
  // All state and refs should be declared only once, inside the Home component
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [minPopularity, setMinPopularity] = useState<string>("");
  const [maxPopularity, setMaxPopularity] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [color, setColor] = useState<{ [idx: number]: ColorKey }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);


  // Build query string for filters
  function buildQuery() {
    const params = [];
    if (minPopularity) params.push(`min_popularity=${minPopularity}`);
    if (maxPopularity) params.push(`max_popularity=${maxPopularity}`);
    if (minPrice) params.push(`min_price=${minPrice}`);
    if (maxPrice) params.push(`max_price=${maxPrice}`);
    return params.length ? `?${params.join("&")}` : "";
  }

  // Fetch products on filter change
  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/products${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [minPopularity, maxPopularity, minPrice, maxPrice]);

  // Reset scroll position when products change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [products]);

  // ...existing code...

  // Scroll by 1 card width (plus gap)
  const CARD_WIDTH = 260; // image+text+margin
  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    }
    // Build query string for filters
    function buildQuery() {
      const params = [];
      if (minPopularity) params.push(`min_popularity=${minPopularity}`);
      if (maxPopularity) params.push(`max_popularity=${maxPopularity}`);
      if (minPrice) params.push(`min_price=${minPrice}`);
      if (maxPrice) params.push(`max_price=${maxPrice}`);
      return params.length ? `?${params.join("&")}` : "";
    }

  };
  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    }
  };

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);




  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-8 pb-20 select-none" style={{ userSelect: "none" }}>
      <h1 className="avenir-title text-black mb-8 select-none text-[32px] sm:text-[45px]" style={{ userSelect: "none" }}>Product List</h1>
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-center gap-4 mb-8 px-2">
        {/* ...existing filter bar code... */}
        <div className="flex flex-col items-start">
          <label htmlFor="minPopularity" className="text-xs avenir-book text-gray-700 mb-1">Min Popularity</label>
          <input
            id="minPopularity"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={minPopularity}
            onChange={e => {
              let v = e.target.value;
              if (v && parseFloat(v) > 1) v = "1";
              setMinPopularity(v);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6CA97] bg-white"
            placeholder="0.0"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="maxPopularity" className="text-xs avenir-book text-gray-700 mb-1">Max Popularity</label>
          <input
            id="maxPopularity"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={maxPopularity}
            onChange={e => {
              let v = e.target.value;
              if (v && parseFloat(v) > 1) v = "1";
              setMaxPopularity(v);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6CA97] bg-white"
            placeholder="1.0"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="minPrice" className="text-xs avenir-book text-gray-700 mb-1">Min Price</label>
          <input
            id="minPrice"
            type="number"
            min={0}
            step={0.01}
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6CA97] bg-white"
            placeholder="0"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="maxPrice" className="text-xs avenir-book text-gray-700 mb-1">Max Price</label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            step={0.01}
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6CA97] bg-white"
            placeholder=""
          />
        </div>
        <div className="flex flex-col items-end pt-5">
          <button
          type="button"
          className="ml-2 px-4 py-2 rounded-lg bg-[#E6CA97] text-white text-sm font-semibold mt-5 sm:mt-0 cursor-pointer"
          onClick={() => {
            setMinPopularity("");
            setMaxPopularity("");
            setMinPrice("");
            setMaxPrice("");
          }}
          >
            Reset
          </button>
        </div>

      </div>
      <div className="flex items-center w-full max-w-full sm:max-w-6xl select-none min-h-[350px]" style={{ userSelect: "none" }}>
        {/* Carousel area: show loading, empty, or products */}
        {loading ? (
          <div className="w-full text-center avenir-title text-gray-400 text-xl py-24">Loading...</div>
        ) : products.length === 0 ? (
          <div className="w-full text-center avenir-title text-gray-400 text-xl py-24">No products found</div>
        ) : (
          <>
            <button onClick={handlePrev} className="text-3xl px-2 select-none">&#60;</button>
            <div
              ref={scrollRef}
              className="flex flex-1 gap-12 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 cursor-grab"
              style={{ WebkitOverflowScrolling: "touch" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[160px] max-w-[160px] sm:min-w-[220px] sm:max-w-[220px] mx-1 sm:mx-2 cursor-pointer select-none"
                  style={{ userSelect: "none" }}
                >
                  <div className="w-full">
                    <Image
                      src={product.images[(color[idx] || "yellow") as ColorKey]}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="rounded-[14px] sm:rounded-[18px] object-cover border border-gray-200 select-none w-full h-auto"
                      style={{ marginBottom: 12, userSelect: "none" }}
                      draggable={false}
                    />
                  </div>
                  <div className="w-full text-left select-none" style={{ userSelect: "none" }}>
                    <div className="montserrat-medium text-black mb-1 select-none text-[13px] sm:text-[15px]" style={{ userSelect: "none" }}>{product.name}</div>
                    <div className="montserrat-regular text-black mb-3 select-none text-[13px] sm:text-[15px]" style={{ userSelect: "none" }}>${product.price.toFixed(2)} USD</div>
                    <div className="flex gap-1 sm:gap-2 mb-1 select-none" style={{ userSelect: "none" }}>
                      {COLORS.map((c) => (
                        <button
                          key={c.key}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center cursor-pointer select-none"
                          style={{
                            background: c.color,
                            borderColor: color[idx] === c.key ? "#000" : "#ccc",
                            userSelect: "none"
                          }}
                          onClick={() => setColor((prev) => ({ ...prev, [idx]: c.key as ColorKey }))}
                        />
                      ))}
                    </div>
                    <div className="avenir-book text-[11px] sm:text-[12px] mb-1 text-black select-none" style={{ userSelect: "none" }}>
                      {COLORS.find((c) => c.key === (color[idx] || "yellow"))?.name}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 mb-5 select-none" style={{ userSelect: "none" }}>
                      <StarRating value={Math.round(product.popularityScore * 5 * 10) / 10} />
                      <span className="text-[12px] sm:text-[14px] text-black avenir-book select-none" style={{ userSelect: "none" }}>
                        {(Math.round(product.popularityScore * 5 * 10) / 10).toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleNext} className="text-3xl px-2 select-none">&#62;</button>
          </>
        )}
      </div>
    </div>
  );
}
