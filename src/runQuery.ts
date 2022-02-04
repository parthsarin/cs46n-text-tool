// @ts-ignore
import * as brain from 'brain.js/dist/brain-browser';

enum OperationType {
    Count = "Count",
    LSTMClassifier = "LSTM Classifier"
}

interface Params {
    [key: string]: any;
    output: string;
}

interface CountAnalysisParams extends Params {
    terms: string[],
    variable: string,
    output: string
}

const runCountQuery = (row: any, query: CountAnalysisParams): any => {
    const { variable, terms, output } = query;
    const slug = row[variable];
    
    const n = slug
               .split(' ')
               .map((term: string) => terms.includes(term) ? 1 : 0)
               .reduce((a: number, b: number) => a + b, 0);

    return {
        ...row,
        [output]: n
    }
}

interface LSTMClassifierParams extends Params {
    inputVariable: string,
    labelVariable: string,
    trainOnVariable: string,
    predictOnVariable: string,
    output: string,
}

const runLSTMClassifier = (data: any[], query: LSTMClassifierParams): any[] => {
    const net = new brain.recurrent.LSTM();

    // Train
    const trainFilter = data.filter(row => row[query.trainOnVariable] === '1');
    const trainData = trainFilter.map(row => ({
        'input': row[query.inputVariable], 'output': row[query.labelVariable]
    }));
    console.log(trainData);
    net.train(trainData);

    // Predict
    return data.map(row => ({
        ...row,
        [query.output]: row[query.predictOnVariable] === '1' ? net.run(row[query.inputVariable]) : ""
    }));
}

const runQuery = (data: any[], query: Params): any[] => {
    if (query.type === OperationType.Count) {
        return data.map(row => runCountQuery(row, query as CountAnalysisParams));
    }

    if (query.type === OperationType.LSTMClassifier) {
        return runLSTMClassifier(data, query as LSTMClassifierParams);
    }
    
    return [];
}

export default runQuery;
export type { Params, CountAnalysisParams, LSTMClassifierParams };
export { OperationType };