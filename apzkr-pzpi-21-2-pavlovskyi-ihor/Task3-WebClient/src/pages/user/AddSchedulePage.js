import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { addSchedule } from '../../services/ScheduleService';
import { getSensorsByUserId } from '../../services/SensorService';
import { format } from 'date-fns';
import '../../styles/user/addSchedule.css';

const AddSchedulePage = () => {
  const { sensorId } = useParams();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSensors = async () => {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        alert("User not found. Please log in.");
        return;
      }

      try {
        const data = await getSensorsByUserId(user.userId);
        setSensors(data);
      } catch (error) {
        console.error('Error fetching sensors:', error);
        alert('Failed to load sensors. Please try again later.');
      }
    };

    fetchSensors();
  }, []);

  const handleAddSchedule = async (event) => {
    event.preventDefault();

    const startTimeUTC = format(new Date(startTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    const endTimeUTC = format(new Date(endTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    const scheduleData = {
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      sensorId: parseInt(sensorId, 10),
    };

    try {
      setIsLoading(true);
      await addSchedule(scheduleData);
      setIsLoading(false);

      alert('Schedule created successfully');
      navigate(`/user/schedules/${sensorId}`);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating schedule:', error);

      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Failed to create schedule');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <main className="add-schedule-page main py-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="page-title">
              <FormattedMessage id="addSchedulePage.title" defaultMessage="Add Schedule" />
            </h1>
          </div>
        </div>
        <div className="row form-container">
          <div className="col-md-6">
            <form onSubmit={handleAddSchedule}>
              <div className="mb-3">
                <label htmlFor="startTime" className="form-label"><FormattedMessage id="addSchedulePage.StartTime" defaultMessage="Start Time:" /></label>
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
                <label htmlFor="endTime" className="form-label"><FormattedMessage id="addSchedulePage.EndTime" defaultMessage="End Time:" /></label>
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
                {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Add Schedule'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddSchedulePage;
