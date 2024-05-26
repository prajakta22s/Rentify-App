import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`);
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div>
      <h2>{property.title}</h2>
      <p>{property.description}</p>
      <p>Location: {property.location}</p>
      <p>Price: {property.price}</p>
      <p>Bedrooms: {property.bedrooms}</p>
      <p>Bathrooms: {property.bathrooms}</p>
      <p>Area: {property.area} sqft</p>
      <p>Nearby: {property.nearby}</p>
      <button onClick={() => alert('Interested! Contact the seller')}>I'm Interested</button>
    </div>
  );
};

export default PropertyDetail;
