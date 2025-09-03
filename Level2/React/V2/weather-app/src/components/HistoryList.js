import React from "react";

function HistoryList({ cities, onSelect }) {
  return (
    <div className="chips">
      {cities.map((city, idx) => (
        <span key={idx} className="chip" onClick={() => onSelect(city)}>
          {city}
        </span>
      ))}
    </div>
  );
}

export default HistoryList;
