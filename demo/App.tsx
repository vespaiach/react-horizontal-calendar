import '../src/datepicker.css';
import '../src/defaultTheme.css';

import React from 'react';
import ReactDOM from 'react-dom';

import DatePicker from '../src';

function App() {
    return (
        <div>
            <DatePicker allowRangeSelection />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
