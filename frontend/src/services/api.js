
export const getAllData = async () => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return await fetch("https://back.etinaude.dev/zona/entries/all", headers)
}

// TODO
export const roomDailyData = async (room) => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return await fetch("https://back.etinaude.dev/zona/entries/all", headers)
}


// TODO
export const roomWeeklyData = async (room) => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return await fetch("https://back.etinaude.dev/zona/entries/all", headers)
}


// TODO
export const roomMonthlyData = async (room) => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return await fetch("https://back.etinaude.dev/zona/entries/all", headers)
}


// TODO
export const roomYearlyData = async (room) => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return await fetch("https://back.etinaude.dev/zona/entries/all", headers)
}

// TODO
export const getCurrentData = async (room) => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    return await fetch("https://back.etinaude.dev/zona/entries/all", headers)
}