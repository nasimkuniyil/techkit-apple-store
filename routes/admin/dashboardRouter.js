const express = require('express')
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('admin/dashboard.ejs',{currentPage:'home'})
});

module.exports = router;