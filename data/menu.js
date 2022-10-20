
import faker from 'faker';

const PRODUCT_NAME = [
    'dasboard',
    'fred',
    'amazon',
    'netflix',
];


const products = [...Array(4)].map((_, index) => {
    return {
        id: faker.datatype.uuid(),
        name: PRODUCT_NAME[index],
    };
});

export default products;
