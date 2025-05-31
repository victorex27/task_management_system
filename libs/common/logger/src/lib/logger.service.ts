import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { Logger, LoggerOptions, createLogger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;

   constructor(options: LoggerOptions) {
    // Create actual Winston logger instance
    this.logger = createLogger(options);
    
    // Initialize Nest-Winston integration
    WinstonModule.createLogger({
      instance: this.logger
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}