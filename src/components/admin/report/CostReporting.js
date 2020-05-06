import React, { Component } from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CostReporting extends Component {
    render() {
        const options = {
            animationEnabled: true,
            title: {
                text: "Chi phí hoạt động trong tháng"
            },
            subtitles: [{
                text: "1,000,000 VND",
                verticalAlign: "center",
                fontSize: 24,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###'%'",
                dataPoints: [
                    { name: "Điện", y: 25 },
                    { name: "Nước", y: 25 },
                    { name: "Thức ăn & nước uống", y: 40 },
                    { name: "Chi phí khác", y: 10 }
                ]
            }]
        }

        return (
            <div>
                <h1>React Doughnut Chart</h1>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}

export default CostReporting;