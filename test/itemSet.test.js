describe('Unit: Testing itemSet', function () {
    beforeEach(angular.mock.module('freqModule'));

    it('should have an itemSet factory', inject(['itemSet', function (itemSet) {
        expect(itemSet).toBeDefined();
        expect(itemSet.make1ItemSetFrom2dList).not.toEqual(null);
    }]));
});