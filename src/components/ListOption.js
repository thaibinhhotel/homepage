import React from 'react'
import {Button, Form, Input, Dropdown, Divider, Grid, Label, Statistic} from 'semantic-ui-react'
import PropTypes from "prop-types";
import TableBT from 'react-bootstrap/Table';
import {Segment} from 'semantic-ui-react';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export class ListOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.listoptionIds.slice(0, this.props.optionListSelected.length),
            option: {
                description: '',
                optionid: null,
                price: 0,
                quantity: 0,
                total: 0
            },
            listoptionIds: [],
            optionListSelected: [],
            totalOptions: 0,
        };
        [
            'handleChangeDropdown',
            'handleChangeQuantity',
            'handleAddRow',
            'handleRemoveRow',
            'handleOptionOtherChange'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    componentDidMount() {
        let listOptionSlt = this.props.optionListSelected;
        let listOptionSltIds = [];
        listOptionSlt && listOptionSlt.map(item => {
            listOptionSltIds.push(item["optionid"])
        })

        var listOptionIDsTmp = listOptionSltIds.concat(this.props.listoptionIds);
        var listOptionIDsMerge = listOptionIDsTmp.filter((item, pos) => listOptionIDsTmp.indexOf(item) === pos);

        this.setState({
            items: listOptionIDsMerge.slice(0, this.props.optionListSelected.length)
        });


        var listoptionIdstmp = {};
        var listoptionIds = [];

        this.props.listoption.map(item => {
            listoptionIdstmp = {}
            listoptionIdstmp['key'] = item['optionId'];
            listoptionIdstmp['text'] = item['description'];
            listoptionIdstmp['value'] = item['optionId'];
            listoptionIds.push(listoptionIdstmp);
        });
        this.setState({
            listoptionIds: listoptionIds,
        });

        //Set value for State: optionListSelected
        this.setState({
            optionListSelected: this.props.optionListSelected
        });

    }


    handleAddRow() {
        const option = {...this.state.option};
        let optionListSelected = this.state.optionListSelected;
        let flagNew = true;
        for (let i = 0; i < optionListSelected.length; i++) {
            if (optionListSelected[i].optionid == option.optionid) {
                if(optionListSelected[i].description.startsWith("Other")){
                    optionListSelected[i].quantity = 1;
                    optionListSelected[i].total = option.total;
                } else {
                    optionListSelected[i].quantity = parseInt(option.quantity) + parseInt(optionListSelected[i].quantity);
                    optionListSelected[i].total = parseInt(optionListSelected[i].quantity) * parseInt(optionListSelected[i].price);
                }
                flagNew = false;
                break;
            }
        }

        if (flagNew) {
            optionListSelected.push(option);
        }
        this.setState({
            optionListSelected: optionListSelected
        });

        this.props.onChangeOption(optionListSelected);
    }

    handleRemoveRow() {
        const optionListSelected = this.state.optionListSelected;
        optionListSelected.pop();
        this.setState({
            optionListSelected: optionListSelected
        });

        this.props.onChangeOption(optionListSelected);
    }

    handleChangeQuantity(event, data) {
        if(!data){
            return;
        }
        if (isNaN(data.value)) {
            return
        } else {
            if (parseInt(data.value) < 0) {
                toast.info('Số lượng phải lớn hơn 0.');
                return;
            }
        }
        let option = {...this.state.option};
        option['quantity'] = parseInt(data.value);
        option['total'] = parseInt(data.value) * parseInt(option['price']);

        this.setState({
            option: option,
        });
    }

    handleChangeDropdown(event, data) {
        const listoption = this.props.listoption;
        let tmp = [];
        for (let i = 0; i < listoption.length; i++) {
            if (listoption[i].optionId == data.value) {
                tmp = [];
                tmp = listoption[i];
                tmp['optionid'] = listoption[i].optionId;
                tmp['quantity'] = 1;
                tmp['total'] = tmp['price'];
                break;
            }
        }
        this.setState({
            option: tmp,
        });
    }

    handleOptionOtherChange(val, data){
        let tmp = {...this.state.option};
        tmp['total'] = (parseInt(data.value) ? parseInt(data.value) : 0);
        this.setState({
           option: tmp
        });
    }

    render() {
        var total_option = 0;
        var count = 0;
        return (
            <div>
                <div>
                    <Segment placeholder textAlign='center'>
                        <Grid columns={1} relaxed='very' stackable>
                            <Grid.Column>
                                <Form>
                                    <Label>Loại SP:</Label>
                                    <Dropdown
                                        options={this.state.listoptionIds}
                                        value={this.state.option.optionid}
                                        placeholder='Chọn loại SP:'
                                        selection
                                        onChange={this.handleChangeDropdown}
                                    />
                                    <br/>
                                    <br/>
                                    <Label>Số lượng:</Label>
                                    <Input
                                        disabled={this.state.option.optionid == 0 || this.state.option.optionid == null || this.state.option.description.startsWith("Other")}
                                        placeholder='...'
                                        type='number'
                                        max='100'
                                        min='0'
                                        value={this.state.option.quantity}
                                        onChange={this.handleChangeQuantity}
                                    />
                                    <br/>
                                    <br/>
                                    <Label> Số tiền/1
                                        sp: <b>{formatNumber(this.state.option.price)} VND</b>
                                    </Label>
                                    <br/>
                                    <br/>
                                </Form>

                                <Divider horizontal>Tổng:</Divider>

                                {this.state.option.description.startsWith("Other")
                                    ? <div>
                                        <Input size="small" type="number" value={this.state.option.total} onChange={this.handleOptionOtherChange}/>
                                        <br/><br/>
                                     </div>
                                    : <Statistic horizontal size='tiny'>
                                        <Statistic.Value>{formatNumber(this.state.option.total)}</Statistic.Value>
                                        <Statistic.Label>vnd</Statistic.Label>
                                     </Statistic>
                                }

                                <Button content='Thêm' icon='plus square' size='big' color='grey'
                                        onClick={this.handleAddRow}
                                        disabled={this.state.option.optionid == 0 || this.state.option.optionid == null || this.state.option.quantity == 0 || this.state.option.total == 0}/>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </div>
                <Button.Group>
                </Button.Group>
                {this.state.optionListSelected ? <TableBT size="sm" striped bordered hover style={{width: '100%'}}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>
                            <Button
                                label='Xoá'
                                disabled={this.state.optionListSelected.length === 0}
                                icon='minus square'
                                onClick={this.handleRemoveRow}
                                floated='right'
                            />
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.optionListSelected.map((item) => (
                        <tr key={Math.random()}>
                            {(item) && (
                                [<td key={Math.random()}>
                                    <b>{item.quantity} - {item.description}</b>
                                </td>,
                                    <td key={Math.random()}>
                                        <b style={{float: 'right'}}><Label as='a' color='olive' tag
                                                                           size='large'>{formatNumber(item.total)} VND</Label></b>
                                        <p hidden>{count = count + 1} {total_option = total_option + item.total}</p>
                                    </td>]
                            )
                            }
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td></td>
                        <td>
                            <b style={{float: 'right'}}><Label as='a' color='yellow' tag
                                                               size='large'>{formatNumber(total_option)} VND</Label></b>
                        </td>
                    </tr>
                    </tfoot>
                </TableBT> : <div></div>
                }
            </div>
        )
    }
}

ListOption.propTypes = {
    listoptionIds: PropTypes.array,
    listoption: PropTypes.array,
    optionListSelected: PropTypes.array,
    onChangeOption: PropTypes.func,
}