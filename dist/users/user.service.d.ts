import { Repository } from 'typeorm';
import { User } from './Database/entity/user.entity';
import { UserDto } from './dto/index';
import { Employee } from './Database/entity/employee.enitity';
import { Contact } from './Database/entity/contact.entity';
import { Meeting } from './Database/entity/meeting.entity';
import { Task } from './Database/entity/task.entity';
export declare class CustomerService {
    private userRepo;
    private empRepo;
    private contactRepo;
    private meetRepo;
    private taskRepo;
    constructor(userRepo: Repository<User>, empRepo: Repository<Employee>, contactRepo: Repository<Contact>, meetRepo: Repository<Meeting>, taskRepo: Repository<Task>);
    seed(): Promise<any>;
    createEmployeeOto(post: any, user: Employee): Promise<Employee>;
    getEmployeeOto(): Promise<Employee[]>;
    createEmployeeOtm(post: any, user: Employee): Promise<Employee>;
    getEmployeeOtm(): Promise<Employee[]>;
    createEmployeemtm(post: any, user: Employee): Promise<Employee>;
    getEmployeemtm(): Promise<Employee[]>;
    listCustomer(): Promise<User[]>;
    getCustomer(email: string): Promise<any>;
    getCustomerbyID(id: string): Promise<any>;
    createCustomer(data: UserDto): Promise<any>;
    updateCustomer(id: string, customerdto: UserDto): Promise<any>;
    removeCustomer(id: string): Promise<User>;
}
