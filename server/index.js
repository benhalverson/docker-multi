const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgDatabase,
	port: keys.pgPORT
});

const keys = require('./keys');

app.use(cors());
app.use(bodyParser.json());

pgClient.on('error', () => console.error('Lost PG connection'));

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)').catch((err) => console.error(err));

const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/api', (req, res) => {
	res.send({
		api: 'it works'
	});
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if(parseInt(index) > 40) {
    return res.status(422).send('Index is to high');
  }

  redisClient.hset('values', index, 'Nothing Yet');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({
    working: true
  });
});

app.listen(5000, () => {
  console.log('listening on port 5000');
});