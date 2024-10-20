/* eslint-disable no-unused-vars */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
/* eslint-enable no-unused-vars */

export interface RequestMessage {
  method: string | undefined;
  url: string | null;
  headers: Record<string, string>;
}

export interface ResponseMessage {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
