const { createTransaction, getTransactions, getTransactionById } = require('../libs/transactions.libs');
const transactionSchema = require('../validation/transactions.validator');

module.exports = {
  create: async (req, res, next) => {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;
      const { error } = await transactionSchema.validate({
        source_account_id,
        destination_account_id,
        amount,
      });

      if (error) {
        return res.status(400).json({ status: false, message: 'Bad Request!', err: error.message, data: null });
      }
      try {
        const transaction = await createTransaction(source_account_id, destination_account_id, amount);

        return res.status(201).json({
          status: false,
          message: 'Created!',
          err: null,
          data: transaction,
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

  indexTransactions: async (req, res, next) => {
    try {
      const transactions = await getTransactions();

      res.status(200).json({
        status: true,
        message: 'Success!',
        err: null,
        data: transactions,
      });
    } catch (err) {
      next(err);
    }
  },

  showTransaction: async (req, res, next) => {
    try {
      const { transactionId } = req.params;
      try {
        const transaction = await getTransactionById(Number(transactionId));
        return res.status(200).json({
          status: true,
          message: 'Success!',
          err: null,
          data: transaction,
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
