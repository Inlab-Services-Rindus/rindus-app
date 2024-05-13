CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE VIEW employees_view AS
SELECT
  e.id,
  e."uid",
  e.personio_id,
  e.first_name,
  e.last_name,
  e.email,
  e.position,
  e.birthday,
  e.partner_id,
  e.created_at,
  e.updated_at,
  unaccent (LOWER(e.first_name)) AS ascii_first_name,
  unaccent (LOWER(e.last_name)) AS ascii_last_name,
  COALESCE(
    e.birthday = TO_CHAR (CURRENT_DATE, 'Mon DD'),
    false
  ) AS is_birthday,
  (
    SELECT
      id
    FROM
      team_captains
    WHERE
      employee_id = e.id
    LIMIT
      1
  ) IS NOT NULL AS is_team_captain,
  si.avatar_url AS picture_url
FROM
  employees e
  LEFT JOIN slack_info si ON si.employee_id = e.id;
