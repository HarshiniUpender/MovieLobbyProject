import request from 'supertest';
import app from './index'; 

//List all movies
describe('GET /movies', () => {
    it('should retrieve all movies from the database', async () => {
        const movie = { title: 'Test Movie', genre: 'Test Genre' };
        await request(app).post('/movies').send(movie);

        const response = await request(app).get('/movies');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Retrieved the movie(s).');
    });
});

//Search a movie
describe('GET /movies/search', () => {
    it('should search movies by title', async () => {
        const movie = { title: 'Hanuman' };
        await request(app).post('/movies').send(movie);

        const response = await request(app).get('/movies/search').query({ title: 'Hanuman' });
        expect(response.status).toBe(200);
    });

    it('should search movies by genre', async () => {
        const movie = { genre: 'Comedy' };
        await request(app).post('/movies').send(movie);

        const response = await request(app).get('/movies/search').query({ genre: 'Comedy' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Retrieved the movie(s).');
        expect(response.body.movie.length).toBe(1);
    });
});

//Add a movie
describe('POST /movies', () => {
    it('should add a movie to the database', async () => {
        const newMovie = { title: 'New Movie', genre: 'Drama', userRole: 'admin' };

        const response = await request(app).post('/movies').send(newMovie);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Movie is added to the lobby!');
    });

    it('should not add a movie if user is not admin', async () => {
        const newMovie = { title: 'New Movie', genre: 'Drama', userRole: 'user' };

        const response = await request(app).post('/movies').send(newMovie);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User does not have admin access to add a movie.');
    });
});

//Update a movie
describe('PUT /movies/:id', () => {
    it('should update a movie in the database', async () => {
        const movieData = {
            userRole: 'admin',
            title: 'Test Movie2',
            genre: 'Test Genre2',
            rating: 5,
            streamingLink: 'http://example.com'
        };

        const response = await request(app)
            .put('/movies/65ec35da5c87fe45350cef37')
            .send(movieData)
            .expect(200);

            expect(response.body.message).toBe('Movie is updated in the lobby!');
    });

    it('user should not be able to update movie', async () => {
        const movieData = {
            userRole: 'user',
            title: 'Test Movie2',
            genre: 'Test Genre2',
            rating: 5,
            streamingLink: 'http://example.com'
        };

        const response = await request(app)
            .put('/movies/65ec35da5c87fe45350cef37')
            .send(movieData)
            .expect(200);

            expect(response.body.message).toBe('User does not have admin access to update a movie.');
    });
});

//Delete a movie
describe('DELETE /movies/:id', () => {
     it('Should delete a movie', async () => {
        const movieData = {
            userRole: 'admin',
        };

        const response = await request(app)
            .delete('/movies/65f41cb86ea0c6a0d30c8433')
            .send(movieData)
            .expect(200);

            expect(response.body.message).toBe('Movie is deleted in the lobby!');
    });

    it('Should not delete a movie as user does not have admin access', async () => {
        const movieData = {
            userRole: 'user',
        };

        const response = await request(app)
            .delete('/movies/65ec30d6b7bfecbd4acd609c')
            .send(movieData)
            .expect(200);

        expect(response.body).toEqual({ message: 'User does not have admin access to delete a movie.' });
    });
});
