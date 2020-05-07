import React, {Component} from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import cookie from "react-cookies";
import {toast} from "react-toastify";
import {Dropdown, Header, Icon, Loader} from 'semantic-ui-react';
// import CostReporting from '../components/admin/report/CostReporting';
import CostReporting from './CostReporting';
import ProductOptionUsing from './ProductOptionUsing';
import {forEach} from "react-bootstrap/cjs/ElementChildren";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

const optionsSelects = [
    {
        key: 'room',
        text: 'Phòng',
        value: 'room',
        content: 'Doanh thu theo Phòng',
    }
]

const optionsSelectsMonth = [
    {
        key: '201912',
        text: '201912',
        value: '201912',
        content: '201912',
    },
    {
        key: '20201',
        text: '2020-01',
        value: '20201',
        content: '2020-01',
    },
    {
        key: '20202',
        text: '2020-02',
        value: '20202',
        content: '2020-02',
    },
    {
        key: '20203',
        text: '2020-03',
        value: '20203',
        content: '2020-03',
    },
    {
        key: '20204',
        text: '2020-04',
        value: '20204',
        content: '2020-04',
    },
    {
        key: '20205',
        text: '2020-05',
        value: '20205',
        content: '2020-05',
    },
    {
        key: '20206',
        text: '2020-06',
        value: '20206',
        content: '2020-06',
    },
    {
        key: '20207',
        text: '2020-07',
        value: '20207',
        content: '2020-07',
    },
    {
        key: '20208',
        text: '2020-08',
        value: '20208',
        content: '2020-08',
    },
    {
        key: '20209',
        text: '2020-09',
        value: '20209',
        content: '2020-09',
    },
    {
        key: '202010',
        text: '2020-10',
        value: '202010',
        content: '2020-10',
    },
    {
        key: '202011',
        text: '2020-11',
        value: '202011',
        content: '2020-11',
    },
    {
        key: '202012',
        text: '2020-12',
        value: '202012',
        content: '2020-12',
    }
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
            },
            optionLst: [
                {
                    label: "",
                    y: 0
                }
            ],
            revenueByRoom: [
                {
                    label: "",
                    y: 0
                }
            ],
            monthSelected: "201912",
            isLoadingRpt1: true
        };
        [
            'addSymbols',
            'toggleDataSeries',
            'getOptionListValue',
            'GetReportData',
            'GetReportDataSummaryByRoom',
            'getrevenueByRoomValue',
            'handleChangeMonthDropdown'
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    async GetReportData(yearMonth, reportName) {
        let encoded = "yearmonth=" + yearMonth +
            "&reportName=" + reportName +
            "&token=" + cookie.load('tokenTBh');
        let result = [];
        debugger;
        await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=ReportDetail', {
            method: 'POST',
            body: encoded,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(async function (response) {
            let msgerr = '';
            await response.json().then(function (data) {

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
                // debugger;
                this.setState({
                    allData: result,
                    isLoadingRpt1: false
                });
                this.getOptionListValue();
            }
            this.setState({
                isLoadingRpt1: false
            });
        })

    }

    async GetReportDataSummaryByRoom(yearMonth, reportName) {
        let encoded = "yearmonth=" + yearMonth +
            "&reportName=" + reportName +
            "&token=" + cookie.load('tokenTBh');
        let result = [];

        await fetch('https://script.google.com/macros/s/AKfycby1NCjArXNvliviV9Su8imyfVXsNTUL2memG4bxJhX4JTcyoXGr/exec?func=ReportSummary', {
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
                // debugger;
                // this.setState({
                //     revenueByRoom: result
                // });
                this.getrevenueByRoomValue(result);
            }
        })
    }

    getrevenueByRoomValue(result) {
        const allData = [...result];
        let resultReturn = [];
        for (let i = 0; i < allData.length; i++) {
            let item = JSON.parse(allData[i]);
            resultReturn.push(item);
        }
        this.setState({
            revenueByRoom: resultReturn
        });
        console.log(resultReturn);
    }

    getOptionListValue() {
        let optionList = {
            optionName: [],
            optionID: [],
            optionTotal: []
        }
        const allData = [...this.state.allData];
        let tmpoptionLst = [];

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

        for (let i = 0; i < optionList.optionName.length; i++) {
            tmpoptionLst.push({"label": optionList.optionName[i], "y": optionList.optionTotal[i]})
        }
        this.setState({
            optionLst: tmpoptionLst
        });

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
        let yearmonth = this.state.monthSelected;
        this.GetReportDataSummaryByRoom(yearmonth, "test"); //Summary
        this.GetReportData(yearmonth, "test"); //Detail
    }

    handleChangeMonthDropdown(event, data) {
        this.setState({
            isLoadingRpt1: true
        });
        let yearmonth = data.value;
        this.GetReportDataSummaryByRoom(yearmonth, "test"); //Summary
        this.GetReportData(yearmonth, "test"); //Detail
    }

    render() {
        console.log("render");
        console.log("aaaa: " + this.state.revenueByRoom[0]);
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
                yValueFormatString: "VND#,##0",
                dataPoints: this.state.revenueByRoom.length > 0 ? this.state.revenueByRoom : [
                    {label: "101", y: 15000000},
                    {label: "102", y: 15000000},
                    {label: "103", y: 15000000},
                    {label: "104", y: 15000000},
                    {label: "201", y: 15000000},
                    {label: "202", y: 15000000},
                    {label: "203", y: 15000000},
                    {label: "204", y: 15000000}
                    // {x: new Date(year, 0), y: 27500},
                    // {x: new Date(year, 1), y: 29000},
                    // {x: new Date(year, 2), y: 22000},
                    // {x: new Date(year, 3), y: 26500},
                    // {x: new Date(year, 4), y: 33000},
                    // {x: new Date(year, 5), y: 37000},
                    // {x: new Date(year, 6), y: 32000},
                    // {x: new Date(year, 7), y: 27500},
                    // {x: new Date(year, 8), y: 29500},
                    // {x: new Date(year, 9), y: 43000},
                    // {x: new Date(year, 10), y: 55000, indexLabel: "High Renewals"},
                    // {x: new Date(year, 11), y: 39500}
                ]
            }, {
                type: "line",
                name: "Expected Sales",
                showInLegend: true,
                yValueFormatString: "VND#,##0",
                dataPoints: [
                    {label: "101", y: 30000000},
                    {label: "102", y: 30000000},
                    {label: "103", y: 30000000},
                    {label: "104", y: 30000000},
                    {label: "201", y: 30000000},
                    {label: "202", y: 30000000},
                    {label: "203", y: 30000000},
                    {label: "204", y: 30000000}
                    // {x: new Date(year, 0), y: 30000000},
                    // {x: new Date(year, 1), y: 30000000},
                    // {x: new Date(year, 2), y: 30000000},
                    // {x: new Date(year, 3), y: 30000000},
                    // {x: new Date(year, 4), y: 30000000},
                    // {x: new Date(year, 5), y: 30000000},
                    // {x: new Date(year, 6), y: 30000000},
                    // {x: new Date(year, 7), y: 30000000},
                    // {x: new Date(year, 8), y: 30000000},
                    // {x: new Date(year, 9), y: 30000000},
                    // {x: new Date(year, 10), y: 30000000},
                    // {x: new Date(year, 11), y: 30000000}
                ]
            }]
        }
        console.log(this.state.revenueByRoom);
        console.log(this.state.optionLst);
        console.log(options);

        return (
            <div>
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
                        <Dropdown
                            options={optionsSelectsMonth}
                            //value={this.state.monthSelected}
                            defaultValue={optionsSelectsMonth[0].value}
                            placeholder="Chọn Tháng"
                            selection
                            onChange={this.handleChangeMonthDropdown}
                        />
                    </Header.Content>
                </Header>
                {this.state.isLoadingRpt1 ? <Loader active inline='centered'/> :
                    <div>
                        <CanvasJSChart options={options}
                                       onRef={ref => this.chart = ref}
                        />
                        <ProductOptionUsing optionLst={this.state.optionLst}/>
                    </div>
                }
                {/*<CostReporting/>*/}
            </div>
        );
    }
}

export default MainReportPage;