CREATE TABLE IF NOT EXISTS languages (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT languages_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS offices (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT offices_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS partners (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	logo_url varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT partners_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS employees (
	id serial NOT NULL,
	"uid" uuid NOT NULL DEFAULT gen_random_uuid(),
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NULL,
	email varchar(255) NOT NULL,
	picture_url varchar(255) NULL,
	office_id int NOT NULL,
	partner_id int NOT NULL,
	position varchar(255) NOT NULL,
	birthday varchar(255) NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT employees_email_unique UNIQUE (email),
	CONSTRAINT employees_pkey PRIMARY KEY (id),
	CONSTRAINT employees_office_id_foreign FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE,
	CONSTRAINT employees_partner_id_foreign FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS slack_info (
	id serial NOT NULL,
	"name" varchar(255) NOT NULL,
	slack_id varchar(255) NOT NULL,
	employee_id int NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT slack_info_pkey PRIMARY KEY (id),
	CONSTRAINT employees_id_foreign FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employees_languages (
	id serial NOT NULL,
	employee_id int NOT NULL,
	language_id int NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT employees_languages_pkey PRIMARY KEY (id),
	CONSTRAINT employees_languages_language_id_foreign FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
	CONSTRAINT employees_languages_user_id_foreign FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS team_captains (
	id serial NOT NULL,
	employee_id int NOT NULL,
	partner_id int NOT NULL,
	created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT team_captains_pkey PRIMARY KEY (id),
	CONSTRAINT team_captains_partner_id_foreign FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
	CONSTRAINT team_captains_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);