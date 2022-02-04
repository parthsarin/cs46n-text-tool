import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { Card } from 'react-bootstrap';

const Download = ({ data }: { data: any[] }) => {
    const downloadRef = useRef(null);

    useEffect(() => {
        if (downloadRef.current) {
            // @ts-ignore
            downloadRef.current.link.click();
        }
    }, [])

    return (
        <div className="h-100 d-flex justify-content-center align-content-center">
            <div className="d-flex align-self-center w-75 h-50 flex-column">
                <h1 className="text-center mb-3">Downloading...</h1>
                <p className="lead text-center">(Didn't work? Click below)</p>
                <Card
                    className={`bg-transparent border border-light w-100 h-100 download-card`}
                    // @ts-ignore
                    onClick={() => { downloadRef.current!.link.click() }}
                >
                    <Card.Body>
                        <div className='w-100 h-100 d-flex justify-content-center align-content-center'>
                            <div className="d-flex align-self-center">
                                <FontAwesomeIcon icon={faDownload} size="5x" className="text-center mb-3" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <CSVLink 
                    data={data} 
                    filename={"data.csv"} 
                    className="hidden"
                    ref={downloadRef}
                    target="_blank"
                />
            </div>
        </div>
    );
}

export default Download;