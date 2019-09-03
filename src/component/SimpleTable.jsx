import React, { Component } from 'react';
import MaterialTable from 'material-table';
import './SearchBar.css';
import { object } from 'prop-types';


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
            column1:[],
            contacts:[],
            permContacts:[],
            url : this.props.url,
        }
        
    }

    setHeader=(row)=>{
        let col = Object.keys(row);
        let values = Object.values(row);
        console.log(row);
        
        for (let index = 0; index < col.length; index++) {
            let object1 = {
                title : '',
                field : ''
            };
            
            console.log(col[index]+"  "+typeof values[index]);
            
            object1.title = col[index];
            object1.field = col[index];

            if (typeof values[index] !== 'object') {
                this.state.column1.push(object1);  
            }
        }
        
    }

    filterList=(value)=>{
        var updatedList = this.state.permContacts;
        updatedList = updatedList.filter((item)=>{
            let flag = false;
            for (let index = 0; index <  this.state.column1.length; index++) {
                const element =  this.state.column1[index];
                if (item[element.title].toString().search(value)!==-1) {
                    flag = true;
                }
            }
            if(flag)
                return true;
            else
                return false;
        });
        this.setState({contacts: updatedList});
    } 

    UNSAFE_componentWillMount() {
        this.renderMyData();
    }

    renderMyData=() =>{
        fetch(this.state.url)
        .then(res => res.json())
        .then((data) => {
            this.setHeader(data[0]);
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
                title=""
                columns={this.state.column1}
                data={this.state.contacts}
            />
          );
    }
}
 
export default SimpleTable;