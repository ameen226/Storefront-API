import { ProductStore } from "../product";

const store = new ProductStore();

describe('The Product model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('should create a product', async () => {
        const { name, price, category } = await store.create({
            name: 'rubber duck',
            price: '4',
            category: 'toys'
        });

        expect({ name, price, category }).toEqual({
            name: 'rubber duck',
            price: '4',
            category: 'toys'
        });
    });

    it('should index all the products', async () => {
        const [{ name, price, category }] = await store.index();

        expect([{ name, price, category }]).toEqual([
            {
                name: 'rubber duck',
                price: '4',
                category: 'toys'
            },
        ]);
    });

    it('should show a specific product', async () => {
        const { name, price, category } = await store.show('rubber duck');

        expect({ name, price, category }).toEqual({
            name: 'rubber duck',
            price: '4',
            category: 'toys'
        });
    });

    it('should delete a specific product', async () => {
        await store.delete('rubber duck');
        const result = await store.show('rubber duck');

        // @ts-ignore
        expect(result).toBe(undefined);
    });
});