import React from 'react';
import SearchResult from './search-result';

class SearchResultsList extends React.Component {
    render() {
        if (this.props.results.length) {
            var results = this.props.results.map(function(result, index) {
                return (
                    <li key={index}>
                        <SearchResult content={result.content} history={result.history} id={result.id} />
                    </li>
                )

            }, this)
        } else {
            if (this.props.searching) {
                 return (<li className="searching-info" key="1">Searching the state code for {this.props.searchQuery}...</li>)
            } else {
                return (<li className="searching-info" key="1">No results for "{this.props.searchQuery}"</li>)
            }
        }

        return (
            <div className="search-results">
                <ul>
                    {results}
                </ul>
            </div>
        )
    }

}

export default SearchResultsList;
