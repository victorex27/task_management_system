// import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// import { UserProto } from 'protos';

// export const GetUser = createParamDecorator(
//     (data: unknown, ctx: ExecutionContext)=>{
//         const request = ctx.switchToHttp().getRequest();

//         const user = request.user as UserProto.User

//         return user;
//     }
// );