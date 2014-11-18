var Poll = function(id, choices){
	
	this.vote = function(id){
		if(this.choices[id].count){
			this.choices[id].count ++;
		}else{
			this.choices[id].count = 1;
		}
	};

	this.changeVote = function(newId, oldId){
		this.choices[oldId] --;
		this.vote(newId);
	};

	this.getResult = function(){
		keys = Object.keys(this.choices);
		max = this.choices[keys[0]];
		keys.forEach(function(element, id, list){
			if(this.choices[element].count > max.count){
				max = this.choices[element];
			}
		});
		return max;
	};

	this.id = id;
	this.choices = choices;
};

module.exports = Poll;
