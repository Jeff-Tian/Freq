angular.module('aprioriModule', ['setModule', 'arrayHelperModule'])
    .controller('aprioriCtrl', ['$scope', 'itemSetOps', function($scope, itemSetOps) {
        var database = [
            ['牛奶', '啤酒', '尿布'],
            ['面包', '黄油', '牛奶'],
            ['牛奶', '尿布', '饼干'],
            ['面包', '黄油', '饼干'],
            ['啤酒', '饼干', '尿布'],
            ['牛奶', '尿布', '面包', '黄油'],
            ['面包', '黄油', '尿布'],
            ['啤酒', '尿布'],
            ['牛奶', '尿布', '面包', '黄油'],
            ['啤酒', '饼干']
        ];

        function scanDbGenerateFirstCandidate(db) {
            return itemSetOps.make1ItemSetFrom2dList(db);
        }

        $scope.firstCandidates = scanDbGenerateFirstCandidate(database);

        function filter(firstCandidates) {
            for (var item in firstCandidates.elements) {
                if (firstCandidates.elements[item] < 2) {
                    delete firstCandidates.elements[item];
                }
            }
        }

        function join1stCandidates(firstCandidates) {
            return itemSetOps.make2ItemSetFrom1ItemSet(firstCandidates, database);
        }

        filter($scope.firstCandidates);
        $scope.secondCandidates = join1stCandidates($scope.firstCandidates);

        function filterCandidates(c) {
            for (var item in c.elements) {
                if (c.elements[item].weight < 2) {
                    delete c.elements[item];
                }
            }
        }

        function join2ndCandidates(c) {
            return itemSetOps.make3ItemSetFromItemSet(c, database);
        }

        filterCandidates($scope.secondCandidates);
        $scope.thirdCandidates = join2ndCandidates($scope.secondCandidates);
    }]);