const express = require('express')
const router = express.Router()



router.get('/todos', async (req, res)=>{

    return res.sendFile('/routes/auth.js', (err)=>{
        if(err)console.log('error', err);
        else{
            console.log('file sent succesfully')
        }
    })
})

module.exports = router;