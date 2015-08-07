var Search = React.createClass({displayName: "Search",

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
            var searchResults = (React.createElement(SearchResults, {results:  this.state.searchResults}));
        }

        return (
            React.createElement("div", {className: "search-form"}, 
                React.createElement("h1", null, "This is the search"), 
                React.createElement("input", {type: "search", ref: "searchInput", onChange:  this.onSearchUpdate, value:  this.state.searchQuery}), 
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
            React.createElement("ul", null, 
                results
            )
        )
    }

});

React.render(
    React.createElement(Search, {source: "https://api.calilaws.com/v1/search"}), document.getElementById('search')
);
