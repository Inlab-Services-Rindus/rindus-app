CREATE VIEW users AS
SELECT
  e.*,
  LOWER(e.first_name) AS ascii_first_name,
  LOWER(e.last_name) AS ascii_last_name,
  1 as office_id
FROM
  employees e;

CREATE VIEW users_languages AS
SELECT
  ul.*,
  ul.employee_id AS user_id
FROM
  employees_languages ul;

CREATE VIEW team_captains AS
SELECT
  tc.*,
  tc.employee_id AS user_id
FROM
  new_team_captains tc;

CREATE VIEW users_view AS
SELECT
  u.*,
  u.birthday = TO_CHAR (CURRENT_DATE, 'Mon DD') AS is_birthday,
  (
    SELECT
      id
    FROM
      team_captains
    WHERE
      user_id = u.id
    LIMIT
      1
  ) IS NOT NULL AS is_team_captain
FROM
  users u;
