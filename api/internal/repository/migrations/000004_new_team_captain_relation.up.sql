ALTER TABLE team_captains RENAME CONSTRAINT team_captains_pkey TO deprecated_team_captains_pkey;

ALTER TABLE team_captains RENAME CONSTRAINT team_captains_employee_id_foreign TO deprecated_team_captains_employee_id_foreign;

ALTER TABLE team_captains
RENAME TO deprecated_team_captains;

CREATE TABLE team_captains (
  id serial NOT NULL,
  employee_id int NOT NULL,
  team_captain_id int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT team_captains_pkey PRIMARY KEY (id),
  CONSTRAINT team_captains_employee_id_team_captain_id_unique UNIQUE (employee_id, team_captain_id),
  CONSTRAINT team_captains_team_captain_id_foreign FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
  CONSTRAINT team_captains_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
);
