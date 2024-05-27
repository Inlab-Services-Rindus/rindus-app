ALTER TABLE team_captains
DROP CONSTRAINT team_captains_pkey;

ALTER TABLE team_captains
DROP CONSTRAINT team_captains_employee_id_foreign;

ALTER TABLE deprecated_team_captains RENAME CONSTRAINT deprecated_team_captains_pkey TO team_captains_pkey;

ALTER TABLE deprecated_team_captains RENAME CONSTRAINT deprecated_team_captains_employee_id_foreign TO team_captains_employee_id_foreign;

DROP TABLE team_captains;

ALTER TABLE deprecated_team_captains
RENAME TO team_captains;
