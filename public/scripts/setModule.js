angular.module('setModule', [])
    .factory('Set', [function() {
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

        Set.union = function(a) {
            var first = a[0];

            for (var i = 1; i < a.length; i++) {
                first = first.union(a[i]);
            }

            return first;
        };

        return Set;
    }])
    .factory('WeightedSet', ['Set', function(Set) {
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

        return WeightedSet;
    }])

.factory('itemSetOps', ['Set', 'WeightedSet', 'arrayHelper', function(Set, WeightedSet, arrayHelper) {
    function generateSource(x, y, z) {
        var a = Array.prototype.slice.call(arguments);
        var res = [];

        for (var i = a.length - 1; i >= 0; i--) {
            res.push(Set.union(a.slice(0).splice(i, 1)).toString());
        }

        return res;
    }

    function generateSourceFor(lowerLevel, upperLevel) {
        for (var item in lowerLevel.elements) {
            var lowerArray = arrayHelper.fromSetElement(item);

            for (var upperItem in upperLevel.elements) {
                var upperArray = arrayHelper.fromSetElement(upperItem);

                if (arrayHelper.contains(lowerArray, upperArray)) {
                    lowerLevel.elements[item].source.push(upperItem);
                }
            }
        }
    }

    function noSameSet(sets) {
        for (var i = 0; i < sets.length; i++) {
            for (var j = i + 1; j < sets.length; j++) {
                if (sets[i].equals(sets[j])) {
                    return false;
                }
            }
        }

        return true;
    }

    function countWeight(baskets, union) {
        var count = 0;

        for (var i = 0; i < baskets.length; i++) {
            if (arrayHelper.contains(baskets[i], union.toArray())) {
                count++;
            }
        }

        return count;
    }

    function makeSet(baskets, weightSet, xx, yy) {
        var a = Array.prototype.slice.call(arguments);

        weightSet = a[1];
        var sets = a.slice(2);

        if (noSameSet(sets)) {
            var union = Set.union(sets);
            weightSet.elements[union.toString()] = {
                weight: countWeight(baskets, union),
                source: []
            };
        }
    }

    return {
        generateSourceFor: generateSourceFor,
        make1ItemSetFrom2dList: function(list) {
            var set = new WeightedSet();

            for (var i = 0; i < list.length; i++) {
                set = set.union(new WeightedSet(list[i]))
            }

            return set;
        },

        make1ItemSetFrom1ItemSet: function(oneItemSet) {
            var ws = new WeightedSet();

            for (var x in oneItemSet.elements) {
                var xx = oneItemSet.subSet(x).toSet();

                ws.elements[xx.toArray()[0]] = {
                    weight: oneItemSet.elements[x],
                    source: []
                };
            }

            return ws;
        },

        make2ItemSetFrom1ItemSet: function(oneItemSet, baskets) {
            var ws = new WeightedSet();

            for (var x in oneItemSet.elements) {
                var xx = oneItemSet.subSet(x).toSet();
                for (var y in oneItemSet.elements) {
                    var yy = oneItemSet.subSet(y).toSet();

                    makeSet(baskets, ws, xx, yy);
                }
            }

            return ws;
        },

        make3ItemSetFrom1ItemSet: function(oneItemSet, baskets) {
            var ws = new WeightedSet();
            for (var x in oneItemSet.elements) {
                var xx = oneItemSet.subSet(x).toSet();
                for (var y in oneItemSet.elements) {
                    var yy = oneItemSet.subSet(y).toSet();

                    if (xx.equals(yy)) {
                        continue;
                    }

                    for (var z in oneItemSet.elements) {
                        var zz = oneItemSet.subSet(z).toSet();

                        makeSet(baskets, ws, xx, yy, zz);
                    }
                }
            }

            return ws;
        },

        make4ItemSetFrom1ItemSet: function(oneItemSet, baskets) {
            var ws = new WeightedSet();
            for (var x in oneItemSet.elements) {
                var xx = oneItemSet.subSet(x).toSet();
                for (var y in oneItemSet.elements) {
                    var yy = oneItemSet.subSet(y).toSet();

                    if (xx.equals(yy)) {
                        continue;
                    }

                    for (var z in oneItemSet.elements) {
                        var zz = oneItemSet.subSet(z).toSet();

                        if (xx.equals(zz) || yy.equals(zz)) {
                            continue;
                        }

                        for (var w in oneItemSet.elements) {
                            var ww = oneItemSet.subSet(w).toSet();

                            makeSet(baskets, ws, xx, yy, zz, ww);
                        }
                    }
                }
            }

            return ws;
        },
        make5ItemSetFrom1ItemSet: function(oneItemSet, baskets) {
            var ws = new WeightedSet();
            for (var x in oneItemSet.elements) {
                var xx = oneItemSet.subSet(x).toSet();
                for (var y in oneItemSet.elements) {
                    var yy = oneItemSet.subSet(y).toSet();

                    if (xx.equals(yy)) {
                        continue;
                    }

                    for (var z in oneItemSet.elements) {
                        var zz = oneItemSet.subSet(z).toSet();

                        if (xx.equals(zz) || yy.equals(zz)) {
                            continue;
                        }

                        for (var w in oneItemSet.elements) {
                            var ww = oneItemSet.subSet(w).toSet();

                            if (xx.equals(ww) || yy.equals(ww) || zz.equals(ww)) {
                                continue;
                            }

                            for (var v in oneItemSet.elements) {
                                var vv = oneItemSet.subSet(v).toSet();

                                makeSet(baskets, ws, xx, yy, zz, ww, vv);
                            }
                        }
                    }
                }
            }

            return ws;
        },

        make6ItemSetFrom1ItemSet: function(oneItemSet, baskets) {

            var ws = new WeightedSet();
            for (var x in oneItemSet.elements) {
                var xx = oneItemSet.subSet(x).toSet();
                for (var y in oneItemSet.elements) {
                    var yy = oneItemSet.subSet(y).toSet();

                    if (xx.equals(yy)) {
                        continue;
                    }

                    for (var z in oneItemSet.elements) {
                        var zz = oneItemSet.subSet(z).toSet();

                        if (xx.equals(zz) || yy.equals(zz)) {
                            continue;
                        }

                        for (var w in oneItemSet.elements) {
                            var ww = oneItemSet.subSet(w).toSet();

                            if (xx.equals(ww) || yy.equals(ww) || zz.equals(ww)) {
                                continue;
                            }

                            for (var v in oneItemSet.elements) {
                                var vv = oneItemSet.subSet(v).toSet();

                                if (!noSameSet([xx, yy, zz, ww, vv])) {
                                    continue;
                                }

                                for (var u in oneItemSet.elements) {
                                    var uu = oneItemSet.subSet(u).toSet();

                                    makeSet(baskets, ws, xx, yy, zz, ww, vv, uu);
                                }
                            }
                        }
                    }
                }
            }

            return ws;
        },
        
        makeSupperItemSetFrom: function (subItemSet, baskets){
            var ws = new WeightedSet();
            
            for(var x in subItemSet.elements){
                var xx = subItemSet.subSet(x).toSet();
                console.log(xx);
                for (var y in subItemSet.elements){
                    var yy = subItemSet.subSet(y).toSet();
                    console.log(yy);
                    
                    makeSet(baskets, ws, xx, yy);
                }
            }
            
            return ws;
        }
    };
}]);