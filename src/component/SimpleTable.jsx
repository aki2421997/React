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
            column1:[],
            column2:[],
            contacts:[],
            permContacts:[],
            url : this.props.url,
        }
        
    }

    setHeaderColumn1=(row)=>{
        let col = Object.keys(row);
        let values = Object.values(row);
        console.log(col+"         "+values);
        
        for (let index = 0; index < col.length; index++) {
            let object1 = {
                title : '',
                field : ''
            };

            //console.log(col[index]+"  "+typeof values[index]);
            
            object1.title = col[index];
            object1.field = col[index];

            if (typeof values[index] !== 'object') {
                this.state.column1.push(object1);  
            }
        }
        
    }

    setHeaderColumn2=(row)=>{
        let col = Object.keys(row);
        let values = Object.values(row);
        console.log(row);
        
        for (let index = 0; index < col.length; index++) {
            let object1 = {
                title : '',
                field : ''
            };

            // console.log(Object.keys(values[index])+"  "+values[index]);
            
            object1.title = col[index];
            object1.field = col[index];

            if (typeof values[index] !== 'object') {
                if(this.check(col[index]))
                    this.state.column1.push(object1);  
            }
            else{
                this.getObject(values[index],col[index]);
                // if(temp){
                //     object1.title = temp;
                //     object1.field = temp;
                //     this.state.column1.push(object1);
                // }
                // console.log(temp);
            }
        }
    }

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
                console.log(prop + ': ' + theObject[prop]);
                if(this.check(prop)) {
                    string += "."+prop;
                    let object1 = {
                        title : '',
                        field : ''
                    };
                    object1.title = prop;
                    object1.field = string;
                    this.state.column1.push(object1);
                    string = temp;
                }
                
                if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    string += "."+prop;
                    console.log(string);
                    
                    result = this.getObject(theObject[prop],string);
                    string = temp;
                } 
            }
        }
        return result;
    }

    check=(val)=>{
        for (let index = 0; index < this.props.header.length; index++) {
            if(val.toLowerCase() === this.props.header[index].toLowerCase()){
                return true;
            }
            
        }
        return false;
    }

    filterList=(value)=>{
        var updatedList = this.state.permContacts;
        updatedList = updatedList.filter((item)=>{
            let flag = false;
            for (let index = 0; index <  this.state.column1.length; index++) {
                const element =  this.state.column1[index];
                if (item[element.title].toString().toLowerCase().search(value.toLowerCase())!==-1) {
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
            this.setHeaderColumn2(data[0]);
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