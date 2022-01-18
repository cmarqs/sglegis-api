const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addIndex(uniq_unit) => "customers_units"
 * addIndex(uniq_unit_area_aspect) => "units_areas_aspects"
 *
 */

const info = {
  revision: 4,
  name: "uniq_keys",
  created: "2021-12-19T11:36:52.725Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addIndex",
    params: [
      "customers_units",
      [
        "customer_id",
        "customer_unit_name",
        "customer_unit_city_id",
        "customer_unit_uf_id",
        "customer_unit_cep",
      ],
      {
        indexName: "uniq_unit",
        name: "uniq_unit",
        indicesType: "UNIQUE",
        type: "UNIQUE",
        transaction,
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "units_areas_aspects",
      ["area_id", "area_aspect_id", "customer_unit_id"],
      {
        indexName: "uniq_unit_area_aspect",
        name: "uniq_unit_area_aspect",
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
    params: ["customers_units", "uniq_unit", { transaction }],
  },
  {
    fn: "removeIndex",
    params: ["units_areas_aspects", "uniq_unit_area_aspect", { transaction }],
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
