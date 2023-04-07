import { IsNotEmpty, IsInt, IsJSON } from '@nestjs/class-validator';

export class NumberUserDto {
  @IsNotEmpty()
  @IsInt()
  numberOfUsers: number;

  @IsNotEmpty()
  @IsJSON()
  numberOfUserPerGroup: any;

  constructor(numberOfUsers: number, numberOfUserPerGroup: any) {
    this.numberOfUsers = numberOfUsers;
    this.numberOfUserPerGroup = numberOfUserPerGroup;
  }
}
