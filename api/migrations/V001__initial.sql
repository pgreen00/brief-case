-- public.businesses definition

-- Drop table

-- DROP TABLE businesses;

CREATE TABLE businesses (
	id serial4 NOT NULL,
	business_name text NOT NULL,
	display_name text NOT NULL,
	guid uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT businesses_pk PRIMARY KEY (id),
	CONSTRAINT businesses_unique_display_name UNIQUE (display_name),
	CONSTRAINT businesses_unique_name UNIQUE (business_name)
);

-- Table Triggers

create trigger businesses_audit_trigger after
insert
    or
delete
    or
update
    on
    public.businesses for each row execute function dynamic_audit_function();


-- public.cases definition

-- Drop table

-- DROP TABLE cases;

CREATE TABLE cases (
	id serial4 NOT NULL,
	business_user_id int4 NOT NULL,
	case_group_id int4 NOT NULL,
	intake jsonb NOT NULL,
	tags _text NULL,
	code text GENERATED ALWAYS AS (lpad(id::text, 4, '0'::text)) STORED NOT NULL,
	CONSTRAINT cases_pk PRIMARY KEY (id)
);

-- Table Triggers

create trigger cases_audit_trigger after
insert
    or
delete
    or
update
    on
    public.cases for each row execute function dynamic_audit_function();


-- public.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	id serial4 NOT NULL,
	guid uuid DEFAULT gen_random_uuid() NOT NULL,
	email bytea NOT NULL,
	email_hint text NOT NULL,
	phone bytea NULL,
	alt_phone bytea NULL,
	first_name text NULL,
	middle_name bytea NULL,
	last_name bytea NULL,
	dob bytea NULL,
	is_business bool DEFAULT false NOT NULL,
	gender bytea NULL,
	ssn bytea NULL,
	alt_contact bytea NULL,
	alt_contact_phone bytea NULL,
	pw text NULL,
	dek bytea NOT NULL,
	iv bytea NOT NULL,
	registration_code text NULL,
	registration_code_expiration timestamptz NULL,
	last_login bytea NULL,
	locked_out bool DEFAULT false NOT NULL,
	locked_out_until timestamptz NULL,
	settings jsonb NULL,
	is_deleted bool DEFAULT false NOT NULL,
	dek_expiration timestamptz NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_unique_guid UNIQUE (guid)
);

-- Table Triggers

create trigger users_audit_trigger after
insert
    or
delete
    or
update
    on
    public.users for each row execute function dynamic_audit_function();


-- public.auth_tokens definition

-- Drop table

-- DROP TABLE auth_tokens;

