module.exports = function (sequelize, DataTypes) {
    return sequelize.define('items_areas_aspects', {
        item_area_aspect_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        area_id: { type: DataTypes.INTEGER, allowNull: false },
        area_aspect_id: { type: DataTypes.INTEGER, allowNull: false },
        document_item_id: { type: DataTypes.INTEGER, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: true },
        updatedAt: { type: DataTypes.DATE, allowNull: true },
    }, {
        indexes: [{
            unique: true,
            name: 'uniq_aspect_by_itemdocument',
            fields: ['area_id', 'area_aspect_id', 'document_item_id']
          }]
    },{
        tableName: 'items_areas_aspects'
    });
    
}