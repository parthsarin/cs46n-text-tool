import React, { useState } from 'react';
import { CountAnalysisParams, LSTMClassifierParams, OperationType, Params } from './runQuery';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Dropdown, Form, FormControl, Button } from 'react-bootstrap';
import _ from 'lodash';

interface OperationProps {
    type: OperationType,
    headers: string[],
    removeSelf: () => void
}

interface OperationState {
    analysisParams: Params | null
}

class Operation extends React.Component<OperationProps, OperationState> {
    constructor(props: OperationProps) {
        super(props);

        if (props.type === OperationType.Count) {
            const defaultAP: CountAnalysisParams = {
                terms: [],
                variable: "",
                output: ""
            };

            this.state = {
                analysisParams: defaultAP
            }
        } else if (props.type === OperationType.LSTMClassifier) {
            const defaultAP: LSTMClassifierParams = {
                inputVariable: "",
                labelVariable: "",
                trainOnVariable: "",
                predictOnVariable: "",
                output: "",
            }

            this.state = {
                analysisParams: defaultAP
            }
        } else {
            this.state = {
                analysisParams: null
            }
        }
    }

    updateCountComponent(
            terms: string | null = null, 
            variable: string | null = null, 
            output: string | null = null
        ) {
        let termsList = terms !== null ? terms.split(',') : this.state.analysisParams!.terms;
        const newVariable = variable !== null ? variable.trim() : this.state.analysisParams!.variable;
        const newOutput = output !== null ? output.trim() : this.state.analysisParams!.output;

        termsList = termsList.map((term: string) => term.trim());
        termsList = termsList.filter((term: string) => term !== "");

        this.setState({
            analysisParams: {
                terms: termsList,
                variable: newVariable,
                output: newOutput
            }
        })
    }

    renderCountComponent() {
        const terms = (
            <FormControl 
                className="d-inline w-25" 
                type="text" 
                placeholder='enter comma-separated terms' 
                onChange={e => this.updateCountComponent(e.target.value, null, null)} 
            />
        );
        const variable = (
            <Form.Select 
                className="d-inline w-25" 
                onChange={e => this.updateCountComponent(null, e.target.value, null)}
            >
                    <option key={-1}>(select)</option>
                {
                    this.props.headers.map(
                        (header, i) => <option key={i}>{header}</option>
                    )
                }
            </Form.Select>
        )
        const output = (
            <Form.Control 
                className="d-inline w-25" 
                type="text" 
                onChange={e => this.updateCountComponent(null, null, e.target.value)} 
            />
        )

        return (
            <div className="operation">
                Count occurrences of {terms} in {variable} and store it in the variable {output}.
            </div>
        )
    }

    updateLSTMComponent(key: string, val: string) {
        this.setState({
            analysisParams: {
                ...this.state.analysisParams as LSTMClassifierParams,
                [key]: val
            }
        });
    }

    renderLSTMComponent() {
        const inputVariable = (
            <Form.Select
                className="d-inline w-25"
                onChange={e => this.updateLSTMComponent("inputVariable", e.target.value)}
            >
                <option key={-1}>(select)</option>
                {
                    this.props.headers.map(
                        (header, i) => <option key={i}>{header}</option>
                    )
                }
            </Form.Select>
        );

        const labelVariable = (
            <Form.Select
                className="d-inline w-25"
                onChange={e => this.updateLSTMComponent("labelVariable", e.target.value)}
            >
                <option key={-1}>(select)</option>
                {
                    this.props.headers.map(
                        (header, i) => <option key={i}>{header}</option>
                    )
                }
            </Form.Select>
        );

        const trainOnVariable = (
            <Form.Select
                className="d-inline w-25"
                onChange={e => this.updateLSTMComponent("trainOnVariable", e.target.value)}
            >
                <option key={-1}>(select)</option>
                {
                    this.props.headers.map(
                        (header, i) => <option key={i}>{header}</option>
                    )
                }
            </Form.Select>
        );

        const predictOnVariable = (
            <Form.Select
                className="d-inline w-25"
                onChange={e => this.updateLSTMComponent("predictOnVariable", e.target.value)}
            >
                <option key={-1}>(select)</option>
                {
                    this.props.headers.map(
                        (header, i) => <option key={i}>{header}</option>
                    )
                }
            </Form.Select>
        );

        const output = (
            <Form.Control
                className="d-inline w-25"
                type="text"
                onChange={e => this.updateLSTMComponent("output", e.target.value)}
            />
        )

        return (
            <div className="operation">
                Train an LSTM classifier on {inputVariable} and predict {labelVariable}. Train using the inputs that are marked with a "1" in {trainOnVariable} and predict for inputs marked with a "1" in {predictOnVariable}. Store the predictions in {output}.
            </div>
        )
    }

    render() {
        if (this.props.type === OperationType.Count) {
            return this.renderCountComponent();
        }

        if (this.props.type === OperationType.LSTMClassifier) {
            return this.renderLSTMComponent();
        }

        return null;
    }
}

interface ProcessProps {
    headers: string[],
    goForward: (p: Params[]) => void
}

const Process = ({ headers, goForward }: ProcessProps) => {
    const [operations, setOperations] = useState<any[]>([]);
    
    const addOperation = (type: OperationType) =>{
        const id = _.uniqueId();
        const ref = React.createRef<Operation>();
        const removeOperation = () => {
            setOperations(operations.filter(elt => elt.id !== id));
        }

        setOperations([...operations, {
            id: id,
            type: type,
            ref: ref,
            elt: (<Operation ref={ref} key={id} headers={headers} type={type} removeSelf={removeOperation} />)
        }]);
    }

    const advance = () => {
        let params = operations.map(({ type, ref }) => {
            const ap = ref.current.state.analysisParams;
            if (ap !== null) {
                return {...ap, type: type};
            } else {
                return null;
            }
        });
        params = params.filter(p => p !== null);

        goForward(params);
    }

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <Card className="w-75 h-75 bg-transparent border border-light">
                <Card.Body>
                    <h1>Process the data</h1>
                    {operations.map(elt => elt.elt)}
                    <Dropdown className="d-inline">
                        <Dropdown.Toggle variant='primary'>
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" /> Add operation
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {Object.values(OperationType).map((type, i) => (
                                <Dropdown.Item 
                                    key={i} 
                                    onClick={() => addOperation(type as OperationType)}
                                >
                                    {type}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button 
                        variant="success" 
                        onClick={advance}
                        style={{ marginLeft: '20px' }}
                    >Run Analysis</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Process;
export type { Params, CountAnalysisParams };
export { OperationType };