
// Paging util.
exports.pager = function(list, start, end, callBack){
	for (i=start; i<=end; i++) {
		// Prevent looping through items not in the object.
		if(list[i]){
			callBack(i, list[i]);
		}
	}
};

// Arry to object with defined keys.
exports.decorate = function(obj, model, key, key2){
	
	var newObj = [];

	for (var prop in obj) {
		newObj[prop] = obj[prop];
		newObj[prop][key] = model[prop][key2];
	}
   
	return newObj;
};

// Arry to object with defined keys.
exports.groupCount = function(array, key){
	
	var group = {};
	
	array.forEach(function(d, i){
		
		var keyName = d[key];
		
		if(group[keyName]){
			group[keyName].count++;
		} else {
		
			group[keyName] = {
				count: 1,
				key: keyName
			};
		}
	});

	return group;
};

// Arry to object with defined keys.
exports.arrayToObj = function(array, key){
	
	var obj = {};
	
	array.forEach(function(d, i){
	
		if(d[key]){
			obj[d[key]] = d;
		}
	});
	
	return obj;
};

// Re-maps object.
exports.map = function(obj, map){
	
	var newObj = {};
	
	obj.forEach(function(d, i){
	
		if(i === map.old){
			newObj[map.new] = d;
		}
	});
	
	return newObj;
};