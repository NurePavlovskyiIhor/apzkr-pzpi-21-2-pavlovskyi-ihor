import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getSensorById, updateSensor } from '../../services/SensorService';
import { getGreenhouseByUserId } from '../../services/GreenhouseService';
import '../../styles/user/editSensor.css';

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

const EditSensorPage = () => {
    const { sensorId } = useParams();
    const navigate = useNavigate();
    const [sensorType, setSensorType] = useState('');
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [greenhouses, setGreenhouses] = useState({});
    const [selectedGreenhouseId, setSelectedGreenhouseId] = useState('');
    const [error, setError] = useState(null);

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user.userId;

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

                const sensor = await getSensorById(sensorId);
                setSensorType(sensorTypesEnum[sensor.sensorType]);
                setMinValue(sensor.minValue);
                setMaxValue(sensor.maxValue);
                setIsActive(sensor.isActive);

            } catch (error) {
                console.error('Error fetching greenhouses:', error);
                setError('Failed to load greenhouses. Please try again later.');
            }
        };
        fetchGreenhouses();
    }, [userId]);

    const handleEditSensor = async (event) => {
        event.preventDefault();

        const numericSensorType = sensorTypesEnumReverse[sensorType];
        let greenhouseId = localStorage.getItem('greenhouseId');

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
            await updateSensor(sensorId, sensorData);
            alert('Sensor updated successfully');
            navigate(`/user/sensors/${greenhouseId}`);

        } catch (error) {
            console.error('Error updating sensor:', error);
            setError(error.response?.data?.message || 'Failed to update sensor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="edit-sensor-page main py-5">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="page-title">
                            <FormattedMessage id="editSensorPage.title" defaultMessage="Edit Sensor" />
                        </h1>
                    </div>
                </div>

                <div className="row form-container">
                    <div className="col-md-6">
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : isLoading ? (
                            <p>Loading sensor data...</p>
                        ) : (
                            <form onSubmit={handleEditSensor}>
                                <div className="mb-3">
                                    <label htmlFor="sensorType" className="form-label"><FormattedMessage id="editSensorPage.SensorType" defaultMessage="Sensor Type:" /></label>
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
                                    <label htmlFor="minValue" className="form-label"><FormattedMessage id="editSensorPage.MinValue" defaultMessage="Min Value:" /></label>
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
                                    <label htmlFor="maxValue" className="form-label"><FormattedMessage id="editSensorPage.MaxValue" defaultMessage="Max Value:" /></label>
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
                                    <label className="form-check-label" htmlFor="isActive"><FormattedMessage id="editSensorPage.IsActive" defaultMessage="Is Active" /></label>
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

export default EditSensorPage;
