app.factory('DisplayFactory', function() {
	var rightBox = document.getElementById('baseline');
	return {
		baseline: function(left, right, mouth) {
			document.getElementById('baseline').innerHTML = "Base Left: [" + left.toFixed(1) + "]" + "  Base Right: [" + right.toFixed(1) + "]" + "  Mouth: [" + mouth.toFixed(1) + "]";
		},
		area: function(left, right, mouth) {
			document.getElementById('areaRight').innerHTML = "Right: [" + right.toFixed(1) + "]";
            document.getElementById('areaLeft').innerHTML = "Left: [" + left.toFixed(1) + "]";
            document.getElementById('mouth').innerHTML = "Mouth: [" + mouth.toFixed(1) + "]";
		},
		highlight: function(id) {

		},
		removeHighlight: function(id) {
			document.getElementById(id).removeClass("list-group-item-success");
		}

	}
})