import React from 'react';

class SearchResult extends React.Component {
    render() {
        var codeLink = "https://api.calilaws.com/v1/sections/" + this.props.id;

        return (
            <section className="search-result-wrap">
                <p className="result-meta"><a href={codeLink} target="_blank">{this.props.id}</a></p>
                <p>{this.props.content}</p>
                <p className="result-history">{this.props.history}</p>
            </section>
        )
    }

}

export default SearchResult;
