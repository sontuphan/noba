import { each } from 'noba'

each(
  [
    { brand: 'Porsche', cars: ['Macan', 'Taycan', 'Cayman', '911'] },
    { brand: 'BMW', cars: ['M2', 'M3', 'X7'] },
    { brand: 'Toyota', cars: ['Supra', 'Sequoia'] },
  ],
  ({ describe, arg: { brand, cars } }) => {
    describe(`each > ${brand}`, ({ each }) => {
      each(cars, ({ test, arg: car }) => {
        test(`should be ${car}`, ({ expect }) => {
          expect(car).to.be.truthy()
        })
      })
    })
  },
)
