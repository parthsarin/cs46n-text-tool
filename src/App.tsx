import React, { useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import './App.css';
import Download from './Download';
import Process from './Process';
import runQuery, { Params } from './runQuery';
import Upload from './Upload';
import Verify from './Verify';

enum ProcessState {
  UploadFile,
  Verify,
  Process,
  Complete
}

function App() {
  const [processState, setProcessState] = useState<ProcessState>(ProcessState.UploadFile);
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = (data: any[]) => {
    setData(data);
    setProcessState(ProcessState.Verify);
  }

  const goBackFromVerify = () => {
    setData(null);
    setProcessState(ProcessState.UploadFile);
  }

  const handleProcess = (p: Params[]) => {
    setLoading(true);

    let mutableData = data!.slice();
    p.forEach(param => {
      mutableData = runQuery(mutableData, param);
    });

    setData(mutableData);
    setProcessState(ProcessState.Complete);
    setLoading(false);
  }

  let app;
  switch (processState) {
    case ProcessState.UploadFile:
      app = (
        <Upload setData={handleUpload} setLoading={setLoading} />
      );
      break;
  
    case ProcessState.Verify:
      app = (
        <Verify 
          data={data!} 
          goBack={goBackFromVerify} 
          goForward={() => setProcessState(ProcessState.Process)} 
        />
      );
      break;

    case ProcessState.Process:
      app = (
        <Process 
          headers={Object.keys(data![0])}
          goForward={handleProcess} 
        />
      );
      break;

    case ProcessState.Complete:
      app = (
        <Download data={data!} />
      );
      break;

    default:
      app = (
        <div className="app">
          <h1>Hello world!</h1>
        </div>
      );
      break;
  }

  if (loading) {
    return (
      <>
        <div className="loading">
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <PacmanLoader color={'#fff'} size={100} />
          </div>
        </div>
        {app}
      </>
    );
  } else {
    return app;
  }
}

export default App;
