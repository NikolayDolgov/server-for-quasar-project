const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const Database = require('better-sqlite3');
const dbr = new Database('mailDB.db', { fileMustExist: true });

const options = {
  origin: [
    'http://localhost:9000',
  ],
};
app.use('*', cors(options));

app.use(bodyParser.json());

app.get('/income', (req, res) => {
  const data = dbr.prepare(`SELECT * FROM main.mailIn`).all();;
  console.log(data)
  res.json({ message: data });
});

app.post('/delite', (req, res) => {
  const {
    id,
    theme,
    message,
    sender,
    address,
    file,
  } = req.body;
  console.log(message);
  console.log(typeof(message));
  const data = dbr.prepare(`INSERT INTO main.del VALUES(${id}, '${theme}', '${message}', '${sender}', '${address}', '${file}');`);
  data.run()
  res.json({ message: 'ок' });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
