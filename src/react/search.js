var Search = React.createClass({

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

});

var SearchResultsList = React.createClass({
    render: function() {
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
                 return (<li className="searching-info" key="1">Searching for "{this.props.searchQuery}"...</li>)
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

});


var SearchResult = React.createClass({

    render: function() {
        var codeLink = "https://api.calilaws.com/v1/sections/" + this.props.id;

        return (
            <section className="search-result-wrap">
                <p className="result-meta"><a href={codeLink} target="_blank">{this.props.id}</a></p>
                <p>{this.props.content}</p>
                <p className="result-history">{this.props.history}</p>
            </section>
        )
    }

});

React.render(
    <Search source="https://api.calilaws.com/v1/search" />, document.getElementById('search')
);
