import { useState } from 'react';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (keyword.length < 2) return;
    setLoading(true);
    const res = await fetch(
      `http://localhost:4000/api/locations/search?keyword=${keyword}`
    );
    const data = await res.json();
    setLocations(data.data || []);
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>✈️ 2nd Search (via Node.js & React)</h1>
      <div className="search-box">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search airports..."
        />
        <button onClick={search} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="results">
        {locations.map((loc, i) => (
          <div key={i} className="card">
            <span className="name">{loc.name}</span>
            <span className="code">{loc.iataCode}</span>
            <div className="info">
              {loc.subType} • {loc.address?.cityName}, {loc.address?.countryName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
