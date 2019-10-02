var express = require('express');
var router = express.Router();

const { User } = require('../models');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await User.findAll();
  return res.json({ users });
});

router.post('/', (req, res, next) => {
  const { first_name, last_name, email, age, contact_number } = req.body;
  User.create({
    first_name,
    last_name,
    email,
    age,
    contact_number
  })
    .then((user) => {
      return res.json({ user });
    })
    .catch((e) => {
      console.log(e);
      return res.render('users/new');
    });
});

router.patch('/:id', async (req, res, next) => {
  let { id } = req.params;
  let user = await User.findOne({ where: { id } });
  if (user) {
    let { first_name, last_name, age, contact_number, email } = req.body;
    let userObj = {
      first_name,
      last_name,
      age,
      contact_number,
      email
    };

    Object.keys(userObj).forEach((key) => (userObj[key] == null) && delete userObj[key]);

    try {
      let result = await user.update(userObj);
      console.log(result);
      return res.json({ user });
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }

  } else {
    return res.status(400).json({ status: false });
  }
});

router.get('/:id', async (req, res, next) => {
  let user = await User.findOne({ where: { id: req.params.id } });
  if (user) {
    return res.json({ user });
  } else {
    return res.status(400).json({ status: false });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    let user = await User.findOne({ where: { id: req.params.id } });
    try {
      user.destroy()
      return res.status(200).json();
    } catch (err) {
      return res.status(500).json({ status: false, message: e.message });
    }
  } catch (err) {
    return res.status(400).json({ status: false });
  }
});

module.exports = router;
