import { Injectable } from '@nestjs/common';
import { CreateTeamFormDto } from './dto/create-team-form.dto';
import { TeamForm } from './entities/team-form.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import { Repository } from 'typeorm';

@Injectable()
export class TeamFormService {
  constructor(
    @InjectRepository(TeamForm)
    private formRepository: Repository<TeamForm>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(file: Express.Multer.File, payload: CreateTeamFormDto) {
    const upload = await this.cloudinaryService.uploadFile(file);
    const newForm = new TeamForm(payload);
    newForm.cvPath = upload.secure_url;

    return await this.formRepository.save(newForm);
  }

  async findAll() {
    return await this.formRepository.find();
  }

  async remove(id: number) {
    return await this.formRepository.delete(id);
  }
}
