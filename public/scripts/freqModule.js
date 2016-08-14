angular.module('freqModule', ['setModule', 'arrayHelperModule'])
    .controller('freqCtrl', ['$scope', 'itemSetOps', function ($scope, itemSetOps) {
        var cy = cytoscape({
            container: document.getElementById('cy'),
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#aaa',
                        'label': 'data(id)',
                        'color': '#fff',
                        'font-size': '22px',
                        'text-rotation': '45',
                        'text-margin-x': 50,
                        'text-margin-y': 50
                    }
                }, {
                    selector: 'node[weight >= 2]',
                    style: {
                        'border': 'solid 1px yellow',
                        'background-color': 'yellow'
                    }
                }, {
                    selector: 'edge',
                    style: {
                        'width': 1,
                        'line-color': '#777',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            layout: {
                name: 'breadthfirst'
            }
        });

        var baskets = [
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

        function addItemSetToCy(cy, itemSet, y) {
            var a = [];

            function getIdFor(item) {
                return item;
            }

            var i = 0;
            var count = itemSet.toSet().toArray().length;

            for (var item in itemSet.elements) {
                var theItem = itemSet.elements[item];
                var data = {
                    group: 'nodes',
                    data: {
                        id: getIdFor(item),
                        weight: theItem.weight
                    },
                    position: {
                        x: (100 + 300 / count) * (i - count / 2),
                        y: y
                    },
                    locked: true,
                    label: {
                        'text-valign': ['top', 'center', 'bottom'][i % 3]
                    }
                };

                a.push(data);
                cy.add(data);

                i++;
            }

            return a;
        }

        function addEdgesToCy(cy, itemSet) {
            var a = [];
            for (var element in itemSet.elements) {
                for (var i = 0; i < itemSet.elements[element].source.length; i++) {
                    var source = itemSet.elements[element].source[i];
                    var data = {
                        group: 'edges',
                        data: {
                            id: source + '-->' + element,
                            source: source,
                            target: element
                        }
                    };
                    a.push(data);
                    cy.add(data);
                }
            }

            return a;
        }

        window.cy = cy;

        var oneItemSet = itemSetOps.make1ItemSetFrom1ItemSet(itemSetOps.make1ItemSetFrom2dList(baskets));
        var a1 = addItemSetToCy(cy, oneItemSet, 0);

        var twoItemSet = itemSetOps.make2ItemSetFrom1ItemSet(oneItemSet, baskets);
        var a2 = addItemSetToCy(cy, twoItemSet, 270);

        itemSetOps.generateSourceFor(twoItemSet, oneItemSet);
        console.log(twoItemSet);
        var a3 = addEdgesToCy(cy, twoItemSet);

        var threeItemSet = itemSetOps.make3ItemSetFrom1ItemSet(oneItemSet, baskets);
        var a4 = addItemSetToCy(cy, threeItemSet, 540);

        itemSetOps.generateSourceFor(threeItemSet, twoItemSet);
        var a5 = addEdgesToCy(cy, threeItemSet);

        var fourItemSet = itemSetOps.make4ItemSetFrom1ItemSet(oneItemSet, baskets);
        var a6 = addItemSetToCy(cy, fourItemSet, 810);

        itemSetOps.generateSourceFor(fourItemSet, threeItemSet);
        var a7 = addEdgesToCy(cy, fourItemSet);

        var fiveItemSet = itemSetOps.make5ItemSetFrom1ItemSet(oneItemSet, baskets);
        var a8 = addItemSetToCy(cy, fiveItemSet, 1080);

        itemSetOps.generateSourceFor(fiveItemSet, fourItemSet);
        var a9 = addEdgesToCy(cy, fiveItemSet);

        var sixItemSet = itemSetOps.make6ItemSetFrom1ItemSet(oneItemSet, baskets);
        var a10 = addItemSetToCy(cy, sixItemSet, 1350);

        itemSetOps.generateSourceFor(sixItemSet, fiveItemSet);
        var a11 = addEdgesToCy(cy, sixItemSet);

        cy.layout({
            name: 'grid'
        });
    }]);