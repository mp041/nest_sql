import { Injectable, InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
// import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { User } from './Database/entity/user.entity';
import { UserDto } from './dto/index';
// import { Customer } from './interface/user';
// import { uuid } from 'uuidv4';
import * as bcrypt from 'bcrypt';
import { Employee } from './Database/entity/employee.enitity';
import { Contact } from './Database/entity/contact.entity';
import { Meeting } from './Database/entity/meeting.entity';
import { Task } from './Database/entity/task.entity';



@Injectable()
export class CustomerService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
    @InjectRepository(Meeting) private meetRepo: Repository<Meeting>,
    @InjectRepository(Task) private taskRepo: Repository<Task>) { }

  async seed(): Promise<any> {
    console.log("seeeeeeeeeeeeeeeeeeeed")

    //EMPLOYEE - 1
    const ceo = this.empRepo.create({ name: 'Mr.CEO' })
    await this.empRepo.save(ceo);

    const ceoContact = this.contactRepo.create({
      email: 'email@email.com',
    })
    ceoContact.employee = ceo;
    await this.contactRepo.save(ceoContact);


    //EMPLOYEE - 2
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



  //O T O
  async createEmployeeOto(post: any, user: Employee) {
    const ceo = this.empRepo.create({ name: post.name })
    await this.empRepo.save(ceo);

    const ceoContact = this.contactRepo.create({
      email: post.email,
    })
    ceoContact.employee = ceo;
    await this.contactRepo.save(ceoContact);


    return this.empRepo.findOne({where : { id : ceo.id},relations: ['contactInfo'] })




    // let employee = new Employee();
    // employee.name = "narutoo";
    // await this.empRepo.save(employee);
    //
    // let contact = new Contact();
    // contact.email = "demo@email.com";
    // contact.phone = "1234567";
    // await this.contactRepo.save(contact);
    // const newPost = this.contactRepo.create({
    //   employee : user,
    //   ...post
    // const user2 = await this.empRepo.findOne( id:email ,options : {where: { email : "demo@email.com"}})
    // });
    // await this.contactRepo.save(newPost);
    // return newPost;
  }

  async getEmployeeOto() {
    return this.empRepo.find({ relations: ['contactInfo'] });
  }











  //O T M

  async createEmployeeOtm(post: any, user: Employee) {

    // console.log(post.tname[0]);


    //
    //
    // console.log(ceo.id,"ceo");
    const ceo = this.empRepo.create({ name: post.name })
    await this.empRepo.save(ceo);
    // var id = ceo.id;

    post.tname.forEach(async element => {


      const taskName = this.taskRepo.create({ employee :ceo  ,tname : element });
      await this.taskRepo.save(taskName);

    });

    // const task1 = this.taskRepo.create({ tname : post.tname });
    // await this.taskRepo.save(task1);
    // const task2 = this.taskRepo.create({ tname: 'Present to Ceo' });
    // await this.taskRepo.save(task2);
    // const task3 = this.taskRepo.create({ tname: 'Coding' });
    // await this.taskRepo.save(task3);
    //
    // //
    // ceo.tasks = [task1,task2,task3];

    // const ceoContact = this.contactRepo.create({
    //   email : post.email ,
    // })
    // ceoContact.employee = ceo;
    // await this.contactRepo.save(ceoContact);

    // await this.empRepo.save(ceo);
    // return ceo;
    // const newPost =  this.taskRepo.create({
    //   ...post,
    //   employee:
    // });
    // console.log(newPost);
    // await this.taskRepo.save(task1,task2,task3);
    return ceo;


  }


  async getEmployeeOtm() {
    return this.empRepo.find({ relations: ['tasks'] });
  }





  // M T M
  async createEmployeemtm(post: any, user: Employee) {


    const ceo = this.empRepo.create({ name: post.name })
    await this.empRepo.save(ceo);

    const ceoContact = this.contactRepo.create({
      email: post.email,
    })
    ceoContact.employee = ceo;
    await this.contactRepo.save(ceoContact);


    post.tname.forEach(async element => {

      const taskName = this.taskRepo.create({ employee :ceo  ,tname : element });
      await this.taskRepo.save(taskName);

    });

    post.zoomUrl.forEach(async element => {
      const meetName = this.meetRepo.create({  zoomUrl : element });
      meetName.attendees = [ceo];
      await this.meetRepo.save(meetName);
    })

    // const manager = this.empRepo.create({
    //   name: post.name,
    //   manager: ceo,
    // });
    //
    // const task1 = this.taskRepo.create({ tname: 'Hire people' });
    // await this.taskRepo.save(task1);
    // const task2 = this.taskRepo.create({ tname: 'Present to Ceo' });
    // await this.taskRepo.save(task2);
    //
    // manager.tasks = [task1, task2];
    //
    // const meeting1 = this.meetRepo.create({ zoomUrl: 'meeting.com' });
    // meeting1.attendees = [ceo];
    // await this.meetRepo.save(meeting1);
    //
    // manager.meetings = [meeting1];
    //
    // await this.empRepo.save(manager);
    return ceo;
  }

  async getEmployeemtm() {
    return this.empRepo.find({ relations: ['contactInfo', 'tasks', 'meetings'] });
  }












  public async listCustomer(): Promise<User[]> {
    return await this.userRepo.find({})
  }







  public async getCustomer(email: string): Promise<any> {
    console.log(email)
    const data = await this.userRepo.find({ email })
    // console.log(data);
    if (!email) {
      throw new NotFoundException('user Not Found')
    }
    return data;
    //     console.log(email)
    //     if(!data){
    //         throw new NotFoundException('user not found');
    //     }
    //     return data;
  }

  public async getCustomerbyID(id: string): Promise<any> {

    // console.log(id)

    const data = await this.userRepo.findOne(id);
    // console.log(data,"dataaaaaaaaaaaaaaaaaaaaaa")
    // if(data){
    //   if()
    //   throw new NotFoundException('user Not Found')
    //
    // }
    // console.log(data);
    return await this.userRepo.find(data)
  }






  public async createCustomer(data: UserDto): Promise<any> {
    try {
      const email = data.email;
      // console.log(email)
      // console.log(data.password);
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password, saltOrRounds);

      console.log(hash, "hasssssssssssssssssssssssssss")
      // // const l = data.email;
      if (email) {
        // console.log("demmooooooooooooooooooooooooo")
        const edata = await this.userRepo.find({ email });
        // console.log(edata, "edataaaaaaaaaaa");

        if (edata.length === 0) {
          const person = {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            email: data.email,
            password: hash
          }


          const user = await this.userRepo.create(person);
          await this.userRepo.save(user);
          // data.id = uuid();

          return user;


          // if (edata[0].email === email) {
          //   console.log("founddddddd")
          //
          //   throw new NotFoundException("User already found");
          // }
        } else {
          // if(edata[0].email === email)
          console.log("founddddddd")
          //
          throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'User is already Exist!!!!',

          }, HttpStatus.FORBIDDEN);

        }
        // console.log()

      }
      // const user = await this.userRepo.create(data);
      // await this.userRepo.save(user);
      // data.id = uuid();
      //
      // return user;


      // const edata = await this.userRepo.find({email})

      // console.log(data.email,"creatttttttttttttttttttttttt");
      // if(data.email === )



      // console.log(this.user,"userffffffffffffffffffffffffffffffff");
      // const person = {
      //     firstName:user.firstName,
      //     lastName:user.lastName,
      //     id:user.id,
      //     isActive:user.isActive,
      //     email:user.email
      // }
      // user.firstName = "Mihir";
      // user.lastName = "Panchal";
      // user.id = 121;
      // user.isActive = true;
      // user.email = 'demo@gmail.com';

      // const saveperson =await this.userRepo.create(user);
      //
      // await this.userRepo.save(user);
      // console.log(user,"nfaknkfanakfkak");
      //
      // return saveperson;
      // return saveperson;
      // return await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

  }
  // user(user: any, arg1: string) {
  //     throw new Error('Method not implemented.');
  // }





  public async updateCustomer(id: string, customerdto: UserDto): Promise<any> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(customerdto.password, saltOrRounds);

    const person = {
      firstName: customerdto.firstName,
      lastName: customerdto.lastName,
      phone: customerdto.phone,
      email: customerdto.email,
      password: hash
    }
    console.log(customerdto, "CustomerDto")
    const update = await this.userRepo.update(id, person);
    const data = await this.userRepo.findOne(id)
    console.log(update);

    return data;
  }






  public async removeCustomer(id: string): Promise<User> {
    const data = await this.userRepo.findOne(id);

    if (!data) {
      throw new NotFoundException('user not found');
    }

    return await this.userRepo.remove(data);
  }

  // async findOne(email:any): Promise<User[] | undefined> {
  //     console.log(this.userRepo);
  //     return this.userRepo.find(user => user.email === email)
  // }

}
