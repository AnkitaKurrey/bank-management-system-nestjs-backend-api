import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/guards/role.guard';
import { BankService } from './bank.service';
import { AmountDeposit } from './dtos/AmountDeposit';
import { AmountToTransfer } from './dtos/AmountToTransfer';
import { CreateAccount } from './dtos/CreateAccount';
import { CurrentBalance } from './dtos/CurrentBalance';
import { Login } from './dtos/login';
import { UpdateUser } from './dtos/UpdateUser';


@Controller('bank')
export class BankController {
    constructor(private bankService: BankService) { }

    @Post()
    @ApiHeader({ name: 'authorizaion' })
    async createAccount(@Body() CreateAccount: CreateAccount, @Req() req) {
        //reandom account number
        const accountNumber = Math.floor(Math.random() * (80000000 - 13000000)) + 13000000;

        return await this.bankService.createAccount(accountNumber, CreateAccount, req.user.email)
    }


    @Get()
    @ApiHeader({ name: 'authorizaion' })
    async getDetails(@Req() req) {
        return await this.bankService.getDetails(req.user.email);
    }


    @Post("deposit")
    @ApiHeader({ name: 'authorizaion' })
    async amountDeposit(
        @Req() req,
        @Body() AmountDeposit: AmountDeposit
    ) {
        return await this.bankService.amountDeposit(AmountDeposit, req.user.email);
    }


    @Post("withdraw")
    @ApiHeader({ name: 'authorizaion' })
    async amountWithdraw(
        @Req() req,
        @Body() AmountDeposit: AmountDeposit) {
        return await this.bankService.amountWithdraw(AmountDeposit, req.user.email)
    }


    @Post("transfer")
    @ApiHeader({ name: 'authorizaion' })
    async amountToTransfer(
        @Req() req,
        @Body() AmountToTransfer: AmountToTransfer
    ) {
        return await this.bankService.amountToTransfer(AmountToTransfer, req.user.email)
    }


    @Post("currentBalance")
    @ApiHeader({ name: 'authorizaion' })
    async showCurrentBalance(
        @Req() req,
        @Body() CurrentBalance: CurrentBalance) {
        return await this.bankService.showCurrentBalance(CurrentBalance)
    }


    @Patch("requestUpdate/:AccountNumber")
    @ApiHeader({ name: 'authorizaion' })
    async userUpdates(
        @Req() req,
        @Param("AccountNumber") AccountNumber: number,
        @Body() UpdateUser: UpdateUser
    ) {
        return await this.bankService.userUpdates(UpdateUser, req.user.email, AccountNumber)
    }


    @Get("showUpdates")
    @UseGuards(RoleGuard)
    @ApiHeader({ name: 'authorizaion' })
    async showUpdates(
        @Req() req
    ) {
        return await this.bankService.showUpdates(req.user.email);
    }

    @Patch("updatePending/:id")
    @UseGuards(RoleGuard)
    @ApiHeader({ name: 'authorizaion' })
    async updatePending(
        @Param("id") id: number) {
        return await this.bankService.updatePending(id);
    }

}

@Controller("user")
export class userController {
    constructor(private bankService: BankService) { }

    @Post()
    async login(
        @Body() login: Login
    ) {
        return await this.bankService.login(login)
    }
}