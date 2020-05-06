import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {IndexPage} from './containers/IndexPage';
import {LoginPage} from './containers/LoginPage';
import {AdminPage} from './containers/AdminPage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import {
    Dimmer, Image,
    Loader, Segment
} from 'semantic-ui-react';
import {ToastContainer} from "react-toastify";
import cookie from 'react-cookies';
import {BrowserRouter, Route} from "react-router-dom";

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

class ThaiBinhHotel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTokenValid: false,
            userInfo: {
                token: cookie.load('tokenTBh'),
                email: cookie.load('emailTBh'),
                // token: sessionStorage.getItem('tokenTBh'),
                // email: sessionStorage.getItem('emailTBh'),
                ipAddress: "",
                deviceName: isMobile.CheckDevices()
            },
            isChecking: true,
        };
        [
            'checkTokenValid',
            'getIPAndCheckToken',
            'setTokenValid'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    setTokenValid(username, token) {
        let userInfo = {...this.state.userInfo};
        userInfo.email = username;
        userInfo.token = token;
        this.setState({
            isTokenValid: true,
            userInfo: userInfo
        });
        ReactDOM.render(<GreetUser/>, document.getElementById('userinfo'));
        ReactDOM.render(<AcctionBottom/>, document.getElementById('actionbottom'));
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

    render() {
        let isTokenValid = this.state.isTokenValid;
        if (this.state.isChecking) {
            return <Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Hệ thống đang kiểm tra người dùng</Loader>
                </Dimmer>
                <Image src='images/loader.png'/>
            </Segment>
        }
        return (
            <div>
                <ToastContainer style={{fontSize: '20px', textAlign: 'center'}}/>
                {isTokenValid ?
                    <IndexPage userInfo={this.state.userInfo}/>
                    :
                    <LoginPage deviceName={this.state.userInfo.deviceName} ipAddress={this.state.userInfo.ipAddress}
                               setTokenValid={this.setTokenValid}/>}
            </div>
        )
    }
}

class AppMain extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <hr/>
                    <div>
                        <Route exact path="/homepage" component={ThaiBinhHotel}/>
                        <Route path="/homepage/admin" component={admin}/>
                        <Route path="/homepage/logout" component={logout}/>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

class logout extends React.Component {
    render() {
        cookie.remove('tokenTBh', {path: '/homepage'});
        cookie.remove('emailTBh', {path: '/homepage'});
        cookie.remove('userNameTBh', {path: '/homepage'});
        window.location.href = "/homepage";
        return "";
    }
}

class admin extends React.Component {
    render() {
        return (
            <AdminPage/>
        );
    }
}

class GreetUser extends React.Component {
    render() {
        let info = cookie.load("userNameTBh");
        return (
            info ?
                <div>
                    {info}
                    <a href="/homepage/logout"><h6>Thoát</h6></a>
                </div>
                :
                <div>
                    Hi Guess!
                </div>
        );
    }
}

class AcctionBottom extends React.Component {
    render() {
        let info = cookie.load("tokenTBh");
        return (
            info ?
                <div>
                    <ul className="icons">
                        <li><a
                            href="https://docs.google.com/spreadsheets/d/1ZRQ1m7W-rKciypYBbtgSswODZj8qdOWmW2JLb6GTVX8/"
                            target="_blank" className="icon brands fa-google-drive"><span className="label"></span></a>
                        </li>
                        <li><a href="/homepage" className="icon solid fa-home"><span className="label"></span></a></li>
                        <li><a href="/homepage/admin" className="fas fa-tools"><span className="label"></span></a></li>
                    </ul>
                </div>
                :
                <div>
                </div>
        );
    }
}


ReactDOM.render(<AppMain/>, document.getElementById('root'));
ReactDOM.render(<GreetUser/>, document.getElementById('userinfo'));
ReactDOM.render(<AcctionBottom/>, document.getElementById('actionbottom'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
