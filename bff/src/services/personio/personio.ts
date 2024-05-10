import { config } from '@/config';
import { authBackend } from '@/services/auth/auth';
import { getPersonioData } from '@/services/personio/scraping';

export async function importPersonioData() {
  const personioData = await getPersonioData(config);

  if (personioData.length === 0) {
    return;
  }

  const { access_token, token_type } = await authBackend();

  //Loop through the personioData array and send each employee to the backend
  for (const employee of personioData) {
    await fetch(`${config.api.url}/api/v1/employees/import/personio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token_type} ${access_token}`,
      },
      body: JSON.stringify(employee),
    });
  }
}
