import { logger } from '@/bootstrap/logger';
import { Config } from '@/config/config.type';
import { Auth } from '@/services/auth/auth';
import { getPersonioData } from '@/services/personio/scraping';

export interface Employee {
  id: number;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    office_id: string;
    department_id: string;
    position: string;
    preferred_name: string;
    gender: string;
    subcompany_id: string;
    team_id: string;
    status: string;
    __status: string;
    termination_date: string;
    dynamic_34779: string;
    dynamic_87778: string;
    dynamic_1298673: string;
    dynamic_1300584: string;
    profile_picture_url: string;
  };
}

export async function importPersonioData(config: Config, auth: Auth) {
  const personioData = await getPersonioData(config);

  if (personioData.length === 0) {
    return;
  }

  const { access_token, token_type } = auth;

  //Loop through the personioData array and send each employee to the backend
  for (const employee of personioData) {
    logger.debug('Sending import for employee %d', employee.id);
    const response = await fetch(
      `${config.api.url}/api/v1/employees/import/personio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token_type} ${access_token}`,
        },
        body: JSON.stringify(employee),
      },
    );
    logger.debug(
      'Received response for employee %d - %d',
      employee.id,
      response.status,
    );
  }
}
