const { audit_attachments } = require('../models');
const base = require('./baseController');



exports.getAll = (req, res, next) => {
    base.getAll(audit_attachments, req, res, next);    
}

exports.get = (req, res, next) => {
    base.get(audit_attachments, req, res, next, 'attachment_id');
};

exports.getAttachments = (req, res, next) => {
    base.get(audit_attachments, req, res, next, 'audit_id');
};

exports.post = (req, res, next) => {
    req.body.attachment_src = `${String(req.file.destination).replace('uploads/', '')}/${req.file.filename}`;
    req.body.attachment_item_id = 0;
    base.insert(audit_attachments, req, res, next);
}

exports.delete = (req, res, next) => {
    base.delete(audit_attachments, req, res, next, 'attachment_id');
}

