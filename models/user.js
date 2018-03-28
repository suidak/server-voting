var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    private_key: {
        type: String
    },
    vote_keys: [{
        type: String
    }]
}
})

module.exports = mongoose.model('Users', UserSchema);