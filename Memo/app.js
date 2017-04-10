var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

mongoose.connect('mongodb://joon:1234@ds153730.mlab.com:53730/mern');

var Schema = mongoose.Schema;

var MemoSchema = new Schema({
    title     : String,
    body      : String,
    date      : {type: Date, default:Date.now}
});

var Memo = mongoose.model('Memo', MemoSchema);


app.set('view engine', 'pug');
app.set('views', 'view');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    Memo.find((err, docs) => {
        var output = '';
        for (var i = 0; i < docs.length; i++) {
            output += '<p><a href="/'+docs[i]._id+'">'+docs[i].title+'</a></p>';
        }
        res.send(output+'<p><a href="/add">Add</a></p>');
    });
});

app.get('/add', (req, res) => {
    res.send(`
        <form action="/add" method="post">
            <p><input type="text" name="title" id="title"></p>
            <p><textarea name="body" id="body"></textarea></p>
            <p><input type="submit"></p>
        </form>
    `);
});

app.post('/add', (req, res) => {
    var newMemo = new Memo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save(function(err){
      if(err) console.log("Something went wrong while saving the thing");
      else res.redirect('/');
    });
});

app.get('/:id', (req, res) => {
    Memo.findOne({'_id': req.params.id}, (err, doc) => {
        res.send(doc.title + '<br>' + doc.body + '<br>' + doc.date + '<br>');
    });
});

app.delete('/:id', (req, res) => {
    Memo.remove({'_id': req.params.id}, (err, output) => {
        res.redirect('/');
    });
});

app.listen('3000', () => {
    console.log("Express is Connected 3000 Port!");
});