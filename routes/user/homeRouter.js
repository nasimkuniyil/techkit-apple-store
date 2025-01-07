const express = require('express');
const { getHome } = require('../../controller/userController/homePageController');
const router = express.Router();

router.get('/', getHome);

module.exports = router;