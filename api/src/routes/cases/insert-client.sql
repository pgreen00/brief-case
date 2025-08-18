INSERT INTO users (
        email,
        search_token,
        phone,
        alt_phone,
        alt_contact,
        alt_contact_phone,
        first_name,
        last_name,
        middle_name,
        dob,
        ssn,
        gender
    )
VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12
    )
RETURNING id
