const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeIndex(uniq_document) => "documents"
 * changeColumn(updatedAt) => "audit_attachments"
 * changeColumn(updatedAt) => "document_attachments"
 * addIndex(uniq_document) => "documents"
 *
 */

const info = {
  revision: 8,
  name: "uniqs_for_attachments",
  created: "2022-02-15T22:03:31.847Z",
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
      "audit_attachments",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "document_attachments",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: true },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "documents",
      [
        "document_number",
        "document_scope_id",
        "document_date",
        "document_state_id",
        "document_city_id",
        "document_status_id"
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
      "audit_attachments",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "document_attachments",
      "updatedAt",
      { type: Sequelize.DATE, field: "updatedAt", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "documents",
      [
        "document_number",
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
