const User = require('../models/user');
const Truck = require('../models/truck');

module.exports = {
    index,
    new: newTruck,
    create,
    show,
    delete: deleteTruck
};

function index(req, res) {
    Truck.find({})
    .then(trucks => {
        res.render('index', {
            user: req.user,
            viewName: 'trucks#index',
            trucks
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.send('Error setting up trucks index page');
    });
}

function newTruck(req, res) {
    res.render('new', {
        user: req.user,
        viewName: 'trucks#new'
    });
}

function create(req, res) {
    Truck.create(req.body)
    .then(truck => truck.save())
    .then(truck => {
        console.log('Saved truck: ', truck);
        User.findById(truck.creator)
        .then(user => {
            user.trucks.push(truck._id);
            console.log("Updated user's trucks array: ", user);
            return user.save();
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/new');
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/new');
    });
}

function show(req, res) {
    Truck.findById(req.params.id)
    .then(truck => {
        res.render('show', {
            user: req.user,
            viewName: 'trucks#show',
            truck
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
}

function deleteTruck(req, res) {
    Truck.findByIdAndDelete(req.params.id)
    .then(truck => {
        User.findById(req.user.id)
        .then(user => {
            let idx = user.trucks.findIndex(idx => idx === truck.id);
            user.trucks.splice(idx, 1);
            return user.save();
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/');
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
}