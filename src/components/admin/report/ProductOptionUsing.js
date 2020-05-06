import React, { Component } from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

class ProductOptionUsing extends Component {
    addSymbols(e){
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if(order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }
    render() {
        const options = {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: "Doanh thu từ các loại sản phẩm"
            },
            axisX: {
                title: "Sản ",
                reversed: true,
            },
            axisY: {
                title: "VND",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: [
                    { y:  2200000000, label: "Facebook" },
                    { y:  1800000000, label: "YouTube" },
                    { y:  800000000, label: "Instagram" },
                    { y:  563000000, label: "Qzone" },
                    { y:  376000000, label: "Weibo" },
                    { y:  336000000, label: "Twitter" },
                    { y:  330000000, label: "Reddit" }
                ]
            }]
        }

        return (
            <div>
                <h1>React Bar Chart</h1>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}

export default ProductOptionUsing;