import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Очистка (порядок важен из-за связей)
  await prisma.excursionTag.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.excursion.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // 1. Пользователи
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@guidedtrip.kz',
      name: 'Админ',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@guidedtrip.kz',
      name: 'Тестовый пользователь',
      passwordHash,
      role: Role.USER,
    },
  });

  // 2. Категории
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Популярные', slug: 'populyarnye' } }),
    prisma.category.create({ data: { name: 'Обзорные', slug: 'obzornye' } }),
    prisma.category.create({ data: { name: 'Вечерние', slug: 'vechernie' } }),
    prisma.category.create({ data: { name: 'Детские', slug: 'detskie' } }),
  ]);

  // 3. Теги
  const tagNames = ['история', 'архитектура', 'природа', 'искусство', 'семейный', 'ночной', 'пешая', 'автобусная'];
  const tags = await Promise.all(
    tagNames.map((name) => prisma.tag.create({ data: { name } })),
  );

  // 4. Экскурсии (12 штук — по 3 в каждой категории)
  const excursionsData = [
    // Популярные
    {
      title: 'Главная мечеть Казахстана',
      description: 'Авторская ознакомительная экскурсия по крупнейшей мечети Центральной Азии. Вы узнаете об истории строительства, архитектурных особенностях и значении мечети для культуры Казахстана.',
      price: 5000, duration: 1.5, imageUrl: 'https://images.unsplash.com/photo-1596627116790-af6f46dddbde?w=800', format: 'индивидуальная', maxPeople: 3, categoryId: categories[0].id, tagIds: [tags[0].id, tags[1].id],
    },
    {
      title: 'Городские картины',
      description: 'Пешая прогулка по муралам и стрит-арту Астаны. Маршрут проходит через старый город и новые кварталы, где стены домов превращены в холсты современных художников.',
      price: 4000, duration: 2.5, imageUrl: 'https://images.unsplash.com/photo-1569880153113-76e33fc52b5f?w=800', format: 'пешая', maxPeople: 10, categoryId: categories[0].id, tagIds: [tags[3].id, tags[6].id],
    },
    {
      title: 'Астана қаласының бас мешіті',
      description: 'Экскурсия на казахском и русском языках по главной мечети столицы. Погружение в историю ислама в Казахстане и знакомство с традициями.',
      price: 4500, duration: 2, imageUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa00?w=800', format: 'групповая', maxPeople: 15, categoryId: categories[0].id, tagIds: [tags[0].id, tags[1].id],
    },
    // Обзорные
    {
      title: 'Астана — от крепости к величию',
      description: 'Полная обзорная экскурсия по столице: от старого центра Акмолинска до футуристических небоскрёбов левого берега. Байтерек, Хан Шатыр, Дворец мира и согласия.',
      price: 8000, duration: 4, imageUrl: 'https://images.unsplash.com/photo-1555862124-94036092ab14?w=800', format: 'автобусная', maxPeople: 20, categoryId: categories[1].id, tagIds: [tags[0].id, tags[1].id, tags[7].id],
    },
    {
      title: 'Столичный калейдоскоп',
      description: 'Яркая обзорная экскурсия с посещением главных достопримечательностей обоих берегов Ишима. Фотостопы у знаковых зданий, рассказы о современной истории.',
      price: 7000, duration: 3.5, imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', format: 'автобусная', maxPeople: 15, categoryId: categories[1].id, tagIds: [tags[0].id, tags[7].id],
    },
    {
      title: 'Город двух берегов',
      description: 'Контрастная экскурсия: правый берег — история и традиции, левый берег — амбиции и будущее. Увидите, как два мира соединяются в одном городе.',
      price: 7500, duration: 3.5, imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800', format: 'автобусная', maxPeople: 20, categoryId: categories[1].id, tagIds: [tags[0].id, tags[1].id, tags[7].id],
    },
    // Вечерние
    {
      title: 'Астана в свете фонарей',
      description: 'Вечерняя пешая прогулка по подсвеченному центру столицы. Байтерек в ночных огнях, фонтаны, бульвар Нуржол — город раскрывается с новой стороны.',
      price: 6000, duration: 3, imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800', format: 'пешая', maxPeople: 10, categoryId: categories[2].id, tagIds: [tags[5].id, tags[6].id],
    },
    {
      title: 'Огни ночного города',
      description: 'Короткая, но яркая автобусная экскурсия по вечерней Астане. Маршрут проходит мимо самых красивых подсвеченных зданий столицы.',
      price: 5000, duration: 2, imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800', format: 'автобусная', maxPeople: 20, categoryId: categories[2].id, tagIds: [tags[5].id, tags[7].id],
    },
    {
      title: 'Северное сияние столицы',
      description: 'Атмосферная вечерняя экскурсия с элементами театрализации. Гид в образе рассказчика ведёт группу по самым загадочным местам ночной Астаны.',
      price: 5500, duration: 2.5, imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', format: 'пешая', maxPeople: 8, categoryId: categories[2].id, tagIds: [tags[3].id, tags[5].id, tags[6].id],
    },
    // Детские
    {
      title: 'Зелёный пояс',
      description: 'Экскурсия для всей семьи по паркам и зелёным зонам Астаны. Ботанический сад, парк «Жеті Қазына», набережная — природа в центре мегаполиса.',
      price: 3500, duration: 3, imageUrl: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=800', format: 'групповая', maxPeople: 25, categoryId: categories[3].id, tagIds: [tags[2].id, tags[4].id],
    },
    {
      title: 'Сказочный мир',
      description: 'Детская интерактивная экскурсия с квестами и загадками. Дети узнают историю города через игру, собирают подсказки и находят «сокровище Астаны».',
      price: 3000, duration: 3, imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', format: 'групповая', maxPeople: 20, categoryId: categories[3].id, tagIds: [tags[0].id, tags[4].id],
    },
    {
      title: 'Dolce Vita столицы',
      description: 'Гастрономическая прогулка для семей: дегустация казахских сладостей, посещение кондитерских и кафе. Дети участвуют в мини-мастер-классе по баурсакам.',
      price: 4000, duration: 3, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', format: 'групповая', maxPeople: 15, categoryId: categories[3].id, tagIds: [tags[3].id, tags[4].id],
    },
  ];

  for (const { tagIds, ...data } of excursionsData) {
    const excursion = await prisma.excursion.create({ data });
    await Promise.all(
      tagIds.map((tagId) =>
        prisma.excursionTag.create({
          data: { excursionId: excursion.id, tagId },
        }),
      ),
    );
  }

  // 5. Бронирования (3 от тестового пользователя)
  const excursions = await prisma.excursion.findMany({ take: 3 });

  await prisma.booking.createMany({
    data: [
      {
        userId: user.id,
        excursionId: excursions[0].id,
        people: 2,
        totalPrice: excursions[0].price * 2,
        status: BookingStatus.PENDING,
        date: new Date('2025-07-15T10:00:00Z'),
        phone: '+7 777 123 4567',
      },
      {
        userId: user.id,
        excursionId: excursions[1].id,
        people: 1,
        totalPrice: excursions[1].price,
        status: BookingStatus.CONFIRMED,
        date: new Date('2025-07-20T14:00:00Z'),
        phone: '+7 777 123 4567',
      },
      {
        userId: user.id,
        excursionId: excursions[2].id,
        people: 3,
        totalPrice: excursions[2].price * 3,
        status: BookingStatus.CANCELLED,
        date: new Date('2025-08-01T11:00:00Z'),
        phone: '+7 777 123 4567',
      },
    ],
  });

  console.log('Seed завершён!');
  console.log(`Создано: 2 пользователя, 4 категории, 8 тегов, 12 экскурсий, 3 бронирования`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });