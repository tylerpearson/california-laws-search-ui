import React from 'react';
import Search from './search';

React.render(
    <Search source="https://api.calilaws.com/v1/search" />, document.getElementById('search')
);
