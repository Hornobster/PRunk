//		choices fotma:
//			choices = {	5: {name: 'test', count:0},
//					1: {name: 'object', count:0},
//					... 
//					}

var Poll = function(id, choices, server, pollRoomId){
	
	// save user vote
	this.vote = function(id){
		console.log('voted '+id);
		if(this.choices[id].count){
			this.choices[id].count ++;
		}else{
			this.choices[id].count = 1;
		}
	};
	
	// change user vote
	this.changeVote = function(newId, oldId){
		this.choices[oldId].count --;
		this.vote(newId);
	};

	// get the poll results
	this.getResult = function(){
		keys = Object.keys(this.choices);
		max = this.choices[keys[0]];
		keys.forEach(function(element, id, list){
			if(this.choices[elemen].count && this.choices[element].count > max.count){
				max = this.choices[element];
			}
		});
		return max;
	};

	// close poll
	this.closePoll = function(){
		this.pollStatus = 'close';
		this.server.to(this.pollRoomId).emit('test','close');
	};

	this.id = id;
	this.choices = choices;
	this.pollStatus = 'voting';
	this.server = server;
	this.pollRoomId = pollRoomId;
	this.server.to(this.pollRoomId).emit('test',choices);
};

module.exports = Poll;
