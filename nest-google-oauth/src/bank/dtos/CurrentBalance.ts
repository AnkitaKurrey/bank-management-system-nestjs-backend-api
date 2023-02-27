import { ApiProperty } from "@nestjs/swagger";

export class CurrentBalance{
    @ApiProperty({ example: '998908' })
    accountNumber:number;

}