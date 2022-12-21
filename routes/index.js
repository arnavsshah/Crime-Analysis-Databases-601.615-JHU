const express = require("express");
const router = express.Router();

router.get('/', async(req, res) => {
  res.render('index', { title: 'Crime Analysis' });
})

router.use("/crime", require("./crime"));

module.exports = router;
