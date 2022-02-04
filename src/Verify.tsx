import React from 'react';
import { Table } from 'react-bootstrap';

interface VerifyProps {
    data: any[],
    goBack: () => void,
    goForward: () => void
}

const Verify = ({ data, goBack, goForward }: VerifyProps) => {
    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    const header = keys.map(key => <th key={key}>{key}</th>);

    return (
        <div className="h-100 d-flex justify-content-center align-content-center">
            <div className="d-flex align-self-center flex-column">
                <h1 className="text-center">Here's the data we found</h1>
                <p className="text-center lead">(the first ten rows)</p>
                <Table className="mt-2" hover variant='dark'>
                    <thead>
                        <tr>{header}</tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 10).map((row: string[], i) => {
                            const rowDOM = Object.values(row).map(
                                (x, j) => <td key={j}>{x.slice(0, 50)}</td>
                            );
                            return (
                                <tr key={i}>{rowDOM}</tr>
                            )

                        })}
                    </tbody>
                </Table>
                <div className="mt-2 text-center d-flex justify-content-around">
                    <button className="btn btn-danger mr-2" onClick={goBack}>Go back</button>
                    <button className="btn btn-success" onClick={goForward}>Looks great!</button>
                </div>
            </div>
        </div>
    );
}

export default Verify;