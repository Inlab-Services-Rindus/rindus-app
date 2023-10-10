import { Knex } from 'knex';
import fs from 'fs';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  const employees = parseEmployeesFromJSONResponse();

  // Inserts seed entries
  await knex('users').insert(employees);
}

interface EmployeesData {
  items: PersonioEmployee[];
}

interface PersonioEmployee {
  id: number;
  data: Data;
}

interface Data {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url: string;
}

interface EmployeesResponse {
  data: EmployeesData;
}

interface Employee extends Data {
  personio_id: string;
}

function parseEmployeesFromJSONResponse() {
  return mapEmployeesResponse(
    JSON.parse(fs.readFileSync('./seeds/employees/all.json').toString('utf-8')),
  );
}

function mapEmployeesResponse(
  personioEmployees: EmployeesResponse,
): Employee[] {
  return personioEmployees.data.items.map((element) => ({
    personio_id: element.id.toFixed(),
    first_name: element.data.first_name,
    last_name: element.data.last_name,
    email: element.data.email,
    profile_picture_url: element.data.profile_picture_url,
  }));
}
