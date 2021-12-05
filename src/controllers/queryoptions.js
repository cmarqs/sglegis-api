
exports.getOptions = (req, key, value) => {
    let r = new Object();

    if (req.query.limit == undefined || req.query.offset == undefined) {
        r.limit = undefined;
        r.offset = undefined
    } else {
        r.limit = parseInt(req.query.limit);
        r.offset = (parseInt(req.query.offset)-1) * parseInt(req.query.limit);
    }

    if (req.query.orderby == undefined) {
        r.order = undefined
    } else {
        if (req.query.direction == undefined){
            req.query.direction = "asc";
        }
        else {
            //array of orderby
            if (req.query.orderby.constructor == Array)
            {
                arrOrder = [];
                req.query.orderby.forEach(o => {
                    arrOrder.push([o, "asc"]); //TODO: add direction to each orderby
                });
                r.order = arrOrder;
            }
            else {
                r.order = [[req.query.orderby, req.query.direction]];
            }
        }
        
    }

    if (key != undefined && value != undefined) {
        let where = new Object();
        where[key] = value;
        r.where = where;
    }
        
    return r;
}

function orderby(req, where) {
    if (req.query.orderby == undefined || req.query.direction == undefined) {
        where.order = undefined
    } else {
        where.order = [[req.query.orderby, req.query.direction]];
    }
    return where;    
}

function pagination(req, where) {
    if (req.query.limit == undefined || req.query.offset == undefined) {
        where.limit = undefined;
        where.offset = undefined
    } else {
        where.limit = parseInt(req.query.limit);
        where.offset = (parseInt(req.query.offset)-1) * parseInt(req.query.limit);
    }
    return where;    
}

exports.query = (req) => {
    if (req.query.fields != undefined) {
        let q = new Object();
        if (Array.isArray(req.query.fields)) {
            for (let x = 0; x < req.query.fields.length; x++){
                switch (req.query.ops[x]) {
                    case 'eq':
                        if (req.query.types[x] == 'i') {
                            q[req.query.fields[x]] = req.query.values[x];                            
                        } else {
                            q[req.query.fields[x]] = req.query.values[x];
                        }                        
                        break;
                    case 'like':
                        break;                
                }               
            }
        } else {
            if (req.query.types == 'i') {
                q[req.query.fields] = parseInt(req.query.values);
            } else {
                q[req.query.fields] = req.query.values;
            }
        }
        let where = new Object();
        where.where = q;
        where = orderby(req, where);
        where = pagination(req, where);
        return where;
    }
}

function rawOrderBy (req) {
    if (req.query.orderby != undefined) {
        let q = ' ORDER BY '
        //array of orderby
        if (req.query.orderby.constructor == Array) {
            for (let i = 0; i < req.query.orderby.length; i++) {
                const element = req.query.orderby[i];
                if (i > 0)
                    q += ', ';
                q += `${element.orderby} ${element.direction}`;
            }
        }
        else {
            q += `${o.orderby} ${o.direction}`
        }
        return q;
    }
}

exports.rawfilter = (req) => {
    if (req.query.fields != undefined) {
        let q = ' WHERE 1 = 1';
        if (Array.isArray(req.query.fields)) {
            for (let x = 0; x < req.query.fields.length; x++){
                switch (req.query.fields[x].ops) {
                    case 'eq':
                        q += ` AND ${req.query.fields[x].fields} = '${req.query.fields[x].values}'`;
                        break;
                    case 'like':
                        break;                
                }               
            }
        }

        q += rawOrderBy(req);

        return q;
    }
}

exports.where = (key, value) => {
    let r = new Object();
    let where = new Object();
    where[key] = value;
    r.where = where;
    return r;
}

