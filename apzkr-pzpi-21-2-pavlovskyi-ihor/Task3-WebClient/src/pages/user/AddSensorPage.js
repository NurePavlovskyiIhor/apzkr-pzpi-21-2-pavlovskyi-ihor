import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { addSensor } from '../../services/SensorService';
import { getGreenhouseByUserId } from '../../services/GreenhouseService';
import '../../styles/user/addSensor.css';

const sensorTypesEnum = {
  0: 'Temperature',
  1: 'Humidity',
  2: 'Lighting',
  3: 'Acidity'
};

const sensorTypesEnumReverse = {
  'Temperature': 0,
  'Humidity': 1,
  'Lighting': 2,
  'Acidity': 3
};

const AddSensorPage = ({ userId, onSuccess }) => {
  const [sensorType, setSensorType] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greenhouses, setGreenhouses] = useState({});
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState('');
  const [error, setError] = useState(null);

  let greenhouseId = localStorage.getItem('greenhouseId');

  const navigate = useNavigate();

  if (!userId) {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    userId = user.userId;
  }

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const data = await getGreenhouseByUserId(userId);
        let greenhouseOptions = {};
        data.forEach(greenhouse => {
          greenhouseOptions[greenhouse.greenhouseId] = greenhouse.name;
        });
        setGreenhouses(greenhouseOptions);
        const keys = Object.keys(greenhouseOptions);
        console.log("Keys:", keys);
      } catch (error) {
        console.error('Error fetching greenhouses:', error);
        setError('Failed to load greenhouses. Please try again later.');
      }
    };
    fetchGreenhouses();
  }, [userId]);

  const handleAddSensor = async (event) => {
    event.preventDefault();

    const numericSensorType = sensorTypesEnumReverse[sensorType];

    const sensorData = {
      sensorType: numericSensorType,
      minValue: parseFloat(minValue),
      maxValue: parseFloat(maxValue),
      isActive,
      greenhouseId: greenhouseId
    };

    console.log(sensorData);

    try {
      setIsLoading(true);
      await addSensor(sensorData);
      setIsLoading(false);
      alert('Sensor created successfully');
      navigate(`/user/sensors/${greenhouseId}`);

    } catch (error) {
      setIsLoading(false);
      console.error('Error adding sensor:', error);
      setError(error.response?.data?.message || 'Failed to add sensor. Please try again.');
    }
  };

  return (
    <main className="add-sensor-page main py-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="page-title">
              <FormattedMessage id="addSensorPage.title" defaultMessage="Add Sensor" />
            </h1>
          </div>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="row form-container">
          <div className="col-md-6">
            <form onSubmit={handleAddSensor}>
              <div className="mb-3">
                <label htmlFor="sensorType" className="form-label"><FormattedMessage id="addSensorPage.SensorType" defaultMessage="Sensor Type:" /></label>
                <select
                  className="form-control"
                  id="sensorType"
                  value={sensorType}
                  onChange={(e) => setSensorType(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a sensor type</option>
                  {Object.keys(sensorTypesEnum).map((key) => (
                    <option key={key} value={sensorTypesEnum[key]}>
                      {sensorTypesEnum[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="minValue" className="form-label"><FormattedMessage id="addSensorPage.MinValue" defaultMessage="Min Value:" /></label>
                <input
                  type="number"
                  className="form-control"
                  id="minValue"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxValue" className="form-label"><FormattedMessage id="addSensorPage.MaxValue" defaultMessage="Max Value:" /></label>
                <input
                  type="number"
                  className="form-control"
                  id="maxValue"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isActive"><FormattedMessage id="addSensorPage.IsActive" defaultMessage="Is Active" /></label>
              </div>

              <button type="submit" className="btn btn-submit" disabled={isLoading}>
                {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Add Sensor'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddSensorPage;
