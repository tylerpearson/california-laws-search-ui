import React from 'react';
import SearchResultsList from './search-results-list';

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchQuery: "",
            searchResults: [],
            runningSearch: null,
            searching: false,
            documentTitle: "California laws search"
        };

        this.getResults = this.getResults.bind(this);
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
    }

    componentDidMount() {
        this.setState({searchQuery: this.getSearchParameterValue()}, function() {
            if (this.state.searchQuery && this.state.searchQuery.length) {
                this.getResults();
                document.title = this.state.searchQuery + " - " + this.state.documentTitle;
            }
        });
    }

    getResults() {
        if (this.state.runningSearch) {
            this.state.runningSearch.abort();
        }

        this.setState({runningSearch: null, searching: true});

        var search = $.get(this.props.source + '/' + this.state.searchQuery.toLowerCase(), function(results) {
                var sections = results.sections;

                this.setState({searchResults: sections, searching: false})

            }.bind(this));

        this.setState({runningSearch: search});
    }

    getSearchParameterValue() {
        if (window.location.search) {
            var results = window.location.search.split('search=');
            if (results[1]) {
                var query =  results[1].replace('/', '');
                return query;
            }
        }
    }

    updateSearchParam(query) {
        if (query.length) {
            history.replaceState(null, query, window.location.origin + "?search=" + query);
            document.title = query + " -  " + this.state.documentTitle;
        } else {
            history.replaceState(null, query, window.location.origin);
            document.title = "California laws search"
        }
    }

    onSearchUpdate() {
        var query = this.refs.searchInput.getDOMNode().value;

        this.setState({searchQuery: query}, function() {
            if (query && query.length) {
               this.getResults();
            }

            this.updateSearchParam(query);
        });
    }

    render() {
        return (
            <div>
                <header className="header">
                    <p className="search-prompt">I want to search California laws for:</p>
                    <form className="search-form">
                        <input className="search-input" type="search" placeholder="Search California state laws..." ref="searchInput" onChange={ this.onSearchUpdate } value={ this.state.searchQuery }  />
                    </form>
                </header>

                <div className="container">
                    <div className="search-wrap">
                        <SearchResultsList searchQuery={this.state.searchQuery} results={ this.state.searchResults } searching={this.state.searching} />
                    </div>
                </div>
            </div>
        )
    }

}


export default Search;
