import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  catchError,
  concatMap,
  EMPTY,
  expand,
  from,
  map,
  mergeMap,
  Observable,
  throwError,
} from 'rxjs';
import {
  ParsedProbationResponse,
  ProbationDataDto,
  ProbationResponseDto,
} from '../dto/probation-data.dto';
import * as Papa from 'papaparse';
import { EventName } from '@app/database/constants/campaign-report-event-name';
import { ConfigService } from '@app/config';
import { ProbationApiClientConfig } from '@app/config/config.types';
import { format } from 'date-fns';

@Injectable()
export class ProbationApiClient {
  private readonly logger = new Logger(ProbationApiClient.name);
  private readonly clientConfig: ProbationApiClientConfig;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.clientConfig = configService.probationApiConfig;
  }

  /**
   * Fetch data from Probation API with streaming
   * Fetches both install and purchase events for the given date range
   *
   * @param fromDate Start date
   * @param toDate End date
   * @returns Observable that streams data items one by one
   */
  streamData(fromDate: Date, toDate: Date): Observable<ProbationDataDto> {
    const formattedStartDate = format(fromDate, 'yyyy-MM-dd HH:mm:ss');
    const formattedEndDate = format(toDate, 'yyyy-MM-dd HH:mm:ss');
    return from([EventName.install, EventName.purchase]).pipe(
      concatMap((eventName) => {
        this.logger.log(`Fetching data for event: ${eventName}`);
        const initialUrl = this.buildApiUrl(
          formattedStartDate,
          formattedEndDate,
          eventName,
        );
        return this.streamUrl(initialUrl);
      }),
    );
  }

  /**
   * Stream data from a specific URL and all its next pages
   * @param url The URL to fetch
   * @returns Observable that emits each data record individually
   */
  private streamUrl(url: string): Observable<ProbationDataDto> {
    return this.fetchUrl(url).pipe(
      expand((response) => {
        if (response.nextPageUrl) {
          return this.fetchUrl(response.nextPageUrl);
        } else {
          return EMPTY;
        }
      }, 1),
      map((response) => (response ? response.records : [])),
      mergeMap((records) => from(records)),
    );
  }

  /**
   * Fetch data from a specific URL
   * @param url The URL to fetch
   * @returns Observable of parsed response
   */
  private fetchUrl(url: string): Observable<ParsedProbationResponse> {
    this.logger.log(`Fetching Probation data from: ${url}`);

    return this.httpService
      .get<ProbationResponseDto>(url, {
        headers: { 'x-api-key': this.clientConfig.apiKey },
      })
      .pipe(
        map((response) => this.parseResponse(response.data)),
        catchError((error: Error) => {
          this.logger.error(
            `Failed to fetch data from Probation API: ${error.message}`,
          );
          return throwError(
            () => new Error(`Probation API fetch failed: ${error.message}`),
          );
        }),
      );
  }

  /**
   * Parse the Probation API response
   * @param response The raw API response
   * @returns Parsed response with records and next page URL
   */
  private parseResponse(
    response: ProbationResponseDto,
  ): ParsedProbationResponse {
    try {
      const parseResult = Papa.parse<ProbationDataDto>(response.data.csv, {
        header: true,
        skipEmptyLines: true,
      });
      this.logger.debug(
        `Parsed ${parseResult.data.length} records from CSV response`,
      );
      return {
        records: parseResult.data,
        nextPageUrl: response.data.pagination
          ? response.data.pagination.next
          : null,
      };
    } catch (error) {
      this.logger.error(`Failed to parse Probation API response: ${error}`);
      throw new Error(`Failed to parse Probation API response: ${error}`);
    }
  }

  /**
   * Build the API URL with query parameters
   * @param fromDate Start date
   * @param toDate End date
   * @param eventName Event name (required)
   * @returns Formatted API URL
   */
  private buildApiUrl(
    fromDate: string,
    toDate: string,
    eventName: EventName,
  ): string {
    const url = new URL(`${this.clientConfig.baseUrl}`);

    url.searchParams.append('from_date', fromDate);
    url.searchParams.append('to_date', toDate);
    url.searchParams.append('event_name', eventName);
    url.searchParams.append('take', this.clientConfig.pageSize.toString());

    return url.toString();
  }
}
