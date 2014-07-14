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
        baseUrl: 'http://footballdb.herokuapp.com/'
    }

    /**
     * @namespace API to interact with football.db service 
     * @type {Object}
     */
    var API = {

        /**
         * get all teams (countries with description) that qualified in the contest
         * @param  {String} key contest key
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
            return promise = $.ajax({
                url: defaults.baseUrl + '/event/' + key + '/teams'
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