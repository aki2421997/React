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
            column2:[],
            column3:[],
            contacts:[],//data to be displayed
            permContacts:[],//data received
            contactsTemp:[],//for filtering purpose
            url : this.props.url,
        }
        
    }

    setHeaderColumn2=(row)=>{
        let col = Object.keys(row);
        let values = Object.values(row);
        for (let index = 0; index < col.length; index++) {

            
            //to push in column2 for mui table
            let object1 = {
                title : '',
                field : ''
            };
            
            object1.title = col[index];
            object1.field = col[index];

            if (typeof values[index] !== 'object') {
                if(this.check(col[index]))
                    this.state.column2.push(object1);  
            }
            else{
                this.getObject(values[index],col[index]);
            }
        }
    }

    //to get path of required nested key 
    getObject=(theObject,string)=> {
        var result = null;
        var  temp = string;
        if(theObject instanceof Array) {
            for(var i = 0; i < theObject.length; i++) {
                result = this.getObject(theObject[i],string);
                if (result) {
                    break;
                }   
            }
        }
        else
        {
            
            for(var prop in theObject) {
                if(this.check(prop)) {
                    string += "."+prop;
                    let object1 = {
                        title : '',
                        field : ''
                    };
                    object1.title = prop;
                    object1.field = string;
                    this.state.column2.push(object1);
                    string = temp;
                }
                
                if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    string += "."+prop;
                    // console.log(string);
                    
                    result = this.getObject(theObject[prop],string);
                    string = temp;
                } 
            }
        }
        return result;
    }

    //to check val is present in this.props.header
    check=(val)=>{
        for (let index = 0; index < this.props.header.length; index++) {
            if(val.toLowerCase() === this.props.header[index].toLowerCase()){
                return true;
            }
            
        }
        return false;
    }

    //to set column for mui table
    setHeaderContacts=()=>{
        for (let index = 0; index < this.state.column2.length; index++) {
            let object1 = {
                title : '',
                field : ''
            };
            let getLastElem = this.state.column2[index].field.split(".");
            object1.title = getLastElem[getLastElem.length-1];
            object1.field = getLastElem[getLastElem.length-1];
            this.state.column3.push(object1);
            
        }
    }

    //to build data from api call as per keys in this.props.header
    modifyData=()=>{
        for (let index1 = 0; index1 < this.state.permContacts.length; index1++) {
            let object2 = {};
            for (let index = 0; index < this.state.column2.length; index++) {
                
                let z = this.state.column2[index].field.split(".");
                let temp ;
                var p = this.state.permContacts[index1];
                for (let index = 0; index < z.length; index++) {
                    p = p[z[index]];
                    temp = z[index];
                }
                object2[ temp]=p;
            }
            this.state.contacts.push(object2);
        }
    }

    //for filtering the this.state.contacts
    filterList=(value)=>{
        var updatedList = this.state.contacts;
        console.log(updatedList);
        
        updatedList = updatedList.filter((item)=>{
            let flag = false;
            for (let index = 0; index <  Object.keys(this.state.contacts[0]).length-1; index++) {
                let getLastElem = this.state.column2[index].field.split(".");
                if (item[getLastElem[getLastElem.length-1]].toString().toLowerCase().search(value.toLowerCase())!==-1) {
                    flag = true;
                }
            }
            if(flag)
                return true;
            else
                return false;
        });
        this.setState({contactsTemp: updatedList});
    }

    UNSAFE_componentWillMount() {
        this.renderMyData();
    }

    //make api call 
    renderMyData=() =>{
        fetch(this.state.url)
        .then(res => res.json())
        .then((data) => {
            this.setHeaderColumn2(data[0]);
            this.setState({ permContacts : data})
            this.modifyData();
            this.setHeaderContacts();
            this.setState({ contactsTemp:this.state.contacts})
        })
        .catch(console.log)
    }

    //on change in search bar (handle onChange)
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
                columns={ this.state.column3}
                data={this.state.contactsTemp}
            />
          );
    }
}
 
export default SimpleTable;