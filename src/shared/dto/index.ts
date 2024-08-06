import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { IGetAll } from '../interface'

export class IGetAllDto implements IGetAll {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  limit: number

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page: number

  @ApiPropertyOptional({ required: false })
  @IsString()
  @IsOptional()
  search?: string
}
