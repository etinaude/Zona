const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/image', (req, res) => {

})



app.listen(port, () => {
    console.clear()
    console.log(`OPEN http://localhost:${port}`)
})