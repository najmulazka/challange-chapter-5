const { getUsers, getUserById } = require('../libs/users.libs');

module.exports = {
  indexUsers: async (req, res, next) => {
    try {
      const users = await getUsers();

      res.status(200).json({
        status: true,
        message: 'Success!',
        err: null,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },

  showUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      try {
        const user = await getUserById(Number(userId));
        return res.status(200).json({
          status: true,
          message: 'Success!',
          err: null,
          data: user,
        });
      } catch (err) {
        return res.status(400).json({
          status: true,
          message: 'Bad Request!',
          err: err,
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
