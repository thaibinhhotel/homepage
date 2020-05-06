import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import 'semantic-ui-css/semantic.min.css';
import {
    Dimmer, Image,
    Loader, Segment, Menu, Icon, Button
} from 'semantic-ui-react';
import cookie from 'react-cookies';
import Table from 'react-bootstrap/Table';
import PortalEditProduct from '../components/admin/PortalEditProduct';
import MainReportPage from '../components/admin/report/MainReportPage';
import {toast} from 'react-toastify';
import {ToastContainer} from "react-toastify";
import {encrypt} from "../components/sha256";

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

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

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
            bodyRow: [],
            isDataLoaded: false,
            isSubmiting: false
        };
        [
            'checkTokenValid',
            'getIPAndCheckToken',
            'renderListFunc',
            'renderProductList',
            'handleChangeRowValue',
            'handleItemClick',
            'getDataAdminByAction',
            'getListAdminEdit',
            'addItemProduct',
            'handleDeleteRow',
            'handleSubmitAllChange'
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
        if (!this.state.userInfo.token) {
            this.setState({
                isTokenValid: false,
                isChecking: false
            });
        }
        this.getIPAndCheckToken();
    }

    clearCookie() {
        cookie.remove('tokenTBh', {path: "/homepage"});
        cookie.remove('emailTBh', {path: "/homepage"});
        cookie.remove('userNameTBh', {path: "/homepage"});
    }

    getListAdminEdit(action) {
        this.setState({
            isDataLoaded: false,
        });
        fetch("https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=" + action + "&token=" + this.state.userInfo.token)
            .then(res => res.json())
            .then(
                (result) => {
                    let strs = [];
                    let tmp = [];
                    for (let i = 0; i < result.length; i++) {
                        tmp = JSON.parse(result[i])
                        strs.push(tmp);
                    }
                    // strs = new Set(strs);
                    strs = Array.from(new Set(strs.map(JSON.stringify))).map(JSON.parse);
                    let rowheader = Object.keys(strs[0]);

                    this.setState({
                        isDataLoaded: true,
                        headerRow: rowheader,
                        bodyRow: strs
                    });
                }, (error) => {
                    console.log(error);
                    this.setState({
                        isDataLoaded: true,
                        bodyRow: [],
                        headerRow: []
                    });
                }
            ).then(() => {
            this.setState({
                isDataLoaded: true
            });
        })
    }

    getDataAdminByAction(tblName) {
        switch (tblName) {
            case "Hotel":
                this.getListAdminEdit("listRoomDetail");
                break;
            case "FoodOption":
                this.getListAdminEdit("listoption");
                break;
            case "RoomsType":
                this.getListAdminEdit("PricebyOthers");
                break;
            case "RoomPrice":
                this.getListAdminEdit("PricebyHour");
                break;
            case "User":
                this.getListAdminEdit("listUser");
                break;
        }
    }

    handleItemClick(e, {name}) {
        this.setState({
            activeItem: name,
            bodyRow: [],
            headerRow: []
        });

        if (name.match(/Hotel|FoodOption|RoomPrice|RoomsType|User|/i)) {
            this.getDataAdminByAction(name);
        }
    }

    handleDeleteRow(data) {
        if (this.state.bodyRow.length == 1) {
            toast.error("Bạn không được xoá hết.");
            return;
        }
        let bodyRow = [...this.state.bodyRow];
        let removeIndex = bodyRow.map(function (item) {
            return item[Object.keys(data[0])[0]];
        }).indexOf(Object.values(data[0])[0]);
        bodyRow.splice(removeIndex, 1);

        this.setState({
            bodyRow: bodyRow
        });
    }

    handleChangeRowValue(newrow) {
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

    }

    addItemProduct() {
        if (!(this.state.activeItem == 'Hotel' || this.state.activeItem == 'FoodOption' || this.state.activeItem == 'RoomsType')) {
            toast.error("Liên hệ với Bangth để thêm.");
            return;
        }
        let bodyRow = this.state.bodyRow;
        let row = {...bodyRow[bodyRow.length - 1]};
        Object.keys(row).map(item => {
            if (item.includes("id") || item.includes("Id")) {
                row[item] = row[item] + 1;
            } else {
                row[item] = '';
            }
        });

        bodyRow[bodyRow.length] = row;
        this.setState({
            bodyRow: bodyRow
        })
    }

    handleSubmitAllChange() {
        this.setState({
            isSubmiting: true
        });
        let jsonString = JSON.stringify(this.state.bodyRow.map(item => {
                return JSON.stringify(item);
            })
        );
        if (this.state.activeItem == 'User') {
            let bodyRow = [...this.state.bodyRow]

            for (let i = 0; i < bodyRow.length; i++) {
                let row = bodyRow[i];
                if (row.PassWord && row.PassWord != "") {
                    bodyRow[i].PassWord = encrypt(row.PassWord);
                }
            }
            jsonString = JSON.stringify(bodyRow.map(item => {
                    return JSON.stringify(item);
                })
            );

        }

        let encoded = "jsonDataEncode=" + jsonString +
            "&token=" + this.state.userInfo.token +
            "&activeItem=" + this.state.activeItem;

        fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=adminUpdateParam', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            let isSuccess = false;
            await response.json().then(function (data) {
                data['result'] == 'error' ? msgerr = (JSON.stringify(data["error"]["message"]) + JSON.stringify(data["error"])) : isSuccess = true;
            });

            let stt = response.status;
            if (stt == 200) {
                if (!msgerr) {
                    toast.success("Lưu thành công!", {position: toast.POSITION.TOP_RIGHT});
                } else {
                    toast.error("Error:" + JSON.stringify(msgerr));
                }
            } else {
                toast.error("Something is wrong, please check log for detail!");
            }

        }).then(() => {
            this.setState({isSubmiting: false});
        })
    }

    renderProductList() {
        return (
            <Table responsive bordered hover style={{height: '300px'}}>
                <thead>
                <tr key="header">
                    <th>
                        <Button.Group
                            style={{display: (this.state.activeItem == 'Hotel' || this.state.activeItem == 'FoodOption' || this.state.activeItem == 'RoomsType') ? '' : 'none'}}>
                            <Button positive inverted color='teal'
                                    onClick={this.addItemProduct}>
                                Thêm
                            </Button>
                            {/*<Button.Or/>*/}
                            {/*<Button inverted color='grey'>Delete</Button>*/}
                        </Button.Group>
                    </th>
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
                                          onDelete={this.handleDeleteRow}
                                          headerRow={this.state.headerRow}
                                          onAction={this.handleAction}
                                          activeItem={this.state.activeItem}
                                          key={item + Math.random()}>{item}</RowRender>
                    })
                }
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={this.state.headerRow.length + 1} hidden={this.state.headerRow.length <= 0}
                        onClick={this.handleSubmitAllChange}><Button
                        primary>Lưu tất cả thay đổi</Button></td>
                </tr>
                </tfoot>
            </Table>
        );
    }

    renderListFunc() {
        let activeItem = this.state.activeItem;
        return (
            <Segment>
                <ToastContainer style={{fontSize: '20px', textAlign: 'center'}}/>
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
                {this.state.activeItem.length > 0 &&
                <Segment>
                    {(this.state.isDataLoaded == true && this.state.activeItem.length > 0) ?
                        <div>
                            <div style={{display: this.state.isSubmiting ? 'none' : ''}}>
                                {this.renderProductList()}
                            </div>
                            <div style={{display: !this.state.isSubmiting ? 'none' : ''}}>
                                <Dimmer active inverted>
                                    <Loader size='large'>Dữ liệu đang được đồng bộ...</Loader>
                                </Dimmer>
                                <Image src='images/loader.png'/>
                            </div>
                        </div>
                        :
                        <Segment>
                            <Dimmer active inverted>
                                <Loader size='large'>Đang tải</Loader>
                            </Dimmer>
                            <Image src='images/loader.png'/>
                        </Segment>
                    }
                </Segment>}
                <Segment>
                    <MainReportPage/>
                </Segment>
                <a href="/homepage">Về lại trang chủ.</a>
            </Segment>
        )
    }

    render() {
        let isTokenValid = this.state.isTokenValid;
        if (this.state.isChecking) {
            return <Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Hệ thống đang kiểm tra người dùng...</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>
        }

        return (isTokenValid ?
            this.renderListFunc()
            :
            <div>
                Bạn phải <a href="/homepage" onClick={this.clearCookie}>Đăng nhập</a> bằng User Admin để sử dụng chức
                năng này.
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
        this.handleChangeDeleteColl = this.handleChangeDeleteColl.bind(this);
    }

    componentDidMount() {
        let cells = Object.keys(this.props.children).map((i) => {
            return {[i]: this.props.children[i]}
        })
        this.setState({
            colls: cells
        });
    }

    handleChangeDeleteColl(data) {
        this.props.onDelete(data);
    }

    handleChangeColl(coll) {
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
                                       activeItem={this.props.activeItem}
                                       handleSelectAction={this.handleSelectAction}
                                       onChangedelete={this.handleChangeDeleteColl}
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
                <p>{isNaN(Object.values(this.state.coll)) ? Object.values(this.state.coll) : formatNumber(Object.values(this.state.coll))}</p>
            </td>
        )
    }
}

CollRender.propTypes = {
    onChangeValue: PropTypes.func
}
AdminPage.propTypes = {}