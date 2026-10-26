export interface ApiError {
  message: string;
  status: number;
}

export const apiError = {
  badRequest: (message: string): ApiError => ({ message, status: 400 }),
  notFound: (message: string): ApiError => ({ message, status: 404 }),
  conflict: (message: string): ApiError => ({ message, status: 409 }),
  tooManyRequests: (message: string): ApiError => ({ message, status: 429 }),
  serverError: (message: string): ApiError => ({ message, status: 500 }),
  badGateway: (message: string): ApiError => ({ message, status: 502 }),
  gatewayTimeout: (message: string): ApiError => ({ message, status: 504 }),
};

// catch даёт unknown, поэтому перед чтением err.status нужна проверка формы
export const isApiError = (err: unknown): err is ApiError =>
  typeof err === "object" &&
  err !== null &&
  "status" in err &&
  typeof err.status === "number" &&
  "message" in err &&
  typeof err.message === "string";
