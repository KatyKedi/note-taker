const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes/index.js');
const htmlRoutes = require('./routes/htmlRoutes/index.js');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true}))

// parse incoming JSON data
app.use(express.json());

// make certain files readily available and not gate it behind a server endpoint
app.use(express.static('Develop/public'));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});  