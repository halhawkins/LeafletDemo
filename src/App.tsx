import React from 'react';
import './App.css';
import MapComponent from './MapCompoment/MapComponent';
import 'leaflet/dist/leaflet.css';
import ErrorBoundary from './ErrorMessage/ErrorBoundary';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import BottomPanel from './BottomPanel/BottomPanel';

const FaultyComponent = () => {
  throw new Error('This is a test error');
  return <div>Will never render</div>;
};

function App() {
  return (
      <div className="App">
        <ErrorBoundary>
          <div className="app-container">
            <MapComponent/>
            {/* <FaultyComponent /> */}
            {/* <ErrorMessage message='This is a message' /> */}
            <BottomPanel />
          </div>
        </ErrorBoundary>
      </div>
  );
}

export default App;
