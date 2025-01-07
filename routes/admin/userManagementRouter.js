const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('admin/userManagement.ejs',{currentPage:'user'});
});

module.exports = router;