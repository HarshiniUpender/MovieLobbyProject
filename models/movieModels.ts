const mongo = require('mongoose');

const movieSchema = mongo.Schema({
    title:{
        type: String
    },
    genre: {
        type: String
    },
    rating: {
        type: Number
    },
    streamingLink: {
        type: String
    },
    userRole: {
        type: String
    }
});

const Movie = mongo.model('Movie', movieSchema);

module.exports = Movie;