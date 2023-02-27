import { ApiProperty } from "@nestjs/swagger";

export class CreateAccount{
    @ApiProperty({ example: 'Name' })
    accountHolderName:string;
    @ApiProperty({ example: '495677' })
    contactNumber:number;
    @ApiProperty({ example: 'saving' })
    accountType:string;
}