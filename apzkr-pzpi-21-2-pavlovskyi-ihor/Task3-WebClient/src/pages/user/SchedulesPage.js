import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSchedulesBySensorId, deleteSchedule } from '../../services/ScheduleService';
import { FormattedMessage } from 'react-intl';
import '../../styles/user/schedules.css';

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

const SchedulesPage = () => {
    const { sensorId } = useParams();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'scheduleId', direction: 'ascending' });
    const navigate = useNavigate();

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const data = await getSchedulesBySensorId(sensorId);
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setError('Failed to fetch schedules. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [sensorId]);

    const handleAddSchedule = () => {
        navigate(`/user/addSchedule/${sensorId}`);
    };

    const handleEditSchedule = (scheduleId) => {
        localStorage.setItem('sensorId', sensorId);
        navigate(`/user/editSchedule/${scheduleId}`);
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            await deleteSchedule(scheduleId);
            const data = await getSchedulesBySensorId(sensorId);
            setSchedules(data);
        } catch (error) {
            console.error('Error deleting schedule:', error);
            setError('Failed to delete schedule');
        }
    };

    const sortedSchedules = [...schedules].sort((a, b) => {
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
                            <FormattedMessage id="schedulesPage.title" defaultMessage="Schedules" />
                        </h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h1 className="page-description">
                            <FormattedMessage id="schedulesPage.description" defaultMessage="Sensor ID: " />
                            {sensorId}
                        </h1>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col text-end">
                        <button onClick={handleAddSchedule} className="btn btn-primary btn-add-schedule">
                        <FormattedMessage id="schedulesPage.AddSchedule" defaultMessage="Add Schedule" />
                        </button>
                    </div>
                </div>

                {schedules.length === 0 ? (
                    <div><FormattedMessage id="schedulesPage.No" defaultMessage="No schedules found." /></div>
                ) : (
                    <table className="table-schedules">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('scheduleId')}><FormattedMessage id="schedulesPage.ScheduleID" defaultMessage="Schedule ID" /></th>
                                <th onClick={() => requestSort('startTime')}><FormattedMessage id="schedulesPage.StartTime" defaultMessage="Start Time" /></th>
                                <th onClick={() => requestSort('endTime')}><FormattedMessage id="schedulesPage.EndTime" defaultMessage="End Time" /></th>
                                <th><FormattedMessage id="schedulesPage.Actions" defaultMessage="Actions" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSchedules.map(schedule => (
                                <tr key={schedule.scheduleId}>
                                    <td>{schedule.scheduleId}</td>
                                    <td>{new Date(schedule.startTime).toISOString().replace('T', ' ').substr(0, 19)}</td>
                                    <td>{new Date(schedule.endTime).toISOString().replace('T', ' ').substr(0, 19)}</td>
                                    <td>
                                        <div className="button-group-schedules">
                                            <button
                                                onClick={() => handleEditSchedule(schedule.scheduleId)}
                                                className="btn btn-sm btn-edit-schedule"
                                            >
                                                <FormattedMessage id="schedulesPage.Edit" defaultMessage="Edit" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                                                className="btn btn-sm btn-delete-schedule"
                                            >
                                                <FormattedMessage id="schedulesPage.Delete" defaultMessage="Delete" />
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

export default SchedulesPage;
