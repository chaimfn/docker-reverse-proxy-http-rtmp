'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app
	.use(express.json())
	.get('/', (req, res) => {
		res.status(200).send('Hello express!');
	})
	.post('/', (req, res) => {
		res.send(req.body)
	})
	.listen(PORT, HOST, () => {
		console.log(`Running on http://${HOST}:${PORT}`);
	});