CREATE TABLE auth_tokens (
	id serial4 NOT NULL,
	value bytea NOT NULL,
	salt bytea NOT NULL,
	user_id int4 NOT NULL,
	expiration timestamptz NOT NULL,
	CONSTRAINT auth_tokens_pk PRIMARY KEY (id),
	CONSTRAINT auth_tokens_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX auth_tokens_user_id_idx ON public.auth_tokens USING btree (user_id);

-- Table Triggers

create trigger auth_tokens_audit_trigger after
insert
    or
delete
    or
update
    on
    public.auth_tokens for each row execute function dynamic_audit_function();


-- public.business_notes definition

-- Drop table

-- DROP TABLE business_notes;

CREATE TABLE business_notes (
	id serial4 NOT NULL,
	title text NOT NULL,
	description text NULL,
	business_id int4 NOT NULL,
	created_at timestamptz NOT NULL,
	tags _text NULL,
	show_in_calendar bool DEFAULT false NOT NULL,
	start_date timestamptz NULL,
	end_date timestamptz NULL,
	user_id int4 NULL,
	duration interval GENERATED ALWAYS AS (
CASE
    WHEN end_date IS NOT NULL AND start_date IS NOT NULL THEN end_date - start_date
    ELSE NULL::interval
END) STORED NULL,
	CONSTRAINT notes_pk PRIMARY KEY (id),
	CONSTRAINT business_notes_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT notes_businesses_fk FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX business_notes_show_in_calendar_idx ON public.business_notes USING btree (show_in_calendar);
CREATE INDEX business_notes_user_id_idx ON public.business_notes USING btree (user_id);
CREATE INDEX notes_business_id_idx ON public.business_notes USING btree (business_id);

-- Table Triggers

create trigger business_notes_audit_trigger after
insert
    or
delete
    or
update
    on
    public.business_notes for each row execute function dynamic_audit_function();


-- public.business_users definition

-- Drop table

-- DROP TABLE business_users;

CREATE TABLE business_users (
	business_id int4 NOT NULL,
	user_id int4 NOT NULL,
	user_role text NOT NULL,
	rights _text NULL,
	id serial4 NOT NULL,
	CONSTRAINT business_users_pk PRIMARY KEY (id),
	CONSTRAINT business_users_businesses_fk FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT business_users_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX business_users_business_id_idx ON public.business_users USING btree (business_id);
CREATE INDEX business_users_user_id_idx ON public.business_users USING btree (user_id);

-- Table Triggers

create trigger business_users_audit_trigger after
insert
    or
delete
    or
update
    on
    public.business_users for each row execute function dynamic_audit_function();


-- public.case_comments definition

-- Drop table

-- DROP TABLE case_comments;

CREATE TABLE case_comments (
	id serial4 NOT NULL,
	value bytea NOT NULL,
	case_id int4 NOT NULL,
	user_id int4 NOT NULL,
	parent_id int4 NULL,
	created_at timestamptz NOT NULL,
	CONSTRAINT case_comments_pk PRIMARY KEY (id),
	CONSTRAINT case_comments_case_comments_fk FOREIGN KEY (parent_id) REFERENCES case_comments(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT case_comments_cases_fk FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT case_comments_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX case_comments_case_id_idx ON public.case_comments USING btree (case_id);
CREATE INDEX case_comments_parent_id_idx ON public.case_comments USING btree (parent_id);
CREATE INDEX case_comments_user_id_idx ON public.case_comments USING btree (user_id);

-- Table Triggers

create trigger case_comments_audit_trigger after
insert
    or
delete
    or
update
    on
    public.case_comments for each row execute function dynamic_audit_function();


-- public.case_files definition

-- Drop table

-- DROP TABLE case_files;

CREATE TABLE case_files (
	id serial4 NOT NULL,
	case_id int4 NOT NULL,
	date_modified timestamptz NOT NULL,
	file_name text NOT NULL,
	s3_path text NULL,
	parent_id int4 NULL,
	file_size text NULL,
	CONSTRAINT case_files_pk PRIMARY KEY (id),
	CONSTRAINT case_files_case_files_fk FOREIGN KEY (parent_id) REFERENCES case_files(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT case_files_cases_fk FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX case_files_case_id_idx ON public.case_files USING btree (case_id);
CREATE INDEX case_files_parent_id_idx ON public.case_files USING btree (parent_id);

-- Table Triggers

create trigger case_files_audit_trigger after
insert
    or
delete
    or
update
    on
    public.case_files for each row execute function dynamic_audit_function();


-- public.case_groups definition

-- Drop table

-- DROP TABLE case_groups;

CREATE TABLE case_groups (
	id serial4 NOT NULL,
	title text NOT NULL,
	business_id int4 NOT NULL,
	description text NULL,
	group_rank int4 NULL,
	parent_id int4 NULL,
	automations jsonb NULL,
	CONSTRAINT case_groups_pk PRIMARY KEY (id),
	CONSTRAINT case_groups_unique UNIQUE (title, business_id, parent_id),
	CONSTRAINT case_groups_businesses_fk FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT case_groups_case_groups_fk FOREIGN KEY (parent_id) REFERENCES case_groups(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX case_groups_business_id_idx ON public.case_groups USING btree (business_id);
CREATE INDEX case_groups_parent_id_idx ON public.case_groups USING btree (parent_id);

-- Table Triggers

create trigger case_goups_audit_trigger after
insert
    or
delete
    or
update
    on
    public.case_groups for each row execute function dynamic_audit_function();


-- public.logs definition

-- Drop table

-- DROP TABLE logs;

CREATE TABLE logs (
	id serial4 NOT NULL,
	entity_type text NOT NULL,
	entity_id int4 NULL,
	user_id int4 NULL,
	occurred_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	entity_action text NOT NULL,
	description jsonb NULL,
	updated_columns _text NULL,
	old_row jsonb NULL,
	new_row jsonb NULL,
	CONSTRAINT logs_pk PRIMARY KEY (id),
	CONSTRAINT logs_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE SET NULL
);
CREATE INDEX logs_entity_type_idx ON public.logs USING btree (entity_type);
CREATE INDEX logs_user_id_idx ON public.logs USING btree (user_id);


-- public.messages definition

-- Drop table

-- DROP TABLE messages;

CREATE TABLE messages (
	id serial4 NOT NULL,
	value bytea NOT NULL,
	sent_at timestamptz NOT NULL,
	sender_id int4 NOT NULL,
	read_messages jsonb NULL,
	recipient_id int4 NULL,
	business_id int4 NULL,
	CONSTRAINT messages_pk PRIMARY KEY (id),
	CONSTRAINT messages_businesses_fk FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT messages_users_recipient_fk FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT messages_users_sender_fk FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX messages_business_id_idx ON public.messages USING btree (business_id);
CREATE INDEX messages_read_messages_idx ON public.messages USING gin (read_messages jsonb_path_ops);
CREATE INDEX messages_recipient_id_idx ON public.messages USING btree (recipient_id);

-- Table Triggers

create trigger messages_audit_trigger after
insert
    or
delete
    or
update
    on
    public.messages for each row execute function dynamic_audit_function();


-- public.tasks definition

-- Drop table

-- DROP TABLE tasks;

CREATE TABLE tasks (
	id serial4 NOT NULL,
	assigned_user_id int4 NULL,
	title text NOT NULL,
	description text NULL,
	due_date timestamptz NULL,
	completed bool DEFAULT false NOT NULL,
	tags _text NULL,
	business_id int4 NOT NULL,
	case_id int4 NULL,
	CONSTRAINT tasks_pk PRIMARY KEY (id),
	CONSTRAINT tasks_businesses_fk FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT tasks_cases_fk FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT tasks_users_fk FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX tasks_assigned_user_id_idx ON public.tasks USING btree (assigned_user_id);
CREATE INDEX tasks_business_id_idx ON public.tasks USING btree (business_id);
CREATE INDEX tasks_case_id_idx ON public.tasks USING btree (case_id);

-- Table Triggers

create trigger tasks_audit_trigger after
insert
    or
delete
    or
update
    on
    public.tasks for each row execute function dynamic_audit_function();


-- public.time_entries definition

-- Drop table

-- DROP TABLE time_entries;

CREATE TABLE time_entries (
	id serial4 NOT NULL,
	note text NULL,
	business_user_id int4 NOT NULL,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	duration interval GENERATED ALWAYS AS (end_date - start_date) STORED NOT NULL,
	task_id int4 NULL,
	case_id int4 NULL,
	CONSTRAINT time_entries_pk PRIMARY KEY (id),
	CONSTRAINT time_entries_business_users_fk FOREIGN KEY (business_user_id) REFERENCES business_users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT time_entries_cases_fk FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT time_entries_tasks_fk FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX time_entries_business_user_id_idx ON public.time_entries USING btree (business_user_id);
CREATE INDEX time_entries_case_id_idx ON public.time_entries USING btree (case_id);
CREATE INDEX time_entries_task_id_idx ON public.time_entries USING btree (task_id);

-- Table Triggers

create trigger time_entries_audit_trigger after
insert
    or
delete
    or
update
    on
    public.time_entries for each row execute function dynamic_audit_function();


-- public.appointments definition

-- Drop table

-- DROP TABLE appointments;

CREATE TABLE appointments (
	id serial4 NOT NULL,
	scheduled_date timestamptz NOT NULL,
	business_user_id int4 NOT NULL,
	confirmed bool DEFAULT false NOT NULL,
	description text NULL,
	CONSTRAINT appointments_pk PRIMARY KEY (id),
	CONSTRAINT appointments_business_users_fk FOREIGN KEY (business_user_id) REFERENCES business_users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX appointments_business_user_id_idx ON public.appointments USING btree (business_user_id);

-- Table Triggers

create trigger appointments_audit_trigger after
insert
    or
delete
    or
update
    on
    public.appointments for each row execute function dynamic_audit_function();



-- DROP FUNCTION public.dynamic_audit_function();

CREATE OR REPLACE FUNCTION public.dynamic_audit_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_user TEXT;
    v_row_id INTEGER;
    v_changed_columns TEXT[];
    column_name TEXT;
BEGIN
    -- Fetch the current user
    v_user := current_setting('brief_case_api.current_user', true);

    -- Initialize an empty array for changed columns
    v_changed_columns := ARRAY[]::TEXT[];

    v_row_id := COALESCE(NEW.id, OLD.id);  -- Get the row ID based on operation

    -- Loop through all columns of the affected table
    FOR column_name IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = TG_TABLE_NAME
    LOOP
        IF TG_OP = 'UPDATE' AND NEW.* IS DISTINCT FROM OLD.* THEN
            v_changed_columns := array_append(v_changed_columns, column_name);
        END IF;
    END LOOP;

    -- Insert into the audit log
    INSERT INTO logs (entity_type, entity_id, entity_action, user_id, old_row, new_row, updated_columns)
    VALUES (TG_TABLE_NAME, v_row_id, TG_OP, v_user, row_to_json(OLD), row_to_json(NEW), v_changed_columns);

    RETURN NEW;
END;
$function$
;
