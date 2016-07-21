describe('Unit: Testing itemSet', function () {
    beforeEach(angular.mock.module('freqModule'));

    it('should', inject(function ($itemSet) {
        expect($itemSet).not.to.equal(null);
    }));
});