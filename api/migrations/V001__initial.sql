-- public.businesses definition

CREATE TABLE public.businesses (
	id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	business_name text NOT NULL UNIQUE,
	display_name text NOT NULL UNIQUE,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table Triggers

create trigger businesses_last_modified_trigger
before update on public.businesses
for each row execute function set_last_modified();


-- public.users definition

CREATE TABLE public.users (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	email bytea NOT NULL,
	search_token text NOT NULL,
	phone bytea NULL,
	alt_phone bytea NULL,
	first_name text NULL,
	middle_name bytea NULL,
	last_name bytea NULL,
	dob bytea NULL,
	gender bytea NULL,
	ssn bytea NULL,
	alt_contact bytea NULL,
	alt_contact_phone bytea NULL,
	pw text NULL,
	dek bytea NOT NULL,
	iv bytea NOT NULL,
	registration_code text NULL,
	registration_code_expiration timestamptz NULL,
	email_verification_code text NULL,
	email_verification_code_expiration timestamptz NULL,
	last_login timestamptz NULL,
	locked_out boolean DEFAULT false NOT NULL,
	locked_out_until timestamptz NULL,
	settings jsonb NULL,
	is_deleted boolean DEFAULT false NOT NULL,
	dek_expiration timestamptz NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table Triggers

create trigger users_last_modified_trigger
before update on public.users
for each row execute function set_last_modified();


-- public.business_users definition

CREATE TABLE public.business_users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	business_id integer NOT NULL REFERENCES public.businesses(id) ON DELETE RESTRICT,
	user_id integer NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
	user_role text NOT NULL,
	rights text[] NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX business_users_business_id_idx ON public.business_users USING btree (business_id);
CREATE INDEX business_users_user_id_idx ON public.business_users USING btree (user_id);

-- Table Triggers

create trigger business_users_last_modified_trigger
before update on public.business_users
for each row execute function set_last_modified();


-- public.case_groups definition

CREATE TABLE public.case_groups (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	title text NOT NULL,
	business_id integer NOT NULL REFERENCES public.businesses(id) ON DELETE RESTRICT,
	description text NULL,
	group_rank integer NULL,
	parent_id integer NULL REFERENCES public.case_groups(id) ON DELETE CASCADE,
	automations jsonb NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT case_groups_unique UNIQUE (title, business_id, parent_id)
);
CREATE INDEX case_groups_business_id_idx ON public.case_groups USING btree (business_id);
CREATE INDEX case_groups_parent_id_idx ON public.case_groups USING btree (parent_id);

-- Table Triggers

create trigger case_groups_last_modified_trigger
before update on public.case_groups
for each row execute function set_last_modified();


-- public.cases definition

CREATE TABLE public.cases (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	business_user_id uuid NOT NULL REFERENCES public.business_users(id) ON DELETE RESTRICT,
	case_group_id integer NOT NULL REFERENCES public.case_groups(id) ON DELETE RESTRICT,
	intake jsonb NOT NULL,
	tags text[] NULL,
	code text GENERATED ALWAYS AS ('CASE-' || lpad(id::text, 4, '0'::text)) STORED NOT NULL UNIQUE,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  modified_by_user_id integer NULL REFERENCES public.users(id) ON DELETE SET NULL,
  sys_period tstzrange NOT NULL DEFAULT tstzrange(CURRENT_TIMESTAMP, null)
);

-- Table Triggers

create trigger cases_last_modified_trigger
before update on public.cases
for each row execute function set_last_modified();


-- public.case_history definition

CREATE TABLE case_history (LIKE public.cases);

-- Table Triggers

CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON public.cases
FOR EACH ROW EXECUTE PROCEDURE versioning(
  'sys_period', 'case_history', true
);


-- public.business_notes definition

CREATE TABLE public.business_notes (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	title text NOT NULL,
	description text NULL,
	business_id integer NOT NULL REFERENCES public.businesses(id) ON DELETE RESTRICT,
	created_at timestamptz NOT NULL,
	tags text[] NULL,
	show_in_calendar boolean DEFAULT false NOT NULL,
	start_date timestamptz NULL,
	end_date timestamptz NULL,
	user_id integer NULL REFERENCES public.users(id) ON DELETE CASCADE,
	duration interval GENERATED ALWAYS AS (
    CASE
        WHEN end_date IS NOT NULL AND start_date IS NOT NULL THEN end_date - start_date
        ELSE NULL::interval
    END
  ) STORED NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	alerts jsonb NULL,
	repeats interval NULL
);
CREATE INDEX business_notes_show_in_calendar_idx ON public.business_notes USING btree (show_in_calendar);
CREATE INDEX business_notes_user_id_idx ON public.business_notes USING btree (user_id);
CREATE INDEX notes_business_id_idx ON public.business_notes USING btree (business_id);

-- Table Triggers

create trigger business_notes_last_modified_trigger
before update on public.business_notes
for each row execute function set_last_modified();


-- public.case_comments definition

CREATE TABLE public.case_comments (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	value bytea NOT NULL,
	case_id integer NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
	user_id integer NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
	parent_id integer NULL REFERENCES public.case_comments(id) ON DELETE CASCADE,
	created_at timestamptz NOT NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX case_comments_case_id_idx ON public.case_comments USING btree (case_id);
CREATE INDEX case_comments_parent_id_idx ON public.case_comments USING btree (parent_id);
CREATE INDEX case_comments_user_id_idx ON public.case_comments USING btree (user_id);

-- Table Triggers

create trigger case_comments_last_modified_trigger
before update on public.case_comments
for each row execute function set_last_modified();


-- public.case_files definition

CREATE TABLE public.case_files (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	case_id integer NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
	file_name text NOT NULL,
	s3_path text NULL,
	parent_id integer NULL REFERENCES public.case_files(id) ON DELETE CASCADE,
	file_size text NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX case_files_case_id_idx ON public.case_files USING btree (case_id);
CREATE INDEX case_files_parent_id_idx ON public.case_files USING btree (parent_id);

-- Table Triggers

create trigger case_files_last_modified_trigger
before update on public.case_files
for each row execute function set_last_modified();


-- public.messages definition

CREATE TABLE public.messages (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	value bytea NOT NULL,
	sent_at timestamptz NOT NULL,
	sender_id integer NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
	read_messages jsonb NULL,
	recipient_id integer NULL REFERENCES public.users(id) ON DELETE RESTRICT,
	business_id integer NULL REFERENCES public.businesses(id) ON DELETE RESTRICT,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX messages_business_id_idx ON public.messages USING btree (business_id);
CREATE INDEX messages_read_messages_idx ON public.messages USING gin (read_messages jsonb_path_ops);
CREATE INDEX messages_recipient_id_idx ON public.messages USING btree (recipient_id);

-- Table Triggers

create trigger messages_last_modified_trigger
before update on public.messages
for each row execute function set_last_modified();


-- public.tasks definition

CREATE TABLE public.tasks (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	assigned_user_id integer NULL REFERENCES public.users(id) ON DELETE RESTRICT,
	title text NOT NULL,
	description text NULL,
	due_date timestamptz NULL,
	completed boolean DEFAULT false NOT NULL,
	tags text[] NULL,
	business_id integer NOT NULL REFERENCES public.businesses(id) ON DELETE RESTRICT,
	case_id integer NULL REFERENCES public.cases(id) ON DELETE SET NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX tasks_assigned_user_id_idx ON public.tasks USING btree (assigned_user_id);
CREATE INDEX tasks_business_id_idx ON public.tasks USING btree (business_id);
CREATE INDEX tasks_case_id_idx ON public.tasks USING btree (case_id);

-- Table Triggers

create trigger tasks_last_modified_trigger
before update on public.tasks
for each row execute function set_last_modified();


-- public.time_entries definition

CREATE TABLE public.time_entries (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	note text NULL,
	business_user_id uuid NOT NULL REFERENCES public.business_users(id) ON DELETE RESTRICT,
	start_date timestamptz NOT NULL,
	end_date timestamptz NOT NULL,
	duration interval GENERATED ALWAYS AS (end_date - start_date) STORED NOT NULL,
	task_id integer NULL REFERENCES public.tasks(id) ON DELETE SET NULL,
	case_id integer NULL REFERENCES public.cases(id) ON DELETE SET NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX time_entries_business_user_id_idx ON public.time_entries USING btree (business_user_id);
CREATE INDEX time_entries_case_id_idx ON public.time_entries USING btree (case_id);
CREATE INDEX time_entries_task_id_idx ON public.time_entries USING btree (task_id);

-- Table Triggers

create trigger time_entries_last_modified_trigger
before update on public.time_entries
for each row execute function set_last_modified();


-- public.appointments definition

CREATE TABLE public.appointments (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	scheduled_date timestamptz NOT NULL,
	business_user_id uuid NOT NULL REFERENCES public.business_users(id) ON DELETE RESTRICT,
	confirmed boolean DEFAULT false NOT NULL,
	description text NULL,
	last_modified timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX appointments_business_user_id_idx ON public.appointments USING btree (business_user_id);

-- Table Triggers

create trigger appointments_last_modified_trigger
before update on public.appointments
for each row execute function set_last_modified();
