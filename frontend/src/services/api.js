
export const getAllData = async (start, end, room) => {
    var headers =
    {
        method: 'GET',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    var params = ""
    if (start || end || room !== undefined) {
        params = `?${start ? "start=" + start + "&" : ""}${end ? "end=" + end + "&" : ""}${room !== undefined ? "room=" + room + "&" : ""}`
        params = params.substring(0, params.length - 1)
    }
    return await fetch(`https://back.etinaude.dev/zona/entries/all${params}`, headers)
}
