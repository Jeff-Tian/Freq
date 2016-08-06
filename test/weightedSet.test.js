describe('Weighted Set', function () {
    beforeEach(angular.mock.module('freqModule'));

    it('should ', inject(['WeightedSet', function (WeightedSet) {
        var ws = new WeightedSet(
            ['牛奶', '啤酒', '尿布', '牛奶']
        );

        expect(ws.elements).toEqual({"牛奶":2,"啤酒":1,"尿布":1});
    }]));
});