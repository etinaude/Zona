
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