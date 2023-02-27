import { ApiProperty } from "@nestjs/swagger";

export class UpdateUser{


    @ApiProperty({ example: 'Name' })
    accountHolderName:string;

    @ApiProperty({ example: '76876' })
    contactNumber:number;
}
