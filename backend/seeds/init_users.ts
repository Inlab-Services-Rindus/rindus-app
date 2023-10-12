import fs from 'fs';

import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  const employees = parseEmployeesFromJSON();

  // Inserts seed entries
  await knex('users').insert(employees);
}

interface EmployeeData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url: string;
}

interface Employee extends Omit<EmployeeData, 'id'> {
  personio_id: string;
}

function parseEmployeesFromJSON() {
  return mapEmployees(
    JSON.parse(fs.readFileSync(`./seeds/resources/all.json`).toString('utf-8')),
  );
}

function mapEmployees(employeeData: EmployeeData[]): Employee[] {
  return employeeData.map((element) => ({
    personio_id: element.id,
    first_name: element.first_name,
    last_name: element.last_name,
    email: element.email,
    profile_picture_url: element.profile_picture_url,
  }));
}
