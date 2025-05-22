INSERT INTO cases (
        business_user_id,
        case_group_id,
        intake,
        modified_by_user_id
    )
VALUES (
        ${clientId},
        ${caseGroup},
        ${intake},
        ${userId}
    )
RETURNING id
