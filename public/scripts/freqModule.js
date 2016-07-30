angular.module('freqModule', [])
    .factory('itemSet', [function() {
        function Set(a) {
            a = a || [];

            var elements = {};

            for (var i = 0; i < a.length; i++) {
                if (!elements[a[i]]) {
                    elements[a[i]] = true;
                }
            }

            this.elements = elements;
        }

        Set.prototype.toString = function() {
            var a = [];
            for (var element in this.elements) {
                a.push(element);
            }

            return '{' + a.sort().join(', ') + '}';
        };

        Set.prototype.contains = function(another) {
            for (var element in another.elements) {
                if (!this.elements[element]) {
                    return false;
                }
            }

            return true;
        };

        Set.prototype.equals = function(another) {
            return this.contains(another) && another.contains(this);
        };

        Set.prototype.toArray = function() {
            var a = [];

            for (var element in this.elements) {
                for (var i = 0; i < this.elements[element]; i++) {
                    a.push(element);
                }
            }

            return a;
        };

        Set.prototype.clone = function() {
            return new Set(this.toArray());
        };

        Set.prototype.union = function(another) {
            var clone = this.clone();

            for (var element in another.elements) {
                clone.elements[element] = true;
            }

            return clone;
        };

        function WeightedSet(a) {
            a = a || [];

            this.elements = {};

            for (var i = 0; i < a.length; i++) {
                if (!this.elements[a[i]]) {
                    this.elements[a[i]] = 0;
                }

                this.elements[a[i]]++;
            }
        }

        WeightedSet.prototype.toString = function() {
            return JSON.stringify(this.elements);
        };

        WeightedSet.prototype.toArray = function() {
            var a = [];

            for (var element in this.elements) {
                for (var i = 0; i < this.elements[element]; i++) {
                    a.push(element);
                }
            }

            return a;
        };

        WeightedSet.prototype.clone = function() {
            return new WeightedSet(this.toArray());
        };

        WeightedSet.prototype.union = function(another) {
            var clone = this.clone();

            for (var element in another.elements) {
                clone.elements[element] = clone.elements[element] ? clone.elements[element] + another.elements[element] : another.elements[element];
            }

            return clone;
        };

        WeightedSet.prototype.subSet = function(element) {
            var s = new WeightedSet();
            s.elements[element] = this.elements[element];

            return s;
        };

        WeightedSet.prototype.toSet = function() {
            var a = [];

            for (var element in this.elements) {
                a.push(element);
            }

            return new Set(a);
        };

        return {
            make1ItemSetFrom2dList: function(list) {
                var set = new WeightedSet();

                for (var i = 0; i < list.length; i++) {
                    set = set.union(new WeightedSet(list[i]))
                }

                return set;
            },

            make2ItemSetFrom1ItemSet: function(oneItemSet) {
                var ws = new WeightedSet();

                for (var x in oneItemSet.elements) {
                    var xx = oneItemSet.subSet(x).toSet();
                    for (var y in oneItemSet.elements) {
                        var yy = oneItemSet.subSet(y).toSet();

                        if (!xx.equals(yy)) {
                            ws.elements[xx.union(yy).toString()] = {
                                weight: 1,
                                source: [xx.toArray()[0], yy.toArray()[0]]
                            };
                        }
                    }
                }

                return ws;
            },

            make3ItemSetFrom1ItemSet: function(oneItemSet) {
                var ws = new WeightedSet();
                for(var x in oneItemSet.elements){
                    var xx = oneItemSet.subSet(x).toSet();
                    for(var y in oneItemSet.elements) {
                        var yy = oneItemSet.subSet(y).toSet();
                        
                        if(xx.equals(yy)){
                            continue;
                        }
                        
                        for(var z in oneItemSet.elements){
                            var zz = oneItemSet.subSet(z).toSet();
                            
                            if(xx.equals(zz) || yy.equals(zz)){
                                continue;
                            }
                            
                            ws.elements[xx.union(yy).union(zz).toString()] = {
                                weight: 1,
                                source: [xx.union(yy), xx.union(zz), yy.union(zz)]
                            };
                        }
                    }
                }
                
                return ws;
            }
        };
    }])
    .controller('freqCtrl', ['$scope', 'itemSet', function($scope, itemSet) {
        var cy = cytoscape({
            container: document.getElementById('cy'),
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#aaa',
                        'label': 'data(id)'
                    }
                }, {
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

        function addItemSetToCy(cy, itemSet) {
            var a = [];

            for (var item in itemSet.elements) {
                var data = {
                    data: {
                        id: item
                    }
                };

                a.push(data);
                cy.add(data);
            }

            return a;
        }

        function addEdgesToCy(cy, twoItemSet) {
            var a = [];
            for (var element in twoItemSet.elements) {
                for (var i = 0; i < twoItemSet.elements[element].source.length; i++) {
                    var source = twoItemSet.elements[element].source[i];
                    var data = {
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

        var oneItemSet = itemSet.make1ItemSetFrom2dList(baskets);
        var a1 = addItemSetToCy(cy, oneItemSet);

        var twoItemSet = itemSet.make2ItemSetFrom1ItemSet(oneItemSet);
        var a2 = addItemSetToCy(cy, twoItemSet);

        var a3 = addEdgesToCy(cy, twoItemSet);
        
        var threeItemSet = itemSet.make3ItemSetFrom1ItemSet(oneItemSet);
        var a4 = addItemSetToCy(cy, threeItemSet);
        var a5 = addEdgesToCy(cy, threeItemSet);
        console.log(threeItemSet);

        cy.layout({
            name: 'breadthfirst'
        });
    }]);