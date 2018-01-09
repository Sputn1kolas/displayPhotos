import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './components/registerServiceWorker';

require("./styles/application.css");

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
