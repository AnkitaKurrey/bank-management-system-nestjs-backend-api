import { ApiProperty } from "@nestjs/swagger";

export class AmountToTransfer{
    @ApiProperty({ example: 'Name' })
    receiversAccountNumber:number;
    @ApiProperty({ example: '6787878' })
    amount:number;
    @ApiProperty({ example: '878798' })
    sendersAccountNumber:number
}