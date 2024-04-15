CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE VIEW employees_view AS
SELECT
  e.*,
  unaccent (LOWER(e.first_name)) AS ascii_first_name,
  unaccent (LOWER(e.last_name)) AS ascii_last_name,
  e.birthday = TO_CHAR (CURRENT_DATE, 'Mon DD') AS is_birthday,
  (
    SELECT
      id
    FROM
      team_captains
    WHERE
      employee_id = e.id
    LIMIT
      1
  ) IS NOT NULL AS is_team_captain
FROM
  employees e;
