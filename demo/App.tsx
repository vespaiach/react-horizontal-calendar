import React from 'react';
import ReactDOM from 'react-dom';

import DatePicker from '../src';

function App() {
    return (
        <div>
            <DatePicker />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));
