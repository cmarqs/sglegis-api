const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeIndex(uniq_document) => "documents"
 * addIndex(uniq_document) => "documents"
 *
 */

const info = {
  revision: 12,
  name: "add_index_status_document",
  created: "2022-02-19T18:32:49.568Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeIndex",
    params: ["documents", "uniq_document", { transaction }],
  },
  {
    fn: "addIndex",
    params: [
      "documents",
      [
        "document_number",
        "document_type",
        "document_status_id",
        "document_scope_id",
        "document_date",
        "document_state_id",
        "document_city_id",
      ],
      {
        indexName: "uniq_document",
        name: "uniq_document",
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
    params: ["documents", "uniq_document", { transaction }],
  },
  {
    fn: "addIndex",
    params: [
      "documents",
      [
        "document_number",
        "document_type",
        "document_scope_id",
        "document_date",
        "document_state_id",
        "document_city_id",
      ],
      {
        indexName: "uniq_document",
        name: "uniq_document",
        indicesType: "UNIQUE",
        type: "UNIQUE",
        transaction,
      },
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
