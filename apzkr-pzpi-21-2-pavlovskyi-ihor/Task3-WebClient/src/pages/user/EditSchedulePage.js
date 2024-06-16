import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getScheduleById, updateSchedule } from '../../services/ScheduleService';
import { format } from 'date-fns';
import '../../styles/user/editSchedule.css';

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

const EditSchedulePage = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const schedule = await getScheduleById(scheduleId);

                setStartTime(schedule.startTime);
                setEndTime(schedule.endTime);
            } catch (error) {
                console.error('Error fetching schedule:', error);
                setError('Failed to load schedule. Please try again later.');
            }
        };

        fetchSchedule();
    }, [scheduleId]);

    const handleEditSchedule = async (event) => {
        event.preventDefault();

        const startTimeUTC = format(new Date(startTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const endTimeUTC = format(new Date(endTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        const scheduleData = {
            startTime: startTimeUTC,
            endTime: endTimeUTC,
        };

        console.log(scheduleData);

        try {
            setIsLoading(true);
            await updateSchedule(scheduleId, scheduleData);
            setIsLoading(false);

            alert('Schedule updated successfully');

            let sensorId = localStorage.getItem('sensorId');
            navigate(`/user/schedules/${sensorId}`);
        } catch (error) {
            setIsLoading(false);
            console.error('Error updating schedule:', error);
            setError(error.response?.data?.message || 'Failed to update schedule');
        }
    };

    return (
        <main className="edit-schedule-page main py-5">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="page-title">
                            <FormattedMessage id="editSchedulePage.title" defaultMessage="Edit Schedule" />
                        </h1>
                    </div>
                </div>

                <div className="row form-container">
                    <div className="col-md-6">
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : isLoading ? (
                            <p>Loading schedule data...</p>
                        ) : (
                            <form onSubmit={handleEditSchedule}>
                                <div className="mb-3">
                                    <label htmlFor="startTime" className="form-label"><FormattedMessage id="editSchedulePage.StartTime" defaultMessage="Start Time:" /></label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="endTime" className="form-label"><FormattedMessage id="editSchedulePage.EndTime" defaultMessage="End Time:" /></label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
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

export default EditSchedulePage;
