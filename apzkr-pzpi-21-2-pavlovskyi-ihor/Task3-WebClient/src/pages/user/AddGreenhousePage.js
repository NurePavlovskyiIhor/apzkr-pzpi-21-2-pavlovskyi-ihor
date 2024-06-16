import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { createGreenhouse } from '../../services/GreenhouseService';
import '../../styles/user/addGreenhouse.css';

const AddGreenhousePage = () => {
  const [greenhouseName, setGreenhouseName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddGreenhouse = async (event) => {
    event.preventDefault();

    const userData = localStorage.getItem('user');
    let user = null;
    if (userData) {
      user = JSON.parse(userData);
    } else {
      alert("User not found. Please log in.");
      return; 
    }

    const greenhouseData = {
      name: greenhouseName,
      userId: user.userId
    };

    try {
      setIsLoading(true); 
      const response = await createGreenhouse(greenhouseData);
      setIsLoading(false); 
      
      alert('Greenhouse created successfully');
      navigate('/user/Greenhouses'); 
      
    } catch (error) {
      setIsLoading(false); 
      console.error('Error creating greenhouse:', error);
      
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Failed to create greenhouse');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <main className="add-greenhouse-page main py-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="page-title">
              <FormattedMessage id="addGreenhousePage.title" defaultMessage="Add Greenhouse" />
            </h1>
          </div>
        </div>
        <div className="row form-container">
          <div className="col-md-6">
            <form onSubmit={handleAddGreenhouse}>
              <div className="mb-3">
                <label htmlFor="greenhouseName" className="form-label"> <FormattedMessage id="addGreenhousePage.GreenhouseName" defaultMessage="Greenhouse Name:" /></label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="greenhouseName" 
                  value={greenhouseName} 
                  onChange={(e) => setGreenhouseName(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-submit" disabled={isLoading}>
                {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Add Greenhouse'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddGreenhousePage;
