import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/User.entity';
import { Repository } from 'typeorm';
import { CreateAccount } from './dtos/CreateAccount';
import { AmountDeposit } from "./dtos/AmountDeposit"
import { AmountToTransfer } from "./dtos/AmountToTransfer"
import { UpdateUser } from "./dtos/UpdateUser"
import { CurrentBalance } from "./dtos/CurrentBalance"
import { Temp } from 'src/temporary.entity';
import { Login } from './dtos/login';
import * as jwt from "jsonwebtoken"
import { BadRequestException } from '@nestjs/common/exceptions';
import * as dotenv from "dotenv"
@Injectable()
export class BankService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Temp) private readonly tempRepository: Repository<Temp>
    ) { }

    async createAccount(accountNumber: number, CreateAccount: CreateAccount, email: string) {

        if (!(CreateAccount.accountHolderName && CreateAccount.accountType && CreateAccount.contactNumber)) {
            throw new BadRequestException("All fields are required")
        }
        let property = ["accountHolderName", "contactNumber", "accountType"]
        for (const key in CreateAccount) {
            if (CreateAccount.hasOwnProperty(key)) {
                // console.log(`${key}`);
                if (!property.includes(`${key}`)) {
                    throw new BadRequestException("Only 3 fields required")
                }
            }
        }

        //limited account options 
        let accountTypesAllowed = ["saving", "loan", "fund deposit", "current", "salary"]
        if (!accountTypesAllowed.includes(CreateAccount.accountType)) {
            let message = {
                message: "Invalid request"
            }
            return message
        }

        let user = await this.userRepository.findOneBy({ email });
        if (!(user.accountNumber)) {
            await this.userRepository.update({ email: email }, { accountNumber: accountNumber, accountHolderName: CreateAccount.accountHolderName, contactNumber: CreateAccount.contactNumber, accountType: CreateAccount.accountType })
            let myuser = await this.userRepository.find({
                where: {
                    email: email,
                    accountNumber: accountNumber
                }
            })
            let mynewuser = {
                email: myuser[0].email,
                accountNumber: myuser[0].accountNumber,
                accountHolderName: myuser[0].accountHolderName,
                accountType: myuser[0].accountType,
                contactNumber: myuser[0].contactNumber,
                CurrentBalance: myuser[0].currentBalance
            }
            return mynewuser;
        }

        if (user && user.accountNumber) {
            let final;
            let newUser = this.userRepository.create({
                email: email, accountHolderName: CreateAccount.accountHolderName, accountType: CreateAccount.accountType
                , contactNumber: CreateAccount.contactNumber, accountNumber: accountNumber
            })
            await this.userRepository.save(newUser)

            let User = await this.userRepository.find({
                where: {
                    email: email,
                    accountNumber: newUser.accountNumber
                }
            });

            return final = {
                email: User[0].email,
                accountNumber: User[0].accountNumber,
                accountHolderName: User[0].accountHolderName,
                accountType: User[0].accountType,
                contactNumber: User[0].contactNumber,
                currentBalance: User[0].currentBalance

            }
        }

    }

    async getDetails(email: string) {

        let user = await this.userRepository.find({
            where: {
                email: email
            }
        })

        let usersData = user.map(function (e) {
            return {
                email: e.email,
                accountHolderName: e.accountHolderName,
                accountNumber: e.accountNumber,
                accountType: e.accountType,
                contactNumber: e.contactNumber,
                currentBalance: e.currentBalance,
            }
        })
        return { customers: usersData }
    }

    async amountDeposit(AmountDeposit: AmountDeposit, email: string) {
        // console.log(AmountDeposit);

        if (!(AmountDeposit.accountNumber && AmountDeposit.amount)) {
            throw new BadRequestException("All fields are required")
        }

        let property = ["amount", "accountNumber"]
        for (const key in AmountDeposit) {
            // console.log("for");

            if (AmountDeposit.hasOwnProperty(key)) {
                // console.log(`${key}`);
                if (!property.includes(`${key}`)) {
                    throw new BadRequestException("Only two fields required")
                }

            }
        }

        let user = await this.userRepository.find({
            where: {
                email: email,
                accountNumber: AmountDeposit.accountNumber
            }
        })

        if (!user[0]) {
            throw new NotFoundException("No account found with this account number")
        }

        if (!(AmountDeposit.amount >= 1)) {
            throw new BadRequestException("Amount should be greater or equal to ")

        }

        let balance = user[0].currentBalance + AmountDeposit.amount

        await this.userRepository.update({ email: email, accountNumber: AmountDeposit.accountNumber }, { currentBalance: balance })

        let newUser = await this.userRepository.find({
            where: {
                email: email,
                accountNumber: AmountDeposit.accountNumber
            }
        })
        return {
            email: newUser[0].email,
            accountHolderName: newUser[0].accountHolderName,
            accountNumber: newUser[0].accountNumber,
            accountType: newUser[0].accountType,
            contactNumber: newUser[0].contactNumber,
            currentBalance: newUser[0].currentBalance,
        }
    }

    async amountWithdraw(AmountDeposit: AmountDeposit, email: string) {

        if (!(AmountDeposit.accountNumber && AmountDeposit.amount)) {
            throw new BadRequestException("All fields are required")
        }

        let property = ["amount", "accountNumber"]
        for (const key in AmountDeposit) {
            if (AmountDeposit.hasOwnProperty(key)) {
                if (!property.includes(`${key}`)) {
                    throw new BadRequestException("Only two fields required")
                }
            }
        }

        let user = await this.userRepository.find({
            where: {
                email: email,
                accountNumber: AmountDeposit.accountNumber
            }
        })

        if (!(AmountDeposit.amount >= 1)) {
            throw new BadRequestException("Amount should be greater than zero")
        }


        if (!user[0]) {
            throw new NotFoundException("No account found with this account number")
        }
        if (user[0].currentBalance < AmountDeposit.amount) {
            throw new BadRequestException("Not enough balance in your account")
        }

        let balance = user[0].currentBalance - AmountDeposit.amount

        await this.userRepository.update({ email: email, accountNumber: AmountDeposit.accountNumber }, { currentBalance: balance })

        let newUser = await this.userRepository.find({
            where: {
                email: email,
                accountNumber: AmountDeposit.accountNumber
            }
        })
        return {
            email: newUser[0].email,
            accountHolderName: newUser[0].accountHolderName,
            accountNumber: newUser[0].accountNumber,
            accountType: newUser[0].accountType,
            contactNumber: newUser[0].contactNumber,
            currentBalance: newUser[0].currentBalance,
        }
    }

    async amountToTransfer(AmountToTransfer: AmountToTransfer, email: string) {

        if (!(AmountToTransfer.amount && AmountToTransfer.receiversAccountNumber && AmountToTransfer.sendersAccountNumber)) {
            throw new BadRequestException("All fields are required")
        }

        let property = ["receiversAccountNumber", "amount", "sendersAccountNumber"]

        for (const key in AmountToTransfer) {
            if (AmountToTransfer.hasOwnProperty(key)) {
                // console.log(`${key}`);
                if (!property.includes(`${key}`)) {
                    throw new BadRequestException("Only three fields required")
                }
            }
        }

        let sender = await this.userRepository.find({
            where: {
                email: email,
                accountNumber: AmountToTransfer.sendersAccountNumber

            }
        })
        // console.log(sender);


        if (!sender[0]) {
            throw new NotFoundException("No account found with this account number")
        }

        if (!(AmountToTransfer.amount >= 1)) {
            throw new BadRequestException("Amount should be greater than zero")

        }

        if (!(sender[0].currentBalance >= AmountToTransfer.amount)) {
            throw new BadRequestException("Not enough balance in your account")
        }

        //Updating receivers current balance
        let receiver = await this.userRepository.findOneBy(
            { accountNumber: AmountToTransfer.receiversAccountNumber }
        )

        // console.log(receiver);

        if (!receiver) {
            throw new NotFoundException("No account found")
        }

        let receiversBalance = receiver.currentBalance + AmountToTransfer.amount

        await this.userRepository.update({
            accountNumber: AmountToTransfer.receiversAccountNumber,
        }, { currentBalance: receiversBalance })


        let newReceiver = await this.userRepository.find({
            where: {
                accountNumber: AmountToTransfer.receiversAccountNumber,

            }
        })

        // console.log(newReceiver[0]);


        //Updating senders current balance
        // console.log(sender[0].currentBalance);


        let sendersBalance = sender[0].currentBalance - AmountToTransfer.amount

        await this.userRepository.update({
            email: email,
            accountNumber: AmountToTransfer.sendersAccountNumber
        }, { currentBalance: sendersBalance })

        let newSender = await this.userRepository.find({
            where: {
                email: email,

                accountNumber: AmountToTransfer.sendersAccountNumber
            }
        })

        return { message: "Amount Transferred successfully" }

    }


    async showCurrentBalance(CurrentBalance: CurrentBalance) {

        if (!CurrentBalance.accountNumber) {
            throw new BadRequestException("All fields are required")
        }

        let user = await this.userRepository.find({
            where: {
                accountNumber: CurrentBalance.accountNumber,
            }
        })

        if (!user[0]) {
            throw new NotFoundException("No account found")
        }
        let usersData = user.map(function (e) {
            return {
                currentBalance: e.currentBalance,
            }
        })
        return usersData[0]
    }

    async userUpdates(UpdateUser: UpdateUser, email: string, AccountNumber: number) {

        let property = ["accountHolderName", "contactNumber"]
        for (const key in UpdateUser) {
            if (UpdateUser.hasOwnProperty(key)) {
                // console.log(`${key}`);
                if (!property.includes(`${key}`)) {
                    throw new BadRequestException("Only two fields required")
                }
            }
        }

        let user = await this.userRepository.findOneBy({ accountNumber: AccountNumber });
        if (!user) {
            throw new NotFoundException("Invalid account number")
        }

        let update = this.tempRepository.create({
            email: email, accountHolderName: UpdateUser.accountHolderName, accountNumber: AccountNumber,
            contactNumber: UpdateUser.contactNumber
        })

        let newUser = await this.tempRepository.save(update)

        return { message: "Request to make changes sent!" }


    }


    async showUpdates(email: string) {
        let pending = await this.tempRepository.find({
            where: {
                status: "pending"
            }
        })

        return pending[0];

    }


    async updatePending(id: number) {
        let user = await this.tempRepository.findOneBy({ id: id })
        if (!user) {
            throw new NotFoundException("User Not found")
        }
        await this.userRepository.update({
            email: user.email,
            accountNumber: user.accountNumber
        }, { accountHolderName: user.accountHolderName, contactNumber: user.contactNumber })
        await this.tempRepository.update({ id: id }, { status: "approved" })

        return { message: "Changes done!" }
    }


    // async deleteUser (accountNumber:number){
    //     await this.userRepository.delete({accountNumber})
    // }

    async login(login: Login) {

        let user = await this.userRepository.find({
            where: {
                email: login.email,
                password: login.password
            }
        })

        if (!user[0]) {
            throw new NotFoundException("User not found")
        }
        const authToken = jwt.sign({ id: user[0].id, email: user[0].email, role: user[0].role },process.env.SECRET_KEY)
        return { accessToken: authToken }

    }
}

