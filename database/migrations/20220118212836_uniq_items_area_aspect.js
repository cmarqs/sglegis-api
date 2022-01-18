const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addIndex(uniq_aspect_by_itemdocument) => "items_areas_aspects"
 *
 */

const info = {
  revision: 6,
  name: "uniq_items_area_aspect",
  created: "2022-01-18T21:28:36.484Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addIndex",
    params: [
      "items_areas_aspects",
      ["area_id", "area_aspect_id", "document_item_id"],
      {
        indexName: "uniq_aspect_by_itemdocument",
        name: "uniq_aspect_by_itemdocument",
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
    params: [
      "items_areas_aspects",
      "uniq_aspect_by_itemdocument",
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
