import { Chart } from 'react-charts'
import { getAllData } from '../services/api';
import React, { useState } from 'react';


function Table(props) {
    var [data, dataUpdate] = useState([]);


    React.useEffect(() => {
        setUpdate(props.roomNumber);
    }, [props.roomNumber]);

    async function setUpdate(room) {
        dataUpdate(await getData(room))
    }



    var series =
        () => ({
            type: 'line'
        })//change to "area"



    var axes = [
        { primary: true, type: 'time', position: 'bottom' },
        { type: 'linear', position: 'left', stacked: true }
    ]


    return (
        <div className="center-container">
            <div
                style={{
                    width: '80%',
                    height: '500px'
                }}
            >
                <Chart data={data} axes={axes} series={series} />
            </div>
        </div>
    )
}

async function getData(roomNumber) {
    const response = await getAllData(undefined, undefined, roomNumber);
    var data = await formatData(await response.json());
    return data;
};

function formatData(rawData) {

    let data = [[new Date(), 0]]
    for (let datum of rawData) {
        data.push([datum.time, datum.count])
    }
    data = data.sort((a, b) => a.time - b.time)

    return [{
        label: 'series', data: data
    }]
}

export default Table;