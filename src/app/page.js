"use client";

import { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "iPad",
    price: 399,
    image: "https://via.placeholder.com/200x150?text=iPad",
  },
  {
    id: 2,
    name: "AirPods Pro",
    price: 249,
    image: "https://via.placeholder.com/200x150?text=AirPods",
  },
  {
    id: 3,
    name: "MacBook Air",
    price: 999,
    image: "https://via.placeholder.com/200x150?text=MacBook",
  },
];

export default function HomePage() {
  const [view, setView] = useState("home");
  const [portfolio, setPortfolio] = useState([]);
  const [btcPrice, setBtcPrice] = useState(68000);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio");
    if (saved) {
      setPortfolio(JSON.parse(saved));
    }
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        if (data.bitcoin && data.bitcoin.usd) {
          setBtcPrice(data.bitcoin.usd);
        }
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const handleBTCBuy = (product) => {
    const btcAmount = product.price / btcPrice;
    const newEntry = {
      name: product.name,
      price: product.price,
      btc: parseFloat(btcAmount.toFixed(6)),
    };
    setPortfolio([...portfolio, newEntry]);
    setView("dashboard");
  };

  const totalBTC = portfolio.reduce((sum, p) => sum + p.btc, 0);

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Symbolic Portfolio</h1>
        <p className="text-center text-lg mb-6">
          Total BTC: <span className="font-bold">{totalBTC.toFixed(6)} BTC</span>
        </p>
        <p className="text-center text-sm text-gray-500 mb-4">
          (BTC price: ${btcPrice.toLocaleString()})
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          {portfolio.map((entry, index) => (
            <div
              key={index}
              className="border p-4 rounded-xl shadow-sm bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{entry.name}</p>
                <p className="text-sm text-gray-600">${entry.price} saved instead</p>
              </div>
              <div className="text-right">
                <p className="text-md font-bold">{entry.btc} BTC</p>
                <p className="text-xs text-gray-500">
                  (~{(entry.price / entry.price).toFixed(1)} {entry.name})
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setView("catalog")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Browse More
          </button>
        </div>
      </div>
    );
  }

  if (view === "catalog") {
    return (
      <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">What are you tempted to buy?</h1>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-4" />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-4">Price: ${product.price}</p>
              <div className="flex flex-col gap-2">
                <button className="bg-gray-300 text-black px-4 py-2 rounded">Buy this item</button>
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={() => handleBTCBuy(product)}
                >
                  Buy BTC Instead
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => setView("home")} className="text-blue-600 underline">
            ⬅ Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Buy Less. Save More. Invest in Bitcoin Instead.
        </h1>
        <p className="text-lg mb-6">
          Turn your spending impulses into savings. See what you could’ve bought, then choose to grow that money instead.
        </p>
        <button
          onClick={() => setView("catalog")}
          className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition"
        >
          Browse Temptations
        </button>
      </div>

      {/* How It Works Section */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16 text-center">
        <div>
          <div className="text-4xl mb-2">🛍️</div>
          <h2 className="font-semibold text-xl mb-1">Browse Popular Products</h2>
          <p className="text-sm">Pick what you'd normally buy online</p>
        </div>
        <div>
          <div className="text-4xl mb-2">💸</div>
          <h2 className="font-semibold text-xl mb-1">Buy BTC Instead</h2>
          <p className="text-sm">Choose to symbolically invest instead of purchasing</p>
        </div>
        <div>
          <div className="text-4xl mb-2">📈</div>
          <h2 className="font-semibold text-xl mb-1">Watch It Grow</h2>
          <p className="text-sm">See how much you’ve saved in your dashboard</p>
        </div>
      </div>

      {/* BTC Comparison Example */}
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-2">
          If you didn’t buy this iPad 3 years ago...
        </h3>
        <p className="text-lg">
          You’d have <span className="font-bold">$2,420</span> in Bitcoin today —
          equivalent to <span className="font-bold">2 iPads</span>.
        </p>
      </div>
    </div>
  );
}
