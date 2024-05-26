import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const AddProperty = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [area, setArea] = useState('');
  const [nearby, setNearby] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sellerId', user._id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('minPrice', minPrice);
    formData.append('maxPrice', maxPrice);
    formData.append('area', area);
    formData.append('nearby', nearby);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Property added successfully');
        navigate('/seller-dashboard');
      } else {
        alert(`Error adding property: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add property');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <h2>Add Property</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <div className="price-range">
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
          required
        />
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
          required
        />
      </div>
      <input
        type="number"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Area (sqft)"
        required
      />
      <input
        type="text"
        value={nearby}
        onChange={(e) => setNearby(e.target.value)}
        placeholder="Nearby (hospitals, schools, etc.)"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Add Property</button>
    </form>
  );
};

export default AddProperty;
