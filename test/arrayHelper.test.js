describe('arrayHelper', function () {
    beforeEach(angular.mock.module('freqModule'));

    it('tests contains', inject(['arrayHelper', function (arrayHelper) {
        var array = ['a', 'b', 'c'];
        var sub = ['a', 'b'];

        expect(arrayHelper.contains(array, sub)).toBe(true);

        sub = ['c', 'd'];
        expect(arrayHelper.contains(array, sub)).toBe(false);
    }]));

    it('', inject(['arrayHelper', function (arrayHelper) {
        expect(arrayHelper.fromSetElement('{牛奶, 啤酒, 尿布}')).toEqual(['牛奶', '啤酒', '尿布']);

        expect(arrayHelper.fromSetElement('牛奶')).toEqual(['牛奶']);
    }]));
});