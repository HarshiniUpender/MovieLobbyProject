const express = require('express');
const mongoose = require('mongoose');
const MovieModel = require('./models/movieModels');

const app = express();
app.use(express.json());

//List All the movies in lobby
app.get('/movies', async (request: any, response: any) => {
    try {
        const listAllMovies = await MovieModel.find({});
        response.status(200).json({ message : 'Retrieved the movie(s).', movies: listAllMovies });
    } catch (error: any) {
        response.status(500).json({ error : error.message });
    }
});

//Search a movie by title or genre
app.get('/movies/search', async (request: any, response: any) => {
    try {
        const { title, genre } = request.query;
        const searchAMovie = title ? 
        await MovieModel.find({ title: title }) 
        : await MovieModel.find({ genre: genre });
        response.status(200).json({ message : 'Retrieved the movie(s).', movie: searchAMovie });
    } catch (error: any) {
        response.status(500).json({ error : error.message });
    }
});

//Add a movie to the lobby
app.post('/movies', async (request: any, response: any) => {
    try {
        const { userRole } = request.body;
        if(userRole === 'admin'){
            const addMovie = await MovieModel.create(request.body);
            response.status(200).json({ message : 'Movie is added to the lobby!' });
        }else{
            response.status(200).json({ message : 'User does not have admin access to add a movie.' });
        }
    } catch (error: any) {
        response.status(500).json({ error : error.message });
    }
});


//Update a movie to the lobby
app.put('/movies/:id', async (request: any, response: any) => {
    try {
        const { id } = request.params;
        const { userRole } = request.body;
        if(userRole === 'admin'){
            const updateMovie = await MovieModel.findByIdAndUpdate(id, request.body);
            if(!updateMovie){
                response.status(404).json({ message : `Cannot find movie with id ${id}!`});
            }
            const updatedMovie = await MovieModel.findById(id);
            response.status(200).json({ message : 'Movie is updated in the lobby!', movie: updatedMovie});
        } else{
            response.status(200).json({ message : 'User does not have admin access to update a movie.' });
        }
    } catch (error: any) {
        response.status(500).json({ error : error.message });
    }
});


//Delete a movie in the lobby
app.delete('/movies/:id', async (request: any, response: any) => {
    try {
        const { id } = request.params;
        const { userRole } = request.body;
        if(userRole === 'admin'){
            const deleteMovie = await MovieModel.findByIdAndDelete(id, request.body);
            if(!deleteMovie){
                response.status(404).json({ message : `Cannot find movie with id ${id}!`});
            }
            response.status(200).json({ message : 'Movie is deleted in the lobby!'});
        } else{
            response.status(200).json({ message : 'User does not have admin access to delete a movie.' });
        }
    } catch (error: any) {
        response.status(500).json({ error : error.message });
    }
});

const mongoUrl = 'mongodb+srv://harshiniupender:harshiniupender@cluster0.juqm2pd.mongodb.net/';
mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to MongoDB!');
    app.db = mongoose.connection;
    app.listen(3000, () => {
        console.log('Server is running on port 3000.');
    });
}).catch((error: any) => {
    console.log(`Error occured while connecting to db:${error}`);
});

export default app;
