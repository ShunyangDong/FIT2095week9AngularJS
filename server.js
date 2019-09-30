const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const actors = require('./routers/actor');
const movies = require('./routers/movie');

const app = express();

app.listen(8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let path = require('path');
app.use("/", express.static(path.join(__dirname, "dist/movieAng")));


mongoose.connect('mongodb://localhost:27017/movies', (err) => {
    if (err) return console.log('Mongoose-connection err', err);
    else console.log('connect successfully');
});

// configuring endpoints, actor RESTful endpoints

app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);


//Movie RESTFul  endpoints

app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);



// task1
app.delete('/movies/:id', movies.deleteOne);
// task2
app.delete('/actors&movies/:id', actors.deleteOneWithMovies);
/*task3
Remove a movie from the list of movies of an actor
Example: http://localhost:8080/actors/1234/987
where 1234 is the actor’s ID
and 987 is the movie’s ID*/
app.put('/actors/:actorID/:movieID', actors.deleteOneMovie); //tick
/*Remove an actor from the list of actors in a movie
Example: http://localhost:8080/movies/567/2234
where 567 is the movie ID
and 2234 is the actor ID*/
app.put('/movies/:movieID/:actorID', movies.deleteOneActor); // tick 
/* Add an existing actor to the list of actors in a movie*/
app.post('/movies/:id/actors', movies.addActor);
/* task 6 Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.*/
app.get('/movies/:year1/:year2', movies.getMovieByYear); //tick

/*task7 The current implementation of getAll actors function retrieves the list of actors, 
where each actor has an array of IDs represents his/her movies.  
Update the implementation such that the array of movies should contain the details of the movies instead of IDs.*/
app.get('/actors', actors.getAll); //tick

/*task8 Like point (7), reimplement getAll movies such that it retrieves the details of all actors for each individual movie.*/
app.get('/movies', movies.getAll); //tick

app.delete('/extratask', actors.deleteByAge);