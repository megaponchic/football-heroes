/**
 * @fileOverview Main js file of web application that showes some football statistics in a nice way
 * @author Artem Panchoyan
 * @copyright Artem Panchoyan
 * @license http://opensource.org/licenses/MIT MIT License
 * @version 0.0.1
 * 
 */
(function ($) {

    'use strict';

    /**
     * Some default properties
     * 
     * @type {Object}
     */
    var defaults = {

        /**
         * Base URL to fetch football.db data
         * 
         * @type {String}
         */
        baseUrl: 'http://footballdb.herokuapp.com/api/v1'
    };

    /**
     * @namespace API to interact with football.db service 
     * @type {Object}
     */
    var API = {

        /**
         * Get all teams (countries with description) that qualified in the contest
         * 
         * @param  {String} key Contest key
         * @example getting world cup 2014 teams
         * var wc2014teams = [];
         * API.getTeams('world.2014').then(function(data) {
         *     wc2014teams = data.teams;
         * });
         * @example
         * @return {jqXHR} Promise-like object that will resolve with teams for the contest
         * https://github.com/openfootball/api/blob/master/TEAMS.md
         */
        getTeams : function (key) {
            var promise;

            promise = $.ajax({
                url: defaults.baseUrl + '/event/' + key + '/teams/',
                crossDomain: true,
                dataType: 'jsonp'
            });

            return promise;
        },

        /**
         * List all games in a round for an event
         * 
         * @param  {String} key   Contest key
         * @param  {Number} round Round number
         * @return {jqXHR} Promise-like object that will resolve with teams for the contest
         * @example
         * var wc2014round;
         * API.getRound('world.2014', 20).then(function(data) {
         *     wc2014round = data.round;
         * });
         * @example
         */
        getRound : function (key, round) {
            var promise;

            promise = $.ajax({
                url: defaults.baseUrl + '/event/' + key + '/round/' + round,
                crossDomain: true,
                dataType: 'jsonp'
            });

            return promise;
        }
    };

    /**
     * once dom is loaded the main app launches and shows results of world cup 2014
     * @private
     */
    $(document).ready(function () {

        var wc2014rounds = [];
        var wc2014playOffRounds = [];
        var roundsPromises = [];
        var worldCupRoundsNumber = 20;
        
        // each round info is a separate call to web-service
        // wrapping all in promises and will work after all resolved
        for (var i = worldCupRoundsNumber; i >= 1; i--) {
            var roundPromise = API.getRound('world.2014', i).then(function (data) {
                wc2014rounds.push(data);
            }, function (jqXHR, textStatus, errorThrown) {
                // TODO: implement failed request
            });
            roundsPromises.push(roundPromise);
        }

        // when all rounds info fetched
        $.when.apply($, roundsPromises).then(function() {
            $('.loader').hide();

            // get only play-offs and assign the divs to each round
            wc2014playOffRounds = wc2014rounds.filter(function(el) {
                if (el.round.pos === 16) {
                    el.round.divs = [1,7];
                    return true;
                } else if (el.round.pos === 17) {
                    el.round.divs = [2,6];
                    return true;
                } else if (el.round.pos === 18) {
                    el.round.divs = [3,5];
                    return true;
                } else if (el.round.pos === 20) {
                    el.round.divs = [4,4];
                    return true;
                }
            });

            // iterate over rounds and show results
            for (var i = wc2014playOffRounds.length - 1; i >= 0; i--) {
                for (var j = wc2014playOffRounds[i].games.length - 1; j >= 0; j--) {
                    
                    var scoreString1,
                        scoreString2;

                    // victory can be with penalty kicks so score results are complex
                    if (wc2014playOffRounds[i].games[j].score1ot) {
                        scoreString1 = wc2014playOffRounds[i].games[j].score1ot;
                        scoreString2 = wc2014playOffRounds[i].games[j].score2ot;

                        if (wc2014playOffRounds[i].games[j].score1p) {
                            scoreString1 += '&nbsp;' + '(' + wc2014playOffRounds[i].games[j].score1p + ')';
                            scoreString2 += '&nbsp;' + '(' + wc2014playOffRounds[i].games[j].score2p + ')';
                        }
                    } else {
                        scoreString1 = wc2014playOffRounds[i].games[j].score1;
                        scoreString2 = wc2014playOffRounds[i].games[j].score2;

                    }

                    var roundTemplate = '<div class="round-info-wrapper"><div class="round-info">' + 
                            wc2014playOffRounds[i].games[j].team1_code + '&nbsp;&ndash;&nbsp;' + 
                            wc2014playOffRounds[i].games[j].team2_code + 
                            '</div>' + 
                            '<div class="round-info">' + 
                            scoreString1 + '&nbsp;&ndash;&nbsp;' + scoreString2 + 
                            '</div></div>';

                    if (j < wc2014playOffRounds[i].games.length/2) {
                        $('.round:nth-child(' + wc2014playOffRounds[i].round.divs[0] + ')')
                            .append(roundTemplate);
                    } else {
                        $('.round:nth-child(' + wc2014playOffRounds[i].round.divs[1] + ')')
                            .append(roundTemplate);
                    }
                    
                };
            };
        }, function(e) {
            console.log("Failed to fetch rounds");
        });
    });
    
})(jQuery);