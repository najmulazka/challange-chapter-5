const { registerUser, loginUser } = require('../libs/auth.libs');
const authSchema = require('../validation/auth.validator');

module.exports = {
  register: async (req, res, next) => {
    try {
      let { name, email, password, password_confirmation, identity_type, identity_number, address } = req.body;
      const { error } = await authSchema.validate({
        name,
        email,
        password,
        identity_type,
        identity_number,
        address,
      });

      if (error) {
        return res.status(400).json({ status: false, message: 'Bad Request!', err: error.message, data: null });
      }

      try {
        let user = await registerUser(name, email, password, password_confirmation, identity_type, identity_number, address);

        return res.status(201).json({
          status: false,
          message: 'Created!',
          err: null,
          data: user,
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: err,
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      try {
        let user = await loginUser(email, password);

        return res.status(200).json({
          status: true,
          message: 'Success!',
          err: null,
          data: user,
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: err,
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },

  whoami: (req, res, next) => {
    return res.status(200).json({
      status: true,
      message: 'Success!',
      err: null,
      data: { user: req.user },
    });
  },
};
