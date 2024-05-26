import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleLike = async (propertyId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/like`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchProperties();
      } else {
        const data = await response.json();
        alert(`Error liking property: ${data.error}`);
      }
    } catch (error) {
      console.error('Error liking property:', error);
    }
  };

  const handleInterested = async (propertyId) => {
    if (!user) {
      alert('Please login to express interest in a property.');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/interested`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }),
      });
      if (response.ok) {
        const data = await response.json();
        setSellerDetails(data.seller);
        setSelectedProperty(propertyId);
        alert('Interest noted and emails sent.');
      } else {
        const data = await response.json();
        alert(`Error expressing interest: ${data.error}`);
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(filter.toLowerCase()) ||
    property.location.toLowerCase().includes(filter.toLowerCase()) ||
    property.description.toLowerCase().includes(filter.toLowerCase()) ||
    property.minPrice.toString().includes(filter) ||
    property.maxPrice.toString().includes(filter) ||
    property.area.toString().includes(filter) ||
    property.nearby.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard">
      <h2>Buyer Dashboard</h2>
      <input
        type="text"
        placeholder="Search properties..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="search-input"
      />
      <div className="property-list">
        {currentItems.map((property) => (
          <div key={property._id} className="property">
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            <p>Location: {property.location}</p>
            <p>Price: ${property.minPrice} - ${property.maxPrice}</p>
            <p>Area: {property.area} sqft</p>
            {property.imageUrl && <img src={`http://localhost:5000${property.imageUrl}`} alt={property.title} />}
            <div className="property-actions">
              <button className="interested-button" onClick={() => handleInterested(property._id)}>I'm Interested</button>
              <button className="like-button" onClick={() => handleLike(property._id)}>Like ({property.likes})</button>
            </div>
          </div>
        ))}
      </div>
      {sellerDetails && selectedProperty && (
        <div className="seller-details">
          <h3>Seller Details</h3>
          <p>Name: {sellerDetails.firstName} {sellerDetails.lastName}</p>
          <p>Email: {sellerDetails.email}</p>
          <p>Phone: {sellerDetails.phoneNumber}</p>
        </div>
      )}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredProperties.length / itemsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
