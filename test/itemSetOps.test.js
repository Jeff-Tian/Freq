describe('itemSetOps', function() {
    beforeEach(angular.mock.module('freqModule'));

    it('should make', inject(['itemSetOps', 'WeightedSet', function(itemSetOps, WeightedSet) {
        var baskets = [
            ['牛奶', '啤酒', '尿布', '牛奶']
        ];
        var ws = new WeightedSet(
            baskets[0]
        );

        var oneItemSet = itemSetOps.make1ItemSetFrom1ItemSet(ws);

        expect(oneItemSet.elements).toEqual({
            '牛奶': {
                weight: 2,
                source: []
            },
            '啤酒': {
                weight: 1,
                source: []
            },
            '尿布': {
                weight: 1,
                source: []
            }
        });
    }]));

    it('', inject(['Set', 'WeightedSet', 'itemSetOps', function(Set, WeightedSet, itemSetOps) {
        var baskets = [
            ['牛奶', '啤酒', '尿布', '牛奶']
        ];

        var oneItemSet = itemSetOps.make1ItemSetFrom1ItemSet(itemSetOps.make1ItemSetFrom2dList(baskets));

        var twoItemSet = itemSetOps.make2ItemSetFrom1ItemSet(oneItemSet, baskets);
        var threeItemSet = itemSetOps.make3ItemSetFrom1ItemSet(oneItemSet, baskets);

        itemSetOps.generateSourceFor(threeItemSet, twoItemSet);

        expect(threeItemSet.elements).toEqual({
            "{啤酒, 尿布, 牛奶}": {
                "weight": 1,
                "source": ["{啤酒, 牛奶}", "{尿布, 牛奶}", "{啤酒, 尿布}"]
            }
        });
    }]));

    it('', inject(['Set', 'WeightedSet', 'itemSetOps', function(Set, WeightedSet, itemSetOps) {
        var baskets = [
            ['牛奶', '啤酒', '尿布', '牛奶']
        ];
        var oneItemSet = itemSetOps.make1ItemSetFrom1ItemSet(itemSetOps.make1ItemSetFrom2dList(baskets));
        var twoItemSet = itemSetOps.make2ItemSetFrom1ItemSet(oneItemSet, baskets);

        var threeItemSet = itemSetOps.makeSupperItemSetFrom(oneItemSet, baskets);

        expect(threeItemSet.elements).toEqual({
            "{啤酒, 尿布, 牛奶}": {
                "weight": 1,
            }
        });
    }]));
});