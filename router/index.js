const express = require('express');
const router = express.Router();
const TeamnameCtr = require('../controller/TeamnameCtr');
const MatchCtr = require('../controller/MatchCtr');
const UserCtr = require('../controller/UserCtr');

router.get('/get_teamnames', TeamnameCtr.getname);

router.get('/get_matchinfor', MatchCtr.getMatch);
router.post('/save_matchinfor', MatchCtr.saveMatch);

router.get('/getUsers', UserCtr.getUser);
router.post('/editUsers', UserCtr.EditUser);
router.post('/delUsers', UserCtr.DeleteUser);

router.post('/login', UserCtr.loginUser);
router.post('/register', UserCtr.registerUser);
router.post('/forgotPass', UserCtr.forgotPass);

router.post('/getaction', UserCtr.getAction);
router.post('/action', UserCtr.actionUser);

router.post('/getnowmatch', MatchCtr.getnowmatch);
router.post('/getuseraction', MatchCtr.getuseraction);
router.post('/confirmaction', MatchCtr.confirmaction);
router.get('/getleaderboard', MatchCtr.getleaderboard);

router.post('/editprofile', UserCtr.editprofile);

router.post('/charge', UserCtr.ChargeEntry);


module.exports = router;