pragma solidity ^0.4.0;

contract MyContract {
    struct Candidate {
        uint voteCount;
    }
    
    mapping(uint => Candidate) public candidates;
    
    
    uint public electionEnd;
    uint public nbrCandidates;
    bool public ended;
	
	
	modifier onlyBefore(uint _time) { require(now < _time); _; }
    modifier onlyAfter(uint _time) { require(now > _time); _; }
	event Winner(uint candidate_number, uint vote_count);
	
	function vote(uint _candidate) public payable {
	    require(now <= electionEnd);
	    require(!ended);
		candidates[_candidate].voteCount++;
	}
	
	
	function MyContract(uint _electionTime, uint _nbr_candidates) public {
	    uint i = 0;
	    while (i++ < _nbr_candidates) {
            candidates[i].voteCount=0;
        }
        nbrCandidates = _nbr_candidates;
		electionEnd = now + _electionTime;
		
	}
	
	//fallback
	function () public payable {
	
	}
	
	function electionEnd() payable onlyAfter(electionEnd){
	    
        require(now >= electionEnd); // election did not yet end
        ended = true;
        //ElectionEnded();
        winningCandidate();
        
    }
    
    function electionEndManually() public payable{
	    
        ended = true;
        winningCandidate();
        
    }
    
    function winningCandidate() payable{
        uint i =0;
        uint winnerIndex;
        uint winnerVotes;
        while (i++ < nbrCandidates){
            if(candidates[i].voteCount > candidates[i++].voteCount){
                winnerIndex = i;
                winnerVotes = candidates[i].voteCount;
            } 
        }
        
        Winner(winnerIndex, winnerVotes);
        
    }
    

	
}