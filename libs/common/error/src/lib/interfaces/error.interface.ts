interface BaseErrorResponse {
  timestamp: string;
  errorCode: string; // Like USER_NOT_FOUND
  message: string;
}

export interface GrpcErrorResponse extends BaseErrorResponse {
  code: number; // numeric code from @grpc/grpc-js
  details: string;
}

export interface HttpErrorResponse extends BaseErrorResponse {
  statusCode: number; // like 404
  path: string;
  details?: Record<string, unknown>;
}


export type ApiErrorResponse = HttpErrorResponse | GrpcErrorResponse;