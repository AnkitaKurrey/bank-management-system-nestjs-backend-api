import { ApiProperty } from "@nestjs/swagger";

export class AmountDeposit{
    @ApiProperty({ example: '495677' })
    amount:number;
    @ApiProperty({ example: '76878' })
    accountNumber:number;
}