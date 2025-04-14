import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { format } from "date-fns";
import "./App.css"

const NASA_API_KEY = "DEMO_KEY"; // Replace with your NASA API Key

export default function AstroSnap() {
  const [photoData, setPhotoData] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("astro_favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    fetchPhoto();
  }, []);

  const fetchPhoto = async (customDate = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${customDate}`
      );
      const data = await res.json();
      setPhotoData(data);
    } catch (err) {
      console.error("Failed to fetch photo", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleView = () => {
    fetchPhoto(date);
  };

  const handleRandom = () => {
    const randomDate = randomDateString();
    setDate(randomDate);
    fetchPhoto(randomDate);
  };

  const randomDateString = () => {
    const start = new Date(1995, 5, 16).getTime();
    const end = new Date().getTime();
    const random = new Date(start + Math.random() * (end - start));
    return (random, "yyyy-MM-dd");
  };

  const addToFavorites = () => {
    if (!photoData) return;
    const updated = [...favorites, photoData];
    setFavorites(updated);
    localStorage.setItem("astro_favorites", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h1 className="title">🚀 AstroSnap</h1>
      <div className="controls">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          max={(new Date(), "yyyy-MM-dd")}
        />
        <button onClick={handleView}>View</button>
        <button onClick={handleRandom} variant="secondary">
          Random
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {photoData && (
        <div className="card">
          <div className="card">
            <h2 className="card-title">{photoData.title}</h2>
            <p className="card-date">📅 {photoData.date}</p>
            {photoData.media_type === "image" ? (
              <img
                src={photoData.url}
                alt={photoData.title}
                className="card-image"
              />
            ) : (
              <iframe
                src={photoData.url}
                title={photoData.title}
                frameBorder="0"
                allow="encrypted-media"
                className="card-iframe"
              ></iframe>
            )}
            <p className="card-description">{photoData.explanation}</p>
            <button onClick={addToFavorites} className="mt-4">
              ❤️ Save to Favorites
            </button>
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div>
          <h2 className="favorites-title">🌟 Favorites</h2>
          <div className="favorites-grid">
            {favorites.map((fav, idx) => (
              <div
                key={idx}
                className="favorites-card"
              >
                <div className="p-3">
                  <p className="favorites-title">{fav.title}</p>
                  <img
                    src={fav.url}
                    alt={fav.title}
                    className="favorites-image"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
