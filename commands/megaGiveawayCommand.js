/**
 * megaGiveaway.js
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

     /*
     * @function generateEntryList
     */
    function generateEntryList(points) {
        var entries = [];
        for (i in points) {
            var userPoints = Number($.inidb.GetString('points', '', points[i]));
            // Not the most efficient way for tables with a lot of users & points
            // TODO: use offset ranges for each user
            //    [{offset: 0, username: kappa}, {offset: 25, username: glitch}]
            // TODO: exclude bots.txt users from being added to the array.
            for ( j = 0; j < userPoints; j++) {
                entries.push(points[i]);
            }
        }
        return entries;
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

            var entries = generateEntryList(points);
            var totalEntries = entries.length;
            var winners = [];
            for (i = 0; i < numWinners; i++) {
                var winningNumber = Math.round(Math.random() * totalEntries);
                winners.push(entries[winningNumber]);
                entries.splice(winningNumber, 1);  //removes winning entry from raffle
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