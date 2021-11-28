const { document_attachments } = require('../models');
const base = require('./baseController');
const file = require('../middleware/file');
const db = require('../models/index');
const sequelize = require('sequelize');



exports.getAll = (req, res, next) => {
    base.getAll(document_attachments, req, res, next);    
}

exports.get = (req, res, next) => {
    //base.get(document_attachments, req, res, next, 'attachment_id');
    let sql = `select * from document_attachments where attachment_id = ${req.params.id}`;

    db.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then(attach => {

        res.download(attach[0].attachment_src, attach[0].attachment_description, (err) => {
            if (err){
                console.log(`Erro ocorrido: ${err}`);
            }
            else {
                next();
            }
        });
    });
}

exports.getAttachments = (req, res, next) => {
    base.get(document_attachments, req, res, next, 'document_id');
};

exports.post = (req, res, next) => {
    req.body.attachment_src = `${req.file.filename}`;
    req.body.attachment_item_id = 0;
    base.insert(document_attachments, req, res, next);
}

exports.delete = (req, res, next) => {
    base.delete(document_attachments, req, res, next, 'attachment_id');
}

