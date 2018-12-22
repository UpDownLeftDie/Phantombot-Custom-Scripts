/**
 * megaGiveawayCommand.js
 *
 * This command will run a raffle with everyone entered with all their points
 *
 * Current version 1.0.0
 *
 * Original author: UpDownLeftDie (Jared)
 *
 * Contributors:
 * Dakoda
 */

(function() {

    function isTwitchBot(bots, username) {
        for (var i in bots) {
            if (bots[i].equalsIgnoreCase(username)) {
                return true;
            }
        }
        return false;
    }

    /*
    * @function generateEntryList
    */
    function generateEntryList(points) {
        var totalEntires = 0;
        var entries = [];
        var bots = $.readFile('./addons/ignorebots.txt');
        for (i in points) {
            if(!isTwitchBot(bots, points[i])) {
                var userPoints = Number($.inidb.GetString('points', '', points[i]));
                totalEntires += userPoints;
                entries.push({ offset: totalEntires, userName: points[i] });
            }
        }
        return { totalEntires: totalEntires, entries: entries };
    }

    /*
    * @function pickWinner
    */
   function pickWinner(entries, winningNumber) {
    var winner;
    var winnerEntriesCount = 0;
    for(i = 0; i < entries.length; i++) {
        if (winner) {
            // Move all entires back to fill in gap
            entries[i].offset -= winnerEntriesCount;
        } else if (entries[i].offset >= winningNumber) {
            winner = entries[i].userName;
            // calulate how many entries the winner had
            winnerEntriesCount = entries[i].offset;
            if (i > 0) winnerEntriesCount -= entries[i-1].offset;
            // remove the winner from the pool so they can't win a second time
            entries.splice(i, 1);
            // account for them being removed
            i--;
        }
    }
    return winner;
}

   /**
    * @event command
    */
   $.bind('command', function(event) {
       var command = event.getCommand(),
           args = event.getArgs(),
           numWinners = args[0] || 1;

       if (command.equalsIgnoreCase('megagiveaway')) {
           var points = $.inidb.GetKeyList('points', '');
           var totalUsers = points.length || 0;

           var giveawayObj = generateEntryList(points);
           var entries = giveawayObj.entries;
           if (numWinners > entries.length) numWinners = entries.length;
           var totalEntries = giveawayObj.totalEntires;

           var winners = [];
           for (pick = 0; pick < numWinners; pick++) {
               // max entires to pick form changes with each winner
               var max = entries[entries.length - 1].offset;
               var winningNumber = Math.round(Math.random() * max);
               winners.push(pickWinner(entries, winningNumber));
           }
           var winnerStr = 'The winner is: @';
           if (winners.length > 1) winnerStr = 'The winners are: @';
           winnerStr += winners.join(', @');

           $.say('Picking a winner from ' + totalUsers + ' users and ' + totalEntries + ' total entries!');
           $.say(winnerStr);

       }
   });

   /**
    * @event initReady
    */
   $.bind('initReady', function() {
       $.registerChatCommand('./custom/megaGiveawayCommand.js', 'megagiveaway', 1);
   });
})();