import { logger } from '@/bootstrap/logger';
import { Config } from '@/config/config.type';
import { AuthService } from '@/services/auth/auth';
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

export interface SyncResult {
  importResult: ProcessResult[];
  updateResult: ProcessResult[];
}

export interface ProcessResult {
  personioId: number;
  statusCode: number;
}

export class PersonioSyncService {
  private readonly config: Config;
  private readonly authService: AuthService;

  constructor(config: Config, auth: AuthService) {
    this.config = config;
    this.authService = auth;
  }

  public importPersonioData(
    personioData: Employee[],
  ): Promise<ProcessResult[]> {
    return this.processPersonioData(
      personioData,
      'POST',
      '/api/v1/employees/import/personio',
    );
  }

  public updatePersonioData(
    personioData: Employee[],
  ): Promise<ProcessResult[]> {
    return this.processPersonioData(
      personioData,
      'PUT',
      '/api/v1/employees/update/personio',
    );
  }

  public async sync(personioData: Employee[]): Promise<SyncResult> {
    const importResult = await this.importPersonioData(personioData);
    const updateResult = await this.updatePersonioData(personioData);

    return {
      importResult,
      updateResult,
    };
  }

  public getPersonioData(): Promise<Employee[]> {
    return getPersonioData(this.config);
  }

  private async processPersonioData(
    personioData: Employee[],
    method: string,
    endpoint: string,
  ): Promise<ProcessResult[]> {
    if (personioData.length === 0) {
      return Promise.resolve([]);
    }

    const result: ProcessResult[] = [];

    const { access_token, token_type } = await this.authService.getToken();

    for (const employee of personioData) {
      logger.debug('Sending request for employee %d', employee.id);

      const response = await fetch(`${this.config.api.url}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token_type} ${access_token}`,
        },
        body: JSON.stringify(employee),
      });

      result.push({ personioId: employee.id, statusCode: response.status });

      logger.debug(
        'Received response for employee %d - %d',
        employee.id,
        response.status,
      );
    }

    return result;
  }
}
