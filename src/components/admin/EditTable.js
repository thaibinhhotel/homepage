import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

const columns = [{
    dataField: 'id',
    text: 'Product ID'
}, {
    dataField: 'name',
    text: 'Product Name'
}, {
    dataField: 'price',
    text: 'Product Price'
}];

const rowEvents = {
    onClick: (e, row, rowIndex) => {
        console.log(`clicked on row with index: ${rowIndex}`);
    },
    onMouseEnter: (e, row, rowIndex) => {
        console.log(`enter on row with index: ${rowIndex}`);
    }
};

let products = [];
products.push({id: "1", name: "ss", price: "dd"});


export default class EditTable extends React.Component {
    constructor(props){
        super(props)
        this.handleChange= this.handleChange.bind(this);
    }

    handleChange(event,data){
        debugger;
    }

    render() {
        console.log(products);
        // return <ReactTabulator data={data} />
        return <div>Currently using React {React.version}</div>
        // return <BootstrapTable
        //     rowEvents={ rowEvents }
        //
        //     keyField="id"
        //     data={products}
        //     columns={columns}
        //     cellEdit={cellEditFactory({mode: 'click'})}
        // />
    }
}

