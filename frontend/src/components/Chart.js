import { Chart } from 'react-charts'
import { getAllData } from '../services/api';
import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function Table(props) {
    var [data, dataUpdate] = useState([]);
    const [selectedScale, setScale] = React.useState(1);

    React.useEffect(() => {
        setUpdate(props.roomNumber);
    }, [props.roomNumber]);

    async function setUpdate(room, scale) {
        var ret = (await getData(room, scale))
        dataUpdate(ret);
    }


    var series =
        () => ({
            type: 'area'
        })//change to "area"

    var axes = [
        { primary: true, type: 'time', position: 'bottom' },
        { type: 'linear', position: 'left', stacked: true }
    ]

    const handleAlignment = async (event, scale) => {
        setScale(scale)
        setUpdate(props.roomNumber, selectedScale);
    };


    return (
        <>
            <div class="time">
                <ToggleButtonGroup
                    value={selectedScale}
                    exclusive
                    size="small"
                    onChange={handleAlignment}
                >
                    <ToggleButton value="1" >
                        Day
                    </ToggleButton>
                    <ToggleButton value="7" >
                        Week
                    </ToggleButton>
                    <ToggleButton value="30">
                        Month
                    </ToggleButton>
                    <ToggleButton value="365">
                        Year
                    </ToggleButton>
                </ToggleButtonGroup>

            </div>
            <div className="center-container">
                <div
                    style={{
                        width: '90%',
                        height: '77%'
                    }}
                >
                    <Chart data={data} axes={axes} series={series} />
                </div>
            </div>
        </>
    )
}

async function getData(roomNumber, scale) {
    var date = new Date().getTime() / 1000;
    if (scale === undefined) scale = 70
    var start = date - (scale * 86400);
    const response = await getAllData(Math.round(start), Math.round(date), roomNumber);
    var data = await formatData(await response.json());
    return data;
};

function formatData(rawData) {
    let data = []
    for (let datum of rawData.entries) {
        data.push([datum.time * 1000, datum.count])
    }
    data = data.sort((a, b) => a.time - b.time)

    return [{
        label: 'series', data: data
    }]
}

export default Table;