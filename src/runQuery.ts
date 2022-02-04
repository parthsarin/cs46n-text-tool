import { CountAnalysisParams, OperationType, Params } from "./Process";

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

const runQuery = (data: any[], query: Params): any[] => {
    return data.map(row => {
        if (query.type === OperationType.Count) {
            return runCountQuery(row, query as CountAnalysisParams);
        } 

        return null;
    })
}

export default runQuery;