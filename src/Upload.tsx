import React, { useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

interface UploadProps {
    setData: (data: any[]) => void,
    setLoading: (loading: boolean) => void
}

const Upload = ({ setData, setLoading }: UploadProps) => {
    const [error, setError] = useState<string>("");
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        cardRef.current?.classList.remove('bg-transparent');
        cardRef.current?.classList.add('bg-white');
        cardRef.current?.classList.add('bg-opacity-25');
    }
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        cardRef.current?.classList.remove('bg-white');
        cardRef.current?.classList.remove('bg-opacity-25');
        cardRef.current?.classList.add('bg-transparent');
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        setLoading(true);
        handleDragLeave(e);

        if (!e.dataTransfer.items) {
            setError("No data selected");
            return;
        }

        if (e.dataTransfer.items.length > 1) {
            setError("Only one file can be uploaded at a time");
            return;
        }

        const file = e.dataTransfer.files[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: ({ data, errors }) => {
                setLoading(false);
                
                if (errors.length > 0) {
                    setError(`${errors.length} errors found. Please check your file.`);
                    return;
                }

                if (data.length === 0) {
                    setError("No data found in file");
                    return;
                }

                setData(data);
            }
        })

    }

    return (
        <div className="h-100 d-flex justify-content-center align-content-center">
            <div className="d-flex align-self-center w-75 h-50 flex-column">
                <h1 className="text-center mb-3">Drop a CSV file here:</h1>
                <Card 
                    className={`bg-transparent ${error ? "border-danger" : "upload-zone"} w-100 h-100`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    ref={cardRef}
                >
                    <Card.Body>
                        <div className='w-100 h-100 d-flex justify-content-center align-content-center'>
                            <div className="d-flex align-self-center">
                                <FontAwesomeIcon icon={faUpload} size="5x" className="text-center mb-3" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                {
                    error
                    ? (
                        <div className="text-center mt-2">
                            <h3 className="text-danger">Error: {error}</h3>
                        </div>
                    )
                    : null
                }
            </div>
        </div>
    );
}

export default Upload;