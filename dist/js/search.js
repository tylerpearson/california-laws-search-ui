var Search = React.createClass({displayName: "Search",

    getInitialState: function() {
        return {
            searchQuery: "",
            searchResults: [],
            runningSearch: null
        }
    },
    componentDidMount: function() {
        this.setState({searchQuery: this.getSearchParameterValue()}, function() {
            if (this.state.searchQuery && this.state.searchQuery.length) {
                this.getResults();
            }
        });
    },
    getResults: function() {
        if (this.state.runningSearch) {
            this.state.runningSearch.abort();
        }

        this.setState({runningSearch: null});

        var search = $.get(this.props.source + '/' + this.state.searchQuery, function(results) {
                var sections = results.sections;

                if (this.isMounted() && sections.length) {
                    this.setState({searchResults: sections})
                }
            }.bind(this));

        this.setState({runningSearch: search});
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
        if (query.length) {
            history.replaceState(null, query, window.location.origin + "?search=" + query);
        } else {
            history.replaceState(null, query, window.location.origin);
        }
    },
    onSearchUpdate: function() {
        var query = this.refs.searchInput.getDOMNode().value;

        this.setState({searchQuery: query}, function() {
            if (query && query.length) {
               this.getResults();
            }

            this.updateSearchParam(query);
        });
    },
    render: function() {
        if (this.state.searchResults.length) {
            var searchResults = (React.createElement(SearchResults, {results:  this.state.searchResults}));
        }

        return (
            React.createElement("div", {className: "search-wrap"}, 
                React.createElement("h1", {className: "search-title"}, "Hi, I am the title"), 
                React.createElement("form", {className: "search-form"}, 
                    React.createElement("input", {className: "search-input", type: "search", placeholder: "Search for something...", ref: "searchInput", onChange:  this.onSearchUpdate, value:  this.state.searchQuery})
                ), 
                searchResults
            )
        )
    }

});

var SearchResults = React.createClass({displayName: "SearchResults",
    render: function() {
        var results = this.props.results.map(function(result, index) {
            var formattedResult = [];

            for (var prop in result) {
                if (result.hasOwnProperty(prop)) {
                    formattedResult.push("<p><strong>" + prop + "</strong> " + result[prop])
                }
            }

            return (
                React.createElement("li", {key: index}, formattedResult.join(''))
            )
        }, this)


        return (
            React.createElement("div", {className: "search-results"}, 
                React.createElement("ul", null, 
                    results
                )
            )
        )
    }

});

React.render(
    React.createElement(Search, {source: "https://api.calilaws.com/v1/search"}), document.getElementById('search')
);
