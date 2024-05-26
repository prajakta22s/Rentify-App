import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const PropertyList = ({ sellerId }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [sellerId]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties?sellerId=${sellerId}`);
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProperties();
      } else {
        const data = await response.json();
        alert(`Error deleting property: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete property');
    }
  };

  return (
    <div className="property-list">
      <h2>My Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        properties.map((property) => (
          <div key={property._id} className="property">
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            <p>Location: {property.location}</p>
            <p>Price: ${property.minPrice} - ${property.maxPrice}</p>
            <p>Area: {property.area} sqft</p>
            {property.imageUrl && <img src={`http://localhost:5000${property.imageUrl}`} alt={property.title} />}
            <Link to={`/properties/edit/${property._id}`}>Edit</Link>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertyList;
