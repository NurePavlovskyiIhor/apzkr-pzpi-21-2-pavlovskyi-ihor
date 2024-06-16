import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import '../../styles/user/greenhouses.css';
import { useNavigate } from 'react-router-dom';
import { deleteGreenhouse, getGreenhouseByUserId } from '../../services/GreenhouseService';

const GreenhousesPage = () => {
    const [greenhouses, setGreenhouses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    useEffect(() => {
        const fetchGreenhouses = async () => {
            try {
                const greenhouses = await getGreenhouseByUserId(user.userId);
                setGreenhouses(greenhouses);
                console.log(greenhouses);
                if (greenhouses.length === 0) {
                    setError("No greenhouses found.");
                } else {
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching greenhouses:', error);
                setError('Failed to fetch greenhouses');
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.userId) {
            fetchGreenhouses();
        } else {
            setIsLoading(false);
            setError("User not found.");
        }
    }, [user?.userId]);

    const handleAddGreenhouse = () => {
        navigate('/user/addGreenhouse');
    };

    const handleEditGreenhouse = (greenhouseId) => {
        navigate(`/user/editGreenhouse/${greenhouseId}`);
    };

    const handleDeleteGreenhouse = async (greenhouseId) => {
        try {
            await deleteGreenhouse(greenhouseId);
            setGreenhouses(greenhouses.filter((greenhouse) => greenhouse.greenhouseId !== greenhouseId));
        } catch (error) {
            console.error('Error deleting greenhouse:', error);
            setError('Failed to delete greenhouse');
        }
    };

    const handleViewSensors = (greenhouseId) => {
        localStorage.setItem('greenhouseId', greenhouseId);
        navigate(`/user/sensors/${greenhouseId}`);
    };

    return (
        <main className="main py-5">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="page-title">
                            <FormattedMessage id="greenhousesPage.title" defaultMessage="Greenhouses" />
                        </h1>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col text-end">
                        <button onClick={handleAddGreenhouse} className="btn btn-primary btn-add">
                        <FormattedMessage id="greenhousesPage.AddGreenhouse" defaultMessage="Add Greenhouse" />
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        {isLoading ? (
                            <p>Loading greenhouses...</p>
                        ) : greenhouses && greenhouses.length > 0 ? (
                            <ul className="list-group">
                                {greenhouses.map(greenhouse => (
                                    <li key={greenhouse.greenhouseId} className="list-group-item greenhouse-item">
                                        {greenhouse.name}
                                        <div className="button-group">
                                            <button
                                                onClick={() => handleEditGreenhouse(greenhouse.greenhouseId)}
                                                className="btn btn-sm btn-edit"
                                            >
                                                <FormattedMessage id="greenhousesPage.Edit" defaultMessage="Edit" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGreenhouse(greenhouse.greenhouseId)}
                                                className="btn btn-sm btn-delete"
                                            >
                                                <FormattedMessage id="greenhousesPage.Delete" defaultMessage="Delete" />
                                            </button>
                                            <button
                                                onClick={() => handleViewSensors(greenhouse.greenhouseId)}
                                                className="btn btn-sm btn-view"
                                            >
                                                <FormattedMessage id="greenhousesPage.Viewsensors" defaultMessage="View sensors" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted"><FormattedMessage id="greenhousesPage.No" defaultMessage="No greenhouses found. Create one to get started." /></p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GreenhousesPage;
