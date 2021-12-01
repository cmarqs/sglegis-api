const { areas_aspects, areas } = require('../models');
const options = require('./queryoptions');
const base = require('./baseController');
const db = require('../models/index');
const sequelize = require('sequelize');

exports.getAll = (req, res, next) => {
    // base.getAll(areas_aspects, req, res, next);    
    // areas_aspects.findAll({include: areas})
    let ret = [];
    let sql = `select ap.*, ar.area_name
                from areas_aspects ap
                join areas ar on (ap.area_id = ar.area_id)
               order by ap.area_aspect_name `;

    db.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then(values => {
        res.send(values);
    });
}

exports.getQuery = (req, res, next)=>{
    //base.query(areas_aspects, req, res, next);
    const query = {};
    Object.keys(req.query).forEach(key => {
        if (req.query[key] !== "" && req.query[key] != 'null' && req.query[key] != null) {
            query[key] = req.query[key]
        }
    });

    let sql = `select ap.*, ar.area_name
    from areas_aspects ap
    join areas ar on (ap.area_id = ar.area_id) `;


    for (let i = 0; i < Object.keys(query).length; i ++) {
        const key = Object.keys(query)[i];
        if (i == 0) sql += ` WHERE `;
        if (key.includes('id'))
            sql += `${key} = '${query[key]}'`;
        else
            sql += `${key} LIKE '%${query[key]}%'`;
        if (i < Object.keys(query).length - 1) sql += ` AND `;           
    }

    sql += ' order by ap.area_aspect_name;'
    console.log(sql);
    
    base.rawquery(sql, req, res, next);
}

function checkArea(el, area_id) {
    return el.area_id = area_id;
}

exports.get = (req, res, next) => {
    base.get(areas_aspects, req, res, next, 'area_aspect_id');
};

exports.post = (req, res, next) => {
    base.insert(areas_aspects, req, res, next);
}

exports.put = (req, res, next) => {
    base.update(areas_aspects, req, res, next, 'area_aspect_id');
}

exports.delete = (req, res, next) => {
    base.delete(areas_aspects, req, res, next, 'area_aspect_id');
}
