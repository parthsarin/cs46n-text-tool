import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CSVDownload } from 'react-csv';
import { Card } from 'react-bootstrap';

const Download = ({ data }: { data: any[] }) => {
    return (
        <div className="h-100 d-flex justify-content-center align-content-center">
            <div className="d-flex align-self-center w-75 h-50 flex-column">
                <h1 className="text-center mb-3">Downloading your file...</h1>
                <Card
                    className={`bg-transparent border border-light w-100 h-100`}
                >
                    <Card.Body>
                        <div className='w-100 h-100 d-flex justify-content-center align-content-center'>
                            <div className="d-flex align-self-center">
                                <FontAwesomeIcon icon={faDownload} size="5x" className="text-center mb-3" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <CSVDownload data={data} filename={"out.csv"} />
            </div>
        </div>
    );
}

export default Download;