export class MethodNotAllowed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MethodNotAllowed';
  }
}

export enum SupportedMethods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
