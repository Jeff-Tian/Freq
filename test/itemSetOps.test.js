describe('itemSetOps', function () {
    beforeEach(angular.mock.module('freqModule'));

    it('should', inject(['itemSetOps', 'WeightedSet', function (itemSetOps, WeightedSet) {
        var ws = new WeightedSet(
            ['牛奶', '啤酒', '尿布', '牛奶']
        );

        var oneItemSet = itemSetOps.make1ItemSetFrom1ItemSet(ws);

        // expect(oneItemSet.elements).toEqual({
        //     '牛奶': {weight: 2, source: ['{牛奶}']},
        //     '啤酒': {weight: 1, source: ['{啤酒}']},
        //     '尿布': {weight: 1, source: ['{尿布}']}
        // });
    }]));
});