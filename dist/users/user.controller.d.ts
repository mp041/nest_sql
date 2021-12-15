import { HttpStatus } from '@nestjs/common';
import { CustomerService } from './user.service';
import { Response } from 'express';
import { UserDto } from './dto/index';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    listCustomer(res: Response): Promise<void>;
    getCustomer(res: Response, id: string): Promise<void>;
    getCustomerbyID(res: Response, id: string): Promise<void>;
    createCustomer(res: Response, createCus: UserDto): Promise<void>;
    deleteCustomer(res: Response, id: string): Promise<void>;
    updateCustomer(id: string, updateCus: UserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
    getEmployeeOto(): Promise<import("./Database/entity/employee.enitity").Employee[]>;
    createEmployeeOto(post: any, req: any): Promise<import("./Database/entity/employee.enitity").Employee>;
    getEmployeeOtm(): Promise<import("./Database/entity/employee.enitity").Employee[]>;
    createEmployeeOtm(post: any, req: any): Promise<import("./Database/entity/employee.enitity").Employee>;
    getEmployeemtm(): Promise<import("./Database/entity/employee.enitity").Employee[]>;
    createEmployeemtm(post: any, req: any): Promise<import("./Database/entity/employee.enitity").Employee>;
}
