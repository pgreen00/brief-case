INSERT INTO case_groups (
        title,
        business_id,
        description,
        group_rank,
        parent_id
    )
VALUES (
        $ { title },
        $ { businessId },
        $ { description },
        $ { groupRank },
        $ { parentId }
    )
RETURNING id;
