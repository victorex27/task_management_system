import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthProto } from 'protos';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();

        const user = request.auth as AuthProto.Auth

        return user;
    }
);