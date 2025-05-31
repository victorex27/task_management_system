import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

export class CustomGrpcException extends RpcException {
  constructor(
    public override readonly message: string,
  
    public readonly context?: Record<string, unknown>,
    public readonly grpcStatusCode: GrpcStatus = GrpcStatus.INTERNAL
  ) {
    super({
      code: grpcStatusCode,
      message: JSON.stringify({
        message,
        context,
      }),
    });
  }

  override getError() {
    return {
      code: this.grpcStatusCode,
      details: JSON.stringify({
        message: this.message,
        context: this.context,
      }),
    };
  }
}