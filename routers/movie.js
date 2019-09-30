var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {
    getAll: function(req, res) {
        Movie.find()
            .populate('actors')
            .exec(function(err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            })
    },
    createOne: function(req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function(err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function(req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function(err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },
    updateOne: function(req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },
    deleteOne: function(req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (err) return res.status(400).json(err);
            res.json();
            //console.log(req.params);
        });
    },
    //task 5 
    addActor: function(req, res) {
        Movie.findOne({ _id: req.params.id }, function(err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function(err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function(err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    deleteOneActor: function(req, res) {
        Movie.findOne({ _id: req.params.movieID }, function(err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.params.actorID }, function(err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                var index = movie.actors.indexOf(actor._id);
                if (index > -1) movie.actors.splice(index, 1); // delet actor
                movie.save(function(err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    getMovieByYear: (req, res) => {
        Movie.where('year').gte(req.params.year2).lte(req.params.year1).exec((err, movies) => {
            if (err) return res.status(400).json(err);
            if (!movies) return res.status(404).json();
            res.json(movies);
        })
    }
}