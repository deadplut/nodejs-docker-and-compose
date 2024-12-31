import { IsUrl, Length, Min } from 'class-validator';
import { PrimaryEntityFields } from 'src/common/primary-entity-fields';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/utils/constants';
import { stringFormat } from 'src/utils/string-format';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

// TODO - перенести числа и текст в константы

/** Схема для подарков (wish) */
@Entity()
export class Wish extends PrimaryEntityFields {
  /** name — название подарка. Не может быть длиннее 250 символов и короче одного. */
  @Column()
  @Length(1, 250, {
    message: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 1, 250),
  })
  name: string;
  /** link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка. */
  @Column({ default: '' })
  @IsUrl(undefined, {
    message: stringFormat(
      ERROR_MESSAGES.VALIDATION.IS_URL,
      'на интернет-магазин',
    ),
  })
  link: string;
  /** image ссылка на изображение подарка, строка. Должна быть валидным URL. */
  @Column()
  @IsUrl(undefined, {
    message: stringFormat(ERROR_MESSAGES.VALIDATION.IS_URL, 'для картинки'),
  })
  image: string;
  /** price — стоимость подарка, с округлением до сотых, число. */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Min(1, { message: stringFormat(ERROR_MESSAGES.VALIDATION.MIN_PRICE, 1) })
  price: number;
  /** raised — сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых. */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  raised: number;
  /** owner — ссылка на пользователя, который добавил пожелание подарка. */
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  /** description — строка с описанием подарка длиной от 1 и до 1024 символов. */
  @Column()
  @Length(1, 1024, {
    message: stringFormat(ERROR_MESSAGES.VALIDATION.TEXT_LENGTH, 1, 1024),
  })
  description: string;
  /** offers — массив ссылок на заявки скинуться от других пользователей. */
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
  /** copied — содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число. */
  @Column({ default: 0 })
  copied: number;
}
