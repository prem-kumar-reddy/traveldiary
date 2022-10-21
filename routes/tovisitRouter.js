const router = require('express').Router()
const tovisitCtrl = require('../controllers/tovisitCtrl')
const auth = require('../middleware/auth')

router.route('/tovisits')
    .post(auth, tovisitCtrl.createTovisit)
    .get(auth, tovisitCtrl.getTovisit)

router.route('/tovisit/:id')
    .patch(auth, tovisitCtrl.updateTovisit)
    .delete(auth, tovisitCtrl.deleteTovisit)

module.exports = router