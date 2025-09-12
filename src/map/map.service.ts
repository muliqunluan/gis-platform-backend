// src/map/map.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Map } from '../entities/map.entity';
import { Group } from '../entities/group.entity';
import { UserGroup } from '../entities/user-group.entity';
import { User } from '../entities/user.entity';
import { CreateMapDto } from './dto/create-map.dto';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Map)
    private mapRepository: Repository<Map>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMap(createMapDto: CreateMapDto, userId: number) {
    // 检查地图名称是否已存在
    const existingMap = await this.mapRepository.findOne({
      where: { name: createMapDto.name },
    });

    if (existingMap) {
      throw new ConflictException('地图名称已存在');
    }

    // 检查群组名称是否已存在
    const existingGroup = await this.groupRepository.findOne({
      where: { name: createMapDto.groupName },
    });

    if (existingGroup) {
      throw new ConflictException('群组名称已存在');
    }

    // 获取用户信息
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('用户不存在');
    }

    // 创建群组
    const group = this.groupRepository.create({
      name: createMapDto.groupName,
      description: createMapDto.description,
    });

    const savedGroup = await this.groupRepository.save(group);

    // 创建用户群组关联
    const userGroup = this.userGroupRepository.create({
      user,
      group: savedGroup,
    });
    await this.userGroupRepository.save(userGroup);

    // 创建地图
    const mapData: Partial<Map> = {
      name: createMapDto.name,
      type: createMapDto.type,
      bounds: createMapDto.bounds ? {
        minLng: createMapDto.bounds[0],
        minLat: createMapDto.bounds[1],
        maxLng: createMapDto.bounds[2],
        maxLat: createMapDto.bounds[3],
      } : undefined,
      zoomRange: createMapDto.zoomRange,
      isPublic: createMapDto.isPublic,
      owner: user,
      group: savedGroup,
    };

    const map = this.mapRepository.create(mapData);

    const savedMap = await this.mapRepository.save(map);

    return {
      map: savedMap,
      group: savedGroup,
    };
  }

  async getUserMaps(userId: number) {
    return this.mapRepository.find({
      where: { owner: { id: userId } },
      relations: ['group', 'layers'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPublicMaps() {
    return this.mapRepository.find({
      where: { isPublic: true },
      relations: ['owner', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMapById(id: number) {
    return this.mapRepository.findOne({
      where: { id },
      relations: ['owner', 'group', 'layers'],
    });
  }

  async deleteMap(id: number, userId: number) {
    const map = await this.mapRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['group'],
    });

    if (!map) {
      throw new Error('地图不存在或无权删除');
    }

    // 删除地图
    await this.mapRepository.remove(map);

    // 检查群组是否还有其他地图
    const groupMaps = await this.mapRepository.count({
      where: { group: { id: map.group.id } },
    });

    // 如果没有其他地图，删除群组
    if (groupMaps === 0) {
      await this.groupRepository.remove(map.group);
    }

    return { success: true };
  }
}