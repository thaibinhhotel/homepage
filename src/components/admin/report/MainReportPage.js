import React, {Component} from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import cookie from "react-cookies";
import {toast} from "react-toastify";
import {Dropdown, Header, Icon} from 'semantic-ui-react';
// import CostReporting from '../components/admin/report/CostReporting';
import CostReporting from './CostReporting';
import ProductOptionUsing from './ProductOptionUsing';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

const optionsSelects = [
    {
        key: 'room',
        text: 'Phòng',
        value: 'room',
        content: 'Doanh thu theo Phòng',
    },
    {
        key: 'this week',
        text: 'this week',
        value: 'this week',
        content: 'This Week',
    },
    {
        key: 'this month',
        text: 'this month',
        value: 'this month',
        content: 'This Month',
    },
]

class MainReportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            optionList: {
                optionName: [],
                optionCountOf: [],
                optionTotal: []
            }
        };
        [
            'addSymbols',
            'toggleDataSeries',
            'getOptionListValue',
            'test'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async GetReportData(yearMonth, reportName) {
        let encoded = "yearmonth=" + yearMonth +
            "&reportName=" + reportName +
            "&token=" + cookie.load('tokenTBh');
        let result = [];

        await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=ReportDetail', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                // debugger;
                data['result'] == 'error' ? msgerr = (JSON.stringify(data["error"]["message"]) + JSON.stringify(data["error"])) : result = data['data'];
                console.log(data);
                result = data;
            });

            let stt = response.status;
            if (stt == 200) {
                if (!msgerr) {

                } else {
                    toast.error("Error:" + JSON.stringify(msgerr));
                }
            } else {
                toast.error("Something is wrong, please check log for detail!");
            }

        }).then(() => {
            if (result.length > 0) {
                this.setState({
                    allData: result
                });
                this.getOptionListValue();
            }
        })

    }

    async test() {
        let result = "{\"errorCode\":0,\"errorMessage\":\"\",\"data\":[{\"sex_prob\":\"N/A\",\"name\":\"PHẠM THỊ LOAN THẢO\",\"id_prob\":\"37.56\",\"type\":\"old\",\"doe_prob\":\"N/A\",\"name_prob\":\"7.51\",\"id\":\"341337333\",\"dob_prob\":\"66.41\",\"doe\":\"N/A\",\"nationality_prob\":\"N/A\",\"nationality\":\"N/A\",\"home_prob\":\"2.91\",\"address\":\"ĐÔNG BÌNH, HÒA AN, TX CAO LÃNH, ĐỒNG THÁP\",\"sex\":\"N/A\",\"home\":\"TÂN THUẬN ĐÔNG, TX CAO LÃNH, ĐỒNG THÁP\",\"address_prob\":\"2.16\",\"dob\":\"1985\"}]}";
        let date = new Date();
        let yearMonth = date.getFullYear().toString() + (date.getMonth() + 1).toString();
        let encoded = "yearmonth=" + yearMonth +
            "&jsonStr=" + result;

        await fetch('https://script.google.com/macros/s/AKfycbweKULYa8P49p9oiGQ4XN_VswC5xn1DHRSZuImPjTYVWAcrDNF6/exec?func=CallLogFpt', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {
                // debugger;
                data['result'] == 'error' ? msgerr = (JSON.stringify(data["error"]["message"]) + JSON.stringify(data["error"])) : result = data['data'];
                result = data;
            });

        }).then(() => {

        })
    }

    getOptionListValue() {
        let optionList = {
            optionName: [],
            optionID: [],
            optionTotal: []
        }
        const allData = [...this.state.allData];
        // debugger;
        for (let i = 0; i < allData.length; i++) {
            let item = JSON.parse(allData[i]);
            let options = JSON.parse(item.options == "" ? "[]" : item.options);
            for (let j = 0; j < options.length; j++) {
                let option = options[j];
                let optionName = option.description;
                let optionID = option.optionId;
                let optionTotal = option.total;

                let isHaving = false;
                for (let x = 0; x < optionList.optionID.length; x++) {
                    if (optionList.optionID[x] == optionID) {
                        optionList.optionTotal[x] = optionList.optionTotal[x] + optionTotal;
                        isHaving = true;
                        break;
                    }
                }
                if (!isHaving) {
                    optionList.optionTotal.push(optionTotal);
                    optionList.optionID.push(optionID);
                    optionList.optionName.push(optionName);
                }

                console.log(option);
            }
        }
        console.log(optionList);
    }

    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        this.chart.render();
    }

    componentDidMount() {
        //this.GetReportData("201912", "test");

        this.test();
    }

    render() {
        console.log("render");
        console.log(this.state.allData);
        let year = new Date().getFullYear();
        
        const options = {
            animationEnabled: true,
            colorSet: "colorSet2",
            title: {
                text: "Monthly Sales"
            },
            axisX: {
                valueFormatString: "MMMM"
            },
            axisY: {
                prefix: "$",
                labelFormatter: this.addSymbols
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: this.toggleDataSeries,
                verticalAlign: "top"
            },
            data: [{
                type: "column",
                name: "Actual Sales",
                showInLegend: true,
                xValueFormatString: "MMMM YYYY",
                yValueFormatString: "$#,##0",
                dataPoints: [
                    {x: new Date(year, 0), y: 27500},
                    {x: new Date(year, 1), y: 29000},
                    {x: new Date(year, 2), y: 22000},
                    {x: new Date(year, 3), y: 26500},
                    {x: new Date(year, 4), y: 33000},
                    {x: new Date(year, 5), y: 37000},
                    {x: new Date(year, 6), y: 32000},
                    {x: new Date(year, 7), y: 27500},
                    {x: new Date(year, 8), y: 29500},
                    {x: new Date(year, 9), y: 43000},
                    {x: new Date(year, 10), y: 55000, indexLabel: "High Renewals"},
                    {x: new Date(year, 11), y: 39500}
                ]
            }, {
                type: "line",
                name: "Expected Sales",
                showInLegend: true,
                yValueFormatString: "$#,##0",
                dataPoints: [
                    {x: new Date(year, 0), y: 30000000},
                    {x: new Date(year, 1), y: 30000000},
                    {x: new Date(year, 2), y: 30000000},
                    {x: new Date(year, 3), y: 30000000},
                    {x: new Date(year, 4), y: 30000000},
                    {x: new Date(year, 5), y: 30000000},
                    {x: new Date(year, 6), y: 30000000},
                    {x: new Date(year, 7), y: 30000000},
                    {x: new Date(year, 8), y: 30000000},
                    {x: new Date(year, 9), y: 30000000},
                    {x: new Date(year, 10), y: 30000000},
                    {x: new Date(year, 11), y: 30000000}
                ]
            }, {
                type: "area",
                name: "Profit",
                markerBorderColor: "white",
                markerBorderThickness: 2,
                showInLegend: true,
                yValueFormatString: "$#,##0",
                dataPoints: [
                    {x: new Date(year, 0), y: 11500},
                    {x: new Date(year, 1), y: 10500},
                    {x: new Date(year, 2), y: 9000},
                    {x: new Date(year, 3), y: 13500},
                    {x: new Date(year, 4), y: 13890},
                    {x: new Date(year, 5), y: 18500},
                    {x: new Date(year, 6), y: 16000},
                    {x: new Date(year, 7), y: 14500},
                    {x: new Date(year, 8), y: 15880},
                    {x: new Date(year, 9), y: 24000},
                    {x: new Date(year, 10), y: 31000},
                    {x: new Date(year, 11), y: 19000}
                ]
            }]
        }

        return (
            <div>
                <hr/>
                <hr/>
                <hr/>
                <Header as='h4'>
                    <Icon name='chart pie'/>
                    <Header.Content>
                        Báo cáo doanh số theo{' '}
                        <Dropdown
                            inline
                            header='Báo cáo theo:'
                            options={optionsSelects}
                            defaultValue={optionsSelects[0].value}
                        />
                    </Header.Content>
                </Header>

                <CanvasJSChart options={options}
                               onRef={ref => this.chart = ref}
                />
                {/*<CostReporting/>*/}
                <ProductOptionUsing/>
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}

export default MainReportPage;