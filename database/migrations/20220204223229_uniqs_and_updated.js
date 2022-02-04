const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(updatedAt) => "areas"
 * changeColumn(updatedAt) => "customers"
 * changeColumn(updatedAt) => "document_items"
 * changeColumn(updatedAt) => "document_scopes"
 * addIndex(uniq_customer) => "customers"
 *
 */

const info = {
  revision: 7,
  name: "uniqs_and_updated",
  created: "2022-02-04T22:32:29.899Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "areas",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "document_items",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "document_scopes",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "customers",
      ["customer_business_name", "customer_cnpj", "customer_group_id"],
      {
        indexName: "uniq_customer",
        name: "uniq_customer",
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
    params: ["customers", "uniq_customer", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "areas",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "customers",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "document_items",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "document_scopes",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: false },
      { transaction },
    ],
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
