'use client';
import { useState } from 'react';

interface Location {
  name: string;
  iataCode: string;
  subType: string;
  address?: { cityName: string; countryName: string };
}

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (keyword.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/locations/search?keyword=${keyword}`
      );
      const data = await res.json();
      setLocations(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">✈️ Airport & City Search</h1>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search airports or cities..."
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
        />
        <button
          onClick={search}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid gap-3">
        {locations.map((loc, i) => (
          <div key={i} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between">
              <span className="font-semibold">{loc.name}</span>
              <span className="text-blue-400">{loc.iataCode}</span>
            </div>
            <div className="text-gray-400 text-sm">
              {loc.subType} • {loc.address?.cityName}, {loc.address?.countryName}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
