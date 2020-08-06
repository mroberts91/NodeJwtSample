import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {ObjectType, Field, Int} from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;
}
