pragma solidity ^0.4.0;

contract Election {

    uint public electionEnd;
    bool public ended;
	uint public candidateA;
	uint public candidateB;
	
	
	modifier onlyBefore(uint _time) { require(now < _time); _; }
    modifier onlyAfter(uint _time) { require(now > _time); _; }
	
	event ElectionEnded(uint A, uint B);
	
	function voteToA() public payable {
	    require(now <= electionEnd);
	    require(!ended);
		candidateA++;
	}
	
	function voteToB() public payable {
	    require(now <= electionEnd);
	    require(!ended);
		candidateB++;
	}
	
	function Election(uint _electionTime) public {
		candidateA = 0;
		candidateB = 0;
		electionEnd = now + _electionTime;
		
	}
	
	//fallback
	function () public payable {
	
	}
	
	function electionEnd() public payable onlyAfter(electionEnd) {
	    
        require(now >= electionEnd); // election did not yet end
        ended = true;
        ElectionEnded(candidateA, candidateB);
        
    }
    
    function electionEndManually() public payable {
	    
        ended = true;
        ElectionEnded(candidateA, candidateB);
        
    }

	
}