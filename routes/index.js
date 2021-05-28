var express = require('express');
var router = express.Router();
const db = require('./db');                 //db connection module

exports.sample = async function () {
  let sqlStr = await sql.sample();
  return new Promise((resolve, reject) => {
    db.query(sqlStr, (error, rows) => {
      if (error) reject(0);
      else resolve(rows);
    });
  });
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getList', async (req, res, next) => {
  try {
    let sql = 'SELECT * FROM TB_TODO'
    const result = await new Promise(async(resolve, reject) => {
        db.query(sql, (error, rows) => {
        if (error) reject(error);
        else resolve(rows);
      });
    });
    console.log(result)
    res.send(result)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})

router.get('/postList', async (req, res, next) => {
  try {
    let {id, todo} = req.query
    let sql = `
    INSERT INTO TB_TODO (id, todo) VALUES ('${id}', '${todo}');
    `
    await new Promise(async(resolve, reject) => {
        db.query(sql, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    res.send(200)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})



router.get('/deleteList', async (req, res, next) => {
  try {
    let {id} = req.query
    let sql = `
      DELETE FROM TB_TODO WHERE id = '${id}';
    `
    await new Promise(async(resolve, reject) => {
        db.query(sql, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    res.send(200)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})


module.exports = router;
