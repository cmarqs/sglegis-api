const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeIndex(uniq_document) => "documents"
 * changeColumn(document_type) => "documents"
 * addIndex(uniq_document) => "documents"
 *
 */

const info = {
  revision: 11,
  name: "add_index_document",
  created: "2022-02-19T18:14:43.417Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeIndex",
    params: ["documents", "uniq_document", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "documents",
      "document_type",
      {
        type: Sequelize.STRING(256),
        field: "document_type",
        comment:
          "The type of document. Commonly is a law or standard rule (norm).",
        allowNull: true,
      },
      { transaction },
    ],
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

const rollbackCommands = (transaction) => [
  {
    fn: "removeIndex",
    params: ["documents", "uniq_document", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "documents",
      "document_type",
      {
        type: Sequelize.STRING(500),
        field: "document_type",
        comment:
          "The type of document. Commonly is a law or standard rule (norm).",
        allowNull: true,
      },
      { transaction },
    ],
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
        "document_status_id",
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
