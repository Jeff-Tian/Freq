angular.module('arrayHelperModule', [])

.factory('arrayHelper', [function() {
    return {
        contains: function(array, sub) {
            for (var i = 0; i < sub.length; i++) {
                if (array.indexOf(sub[i]) < 0) {
                    return false;
                }
            }

            return true;
        },

        fromSetElement: function(setElement) {
            if (setElement[0] !== '{') {
                return [setElement];
            }

            return setElement.substr(1, setElement.length - 2).split(', ');
        }
    };
}]);