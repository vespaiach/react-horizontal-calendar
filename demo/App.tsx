import './app.css';
import '../src/defaultTheme.css';

import React from 'react';
import ReactDOM from 'react-dom';

import DatePicker from '../dist/datepicker.bundle';

function App() {
    return (
        <div>
            <DatePicker allowRangeSelection />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
