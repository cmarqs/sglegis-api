const { isEmpty } = require('../utils/functions');
const base = require('./baseController');


exports.getAll = (req, res, next) => {
    getQuery(req, res, next);
}

const getQuery = (req, res, next) => {
    const query = {};
    Object.keys(req.query).forEach(key => {
        if (req.query[key] !== "" && req.query[key] != 'null' && req.query[key] != null ) {
            query[key] = req.query[key]
        }
    })

    let sql = `
    SELECT
        *
    FROM (
        SELECT
            d.document_id, d.document_type, d.document_number, d.document_date, d.document_state_id, d.document_city_id,
            ds.document_scope_description,
            di.document_item_id, di.document_item_number, di.document_item_status_id, di.document_item_description,
            iaa.item_area_aspect_id, iaa.area_id, a.area_name, iaa.area_aspect_id, aa.area_aspect_name, d.document_scope_id,
            unit_data.area_aspect_id AS aspect,
            unit_data.customer_unit_name, unit_data.customer_id, unit_data.customer_unit_id, unit_data.customer_group_id,
            dst.status_description,
            customer_business_name,
            a2.audit_id, a2.audit_item_id, COALESCE(a2.audit_conformity, 1) AS audit_conformity_id, COALESCE(a2.audit_practical_order, 1) AS audit_practical_order_id, a2.audit_control_action, a2.audit_evidnece_compliance, a2.updatedAt as audit_updated_at, a2.user_id as audit_user_id,
            unit_data.unit_aspect_responsible_name, unit_data.unit_aspect_responsible_email,
            coalesce(qtd_activities, 0) as qtd_activities
        FROM documents d
        INNER JOIN document_items di ON d.document_id = di.document_id
        INNER JOIN items_areas_aspects iaa ON di.document_item_id = iaa.document_item_id
        INNER JOIN areas a ON iaa.area_id = a.area_id
        INNER JOIN areas_aspects aa ON iaa.area_aspect_id = aa.area_aspect_id
        INNER JOIN document_scopes ds ON d.document_scope_id = ds.document_scope_id
        INNER JOIN document_status dst ON dst.status_id = di.document_item_status_id
    INNER JOIN (
            SELECT
                    cu.customer_id, cu.customer_unit_id, cu.customer_unit_uf_id, cu.customer_unit_city_id,
                    uaa.area_id, uaa.area_aspect_id, cu.customer_unit_name, cs.customer_business_name, cs.customer_group_id,
                    uar.unit_aspect_responsible_name, uar.unit_aspect_responsible_email
            FROM customers_units cu
            INNER JOIN units_areas_aspects uaa ON cu.customer_unit_id = uaa.customer_unit_id
            INNER JOIN customers cs ON cu.customer_id = cs.customer_id
            LEFT JOIN (
            	/* RESPONSIBLES PER UNIT AND ASPECTS */
				 select
				 	uar.customer_unit_id, 
				 	ra.area_aspect_id,
				 	GROUP_CONCAT(uar.unit_aspect_responsible_name SEPARATOR ';') AS unit_aspect_responsible_name,
				 	GROUP_CONCAT(uar.unit_aspect_responsible_email SEPARATOR ';') AS unit_aspect_responsible_email
				 from units_aspects_responsibles uar 
				 inner join responsibles_aspects ra on uar.unit_aspect_responsible_id = ra.unit_aspect_responsible_id
				 GROUP BY uar.customer_unit_id, ra.area_aspect_id 
            ) uar ON uar.customer_unit_id = cu.customer_unit_id and uar.area_aspect_id = uaa.area_aspect_id
        ) unit_data ON
        (d.document_scope_id = 4 /*MUNICIPAL*/ AND d.document_city_id = unit_data.customer_unit_city_id AND unit_data.area_aspect_id = iaa.area_aspect_id AND unit_data.area_id = iaa.area_id) OR
        (d.document_scope_id = 3 /*ESTADUAL*/ AND d.document_state_id = unit_data.customer_unit_uf_id AND unit_data.area_aspect_id = iaa.area_aspect_id AND unit_data.area_id = iaa.area_id) OR
        ((d.document_scope_id = 1 OR d.document_scope_id = 2)/*FEDERAL ou GLOBAL*/ AND iaa.area_aspect_id = unit_data.area_aspect_id AND unit_data.area_id = iaa.area_id)
        /* AUDITS */
        LEFT JOIN (
                    select
                            a.audit_id,a.item_area_aspect_id,
                            ai.audit_item_id,
                            ai.audit_conformity, ai.audit_practical_order, ai.audit_control_action, ai.audit_evidnece_compliance,
                            ai.updatedAt, ai.user_id, a.unit_id
                    from audits a
                    inner join (select max(ai2.audit_item_id) as audit_item_id, ai2.audits_audit_id from audit_items ai2 group by ai2.audits_audit_id) as ai2 on a.audit_id = ai2.audits_audit_id
                    inner join audit_items ai on ai2.audit_item_id = ai.audit_item_id
        ) as a2 on iaa.item_area_aspect_id = a2.item_area_aspect_id and unit_data.customer_unit_id = a2.unit_id
        /* ACTION PLAN */
        LEFT JOIN (
            select ap.item_area_aspect_id,
                   count(1) as qtd_activities
            from actionplans ap
                     inner join actionplan_items ai on ap.actionplan_id = ai.actionplan_id and ai.status = 0
            group by item_area_aspect_id
        ) as action_plan on iaa.item_area_aspect_id = action_plan.item_area_aspect_id
    ) AS req_data
    `;

    
    for (let i = 0; i < Object.keys(query).length; i ++) {
        const key = Object.keys(query)[i];
        if (i == 0) sql += ` WHERE `;
        if (key.includes('id'))
            sql += `${key} = '${query[key]}'`;
        else
            sql += `${key} LIKE '%${query[key]}%'`;
        if (i < Object.keys(query).length - 1) sql += ` AND `;           
    }
    // console.log(sql);
    
    base.rawquery(sql, req, res, next);
}
