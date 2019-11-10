import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import 'semantic-ui-css/semantic.min.css';
import {
    Dimmer, Image,
    Loader, Segment, Grid, Menu, Icon, Form, Input, Dropdown, Button
} from 'semantic-ui-react';
import cookie from 'react-cookies';
import Table from 'react-bootstrap/Table';
import PortalEditProduct from '../components/admin/PortalEditProduct';

const isMobile = {
    CheckDevices: function () {
        if (navigator.userAgent.match(/Android/i)) {
            return "Android"
        }
        ;
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            return "iOS"
        }
        ;
        if (navigator.userAgent.match(/Windows/i)) {
            return "Windows"
        }
        ;
        if (navigator.userAgent.match(/Mac/i)) {
            return "Mac"
        }
        ;
        if (navigator.userAgent.match(/BlackBerry/i)) {
            return "BlackBerry"
        }
        ;
    },
};

export class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTokenValid: false,
            userInfo: {
                token: cookie.load('tokenTBh'),
                email: cookie.load('emailTBh'),
                ipAddress: "",
                deviceName: isMobile.CheckDevices()
            },
            isChecking: true,
            activeItem: "",
            headerRow: [],
            bodyRow: []
        };
        [
            'checkTokenValid',
            'getIPAndCheckToken',
            'renderListFunc',
            'renderProductList',
            'handleChangeRowValue',
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    getIPAndCheckToken() {
        this.setState({
            isChecking: true,
        });
        fetch("https://api.ipify.org/?format=json", {
            method: "GET",
            // body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => res.json())
            .then(
                (result) => {
                    console.log(result["ip"]);

                    let userInfo = {...this.state.userInfo};
                    userInfo['ipAddress'] = result["ip"]
                    this.setState({
                        userInfo: userInfo
                    });

                    if (!this.state.userInfo.token) {
                        this.setState({
                            isChecking: false
                        });
                        return;
                    }

                    this.checkTokenValid(result["ip"])
                }, (error) => {
                    console.log(error);
                }
            )
    }

    async checkTokenValid(ipAddress) {
        let encoded = "token=" + this.state.userInfo.token +
            "&email=" + this.state.userInfo.email +
            "&deviceName=" + this.state.userInfo.deviceName +
            "&role=admin" +
            "&ipAddress=" + ipAddress;

        console.log(encoded);

        let isValid = false;
        fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=checkToken', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                console.log(data);
                data['result'] == 'error' ? msgerr = JSON.stringify(data["error"]) : isValid = true;
            });
        }).then(() => {
            if (isValid) {
                this.setState({
                    isTokenValid: true,
                    isChecking: false
                });
            } else {
                this.setState({
                    isTokenValid: false,
                    isChecking: false
                });
            }
        })
    }

    componentDidMount() {
        console.log("Cookie")
        console.log(cookie.load('tokenTBh'));
        console.log(cookie.load('emailTBh'));
        if (!this.state.userInfo.token) {
            this.setState({
                isTokenValid: false,
                isChecking: false
            });
        }
        this.getIPAndCheckToken();


        //Fake Date
        let data = [{
            "optionId": 1,
            "description": "Nc sui",
            "price": 10000,
        }, {
            "optionId": 2,
            "description": "M Tm(1 trng)",
            "price": 20000,
        }, {
            "optionId": 3,
            "description": "M Tm(1 trng)",
            "price": 20000,
        }];

        let rowheader = Object.keys(data[0]);

        this.setState({
            headerRow: rowheader,
            bodyRow: data
        });
    }

    clearCookie() {
        cookie.remove('tokenTBh', {path: '/'});
        cookie.remove('emailTBh', {path: '/'});
        cookie.remove('userNameTBh', {path: '/'});
    }

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

    handleChangeRowValue(newrow) {
        console.log(newrow);
        let bodyRow = [...this.state.bodyRow];
        for (let i = 0; i < bodyRow.length; i++) {
            if (Object.keys(bodyRow[i])[0] == Object.keys(newrow)[0] && Object.values(bodyRow[i])[0] == Object.values(newrow)[0]) {
                bodyRow[i] = newrow
            }
        }
        this.setState({
            bodyRow: bodyRow
        });
    }

    handleAction(action, data) {
        console.log(action);
        console.log(data);

    }

    renderProductList() {
        console.log("renderProductList");
        return (
            <Table responsive bordered hover style={{height: '300px'}}>
                <thead>
                <tr key="header">
                    <th>Action</th>
                    {this.state.headerRow.map(item => {
                        return <th key={item}>{item}</th>
                    })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    this.state.bodyRow.map(item => {
                        return <RowRender onChange={this.handleChangeRowValue}
                                          headerRow={this.state.headerRow}
                                          onAction={this.handleAction}
                                          key={item + Math.random()}>{item}</RowRender>
                    })
                }
                </tbody>
                <tfoot>
                    <td colSpan={this.state.headerRow.length + 1}>
                        <Button primary>Submit Change</Button>
                    </td>
                </tfoot>
            </Table>
        );
    }

    renderListFunc() {
        console.log("renderListFunc");
        console.log(navigator.userAgent);
        let activeItem = this.state.activeItem;
        return (
            <Segment>
                <Menu tabular widths="5" icon='labeled'
                      size={isMobile.CheckDevices().match(/Windows|Mac/i) ? 'massive' : 'mini'} compact>
                    <Menu.Item
                        name='Hotel'
                        active={activeItem === 'Hotel'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name='building outline'/>
                        Hotel
                    </Menu.Item>

                    <Menu.Item
                        name='FoodOption'
                        active={activeItem === 'FoodOption'}
                        onClick={this.handleItemClick}
                    >
                        <Icon><i className="fas fa-utensils"></i></Icon>
                        {/*<i className="fas fa-utensils"></i>*/}
                        Drink & Food
                    </Menu.Item>
                    <Menu.Item
                        name='RoomPrice'
                        active={activeItem === 'RoomPrice'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name=''><i className="fas fa-user-clock"></i></Icon>
                        Price-Hour
                    </Menu.Item>
                    <Menu.Item
                        name='RoomsType'
                        active={activeItem === 'RoomsType'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name=''><i className="fas fa-bed"></i></Icon>
                        Room-Types
                    </Menu.Item>
                    <Menu.Item
                        name='User'
                        active={activeItem === 'User'}
                        onClick={this.handleItemClick}
                    >
                        <Icon name=''><i className="fas fa-user-shield"></i></Icon>
                        User
                    </Menu.Item>
                </Menu>
                <Segment>
                    <div>
                        {this.state.activeItem}
                        {this.renderProductList()}
                    </div>
                </Segment>
                <a href="/">Back to Home</a>
            </Segment>
        )
    }

    render() {
        let isTokenValid = this.state.isTokenValid;
        if (this.state.isChecking) {
            // return <Loader size="massive" active inline='centered'>System is checking your permission...</Loader>
            return <Segment>
                <Dimmer active inverted>
                    <Loader size='large'>System is checking your permission...</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>
        }

        return (isTokenValid ?
            this.renderListFunc()
            :
            <div>
                Please <a href="/" onClick={this.clearCookie}>Login</a> by User Addmin to access this Page
            </div>);
    }
}

class RowRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colls: [],
        };
        this.handleChangeColl = this.handleChangeColl.bind(this);
        this.handleSelectAction = this.handleSelectAction.bind(this);
    }

    componentDidMount() {
        console.log(this.props.children);
        let cells = Object.keys(this.props.children).map((i) => {
            return {[i]: this.props.children[i]}
        })
        this.setState({
            colls: cells
        });
    }

    handleChangeColl(coll) {
        console.log(this.state.colls);
        let tmprow = [...this.state.colls];
        let newrow = {};
        for (let i = 0; i < tmprow.length; i++) {
            if (Object.keys(tmprow[i])[0] == Object.keys(coll)[0]) {
                tmprow[i] = coll;
            }
            newrow[Object.keys(tmprow[i])[0]] = Object.values(tmprow[i])[0];
        }

        this.props.onChange(newrow);
    }

    handleSelectAction(event, data) {
        this.props.onAction(data.children, this.props.children)
    }

    render() {
        let row = this.props.children;
        return (
            <tr key={row + Math.random()}>
                <td>
                    <PortalEditProduct headerRow={this.props.headerRow} data={this.state.colls}
                                       handleSelectAction={this.handleSelectAction}
                                       onChangeValue={this.handleChangeColl}/>
                </td>
                {
                    this.state.colls.map(coll => {
                        return <CollRender key={coll + Math.random()}
                                           onChangeValue={this.handleChangeColl}>{coll}</CollRender>
                    })
                }
            </tr>
        )
    }
}

class CollRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coll: this.props.children
        }
        this.handleChangeInput = this.handleChangeInput.bind(this);
    }

    componentDidMount() {
        console.log(this.state.coll);
    }

    handleChangeInput(event, data) {
        let coll = {...this.state.coll};
        coll[Object.keys(this.state.coll)[0]] = data.value;
        this.props.onChangeValue(coll);
    }

    render() {
        return (
            <td key={this.state.coll + Math.random()}>
                {/*<Input value={Object.values(this.state.coll)} onChange={this.handleChangeInput}/>*/}
                <p>{Object.values(this.state.coll)}</p>
            </td>
        )
    }
}

CollRender.propTypes = {
    onChangeValue: PropTypes.func
}
AdminPage.propTypes = {}