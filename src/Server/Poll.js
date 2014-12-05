//		choices fotma:
//			choices = {	5: {name: 'test', count:0},
//					1: {name: 'object', count:0},
//					... 
//					}

var Poll = function(id, choices, server, pollRoomId){
	
	// save user vote
	this.vote = function(id){
		if(this.choices[id].count){
			this.choices[id].count ++;
		}else{
			this.choices[id].count = 1;
		}
	};
	
	// change user vote
	this.changeVote = function(newId, oldId){
		this.choices[oldId].count--;
		this.vote(newId);
	};

	// get the poll results
	this.getResult = function(){
		keys = Object.keys(this.choices);
		if(!this.choices[keys[0]].count){
			this.choices[keys[0]].count = 0;
		}
		max = this.choices[keys[0]].count;
		resultsList = [this.choices[keys[0]]];
		console.log("~~~~~~~~~~~~~~~~~~~~");
		console.log(this.choices);	
		console.log(max);
		console.log(resultsList);
		for(var i=1; i<keys.length; i++){
			console.log(this.choices[keys[i]]);
			if(!this.choices[keys[i]].count){
				this.choices[keys[i]].count = 0;
			}
			if(this.choices[keys[i]].count > max){
				max = this.choices[keys[i]];
				resultsList = [this.choices[keys[i]]]
			}
			if(this.choices[keys[i]].count == max){
				console.log('equal');
				resultsList.push(this.choices[keys[i]]);
			}
		}
		resIndex = Math.floor(Math.random() * resultsList.length);
		console.log(resultsList);
		return resultsList[resIndex];
	};

	// close poll
	this.closePoll = function(){
		this.pollStatus = 'close';
	};

	this.pollId = id;
	this.choices = choices;
	this.pollStatus = 'voting';
	this.server = server;
	this.pollRoomId = pollRoomId;	
	console.log('created poll '+id);		
	this.server.to(this.pollRoomId).emit('startPoll',choices);
};

module.exports = Poll;
