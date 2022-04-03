const { areas } = require('../models');
const base = require('./baseController');

exports.getAll = (req, res, next) => {
    //base.getAll(areas, req, res, next);
    const query = {};
    Object.keys(req.query).forEach(key => {
        if (req.query[key] !== "" && req.query[key] != 'null' && req.query[key] != null) {
            query[key] = req.query[key]
        }
    });

    let sql = `inner join (
        select uaa.area_id, cu.customer_unit_address, ctm.customer_id, cg.customer_group_id from units_areas_aspects uaa 
        inner join customers_units cu on uaa.customer_unit_id = cu.customer_unit_id 
        inner join customers ctm on cu.customer_id = ctm.customer_id 
        inner join customers_groups cg on ctm.customer_group_id = cg.customer_group_id
    ) as group_customer_unit on a.area_id = group_customer_unit.area_id `;


    for (let i = 0; i < Object.keys(query).length; i ++) {
        const key = Object.keys(query)[i];
        if (i == 0) sql += ` WHERE `;
        if (key.includes('id'))
            sql += `${key} = '${query[key]}'`;
        else
            sql += `${key} LIKE '%${query[key]}%'`;
        if (i < Object.keys(query).length - 1) sql += ` AND `;           
    }

    sql += ' order by a.area_name;'
    // console.log(sql);
    
    base.rawquery(sql, req, res, next);
}

exports.get = (req, res, next) => {
    base.get(areas, req, res, next, 'area_id');
};

exports.post = (req, res, next) => {
    base.insert(areas, req, res, next);
}

exports.put = (req, res, next) => {
    base.update(areas, req, res, next, 'area_id');
}

exports.delete = (req, res, next) => {
    base.delete(areas, req, res, next, 'area_id');
}
