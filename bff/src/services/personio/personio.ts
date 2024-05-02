import { authBackend } from '../auth/auth';
import { getPersonioData } from './scraping';

async function importPersonioData() {
  const personioData = await getPersonioData();

  console.log('Pedro ===> personioData', personioData);

  if (personioData.length === 0) {
    return;
  }

  const { access_token, token_type } = await authBackend();

  //Loop through the personioData array and send each employee to the backend
  for (const employee of personioData) {
    const response = await fetch(
      'http://localhost:8080/api/v1/employees/import/personio',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token_type} ${access_token}`,
        },
        body: JSON.stringify(employee),
      },
    );
  }
}

importPersonioData();
