"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./Database/entity/user.entity");
const bcrypt = require("bcrypt");
const employee_enitity_1 = require("./Database/entity/employee.enitity");
const contact_entity_1 = require("./Database/entity/contact.entity");
const meeting_entity_1 = require("./Database/entity/meeting.entity");
const task_entity_1 = require("./Database/entity/task.entity");
let CustomerService = class CustomerService {
    constructor(userRepo, empRepo, contactRepo, meetRepo, taskRepo) {
        this.userRepo = userRepo;
        this.empRepo = empRepo;
        this.contactRepo = contactRepo;
        this.meetRepo = meetRepo;
        this.taskRepo = taskRepo;
    }
    async seed() {
        console.log("seeeeeeeeeeeeeeeeeeeed");
        const ceo = this.empRepo.create({ name: 'Mr.CEO' });
        await this.empRepo.save(ceo);
        const ceoContact = this.contactRepo.create({
            email: 'email@email.com',
        });
        ceoContact.employee = ceo;
        await this.contactRepo.save(ceoContact);
        const manager = this.empRepo.create({
            name: 'Mihir',
            manager: ceo,
        });
        const task1 = this.taskRepo.create({ tname: 'Hire people' });
        await this.taskRepo.save(task1);
        const task2 = this.taskRepo.create({ tname: 'Present to Ceo' });
        await this.taskRepo.save(task2);
        manager.tasks = [task1, task2];
        const meeting1 = this.meetRepo.create({ zoomUrl: 'meeting.com' });
        meeting1.attendees = [ceo];
        await this.meetRepo.save(meeting1);
        manager.meetings = [meeting1];
        await this.empRepo.save(manager);
    }
    async createEmployeeOto(post, user) {
        const ceo = this.empRepo.create({ name: post.name });
        await this.empRepo.save(ceo);
        const ceoContact = this.contactRepo.create({
            email: post.email,
        });
        ceoContact.employee = ceo;
        await this.contactRepo.save(ceoContact);
        return this.empRepo.findOne({ where: { id: ceo.id }, relations: ['contactInfo'] });
    }
    async getEmployeeOto() {
        return this.empRepo.find({ relations: ['contactInfo'] });
    }
    async createEmployeeOtm(post, user) {
        const ceo = this.empRepo.create({ name: post.name });
        await this.empRepo.save(ceo);
        post.tname.forEach(async (element) => {
            const taskName = this.taskRepo.create({ employee: ceo, tname: element });
            await this.taskRepo.save(taskName);
        });
        return ceo;
    }
    async getEmployeeOtm() {
        return this.empRepo.find({ relations: ['tasks'] });
    }
    async createEmployeemtm(post, user) {
        const ceo = this.empRepo.create({ name: post.name });
        await this.empRepo.save(ceo);
        const ceoContact = this.contactRepo.create({
            email: post.email,
        });
        ceoContact.employee = ceo;
        await this.contactRepo.save(ceoContact);
        post.tname.forEach(async (element) => {
            const taskName = this.taskRepo.create({ employee: ceo, tname: element });
            await this.taskRepo.save(taskName);
        });
        post.zoomUrl.forEach(async (element) => {
            const meetName = this.meetRepo.create({ zoomUrl: element });
            meetName.attendees = [ceo];
            await this.meetRepo.save(meetName);
        });
        return ceo;
    }
    async getEmployeemtm() {
        return this.empRepo.find({ relations: ['contactInfo', 'tasks', 'meetings'] });
    }
    async listCustomer() {
        return await this.userRepo.find({});
    }
    async getCustomer(email) {
        console.log(email);
        const data = await this.userRepo.find({ email });
        if (!email) {
            throw new common_1.NotFoundException('user Not Found');
        }
        return data;
    }
    async getCustomerbyID(id) {
        const data = await this.userRepo.findOne(id);
        return await this.userRepo.find(data);
    }
    async createCustomer(data) {
        try {
            const email = data.email;
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(data.password, saltOrRounds);
            console.log(hash, "hasssssssssssssssssssssssssss");
            if (email) {
                const edata = await this.userRepo.find({ email });
                if (edata.length === 0) {
                    const person = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        email: data.email,
                        password: hash
                    };
                    const user = await this.userRepo.create(person);
                    await this.userRepo.save(user);
                    return user;
                }
                else {
                    console.log("founddddddd");
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.FORBIDDEN,
                        error: 'User is already Exist!!!!',
                    }, common_1.HttpStatus.FORBIDDEN);
                }
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async updateCustomer(id, customerdto) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(customerdto.password, saltOrRounds);
        const person = {
            firstName: customerdto.firstName,
            lastName: customerdto.lastName,
            phone: customerdto.phone,
            email: customerdto.email,
            password: hash
        };
        console.log(customerdto, "CustomerDto");
        const update = await this.userRepo.update(id, person);
        const data = await this.userRepo.findOne(id);
        console.log(update);
        return data;
    }
    async removeCustomer(id) {
        const data = await this.userRepo.findOne(id);
        if (!data) {
            throw new common_1.NotFoundException('user not found');
        }
        return await this.userRepo.remove(data);
    }
};
CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_enitity_1.Employee)),
    __param(2, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(3, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(4, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=user.service.js.map