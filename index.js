const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/routes/index');


const app = express();

app.use(bodyParser.json());


// ROUTER
app.use(router);

// SERVER ADDRESS
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
   console.log(`app running on port ${PORT}`)
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
};

process.on('uncaughtException', (err) => {
  // console.log(err);
});