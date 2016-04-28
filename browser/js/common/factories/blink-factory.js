app.factory('BlinkFactory', function() {
	var charArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var index = 0
    return {
        displayLeft: function(X, Y, diff) {
            document.getElementById('singleLeft').innerHTML = "Left Eye: [" + X + "," + Y + "]";
            document.getElementById('leftDiff').innerHTML = "Delta Left: [" + diff + "]";
        },
        displayRight: function(X, Y, diff) {
            document.getElementById('singleRight').innerHTML = "Right Eye: [" + X + "," + Y + "]";
            document.getElementById('rightDiff').innerHTML = "Delta Right: [" + diff + "]";
        },
        debounceLeft: function() {
            return setTimeout(function() {
                console.log('************LeftReset');
                document.getElementById('blinkLeft').innerHTML = '';
                return true;
            }, 1000);
        },
        debounceRight: function() {
            return setTimeout(function() {
                console.log('************RightReset');
                document.getElementById('blinkRight').innerHTML = '';
                return true;
            }, 600);
        },
        moveLetter: function() {
        	if(index === 25) {
        		index = 0;
        	}
        	console.log('letter', charArray[index]);
        	document.getElementById('current-letter').innerHTML = charArray[index].toUpperCase();
        	index++;
        }
    }
})