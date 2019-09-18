import React, { Component } from 'react';
import MaterialTable from 'material-table';
import './SearchBar.css';


class SimpleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            column1:[],//for header of table
            contacts:[],//data to be displayed
            permContacts:[],//data received
            contactsTemp:[],//for filtering purpose
            url : this.props.url,
        }
        
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

    //set column from header for mui table
    setColFromHeader=()=>{
        for (let index = 0; index < this.props.header.length; index++) {
            let exists = this.checkForCol(this.props.header[index],0)[0];
            if(exists){
                let object1 = {
                    title : '',
                    field : ''
                };
                object1.title = this.props.header[index];
                object1.field = this.props.header[index];
                //console.log("title="+object1.title+" field="+object1.field);
                
                this.state.column1.push(object1);
            }
        }
        console.log("column1"+this.state.column1[0]);
        
    }

    //to build data from api call as per keys in this.props.header
    modifyData=()=>{
        for (let index1 = 0; index1 < this.state.permContacts.length; index1++) {
            let object2 = {};
            for (let index = 0; index < this.props.header.length; index++) {
                let exists = this.checkForCol(this.props.header[index],index1);
                if(exists){
                    //console.log(exists[0]+" = "+exists[1]);
                    
                    object2[this.props.header[index]] = exists[1];
                }
            }
            this.state.contacts.push(object2);
        }
    }


    checkForCol=(col,rowNo)=>{
        let arr = col.split(".");
        let p = this.state.permContacts[rowNo];
        
        let index;
        for (index = 0; index < arr.length; index++) {
            p=p[arr[index]];
            if(typeof p ==="undefined")
                break;
            //console.log("p=="+p+"  "+arr[index]);
            
        }
        if(index === arr.length && !(p instanceof Object))
            return [arr[index-1],p];
        return false;
    }

    //for filtering the this.state.contacts
    filterList=(value)=>{
        var updatedList = this.state.contacts;
        console.log(updatedList);
        
        updatedList = updatedList.filter((item)=>{
            let flag = false;
            for (let index = 0; index <  this.state.column1.length; index++) {
                let getLastElem = this.state.column1[index].field;
                if (item[getLastElem].toString().toLowerCase().search(value.toLowerCase())!==-1) {
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
            this.setState({ permContacts : data})
            this.setColFromHeader();
            this.modifyData();
            console.log(this.state.contacts[0]);
            console.log(this.state.permContacts[0]);
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
                columns={ this.state.column1}
                data={this.state.contactsTemp}
            />
          );
    }
}
 
export default SimpleTable;