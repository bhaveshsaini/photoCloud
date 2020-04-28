const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const cloud = require('cloudinary').v2

app.use(express.json())

app.use(cors({
    origin: 'https://fliks.herokuapp.com/'
  }));

cloud.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret
})


app.get('/', async(req, res) => {

    let resArray = []

    await cloud.api.resources(
        {
            max_results: 500
        },
        function(error, result) {

        for(let i = 0; i < result.resources.length; i++)
        {
            resArray.push(result.resources[i].secure_url)
        }
        
    });

    await cloud.api.resources(
        {
            resource_type: 'video'
        },
        function(error, result) {

        for(let i = 0; i < result.resources.length; i++)
        {
            resArray.push(result.resources[i].secure_url)
        }
        
    });

    res.send(resArray) 
})

const storage = multer.diskStorage({})

const upload = multer({ storage: storage })
 
app.post('/upload', upload.array('pic'), async (req, res) => {
    const file = req.files
    let success = false

    for(let i = 0; i < file.length; i++)
    {
        await cloud.uploader.upload(file[i].path, 
            {
                resource_type: 'auto'
            })
            .then((res) => {
                success = true
            }) .catch((e) => console.log(e))
    }

    if(success)
    {
        res.status(200).send()
    }
    
})

app.delete('/deleteimage', async (req, res) => {

    await cloud.uploader.destroy(req.header('public_id'))
    .then((res) => {
    }).catch((e) => console.log(e))

    res.send()
})

app.delete('/deletevideo', async (req, res) => {
    await cloud.uploader.destroy(req.header('public_id'), {
        resource_type: 'video'
    }).then((res) => {
    }).catch((e) => console.log(e))

    res.send()
})

const PORT = process.env.PORT || 80
app.listen(PORT)