import React from 'react';

function HotelMap({ location }) {
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(location)}`;
  return (
    <iframe
      width="100%"
      height="300"
      frameBorder="0"
      src={mapSrc}
      allowFullScreen
      title="Hotel Directions"
    ></iframe>
  );
}

export default HotelMap;
