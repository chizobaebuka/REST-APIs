const { signup, login } = require('../controllers/authCtrl');

const router = require('express').Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

module.exports = router;