WITH RECURSIVE case_group_hierarchy AS (
  -- Base case: top-level groups (no parent)
  SELECT
    id,
    title,
    business_id,
    description,
    group_rank,
    parent_id,
    automations,
    last_modified,
    1 AS depth,
    ARRAY[id] AS path
  FROM public.case_groups
  WHERE parent_id IS NULL

  UNION ALL

  -- Recursive case: get children
  SELECT
    cg.id,
    cg.title,
    cg.business_id,
    cg.description,
    cg.group_rank,
    cg.parent_id,
    cg.automations,
    cg.last_modified,
    cgh.depth + 1 AS depth,
    cgh.path || cg.id AS path
  FROM public.case_groups cg
  INNER JOIN case_group_hierarchy cgh ON cg.parent_id = cgh.id
)

SELECT * FROM case_group_hierarchy
ORDER BY path;
