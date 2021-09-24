import { Chart } from 'react-charts'
import { getAllData } from '../services/api';
import React from 'react';


export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        const getData = async () => {
            const response = await getAllData();
            var data = await this.formatData(await response.json());
            this.setState({
                data: data
            });
        };
        getData();
    }

    series =
        () => ({
            type: 'area'
        })



    axes = [
        { primary: true, type: 'time', position: 'bottom' },
        { type: 'linear', position: 'left', stacked: true }
    ]

    render() {

        return (
            <div
                style={{
                    width: '80%',
                    height: '500px'
                }}
            >
                <Chart data={this.state.data} axes={this.axes} series={this.series} />
            </div>
        )
    }

    formatData(rawData) {

        let data = [[new Date(), 0]]
        for (let datum of rawData) {
            data.push([datum.time, datum.rooms[0].count])
        }
        data = data.sort((a, b) => b.time - a.time)

        return [{
            label: 'series', data: data
        }]
    }
}