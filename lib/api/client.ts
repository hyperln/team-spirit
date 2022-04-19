export class ResponseError extends Error {
  response: Response;
  data?: any;

  constructor({
    message,
    response,
    data,
  }: {
    message: string;
    response: Response;
    data: any;
  }) {
    super(message);
    this.name = 'ResponseError';
    this.response = response;
    this.data = data;
  }
}

export async function fetchJson(
  input: RequestInfo,
  init?: RequestInit | undefined,
) {
  try {
    const response = await fetch(input, init);

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    const error = new ResponseError({
      message: response.statusText,
      response,
      data,
    });
    throw error;
  } catch (error: any) {
    if (!error.data) {
      error.data = { message: error.message };
    }
    throw error;
  }
}

export function api(path: string) {
  return {
    get: async () => {
      const response = await fetchJson(`/api/${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
    post: async (data: any) => {
      const response = await fetchJson(`/api/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },
  };
}
