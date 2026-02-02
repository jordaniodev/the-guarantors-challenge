import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AddressModule } from './address.module';

describe('AddressController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AddressModule],
    }).compile();

    app = moduleRef.createNestApplication();

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

  // -----------------------------
  // VALID REQUEST
  // -----------------------------

  it('POST /address/validate → valid address', async () => {
    const response = await request(app.getHttpServer())
      .post('/address/validate')
      .send({
        address: '1600 Pennsylvania Avenue, Washington DC 20500',
      })
      .expect(HttpStatus.OK);

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

  // -----------------------------
  // CORRECTED REQUEST
  // -----------------------------

  it('POST /address/validate → corrected address', async () => {
    const response = await request(app.getHttpServer())
      .post('/address/validate')
      .send({
        address: '1600 Penn Ave, Washington DC 20500',
      })
      .expect(HttpStatus.OK);

    expect(response.body.status).toBe('corrected');
    expect(response.body.address).toBeDefined();
  });
});
