import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getGreenhouseById, updateGreenhouse } from '../../services/GreenhouseService';
import '../../styles/user/editGreenhouse.css';

const EditGreenhousePage = () => {
  const { greenhouseId } = useParams();
  const [greenhouseName, setGreenhouseName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGreenhouseData = async () => {
      try {
        const greenhouse = await getGreenhouseById(greenhouseId);
        setGreenhouseName(greenhouse.name);
      } catch (err) {
        console.error('Error fetching greenhouse:', err);
        setError('Failed to fetch greenhouse data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGreenhouseData();
  }, [greenhouseId]); 

  const handleEditGreenhouse = async (event) => {
    event.preventDefault();

    const updatedGreenhouseData = {
      name: greenhouseName,
    };

    try {
      setIsLoading(true);
      await updateGreenhouse(greenhouseId, updatedGreenhouseData);
      alert('Greenhouse updated successfully');
      navigate('/user/Greenhouses');
    } catch (error) {
      console.error('Error updating greenhouse:', error);
      setError(error.response?.data?.message || 'Failed to update greenhouse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="edit-greenhouse-page main py-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="page-title">
              <FormattedMessage id="editGreenhousePage.title" defaultMessage="Edit Greenhouse" />
            </h1>
          </div>
        </div>

        <div className="row form-container">
          <div className="col-md-6">
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : isLoading ? (
              <p>Loading greenhouse data...</p>
            ) : (
              <form onSubmit={handleEditGreenhouse}>
                <div className="mb-3">
                  <label htmlFor="greenhouseName" className="form-label"><FormattedMessage id="editGreenhousePage.GreenhouseName" defaultMessage="Greenhouse Name:" /></label>
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
                  {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditGreenhousePage;
