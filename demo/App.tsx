import '../src/calendar.css';
import '../src/defaultTheme.css';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Calendar from '../src/calendar';

function App() {
    const [selection, setSelection] = useState<Date | [Date, Date] | null>(null);

    return <Calendar rangeSelection selection={selection} onChange={setSelection} />;
}

ReactDOM.render(<App />, document.querySelector('#root'));
