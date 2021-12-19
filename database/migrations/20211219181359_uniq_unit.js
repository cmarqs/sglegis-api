const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addIndex(uniq_user_email) => "users"
 *
 */

const info = {
  revision: 5,
  name: "uniq_unit",
  created: "2021-12-19T18:13:59.436Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addIndex",
    params: [
      "users",
      ["email"],
      {
        indexName: "uniq_user_email",
        name: "uniq_user_email",
        indicesType: "UNIQUE",
        type: "UNIQUE",
        transaction,
      },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeIndex",
    params: ["users", "uniq_user_email", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
