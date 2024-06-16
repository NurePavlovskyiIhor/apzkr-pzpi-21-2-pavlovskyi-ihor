import React from 'react';
import { FormattedMessage } from 'react-intl';
import '../styles/about.css';

const About = () => {
    return (
        <main className="main py-5">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>
                            <FormattedMessage
                                id="about.title"
                                defaultMessage="About Us"
                            />
                        </h1>
                        <p>
                            <FormattedMessage
                                id="about.description1"
                                defaultMessage="description"
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id="about.description2"
                                defaultMessage="description"
                            />
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default About;