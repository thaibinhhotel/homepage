import React, { Component } from 'react';
import CanvasJSReact from '../../../assets/js/canvasjs.react';
import PropTypes from "prop-types";
import {ListRoomRows} from "../../ListRoomRows";
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
        console.log("ProductOptionUsing" + JSON.stringify(this.props.optionLst));
        // debugger;
        const options = {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: "Doanh thu từ các loại sản phẩm"
            },
            axisX: {
                title: "Sản Phẩm",
                reversed: true,
            },
            axisY: {
                title: "VND",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: this.props.optionLst.length > 0 ? this.props.optionLst : [
                    { y:  1000000, label: "Nothing" },
                    { y:  1000000, label: "Nothing" },
                    { y:  1000000, label: "Nothing" },
                    { y:  1000000, label: "Nothing" },
                    { y:  1000000, label: "Nothing" },
                    { y:  1000000, label: "Nothing" },
                    { y:  1000000, label: "Nothing" }
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

ProductOptionUsing.propTypes = {
    optionLst: PropTypes.array
}

export default ProductOptionUsing;