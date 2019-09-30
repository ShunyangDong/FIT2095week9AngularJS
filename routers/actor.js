const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');


module.exports = {
    getAll: (req, res) => {
        Actor.find()
            .populate('movies')
            .exec(function(err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            })
    },
    createOne: (req, res) => {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function(err) {
            res.json(actor);
        });
    },
    getOne: function(req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function(err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },


    updateOne: function(req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            res.json(actor);
        });
    },


    deleteOne: function(req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    deleteOneWithMovies: (req, res) => {
        Actor.findOne({ _id: req.params.id })
            .exec((err, actor) => {
                console.log(actor);
                if (err) return res.status(400).json(err);
                actor.movies.forEach(movie => {
                    Movie.findOneAndRemove({ _id: movie._id }, (err) => {
                        if (err) return res.status(400).json(err);
                        console.log(movie._id)
                    });
                })
                Actor.findOneAndRemove({ _id: req.params.id }, function(err) {
                    if (err) return res.status(400).json(err);
                    res.json({ "msg": "DELETED!" });
                });
            });
    },
    addMovie: function(req, res) {
        Actor.findOne({ _id: req.params.id }, function(err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.body.id }, function(err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function(err) {
                    if (err) return res.status(500).json(err);

                    res.json(actor);
                });
            })
        });
    },
    deleteOneMovie: (req, res) => {
        Actor.findOne({ _id: req.params.actorID }, function(err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.params.movieID }, function(err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                var index = actor.movies.indexOf(movie._id);
                if (index > -1) actor.movies.splice(index, 1);
                actor.save(function(err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    deleteByAge: (req, res) => {
        let date = new Date();
        year1 = date.getFullYear();
        console.log(year1);
        year2 = year1 - 15;
        console.log(year2);
        Actor.where('bYear').gte(year2).exec((err, actors) => {
            if (actors.length == 0) res.json({ 'mss': 'no young actor' });
            actors.forEach(actor => {
                console.log(actor);
                Actor.findOneAndRemove({ _id: actor.id }, err => {
                    if (err) return res.status(400).json(err);
                    res.json(actor);
                })
            })
        })
    }

}