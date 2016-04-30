app.factory('BlinkFactory', function() {
    var charArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var letterObj = {
        prev: 'A',
        current: 'B',
        next: 'C'
    }
    var index = 2;
   // var rightArea = [63, 66, 64, 65];
    return {
        displayLeft: function(X, Y, diff) {
 
        },
        displayRight: function(X, Y, diff) {

        },
        debounceLeft: function() {
           
        },
        debounceRight: function() {
          
        },
        shiftRight: function() {
            index++;
            if (index === 26) {
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
                index = 25;
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
           // var top = positions[63][1] + positions[24][1] + positions[64][1];
            // var bottom = positions[66][1] + positions[26][1] + positions[65][1];
            //return top;
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








