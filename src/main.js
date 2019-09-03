import React, { Component } from 'react';
import SimpleTable from './component/SimpleTable';
import './main.css';
import SearchBar from './component/SearchBar';

class Main extends Component {
    state = { 
        url1: 'http://jsonplaceholder.typicode.com/users',
        url2: 'https://jsonplaceholder.typicode.com/comments',
        value: '',
        header: ["name","street","lat","catchPhrase"]
     }

     updateValue=(value)=>{
        this.setState(()=>({
            value 
        }))
     }

    render() { 
        return (
            <div>
                <SearchBar updateValue={this.updateValue} value={this.state.value}/>
                <SimpleTable classname="col" url={this.state.url1} value={this.state.value} header={this.state.header}/>
                <SimpleTable classname="col" url={this.state.url2} value={this.state.value} header={this.state.header}/>
            </div>
          );
    }
}
 
export default Main;