describe('Unit: Testing itemSet', function () {
    beforeEach(angular.mock.module('freqModule'));

    it('should have an itemSet factory', inject(['itemSetOps', function (itemSet) {
        expect(itemSet).toBeDefined();
        expect(itemSet.make1ItemSetFrom2dList).not.toEqual(null);
    }]));

    it('should have an work Set factory', inject(['Set', function (Set) {
        expect(Set).toBeDefined();
        expect(Set.prototype.equals).toBeDefined();

        var ab = new Set(['a', 'b']);
        var cd = new Set(['c', 'd', 'b']);

        expect(ab.union(cd).toString()).toEqual('{a, b, c, d}');
    }]));

    it('should union all the sets', inject(['Set', function (Set) {
        var ab = new Set(['a', 'b']);
        var cd = new Set(['c', 'd', 'e']);

        expect(Set.union([ab, cd]).toString()).toEqual('{a, b, c, d, e}');
    }]));
});