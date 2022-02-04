import React, { useState } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Dropdown, Form, FormControl } from 'react-bootstrap';
import _ from 'lodash';

enum OperationType {
    Count = "Count"
}

interface OperationProps {
    type: OperationType,
    headers: string[],
    removeSelf: () => void
}

class Operation extends React.Component<OperationProps, {}> {
    constructor(props: OperationProps) {
        super(props);
    }

    renderCountComponent() {
        return (
            <div className="operation">
                Count occurrences of <FormControl className="d-inline w-25" type="text" /> in <Form.Select className="d-inline w-25">{this.props.headers.map((header, i) => <option key={i}>{header}</option>)}</Form.Select> and store it in the variable <Form.Control className="d-inline w-25" type="text" />.
            </div>
        )
    }

    render() {
        if (this.props.type === OperationType.Count) {
            return this.renderCountComponent();
        }
        return null;
    }
}

interface ProcessProps {
    headers: string[],
    goForward: () => void
}

const Process = ({ headers, goForward }: ProcessProps) => {
    const [operations, setOperations] = useState<any[]>([]);
    
    const addOperation = (type: OperationType) =>{
        const id = _.uniqueId();
        console.log(`Adding ${type} with id ${id}`);
        const removeOperation = () => {
            setOperations(operations.filter(elt => elt.id !== id));
        }

        setOperations([...operations, {
            id: id,
            elt: (<Operation key={id} headers={headers} type={type} removeSelf={removeOperation} />)
        }]);
    }

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <Card className="w-75 h-75 bg-transparent border border-light">
                <Card.Body>
                    <h1>Process the data</h1>
                    {operations.map(elt => elt.elt)}
                    <Dropdown>
                        <Dropdown.Toggle variant='primary'>
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" /> Add operation
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {Object.keys(OperationType).map((type, i) => (
                                <Dropdown.Item 
                                    key={i} 
                                    onClick={() => addOperation(type as OperationType)}
                                >
                                    {type}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Process;