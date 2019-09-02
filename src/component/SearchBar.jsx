import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class SearchBar extends Component {
    state = { 
        search : ''
    };
    
    updateSearch=(event)=>{
        this.props.updateValue(event.target.value);
        this.setState({search:event.target.value});
    }

    render() { 
        return (
                <form className="form-inline md-form form-sm mt-0">
                    <i className="glyphicon glyphicon-search" aria-hidden="true"></i>
                    <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" 
                    value={this.state.search} onChange={this.updateSearch} aria-label="Search"/>
                </form>
               );
    }
}
 
export default SearchBar;
