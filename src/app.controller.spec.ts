import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('receive form response', () => {
    it('should receive form response', () => {
      let formResponse = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          'Ime otroka': 'Luba',
          'Priimek otroka': 'Galčot',
          'Datum rojstva': '2024-06-05',
          Naslov: 'Travnik 69',
          Pošta: '4228',
          'EMŠO otroka': '012303123',
          'Številka osebnega dokumenta otroka': '2893448923',
          'Številka zdravstvene izkaznice': '8092438904239',
          'Ime vodnika': 'GG + (Mark)',
          'Ime priimek starša 1': 'asdf',
          'Elektronski naslov starša 1': 'luba@gmail.com',
          'Telefonska številka starša 1': '',
          'Ime priimek starša 2': '',
          'Telefonska številka starša 2': '',
          'Redno cepljen po programu': 'Da',
          'Prehranske posebnosti': 'Vsejed',
          'Plavalske sposobnosti': 'Neplavalec',
          'Udeležba pohodnega tabora - hajka':
            'Prijavljeni se bo udeležil hajka',
          'Nam želite še kaj sporočiti? :)': '',
        }),
      };
      formResponse = JSON.parse(formResponse.payload);
      return request(app.getHttpServer())
        .post('/')
        .send(formResponse)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201);
    });
  });
});
