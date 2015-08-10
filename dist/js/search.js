var Search = React.createClass({displayName: "Search",

    documentTitle: "California laws search",

    getInitialState: function() {
        return {
            searchQuery: "",
            searchResults: [],
            runningSearch: null,
            searching: false
        }
    },
    componentDidMount: function() {
        this.setState({searchQuery: this.getSearchParameterValue()}, function() {
            if (this.state.searchQuery && this.state.searchQuery.length) {
                this.getResults();
                document.title = this.state.searchQuery + " - " + this.documentTitle;
            }
        });
    },
    getResults: function() {
        if (this.state.runningSearch) {
            this.state.runningSearch.abort();
        }

        this.setState({runningSearch: null, searching: true});

        var search = $.get(this.props.source + '/' + this.state.searchQuery.toLowerCase(), function(results) {
                var sections = results.sections;

                if (this.isMounted()) {
                    this.setState({searchResults: sections, searching: false})
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
            document.title = query + " -  " + this.documentTitle;
        } else {
            history.replaceState(null, query, window.location.origin);
            document.title = "California laws search"
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
        return (
            React.createElement("div", null, 
                React.createElement("header", {className: "header"}, 
                    React.createElement("p", {className: "search-prompt"}, "I want to search California laws for:"), 
                    React.createElement("form", {className: "search-form"}, 
                        React.createElement("input", {className: "search-input", type: "search", placeholder: "Search California state laws...", ref: "searchInput", onChange:  this.onSearchUpdate, value:  this.state.searchQuery})
                    )
                ), 

                React.createElement("div", {className: "container"}, 
                    React.createElement("div", {className: "search-wrap"}, 
                        React.createElement(SearchResultsList, {searchQuery: this.state.searchQuery, results:  this.state.searchResults, searching: this.state.searching})
                    )
                )
            )
        )
    }

});

var SearchResultsList = React.createClass({displayName: "SearchResultsList",
    render: function() {
        if (this.props.results.length) {
            var results = this.props.results.map(function(result, index) {
                return (
                    React.createElement("li", {key: index}, 
                        React.createElement(SearchResult, {content: result.content, history: result.history, id: result.id})
                    )
                )

            }, this)
        } else {
            if (this.props.searching) {
                 return (React.createElement("li", {className: "searching-info", key: "1"}, "Searching for \"", this.props.searchQuery, "\"..."))
            } else {
                return (React.createElement("li", {className: "searching-info", key: "1"}, "No results for \"", this.props.searchQuery, "\""))
            }
        }

        return (
            React.createElement("div", {className: "search-results"}, 
                React.createElement("ul", null, 
                    results
                )
            )
        )
    }

});


var SearchResult = React.createClass({displayName: "SearchResult",

    render: function() {
        var codeLink = "https://api.calilaws.com/v1/sections/" + this.props.id;

        return (
            React.createElement("section", {className: "search-result-wrap"}, 
                React.createElement("p", {className: "result-meta"}, React.createElement("a", {href: codeLink, target: "_blank"}, this.props.id)), 
                React.createElement("p", null, this.props.content), 
                React.createElement("p", {className: "result-history"}, this.props.history)
            )
        )
    }

});

React.render(
    React.createElement(Search, {source: "https://api.calilaws.com/v1/search"}), document.getElementById('search')
);
