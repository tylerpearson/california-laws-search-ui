var Search = React.createClass({

    getInitialState: function() {
        return {
            searchQuery: "",
            searchResults: []
        }
    },
    componentDidMount: function() {
        this.setState({searchQuery: this.getSearchParameterValue()}, function() {
            if (this.state.searchQuery.length) {
                this.getResults();
            }
        });
    },
    getResults: function() {
        $.get(this.props.source + '/' + this.state.searchQuery, function(results) {
            var sections = results.sections;

            if (this.isMounted() && sections.length) {
                this.setState({searchResults: sections})
            }
        }.bind(this));
    },
    getSearchParameterValue: function() {
        if (window.location.search) {
            var results = window.location.search.split('search=');
            if (results[1]) {
                var query =  results[1].replace('/', '');
                return query;
            }
        }
    },
    updateSearchParam: function(query) {
         history.replaceState(null, query, window.location.origin + "?search=" + query);
    },
    onSearchUpdate: function() {
        var query = this.refs.searchInput.getDOMNode().value;

        if (query && query.length) {
           this.getResults(query);
        }

        this.setState({searchQuery: query});
        this.updateSearchParam(query);
    },
    render: function() {
        if (this.state.searchResults.length) {
            var searchResults = (<SearchResults results={ this.state.searchResults } />);
        }

        return (
            <div className="search-form">
                <h1>This is the search</h1>
                <input type="search" ref="searchInput" onChange={ this.onSearchUpdate } value={ this.state.searchQuery }  />
                {searchResults}
            </div>
        )
    }

});

var SearchResults = React.createClass({
    render: function() {
        var results = this.props.results.map(function(result, index) {
            var formattedResult = [];

            for (var prop in result) {
                if (result.hasOwnProperty(prop)) {
                    formattedResult.push("<p><strong>" + prop + "</strong> " + result[prop])
                }
            }

            return (
                <li key={index}>{formattedResult.join('')}</li>
            )
        }, this)


        return (
            <ul>
                {results}
            </ul>
        )
    }

});

React.render(
    <Search source="https://api.calilaws.com/v1/search" />, document.getElementById('search')
);
