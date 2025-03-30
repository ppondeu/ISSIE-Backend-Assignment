import { haversine } from "./distance";

describe('haversine', () => {
    it('should calculate the distance between two points correctly', () => {
        const lat1 = 52.5200;
        const lon1 = 13.4050;
        const lat2 = 48.8566;
        const lon2 = 2.3522;

        const distance = haversine(lat1, lon1, lat2, lon2);

        const expectedDistance = 877.4633259175432;

        expect(distance).toBeCloseTo(expectedDistance, 1);
    });

    it('should return 0 if the two points are the same', () => {
        const lat1 = 40.7128;
        const lon1 = -74.0060;
        const lat2 = 40.7128;
        const lon2 = -74.0060;

        const distance = haversine(lat1, lon1, lat2, lon2);

        expect(distance).toBe(0);
    });
});
