/**
 * @fileOverview Main js file of web application that showed some football statistics in a nice way
 * @author Artem Panchoyan
 * @copyright Artem Panchoyan
 * @license http://opensource.org/licenses/MIT MIT License
 * @version 0.0.1
 * 
 */
'use strict';

(function($) {

    /**
     * Some default properties
     * @type {Object}
     */
    var defaults = {

        /**
         * Base URL to fetch football.db data
         * @type {String}
         */
        baseUrl: 'http://footballdb.herokuapp.com/api/v1'
    }

    /**
     * @namespace API to interact with football.db service 
     * @type {Object}
     */
    var API = {

        /**
         * Get all teams (countries with description) that qualified in the contest
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
        getTeams : function(key) {
            var promise;
            return promise = $.ajax({
                url: defaults.baseUrl + '/event/' + key + '/teams/',
                crossDomain: true,
                dataType: 'jsonp'
            });
        },

        /**
         * List all games in a round for an event
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
        getRound : function(key, round) {
            var promise;
            return promise = $.ajax({
                url: defaults.baseUrl + '/event/' + key + '/round/' + round,
                crossDomain: true,
                dataType: 'jsonp'
            });            
        }
    };

    $(document).ready(function() {

        var wc2014teams = [];
        var teamsPromise;
        
        teamsPromise = API.getTeams('world.2014').then(function(data) {
            wc2014teams = data.teams;
        }, function(jqXHR, textStatus, errorThrown) {
            // TODO: implement failed request
        })

        teamsPromise.then(function() {
            $('.teams').html('Fetched');
        });
    })
    
})(jQuery);