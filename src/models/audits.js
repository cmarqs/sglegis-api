/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('audits', {
    audit_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    unit_id: { type: DataTypes.INTEGER, allowNull: false, comment: 'The unit' },
    item_area_aspect_id: { type: DataTypes.INTEGER, allowNull: false, comment: 'The key matched document_id x area_id and aspect_id' },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: 'audits'
  });
};