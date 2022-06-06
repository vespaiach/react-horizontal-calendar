import '../src/calendar.css';
import '../src/defaultTheme.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Calendar from '../src';

function App() {
    return (
        <div>
            <Calendar allowRangeSelection />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
