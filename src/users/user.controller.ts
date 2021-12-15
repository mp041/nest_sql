import { Controller, Delete, Get, Param, Put, Res, UseGuards, Req, Post, Body, HttpStatus, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerService } from './user.service';
import { Request, Response } from 'express';
import { UserDto } from './dto/index';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';



@Controller('users')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listCustomer(@Res() res: Response) {
    const data = await this.customerService.listCustomer();
    res.status(200).send({
      statusCode: HttpStatus.OK,
      message: 'All Users',
      data
    });
  }


  @Get('/:customerid')
  async getCustomer(@Res() res: Response, @Param('customerid') id: string) {
    const data = await this.customerService.getCustomer(id);
    res.status(200).send(data);

  }

  @UseGuards(JwtAuthGuard)
  @Get('/get/:customerid')
  async getCustomerbyID(@Res() res: Response, @Param('customerid') id: string) {
    const data = await this.customerService.getCustomerbyID(id);
    console.log(data, "gettttgggggggggggggggggggggggg")
    res.status(200).send({
      statusCode: HttpStatus.OK,
      message: 'User Getting success',
      data
    });

  }

  @Post('/')
  @UsePipes(new ValidationPipe())
  async createCustomer(@Res() res: Response, @Body() createCus: UserDto) {
    console.log(createCus, "create cu")
    const data = await this.customerService.createCustomer(createCus);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User Created Success',
      data
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:customerid')
  async deleteCustomer(@Res() res: Response, @Param('customerid') id: string) {
    const data = await this.customerService.removeCustomer(id);
    res.status(200).json({
      statusCode: HttpStatus.OK,
      message: 'User Deleted Success',
      data
    });

  }

  @Put('/:customerid')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateCustomer(@Param('customerid') id: string, @Body() updateCus: UserDto) {
    const data = await this.customerService.updateCustomer(id, updateCus);
    return {
      statusCode: HttpStatus.OK,
      message: 'User Update Successfully',
      data
    }
  }

  @Get('/seed/get/oto')
  async getEmployeeOto() {
    console.log("seed?");
    return this.customerService.getEmployeeOto();

  }


  @Post('/seed/post/oto')
  async createEmployeeOto(@Body() post: any, @Req() req: any) {
    return this.customerService.createEmployeeOto(post, req.user)
  }

  @Get('/seed/get/otm')
  async getEmployeeOtm() {
    console.log("seed? OTM");
    return this.customerService.getEmployeeOtm();

  }


  @Post('/seed/post/otm')
  async createEmployeeOtm(@Body() post: any, @Req() req: any) {
    return this.customerService.createEmployeeOtm(post, req.user)
  }

  @Get('/seed/get/mtm')
  async getEmployeemtm() {
    console.log("seed? OTM");
    return this.customerService.getEmployeemtm();

  }



  @Post('/seed/post/mtm')
  async createEmployeemtm(@Body() post: any, @Req() req: any) {
    return this.customerService.createEmployeemtm(post, req.user)
  }
}
