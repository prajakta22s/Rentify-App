import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    title: '',
    description: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    area: '',
    nearby: '',
    imageUrl: ''
  });
  const [image, setImage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', property.title);
    formData.append('description', property.description);
    formData.append('location', property.location);
    formData.append('minPrice', property.minPrice);
    formData.append('maxPrice', property.maxPrice);
    formData.append('area', property.area);
    formData.append('nearby', property.nearby);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Property updated successfully');
        navigate('/seller-dashboard');
      } else {
        alert(`Error updating property: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update property');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <h2>Edit Property</h2>
      <input
        type="text"
        name="title"
        value={property.title}
        onChange={handleInputChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={property.description}
        onChange={handleInputChange}
        placeholder="Description"
        required
      />
      <input
        type="text"
        name="location"
        value={property.location}
        onChange={handleInputChange}
        placeholder="Location"
        required
      />
      <div className="price-range">
        <input
          type="number"
          name="minPrice"
          value={property.minPrice}
          onChange={handleInputChange}
          placeholder="Min Price"
          required
        />
        <input
          type="number"
          name="maxPrice"
          value={property.maxPrice}
          onChange={handleInputChange}
          placeholder="Max Price"
          required
        />
      </div>
      <input
        type="number"
        name="area"
        value={property.area}
        onChange={handleInputChange}
        placeholder="Area (sqft)"
        required
      />
      <input
        type="text"
        name="nearby"
        value={property.nearby}
        onChange={handleInputChange}
        placeholder="Nearby (hospitals, schools, etc.)"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Update Property</button>
    </form>
  );
};

export default EditProperty;
