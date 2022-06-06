import React from 'react';
import ReactDOM from 'react-dom';

import Calendar from '../src/calendar';

function App() {
    return (
        <div>
            <Calendar allowRangeSelection />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
