var express = require('express');
var router = express.Router();
var elections = require('../controllers/electionsController');
router.get('/', elections.list_all_elections);
router.post('/', elections.create_an_election);
router.get('/vote/:votekey', elections.voteToCandidate);

module.exports = router;