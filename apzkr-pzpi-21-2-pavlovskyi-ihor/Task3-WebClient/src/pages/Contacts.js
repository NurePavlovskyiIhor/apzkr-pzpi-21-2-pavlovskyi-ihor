import React from 'react';
import { FormattedMessage } from 'react-intl';
import '../styles/contacts.css';

const Contacts = () => {
    return (
        <main className="contacts-main">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h1 className="contacts-title">
                            <FormattedMessage
                                id="contacts.title"
                                defaultMessage="Contacts"
                            />
                        </h1>
                        <div className="contacts-info">
                            <p>
                                <FormattedMessage
                                    id="contacts.address"
                                    defaultMessage="Address: 14 Nauki Ave, Kharkiv, Kharkiv Oblast, 61166"
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    id="contacts.email"
                                    defaultMessage="Email: {email}"
                                    values={{ email: <a className="contacts-link" href="mailto:info@nure.ua">info@nure.ua</a> }}
                                />
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="contacts-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.585434203698!2d36.22844991567559!3d50.01613027941704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a0f009ab9f07%3A0xa1e47ad2de915f81!2z0L_RgNC-0YHQvy4g0J3QsNGD0LrQuCwgMTQsINCl0LDRgNGM0LrQvtCyLCDQpdCw0YDRjNC60L7QstGB0LrQsNGPINC-0LHQu9Cw0YHRgtGMLCA2MTE2Ng!5e0!3m2!1sru!2sua!4v1621854967201!5m2!1sru!2sua"
                                width="600"
                                height="450"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Contacts;
