import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Validate Address API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /address/validate → valid address', async () => {
    const response = await request(app.getHttpServer())
      .post('/address/validate')
      .send({
        address: '1600 Pennsylvania Avenue, Washington DC 20500',
      })
      .expect(200);

    expect(response.body).toEqual({
      status: 'valid',
      address: {
        number: 1600,
        street: 'pennsylvania avenue',
        city: 'washington',
        state: {
          shortName: 'DC',
          longName: 'District of Columbia',
        },
        zip: '20500',
      },
    });
  });

  it('POST /address/validate → corrected address', async () => {
    const response = await request(app.getHttpServer())
      .post('/address/validate')
      .send({
        address: '1600 Penn Ave, Washington DC 20500',
      })
      .expect(200);

    expect(response.body.status).toBe('corrected');
    expect(response.body.address).toBeDefined();
  });

  it('POST /address/validate → 400 when address is unverifiable', async () => {
    const response = await request(app.getHttpServer())
      .post('/address/validate')
      .send({
        address: 'Washington DC',
      })
      .expect(400);

    expect(response.body.message).toBe('Address is unverifiable');
    expect(response.body.reasons).toContain('Missing number');
    expect(response.body.reasons).toContain('Missing zip');
  });

  it('POST /address/validate → 400 when address is missing', async () => {
    await request(app.getHttpServer())
      .post('/address/validate')
      .send({})
      .expect(400);
  });

  it('POST /address/validate → 400 when address is empty', async () => {
    await request(app.getHttpServer())
      .post('/address/validate')
      .send({ address: '' })
      .expect(400);
  });

  it('POST /address/validate → 400 when extra fields are sent', async () => {
    await request(app.getHttpServer())
      .post('/address/validate')
      .send({
        address: '1600 Pennsylvania Avenue, Washington DC 20500',
        foo: 'bar',
      })
      .expect(400);
  });
});
