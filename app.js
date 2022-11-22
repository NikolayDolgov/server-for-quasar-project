const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const Database = require('better-sqlite3');
const db = new Database('mailDB.db', { fileMustExist: true });

const options = {
  origin: [
    'http://localhost:9000',
  ],
};
app.use('*', cors(options));

app.use(bodyParser.json());

app.get('/income', (req, res) => {
  const data = db.prepare(`SELECT * FROM main.mailIn`).all();;
  res.json({ message: data });
});

app.get('/delitelist', (req, res) => {
  const data = db.prepare(`SELECT * FROM main.del`).all();;
  res.json({ message: data });
});

app.get('/sendlist', (req, res) => {
  const data = db.prepare(`SELECT * FROM main.mailsend`).all();;
  res.json({ message: data });
});

app.get('/draftlist', (req, res) => {
  const data = db.prepare(`SELECT * FROM main.maildraft`).all();;
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
    path
  } = req.body;

  let deliteQuery;
  if (path !== '/basket') {
    const insertQuery = db.prepare(`INSERT INTO main.del VALUES(${id}, '${theme}', '${message}', '${sender}', '${address}', '${file}');`);
    insertQuery.run()

    if (path === '/send') {
      deliteQuery = db.prepare(`DELETE FROM main.mailsend WHERE id = ${id};`);
    }
    else if (path === '/draft') {
      deliteQuery = db.prepare(`DELETE FROM main.maildraft WHERE id = ${id};`);
    }
    else {
      deliteQuery = db.prepare(`DELETE FROM main.mailIn WHERE id = ${id};`);
    }
  }
  else {
    deliteQuery = db.prepare(`DELETE FROM main.del WHERE id = ${id};`);
  }
  deliteQuery.run();

  res.json({ message: 'ок' });
});

app.post('/send', (req, res) => {
  const { list } = req.body;
  list.forEach(element => { // записываем элементы в БД
    const insertQuery = db.prepare(`INSERT INTO main.mailsend VALUES(${element.id}, '${element.theme}', '${element.message}', '${element.sender}', '${element.address}', '${element.file}');`);
    insertQuery.run()
  });
  const deliteQuery = db.prepare('DELETE FROM main.maildraft;'); // очищаем БД черновики
  deliteQuery.run()
  res.json({ message: 'ок' });
});

app.post('/draft', (req, res) => {
  const {
    id,
    theme,
    message,
    sender,
    address,
    file,
  } = req.body;

  const insertQuery = db.prepare(`INSERT INTO main.maildraft VALUES(${id}, '${theme}', '${message}', '${sender}', '${address}', '${file}');`);
  insertQuery.run()

  res.json({ message: 'ок' });
});

app.put('/update', (req, res) => {
  const { update } = req.body;
  if (update) {
    let deliteQuery = db.prepare('DELETE FROM main.maildraft;'); // черновики
    deliteQuery.run()
    let insertQuery = db.prepare(`INSERT INTO main.maildraft VALUES( 1, 'Черновик 1', 'Сообщение черновика 1', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.maildraft VALUES( 2, 'Черновик 2', 'Сообщение черновика 2', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.maildraft VALUES( 3, 'Черновик 3', 'Сообщение черновика 3', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.maildraft VALUES( 4, 'Черновик 4', 'Сообщение черновика 4', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()

    deliteQuery = db.prepare('DELETE FROM main.mailsend;'); // отправленные
    deliteQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailsend VALUES( 5, 'Отправленное 1', 'Сообщение отправленное 1', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailsend VALUES( 6, 'Отправленное 2', 'Сообщение отправленное 2', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailsend VALUES( 7, 'Отправленное 3', 'Сообщение отправленное 3', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailsend VALUES( 8, 'Отправленное 4', 'Сообщение отправленное 4', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()

    deliteQuery = db.prepare('DELETE FROM main.mailIn;'); // входящие
    deliteQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailIn VALUES( 9, 'Входящее 1', 'Сообщение входящее 1', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailIn VALUES( 10, 'Входящее 2', 'Сообщение входящее 2', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailIn VALUES( 11, 'Входящее 3', 'Сообщение входящее 3', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.mailIn VALUES( 12, 'Входящее 4', 'Сообщение входящее 4', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()

    deliteQuery = db.prepare('DELETE FROM main.del;'); // удалённые
    deliteQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.del VALUES( 13, 'Удалённое 1', 'Сообщение удалённое 1', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.del VALUES( 14, 'Удалённое 2', 'Сообщение удалённое 2', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.del VALUES( 15, 'Удалённое 3', 'Сообщение удалённое 3', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    insertQuery = db.prepare(`INSERT INTO main.del VALUES( 16, 'Удалённое 4', 'Сообщение удалённое 4', 'mail@mail', 'sender@mail', '/path');`);
    insertQuery.run()
    res.json({ message: true });
  }
  else {
    res.json({ message: false });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
