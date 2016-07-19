angular.module('freqModule', [])
    .controller('freqCtrl', ['$scope', function ($scope) {
        var cy = cytoscape({
            container: document.getElementById('cy'),
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
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

        for (var i = 0; i < baskets.length; i++) {
            for (var j = 0; j < baskets[i].length; j++) {
                cy.add({
                    data: {
                        id: baskets[i][j]
                    }
                });
            }
        }
    }])
;