"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [view, setView] = useState("home");
  const [portfolio, setPortfolio] = useState([]);
  const [btcPrice, setBtcPrice] = useState(68000);
  const [form, setForm] = useState({ name: "", link: "", price: "" });
  const [preview, setPreview] = useState(null);

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

  useEffect(() => {
    const fetchPreview = async () => {
      if (!form.link) {
        setPreview(null);
        return;
      }
      try {
        const res = await fetch(`/api/preview?url=${encodeURIComponent(form.link)}`);
        const data = await res.json();
        setPreview({ title: data.title, image: data.image });
      } catch (err) {
        setPreview(null);
      }
    };
    fetchPreview();
  }, [form.link]);

  const normalizeLink = (url) => {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  };

  const handleBTCBuy = () => {
    const price = parseFloat(form.price);
    const btcAmount = price / btcPrice;
    const newEntry = {
      name: form.name,
      link: normalizeLink(form.link),
      price,
      btc: parseFloat(btcAmount.toFixed(6)),
    };
    setPortfolio([...portfolio, newEntry]);
    setForm({ name: "", link: "", price: "" });
    setPreview(null);
    setView("dashboard");
  };

  const totalBTC = portfolio.reduce((sum, p) => sum + p.btc, 0);
  const totalUSD = (totalBTC * btcPrice).toFixed(2);

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Symbolic Portfolio</h1>
        <p className="text-center text-lg mb-1">
          Total BTC: <span className="font-bold">{totalBTC.toFixed(6)} BTC</span>
        </p>
        <p className="text-center text-md mb-4 text-gray-700">
          ≈ <span className="font-bold">${parseFloat(totalUSD).toLocaleString()}</span> USD
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
                <p className="text-sm text-gray-600">
                  ${entry.price} saved instead
                </p>
                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm underline"
                  >
                    View Link
                  </a>
                )}
              </div>
              <div className="text-right">
                <p className="text-md font-bold">{entry.btc} BTC</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setView("catalog")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  if (view === "catalog") {
    return (
      <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">What do you want to buy?</h1>
        <div className="max-w-xl mx-auto">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name of Item *</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Link (optional)</label>
            <input
              type="url"
              className="w-full border px-4 py-2 rounded"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </div>
          {preview && (
            <div className="mb-4 border rounded p-3 bg-gray-50">
              {preview.image && (
                <img src={preview.image} alt="Preview" className="mb-2 w-full h-40 object-cover rounded" />
              )}
              {preview.title && <p className="text-sm font-medium">{preview.title}</p>}
            </div>
          )}
          <div className="mb-6">
            <label className="block font-semibold mb-1">Price in USD *</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded"
              onClick={() => alert("This would redirect to buy item.")}
            >
              Buy this item
            </button>
            <button
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              onClick={handleBTCBuy}
              disabled={!form.name || !form.price}
            >
              Buy BTC Instead
            </button>
          </div>
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
          Add a Temptation
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16 text-center">
        <div>
          <div className="text-4xl mb-2">🛍️</div>
          <h2 className="font-semibold text-xl mb-1">Describe a Product</h2>
          <p className="text-sm">What you wanted to buy</p>
        </div>
        <div>
          <div className="text-4xl mb-2">💸</div>
          <h2 className="font-semibold text-xl mb-1">Buy BTC Instead</h2>
          <p className="text-sm">Symbolically invest that money</p>
        </div>
        <div>
          <div className="text-4xl mb-2">📈</div>
          <h2 className="font-semibold text-xl mb-1">Track Growth</h2>
          <p className="text-sm">See your symbolic investment value</p>
        </div>
      </div>

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
