import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSensorsByGreenhouseId, deleteSensor } from '../../services/SensorService';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../../styles/user/sensors.css';

const sensorTypesEnum = {
  Temperature: 'Temperature',
  Humidity: 'Humidity',
  Lighting: 'Lighting',
  Acidity: 'Acidity'
};

const sensorTypesArray = [
    sensorTypesEnum.Temperature,
    sensorTypesEnum.Humidity,
    sensorTypesEnum.Lighting,
    sensorTypesEnum.Acidity
];  

const SensorsPage = () => {
    const { greenhouseId } = useParams();
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'sensorId', direction: 'ascending' });
    const navigate = useNavigate();

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const fetchSensors = async () => {
        if (!user || !user.userId) {
            setError('User not found.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let data;
            console.log('Fetching sensors for greenhouseId:', greenhouseId);
            data = await getSensorsByGreenhouseId(greenhouseId);
            if (Array.isArray(data)) {
                setSensors(data);
                console.log('Valid data format');
            } else {
                console.log('Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching sensors:', error);
            setError('Failed to fetch sensors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSensors();
    }, [greenhouseId]);

    const handleAddSensor = () => {
        navigate('/user/addSensor');
    };

    const handleEditSensor = (sensorId) => {
        navigate(`/user/editSensor/${sensorId}`);
    };

    const handleDeleteSensor = async (sensorId) => {
        try {
            await deleteSensor(sensorId);
            let data;
            data = await getSensorsByGreenhouseId(greenhouseId);
            setSensors(data);
        } catch (error) {
            console.error('Error deleting sensor:', error);
            setError('Failed to delete sensor');
        }
    };

    const handleViewSchedules = (sensorId, sensorType) => {
        localStorage.setItem('sensorId', sensorId);
        localStorage.setItem('sensorType', sensorType);
        navigate(`/user/schedules/${sensorId}`);
    };

    const sortedSensors = [...sensors].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main className="main py-5">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="page-title">
                            <FormattedMessage id="sensorsPage.title" defaultMessage="Sensors" />
                        </h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h1 className="page-description">
                            <FormattedMessage id="sensorsPage.description" defaultMessage="Greenhouse ID: " />
                            {greenhouseId}
                        </h1>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col text-end">
                        <button onClick={handleAddSensor} className="btn btn-primary btn-add-sensor">
                        <FormattedMessage id="sensorsPage.AddSensor" defaultMessage="Add Sensor" />
                        </button>
                    </div>
                </div>

                {sensors.length === 0 ? (
                    <div><FormattedMessage id="sensorsPage.No" defaultMessage="No sensors found." /></div>
                ) : (
                    <table className="table-sensors">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('sensorId')}><FormattedMessage id="sensorsPage.SensorID" defaultMessage="Sensor ID" /></th>
                                <th><FormattedMessage id="sensorsPage.SensorType" defaultMessage="Sensor Type" /></th>
                                <th onClick={() => requestSort('minValue')}><FormattedMessage id="sensorsPage.MinValue" defaultMessage="Min Value" /></th>
                                <th onClick={() => requestSort('maxValue')}><FormattedMessage id="sensorsPage.MaxValue" defaultMessage="Max Value" /></th>
                                <th><FormattedMessage id="sensorsPage.Is Active" defaultMessage="IsActive" /></th>
                                <th><FormattedMessage id="sensorsPage.Actions" defaultMessage="Actions" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSensors.map(sensor => (
                                <tr key={sensor.sensorId}>
                                    <td>{sensor.sensorId}</td>
                                    <td>{sensorTypesArray[sensor.sensorType]}</td>
                                    <td>{sensor.minValue}</td>
                                    <td>{sensor.maxValue}</td>
                                    <td>{sensor.isActive ? 'Yes' : 'No'}</td>
                                    <td>
                                        <div className="button-group-sensors">
                                            <button
                                                onClick={() => handleEditSensor(sensor.sensorId)}
                                                className="btn btn-sm btn-edit-sensor"
                                            >
                                                <FormattedMessage id="sensorsPage.Edit" defaultMessage="Edit" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSensor(sensor.sensorId)}
                                                className="btn btn-sm btn-delete-sensor"
                                            >
                                                <FormattedMessage id="sensorsPage.Delete" defaultMessage="Delete" />
                                            </button>
                                            <button
                                                onClick={() => handleViewSchedules(sensor.sensorId, sensor.sensorType)}
                                                className="btn btn-sm btn-view-schedules"
                                            >
                                                <FormattedMessage id="sensorsPage.Viewschedules" defaultMessage="View schedules" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
};

export default SensorsPage;
