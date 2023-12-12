import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateUserDto {
    @IsNumber()
    managerId: number;
}
  