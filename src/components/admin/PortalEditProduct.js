import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, Dropdown,
    Header,
    Segment,
    TransitionablePortal, Input, Form
} from 'semantic-ui-react'
import Table from 'react-bootstrap/Table';

export default class PortalEditProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: this.props.data,
            field1: '',
            field2: '',
            field3: '',
            field4: '',
            field5: '',
            field6: '',
            field7: '',
            field8: '',
            field9: '',
            field10: '',
        };

        this.handleSelectAction = this.handleSelectAction.bind(this);
        this.handleChangeSave = this.handleChangeSave.bind(this);
    }


    handleClick = () => this.setState((prevState) => ({open: !prevState.open}))
    handleClose = () => this.setState({open: false})

    handleSelectAction() {
        this.setState({
            open: true
        });
    }

    componentDidMount() {
        console.log("Portal")
        console.log(this.props.data);

        for (let i = 0; i < this.props.data.length; i++) {
            let tmp = this.props.data[i];
            Object.values(tmp).map(item => {
                console.log(item);
                this.setState({
                    ["field" + (i + 1)]: item,
                });
            });
        }
    }

    handleChangeSave() {
        console.log(this.props.data);
        let newrow = [...this.props.data];
        for (let i = 0; i < newrow.length; i++) {
            let tmp = newrow[i];
            tmp[Object.keys(tmp)[0]] = this.state['field' + (i + 1)];
        }

        console.log(newrow);
        this.props.onChangeValue(newrow);
    }

    render() {
        const {open} = this.state

        return (
            <div>
                <Dropdown icon="arrow alternate circle down outline" text=''
                          pointing='left' className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.handleSelectAction}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleSelectAction}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <TransitionablePortal onClose={this.handleClose} open={open}>
                    <Segment
                        style={{left: '10%', right: '10%', position: 'fixed', top: '20%'}}
                    >
                        <Form>
                            <div style={{width: '300px', margin: 'auto'}}>
                                <Header style={{backgroundColor: 'lavender'}}><h3>Detail</h3></Header>
                                <Input labelPosition="right" disabled
                                       label={this.props.headerRow[0] ? this.props.headerRow[0] : ''}
                                       fluid id="0"
                                       placeholder={this.props.headerRow[0] ? this.props.headerRow[0] : ''}
                                       style={{display: this.props.headerRow[0] ? '' : 'none'}}
                                       value={this.state.field1}
                                       onChange={(event, data) => {
                                           this.setState({
                                               field1: data.value
                                           })
                                       }}/>
                                <Input fluid id="1" placeholder={this.props.headerRow[1] ? this.props.headerRow[1] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[1] ? this.props.headerRow[1] : ''}
                                       style={{display: this.props.headerRow[1] ? '' : 'none'}}
                                       value={this.state.field2} onChange={(event, data) => {
                                    this.setState({
                                        field2: data.value
                                    })
                                }}/>
                                <Input fluid id="2" placeholder={this.props.headerRow[2] ? this.props.headerRow[2] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[2] ? this.props.headerRow[2] : ''}
                                       style={{display: this.props.headerRow[2] ? '' : 'none'}}
                                       value={this.state.field3} onChange={(event, data) => {
                                    this.setState({
                                        field3: data.value
                                    })
                                }}/>
                                <Input fluid id="3" placeholder={this.props.headerRow[3] ? this.props.headerRow[3] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[3] ? this.props.headerRow[3] : ''}
                                       style={{display: this.props.headerRow[3] ? '' : 'none'}}
                                       value={this.state.field4} onChange={(event, data) => {
                                    this.setState({
                                        field4: data.value
                                    })
                                }}/>
                                <Input fluid id="4" placeholder={this.props.headerRow[4] ? this.props.headerRow[4] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[4] ? this.props.headerRow[4] : ''}
                                       style={{display: this.props.headerRow[4] ? '' : 'none'}}
                                       value={this.state.field5} onChange={(event, data) => {
                                    this.setState({
                                        field5: data.value
                                    })
                                }}/>
                                <Input fluid id="5" placeholder={this.props.headerRow[5] ? this.props.headerRow[5] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[5] ? this.props.headerRow[5] : ''}
                                       style={{display: this.props.headerRow[5] ? '' : 'none'}}
                                       value={this.state.field6} onChange={(event, data) => {
                                    this.setState({
                                        field6: data.value
                                    })
                                }}/>
                                <Input fluid id="6" placeholder={this.props.headerRow[6] ? this.props.headerRow[6] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[6] ? this.props.headerRow[6] : ''}
                                       style={{display: this.props.headerRow[6] ? '' : 'none'}}
                                       value={this.state.field7} onChange={(event, data) => {
                                    this.setState({
                                        field7: data.value
                                    })
                                }}/>
                                <Input fluid id="7" placeholder={this.props.headerRow[7] ? this.props.headerRow[7] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[7] ? this.props.headerRow[7] : ''}
                                       style={{display: this.props.headerRow[7] ? '' : 'none'}}
                                       value={this.state.field8} onChange={(event, data) => {
                                    this.setState({
                                        field8: data.value
                                    })
                                }}/>
                                <Input fluid id="8" placeholder={this.props.headerRow[8] ? this.props.headerRow[8] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[8] ? this.props.headerRow[8] : ''}
                                       style={{display: this.props.headerRow[8] ? '' : 'none'}}
                                       value={this.state.field9} onChange={(event, data) => {
                                    this.setState({
                                        field9: data.value
                                    })
                                }}/>
                                <Input fluid id="9" placeholder={this.props.headerRow[9] ? this.props.headerRow[9] : ''}
                                       labelPosition="right"
                                       label={this.props.headerRow[9] ? this.props.headerRow[9] : ''}
                                       style={{display: this.props.headerRow[9] ? '' : 'none'}}
                                       value={this.state.field10} onChange={(event, data) => {
                                    this.setState({
                                        field10: data.value
                                    })
                                }}/>
                                <hr/>
                                <div style={{textAlign: 'center'}}>
                                    <p>Xem kỹ thông tin trước khi lưu.</p>
                                    <Button color='yellow' basic onClick={this.handleChangeSave}>Save</Button>
                                    <Button color='yellow' basic onClick={this.handleClose}>Close</Button>
                                </div>
                            </div>
                        </Form>
                    </Segment>
                </TransitionablePortal>
            </div>
        )
    }
}

PortalEditProduct.propTypes = {
    handleSelectAction: PropTypes.func
}