import { ApiProperty } from "@nestjs/swagger";

export class CreateNewAccount{
    @ApiProperty({ example: 'saving' })
    accountType:string;
}