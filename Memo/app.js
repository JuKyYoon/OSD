var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var autoIncrement = require("mongoose-auto-increment");
var app = express();

mongoose.connect('mongodb://joon:1234@ds153730.mlab.com:53730/mern');

var connection = mongoose.connection;

autoIncrement.initialize(connection)

var Schema = mongoose.Schema;

var MemoSchema = new Schema({
    title     : String,
    body      : String,
    date      : {type: Date, default:Date.now}
});

MemoSchema.plugin(autoIncrement.plugin, 'Memo');
var Memo = mongoose.model('Memo', MemoSchema);


app.set('view engine', 'pug');
app.set('views', 'view');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    Memo.find((err, docs) => {
        res.render('main',{memos: docs});
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    var newMemo = new Memo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      res.redirect('/');
    });
});

app.get('/:id', (req, res) => {
    Memo.findOne({'_id': req.params.id}, (err, doc) => {
        res.render('view', {memo: doc});
    });
});

app.get('/:id/delete', (req, res) => {
    Memo.remove({'_id': req.params.id}, (err, output) => {
        res.redirect('/');
    });
});

app.get('/:id/edit', (req, res) => {
    Memo.findOne({'_id': req.params.id}, (err, doc) => {
        res.render('edit', {memo: doc});
    });
});

app.post('/:id/edit', (req, res) => {
    Memo.findById(req.params.id, (err, doc) => {
        doc.title = req.body.title;
        doc.body = req.body.body;
        doc.date = Date.now();
        doc.save((err, doc) => {
            if (err) console.log(err);
            res.redirect('/'+req.params.id);
        });
    });
});

app.listen('3000', () => {
    console.log("Express is Connected 3000 Port!");
});