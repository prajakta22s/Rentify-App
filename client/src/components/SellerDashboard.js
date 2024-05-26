import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const SellerDashboard = ({ user }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [user._id]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties?sellerId=${user._id}`);
      const data = await response.json();
      setProperties(data);
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
    <div className="dashboard">
      <h2>Seller Dashboard</h2>
      <Link to="/add-property" className="add-property-link">Add Property</Link>
      <div className="property-list">
        {properties.map((property) => (
          <div key={property._id} className="property">
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            <p>Location: {property.location}</p>
            <p>Price: ${property.minPrice} - ${property.maxPrice}</p>
            <p>Area: {property.area} sqft</p>
            {property.imageUrl && <img src={`http://localhost:5000${property.imageUrl}`} alt={property.title} />}
            <div className="property-actions">
              <Link to={`/properties/edit/${property._id}`} className="edit-button">Edit</Link>
              <button onClick={() => handleDelete(property._id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
