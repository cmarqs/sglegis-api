const { users } = require('../models');
const base = require('./baseController');
const email = require("../config/email");
const { generatePassword, getHash, verityPassword, loginJWT } = require('../utils/auth');
const { validateLogin, validateReset } = require('../validations/login');
const { isEmpty } = require('../utils/functions');
const { Keys } = require('../config/keys');
const { customers_groups } = require('../models');
const db = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        let sql = `SELECT *
            FROM users u
            LEFT JOIN customers c ON (c.customer_id = u.customer_id)
            LEFT JOIN customers_groups cg ON (cg.customer_group_id = c.customer_group_id)`
        const values = await db.sequelize.query(sql);
        return res.send(values[0]);
    } catch (error) {
        next(error);        
    }  
}

exports.getQuery = async (req, res, next)=>{
    base.query(users, req, res, next);
}

exports.get = (req, res, next) => {
    base.get(users, req, res, next, 'user_id');
};

exports.post = async (req, res, next) => {
    const str_pass = await generatePassword(10);
    const hash_pass = await getHash(str_pass);
    req.body.user_password = hash_pass;

    try {
        const { user_email } = req.body;
        await email.send(user_email, "SgLegis: Seu registro no Sglegis foi realizado com sucesso", "Por favor, memorize sua nova senha: " + str_pass);
        base.insert(users, req, res, next);
    } catch (error) {
        next(error);     
    }
}

exports.put = (req, res, next) => {
    base.update(users, req, res, next, 'user_id');
}

exports.delete = (req, res, next) => {
    base.delete(users, req, res, next, 'user_id');
}

exports.reset = async (req, res, next) => {
    const { errors, isValid } = validateReset(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { email } = req.body;
    const user = await users.findOne({
        where: { user_email: email }
    });
    if (isEmpty(user)) return res.status(400).json({
        email: "Usuário não encontrado"
    });
    if (user.is_disabled === '1') return res.status(400).json({
        email: "Conta desabilitada"
    });

    req.body = { user_email, user_id } = user;
    req.params.id = user.user_id;

    resetPassword(req).then(result => {
        return res.json({
            success: true
        });
    }, (err) => {
        return res.status(400).json({
            email: "Login não encontrado"
        });
    });
};

exports.resetPassword = async (req, res, next) => {
    const str_pass = await generatePassword(10);
    const hash_pass = await getHash(str_pass);
    req.body.user_password = hash_pass;    

    try {
        const { user_email } = req.body;

        const user = await users.findOne({ where: { user_email: user_email } });
        if (isEmpty(user)) return res.status(400).json({
            email: "Usuário não encontrado"
        });
        if (user.is_disabled === '1') return res.status(400).json({
            email: "Conta desabilitada"
        });
        
        //update the id 
        if (!req.params.id)
            req.params.id = user.dataValues.user_id;

        base.update(users, req, res, next, 'user_id');
        await email.send(user_email, "SgLegis: Sua senha foi alterada", "Por favor, memorize sua nova senha: " + str_pass);
        
    } catch (error) {
        next(error);    
    }
}

exports.login = async (req, res, next) => {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { email, password } = req.body;
    const user = await users.findOne({
        where: { user_email: email }
    });
    if (isEmpty(user)) return res.status(400).json({
        email: "Usuário não encontrado"
    });
    if (user.is_disabled === '1') return res.status(400).json({
        email: "Conta desabilitada"
    });

    if (await verityPassword(password, user.user_password)) {
        const jwtBearerToken = await loginJWT(user);
        if (jwtBearerToken) {
            return res.json({
                success: true,
                token: jwtBearerToken,
                user: {
                    id: user.user_id,
                    name: user.user_name,
                    role: user.user_role,
                    user_profile_type: user.user_profile_type,
                    email: user.user_email
                }
            });
        }
    } else {
        return res.status(400).json({
            password: "Senha incorreta"
        });
    }
}

exports.current = async (req, res, next) => {    
    try {
        let sql = `SELECT *
            FROM users u
            LEFT JOIN customers c ON c.customer_id = u.customer_id
            WHERE u.user_id = ${req.user.id}`
        const values = await db.sequelize.query(sql);
        const user = values[0][0];
        return res.json({
            id: user.user_id,
            email: user.user_email,
            name: user.user_name,
            role: user.user_role,
            user_profile_type: user.user_profile_type,
            customer_group_id: user.customer_group_id,
            customer_id: user.customer_id
        });
    } catch (error) {
        next(error);        
    }
}