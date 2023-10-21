const { createAccount, getAccounts, getAccountById } = require('../libs/accounts.libs');
const accountSchema = require('../validation/accounts.validator');

module.exports = {
  create: async (req, res, next) => {
    try {
      const { user_id, bank_name, bank_account_number, balance } = req.body;
      const { error } = await accountSchema.validate({
        user_id,
        bank_name,
        bank_account_number,
        balance,
      });

      if (error) {
        return res.status(400).json({ status: false, message: 'Bad Request!', err: error.message, data: null });
      }

      try {
        const account = await createAccount(user_id, bank_name, bank_account_number, Number(balance));

        return res.status(201).json({
          status: false,
          message: 'Created!',
          err: null,
          data: account,
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

  indexAccounts: async (req, res, next) => {
    try {
      const accounts = await getAccounts();

      return res.status(200).json({
        status: true,
        message: 'Success!',
        err: null,
        data: accounts,
      });
    } catch (err) {
      next(err);
    }
  },

  showAccount: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      try {
        const account = await getAccountById(Number(accountId));
        return res.status(200).json({
          status: true,
          message: 'Success!',
          err: null,
          data: account,
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
