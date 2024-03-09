require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let Site;

const siteSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

Site = mongoose.model('Site', siteSchema);

app.route('/api/shorturl').post((req, res) => {
  console.log(req.body.url);
  var reqUrl = req.body.url;

  

  Site.estimatedDocumentCount((countErr, docCount) => {
    if (countErr) {
      res.send('estimatedDocumentCount error');
    }
    
    const site = new Site({
      original_url: reqUrl,
      short_url: docCount + 1
    });
    
    site.save((saveErr, savedUrl) => {
      if (saveErr) {
        res.send('save error');
      }

      res.json({
        original_url: savedUrl.original_url,
        short_url: savedUrl.short_url
      });
    });
  });
});


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
