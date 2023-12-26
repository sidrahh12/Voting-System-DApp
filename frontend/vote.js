
window.onload = function() {  
var candidates = [
   { id: 1, name: 'Candidate 1', votes: 0 },
   { id: 2, name: 'Candidate 2', votes: 0 },
   { id: 3, name: 'Candidate 3', votes: 0 }
 ];
 
 // Display candidates
var candidatesDiv = document.getElementById('candidates');
candidates.forEach(function(candidate) {
 var candidateDiv = document.createElement('div');
 candidateDiv.className = 'candidate';
 candidateDiv.innerHTML = '<label for="candidate' + candidate.id + '">' + candidate.name + '</label><input type="radio" id="candidate' + candidate.id + '" name="candidate" value="' + candidate.id + '">';
 candidatesDiv.appendChild(candidateDiv);
});

// Append vote button after all candidates
var voteButton = document.createElement('button');
voteButton.id = 'vote';
voteButton.innerHTML = 'Vote';
candidatesDiv.appendChild(voteButton);

 
 // Handle vote button click
document.getElementById('vote').addEventListener('click', function() {
   var selectedCandidateId = document.querySelector('input[name="candidate"]:checked').value;
   var selectedCandidate = candidates.find(function(candidate) {
       return candidate.id == selectedCandidateId;
   });
   selectedCandidate.votes++;
  
   // Display result
   var resultDiv = document.getElementById('result');
   var winner = candidates.reduce(function(prev, current) {
       return (prev.votes > current.votes) ? prev : current;
   });
   resultDiv.innerHTML = 'The leading candidate is: ' + winner.name;
  });
}