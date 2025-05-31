/* eslint-disable @typescript-eslint/no-explicit-any */
export class CustomError extends Error {
  public readonly code: number;
  public readonly details?: Record<string, any>;
  
  constructor(
    message: string,
    code: number,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    

   
    // Include details in stack trace for visibility
    this.stack += `Details: ${JSON.stringify(details, null, 2)}\n${this.stack}`;
  }
}