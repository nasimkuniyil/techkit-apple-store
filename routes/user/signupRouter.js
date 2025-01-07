const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/userController')

router.get('/', (req, res)=>{
    res.render('user/signup');
});

// router.get('/users/emails', async (req, res)=>{
//     try{
//         const allEmails = await userController.getEmail();
//         res.json(allEmails)
//     }catch(err){
//         res.status(500).render("error", { err });
//     }
// })

router.post('/create-user',async (req, res)=>{
    const data = req.body;
    try{
        const user = await userController.addUser(data);
        console.log(user);
        res.send('success!')

    }catch(err){
        res.status(500).render("error", { err });
    }
})

module.exports = router;