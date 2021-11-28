const { document_items } = require('../models');
const base = require('./baseController');
const db = require('../models/index');
const sequelize = require('sequelize');

exports.getAll = (req, res, next) => {
    base.getAll(document_items, req, res, next);    
}

exports.getAreasAspects = (req, res, next) => {
    let sql = `select ap.*, ar.area_name, iaa.item_area_aspect_id
                from areas_aspects ap
                join areas ar on (ap.area_id = ar.area_id)
                left join items_areas_aspects iaa on (iaa.area_id = ar.area_id and iaa.area_aspect_id = ap.area_aspect_id) and (iaa.document_item_id = ${req.params.id} or iaa.document_item_id is null)
               order by ar.area_id, ap.area_aspect_name`;

    db.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then(values => {
        let areas = [];
        let areas_id = [];
        for (let i = 0; i < values.length; i++) {
            if (!areas_id.includes(values[i].area_id)) {
                areas_id.push(values[i].area_id);
                areas.push({ "area_id": values[i].area_id, "area_name": values[i].area_name, "aspects": [] });
            }
        }

        for (let j = 0; j < areas.length; j++) {
            for (let k = 0; k < values.length; k++) {
                if (values[k].area_id == areas[j].area_id) {
                    areas[j].aspects.push(
                        {
                            "area_aspect_id": values[k].area_aspect_id,
                            "area_aspect_name": values[k].area_aspect_name,
                            "checked": (values[k].item_area_aspect_id) ? "S" : "N",
                            "previous": (values[k].item_area_aspect_id) ? "S" : "N",
                            "item_area_aspect_id": (values[k].item_area_aspect_id),
                        });
                }
            }
        }
        res.send(areas);
    });
}

exports.get = (req, res, next) => {
    base.get(document_items, req, res, next, 'document_item_id');
};

exports.getItems = (req, res, next) => {
    let sql = ` SELECT
                    document_item_id,
                    document_item_number,
                    document_item_order,
                    document_item_status_id,
                    document_item_description,
                    document_item_observation,
                    document_id,
                    d.document_scope_id,
                    createdAt,
                    updatedAt
                FROM document_items AS document_items
                INNER JOIN (select d.document_id as id_document, d.document_scope_id from documents d) d on document_items.document_id = d.id_document`
    req.query.fields = [{ fields: 'document_id', ops: 'eq', values: req.params.id }]
    req.query.orderby = [{ orderby: 'document_item_order', direction: 'asc' }, { orderby: 'document_item_number', direction: 'asc' }, { orderby: 'document_item_description', direction: 'asc' }];
    base.rawquery(sql, req, res, next);
};

exports.post = (req, res, next) => {
    base.insert(document_items, req, res, next);
}

exports.put = (req, res, next) => {
    base.update(document_items, req, res, next, 'document_item_id');
}

exports.delete = (req, res, next) => {
    base.delete(document_items, req, res, next, 'document_item_id');
}

