import React, { Component } from 'react';
import MaterialTable from 'material-table';
import './SearchBar.css';


class SimpleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            column:[
                { title: 'Name', field: 'name' },
                { title: 'Username', field: 'username' },
                { title: 'Email', field: 'email'},
                { title: 'Catch Phrase', field: 'company.catchPhrase'},
            ],
            contacts:[],
            permContacts:[],
            url : this.props.url,
            value:''
        }
        
    }


    filterList=(value)=>{
        var updatedList = this.state.permContacts;
        updatedList = updatedList.filter(function(item){
            return ((item.name.toLowerCase().search(value.toLowerCase())!== -1) || (item.username.toLowerCase().search(value.toLowerCase())!== -1))
        });
        this.setState({contacts: updatedList});
    } 

    componentDidMount=() =>{
        fetch(this.state.url)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            
          this.setState({ contacts: data ,permContacts : data})
        })
        .catch(console.log)
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.filterList(this.props.value);
            this.setState({value:this.props.value})
        }
       }

    render() {
        return (
            <MaterialTable
                onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
                options={{
                rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                  }),
                headerStyle: {
                  backgroundColor: '#01579b',
                  color: '#FFF'
                }
                }}
                title="Employee Details"
                columns={this.state.column}
                data={this.state.contacts}
            />
          );
    }
}
 
export default SimpleTable;