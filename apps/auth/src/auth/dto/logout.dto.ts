import {  IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  token: string;

 

}