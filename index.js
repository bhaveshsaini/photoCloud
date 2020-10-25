const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')

app.use(express.static('/home/pi/externalStorage/Maleeha'));
app.use(express.json())
app.use(cors())



app.get('/', async(req, res) => {
    const response = fs.readdir('/home/pi/externalStorage/Maleeha', (err, result) => res.send(result))
    
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/pi/externalStorage/Maleeha');
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage});
 
app.post('/upload', upload.array('pic'), async (req, res) => {

    res.send('Successfully Uploaded.')
    
})

app.delete('/delete', async (req, res) => {

    fs.unlink("/home/pi/externalStorage/Maleeha/" + req.header('fileName'), (err) => {
        if (err) {
            console.log("failed:" + err);
        } else {
            res.send('successfully deleted');                                
        }
    });

})

const port = process.env.port || 3000
app.listen(port, () => console.log('RUNNING ON PORT: ' + port))