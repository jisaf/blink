app.factory('BlinkFactory', function() {
    var charArray = ['XX','_','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var letterObj = {
        prev: 'XX',
        current: '_',
        next: 'A'
    }
    var index = 2;
    var rightArray = [23,63,24,64,25,65,26,66];
    var leftArray = [28,67,29,68,30,69,31,70];
    var browArray = [20,21,17,16];
   // var rightArea = [63, 66, 64, 65];
    return {
        displayLeft: function(X, Y, diff) {
 
        },
        displayRight: function(X, Y, diff) {

        },
        debounceLeft: function() {
           
        },
        browPosition: function(positions) {
            var browTotal = 0
            browArray.forEach(function(point) {
                browTotal += positions[point][1]
            })
            return browTotal
        },
        percentChange: function(leftZero, rightZero, browZero, positions) {
            var leftTotal = 0;
            var rightTotal = 0;
            var browTotal = 0;
            var change = 0;
            leftArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - leftZero[i]) / leftZero[i]) * 100)
                leftTotal += change;
            })
            rightArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - rightZero[i]) / rightZero[i]) * 100)
                rightTotal += change;
            })
            browArray.forEach(function(point, i) {
                change = Math.abs(((positions[point][1] - browZero[i]) / browZero[i]) * 100)
                browTotal += change;
            })
            return [leftTotal, rightTotal, browTotal];
        },
        shiftRight: function() {
            index++;
            if (index === charArray.length) {
                index = 0;
            }
            letterObj.prev = letterObj.current;
            letterObj.current = letterObj.next;
            letterObj.next = charArray[index];
            document.getElementById('prev').innerHTML = letterObj.prev
            document.getElementById('current').innerHTML = letterObj.current
            document.getElementById('next').innerHTML = letterObj.next
            return letterObj;
        },
        shiftLeft: function() {
            index--;
            if (index === -1) {
                index = charArray.length - 1;
            }
            letterObj.next = letterObj.current;
            letterObj.current = letterObj.prev;
            letterObj.prev = charArray[index];
            document.getElementById('prev').innerHTML = letterObj.prev
            document.getElementById('current').innerHTML = letterObj.current
            document.getElementById('next').innerHTML = letterObj.next
            return letterObj;
        },
        selectLetter: function(letter) {
            console.log("selecting letter: ", letterObj.current);
            return letterObj.current;
        },
        getAreaRight: function(positions) {
            var length = positions[63][1] - positions[64][1]
            var height = positions[64][1] - positions[65][1]
            var area = length * height;
            return area;
        },
        getAreaLeft: function(positions) {
            var length = positions[67][1] - positions[68][1]
            var height = positions[68][1] - positions[69][1]
            var area = length * height;
            //var top = positions[68][1] + positions[29][1] + positions[67][1];
            // var bottom = positions[69][1] + positions[31][1] + positions[70][1];
            return area;
            //return top;
        },
        getArea: function(positions, a, b, c, d) {
            var sideA = positions[a][1] - positions[b][1]
            var sideB = positions[c][1] - positions[d][1]
            return [sideA.toFixed(1), sideB.toFixed(1)];
        },
        mouthDistance: function(positions) {
            return  positions[57][1] - positions[60][1]
        }

    }
});








