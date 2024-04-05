-- name: GetEmployeeByPersonioID :one
SELECT *
FROM employees
WHERE personio_id = $1 LIMIT 1;

-- name: CreateEmployee :one
INSERT INTO employees (
    personio_id,
    first_name,
    last_name,
    email,
    picture_url,
    position,
    birthday,
    partner_id
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
)
RETURNING *;

-- name: GetEmployeeByUID :one
SELECT 
e.id as employee_id,
e.uid,
e.first_name,
e.last_name,
e.email,
e.picture_url,
e.position,
e.birthday,
p.id as p_id,
p.name as p_name,
p.logo_url as p_logo_url,
s.name as s_name,
s.slack_id as s_id
FROM employees e
JOIN partners p on e.partner_id = p.id  
LEFT JOIN slack_info s on e.id = s.employee_id
WHERE uid = $1 LIMIT 1;

-- name: GetTeamCaptainIDByEmail :one
SELECT 
e.id as employee_id
FROM employees e
JOIN partners p on e.partner_id = p.id  
WHERE e.email = $1
AND p.name = 'rindus'
LIMIT 1;

-- name: GetEmployeeLanguages :many
SELECT l.name
FROM employees e
JOIN employees_languages el ON e.id = el.employee_id
JOIN languages l ON el.language_id = l.id
WHERE e.id = $1; 

-- name: AssignEmployeeLanguages :exec
INSERT INTO employees_languages (
    employee_id, language_id
) VALUES (
    $1, $2
);

-- name: AssignTeamCaptain :exec
INSERT INTO team_captains (
    employee_id, partner_id
) VALUES (
    $1, $2
);