INSERT INTO users (
        email,
        search_token,
        dek,
        iv,
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
        ${encryptedEmail},
        ${searchToken},
        ${ciphertext},
        ${iv},
        ${encryptedPhone},
        ${encryptedAltPhone},
        ${encryptedAltContact},
        ${encryptedAltContactPhone},
        ${encryptedFirstName},
        ${encryptedLastName},
        ${encryptedMiddleName},
        ${encryptedDob},
        ${encryptedSsn},
        ${encryptedGender}
    )
RETURNING id
