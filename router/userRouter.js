const router = require('express').Router()

const {signUp, signIn, getAll, signOut, socialAuth, callback} = require('../controller/userController.js')
const {isLoggedIn} = require('../middleware/session.js')

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.get('/sociallogin', async(req, res)=>{
    res.redirect('http://localhost:5555/api/auth/facebook/callback')
})

router.get('/auth/facebook/callback', socialAuth)
router.get("/auth/facebook/success", (req, res)=>{
    req.session.user=req.user
})

router.post('/sign-out', signOut)

router.get('/all-user', isLoggedIn,getAll)


module.exports = router