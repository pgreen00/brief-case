WITH RECURSIVE descendants AS (
    SELECT id, title, description, parent_id
    FROM case_groups
    WHERE id = $1 AND business_id = $2
    UNION ALL
    SELECT cg.id, cg.title, cg.description, cg.parent_id
    FROM case_groups cg
        INNER JOIN descendants d ON cg.parent_id = d.id
)
SELECT c.id,
    c.business_user_id,
    c.case_group_id,
    c.tags,
    c.code,
    b.dek,
    u.first_name,
    u.last_name,
    u.middle_name,
    u.email,
    u.phone,
    d.title as case_group_title,
    d.description as case_group_description,
    d.parent_id as case_group_parent_id
FROM cases c
JOIN business_users bu ON c.business_user_id = bu.id
JOIN businesses b ON bu.business_id = b.id
JOIN users u ON bu.user_id = u.id
JOIN descendants d ON c.case_group_id = d.id
WHERE case_group_id IN (
        SELECT id
        FROM descendants
    );
