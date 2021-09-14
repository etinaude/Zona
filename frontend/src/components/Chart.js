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
            console.log(data)
            this.setState({
                data: data
            });
        };
        getData();
    }

    data =
        [
            {
                label: 'Series 2',
                data: [[0, 1], [1, 2]]
            }
        ]

    axes = [
        { primary: true, type: 'linear', position: 'bottom' },
        { type: 'linear', position: 'left' }
    ]

    render() {
        return (
            <div
                style={{
                    width: '80%',
                    height: '500px'
                }}
            >
                <Chart data={this.prop.data} axes={this.axes} />
            </div>
        )
    }

    formatData(rawData) {
        let data = []
        for (let i = 0; i < rawData.length; i++) {
            data.push([i, rawData[i].rooms[0].count])
        }
        return [{
            label: 'series', data: data
        }]
    }
}