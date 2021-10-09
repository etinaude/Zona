import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { getAllData } from '../services/api';

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    columns = [
        { field: 'time', headerName: 'Time', width: 160, },
        { field: 'date', headerName: 'Date', width: 160, },
        {
            field: 'fablab',
            headerName: 'Count',
            sortable: false,
            width: 160,
        },
    ];

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


    render() {
        return (
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={this.state.data}
                    columns={this.columns}
                    pageSize={5}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        );
    };



    formatData(rawData) {
        if (!rawData) return []
        let data = []
        for (let i = 0; i < rawData.length; i++) {
            var time = new Date(rawData[i].time).toLocaleTimeString()
            var date = new Date(rawData[i].time).toLocaleDateString()

            data.push({
                id: rawData[i].id,
                time: time,
                date: date,
                fablab: rawData[i].rooms[0].count,
            })
        }
        return data
    }
}