import { calendar_v3, forms_v1, google } from 'googleapis';
import { config } from '@/config';
import { GoogleRepository as GoogleRepositoryInterface } from '@/models/service/google/google.repository';
import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { convertISOToDDMMYYYY } from '@/helpers/convertISOToDDMMYYYY';
import { UserRepository } from '@/repository/user.repository';
import {
  EmployeeEventAttendee,
  AttendeesEventResponse,
} from '@/models/api/google/Google';

export class GoogleRepository implements GoogleRepositoryInterface {
  private auth: GoogleAuth<JSONClient> | undefined;
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.auth = undefined;
    this.setAuth();

    this.userRepository = userRepository;
  }

  private async setAuth() {
    const SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive',
    ];

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(config.googleAuthCredentials),
      scopes: SCOPES,
    });

    this.auth = auth;
  }

  public async events(): Promise<calendar_v3.Schema$Events[]> {
    const response = await google.calendar('v3').events.list({
      auth: this.auth,
      calendarId: 'info@rindus.de',
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
      orderBy: 'startTime',
      singleEvents: true,
    });

    const events = response?.data?.items ?? [];

    const eventsWithoutWeekly = events.filter(
      (event) => !event?.summary?.includes('Weekly'),
    );

    return eventsWithoutWeekly;
  }

  public async event(eventId: string): Promise<calendar_v3.Schema$Event> {
    const response = await google.calendar('v3').events.get({
      auth: this.auth,
      calendarId: 'info@rindus.de',
      eventId: eventId,
    });

    const event = response?.data;

    return event;
  }

  public async attendees(
    userId: number,
    eventId: string,
  ): Promise<AttendeesEventResponse> {
    try {
      const event = await this.event(eventId);
      const startDate = event?.start?.dateTime;
      const name = event?.summary;

      if (!startDate || !name) {
        throw new Error('Start date of the event is missing.');
      }

      const formId = await this.getFormId(startDate, name);

      if (!formId) {
        throw new Error('Form ID not found.');
      }

      const responses = await this.getFormResponses(formId);
      const firstQuestionId = await this.getFirstQuestionId(formId);

      if (!firstQuestionId || !responses) {
        throw new Error('First question ID or responses not found.');
      }

      const surveyUrl = `https://docs.google.com/forms/d/${formId}/viewform`;

      const { employees, totalAttendees, totalNewRinders, isSurveyFilled } =
        await this.extractData(userId, responses, firstQuestionId);

      const attendeesSortedByFirstName = employees.sort((a, b) =>
        a.firstName.localeCompare(b.firstName, 'es', { sensitivity: 'base' }),
      );

      return {
        employees: attendeesSortedByFirstName,
        totalAttendees,
        totalNewRinders,
        isSurveyFilled,
        surveyUrl,
      };
    } catch (error) {
      throw `Error getting attendees: ${error}`;
    }
  }

  private async getFormId(startDate: string, name: string): Promise<string> {
    const firstPartOfName = name.split(' ')[0];

    const forms = await google.drive('v3').files.list({
      auth: this.auth,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      q: `name contains '${convertISOToDDMMYYYY(
        startDate,
      )}' and mimeType='application/vnd.google-apps.form' and trashed=false`,
    });

    console.log('Pedro ===> forms', forms);
    console.log('Pedro ===> firstPartOfName', firstPartOfName);

    //Cant put inside ihe call to google because not works always filtering by name and date
    const form = forms?.data?.files?.find(
      (form) => form.name?.includes(firstPartOfName),
    );

    console.log('Pedro ===> form', form);

    return form?.id ?? '';
  }

  private async getFormResponses(
    formId: string,
  ): Promise<forms_v1.Schema$FormResponse[]> {
    const formResponsesList = await google.forms('v1').forms.responses.list({
      auth: this.auth,
      formId: formId,
    });

    return formResponsesList?.data?.responses || [];
  }

  private async getFirstQuestionId(formId: string): Promise<string> {
    const formData = await google.forms('v1').forms.get({
      auth: this.auth,
      formId: formId,
    });

    return formData?.data?.items?.[0]?.questionItem?.question?.questionId ?? '';
  }

  private async extractData(
    userId: number,
    responses: forms_v1.Schema$FormResponse[],
    firstQuestionId: string | undefined,
  ): Promise<AttendeesEventResponse> {
    const usersPromises = [];
    const employees: EmployeeEventAttendee[] = [];
    let totalNewRinders = 0;

    for (const responseItem of responses) {
      const email = responseItem?.respondentEmail;

      if (email) {
        const answers = responseItem?.answers;

        if (answers && firstQuestionId) {
          const firstAnswer =
            answers[firstQuestionId]?.textAnswers?.answers?.[0]?.value;

          const isYesResponse = firstAnswer?.toLowerCase()?.includes('yes');

          const isUserAttendingEvent =
            isYesResponse ||
            firstAnswer?.toLowerCase()?.includes('participate');

          if (isUserAttendingEvent) {
            const user = await this.userRepository.findUserByEmail(email);

            if (user) {
              usersPromises.push(user);
            } else {
              totalNewRinders++;
            }
          }
        }
      }
    }

    const usersData = await Promise.allSettled(usersPromises);

    let isSurveyFilled = false;

    usersData.forEach((user) => {
      if (user.status === 'fulfilled') {
        const userValue = user.value;

        if (userValue) {
          employees.push({
            id: userValue.id.toString(),
            profilePictureUrl: userValue.pictureUrl,
            firstName: userValue.firstName,
          });

          if (userValue.id === userId) {
            isSurveyFilled = true;
          }
        }
      }
    });

    return {
      employees,
      totalAttendees: employees.length + totalNewRinders,
      totalNewRinders: totalNewRinders,
      isSurveyFilled: isSurveyFilled,
    };
  }
}
