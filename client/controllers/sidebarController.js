module.exports = function (app) {

    app.controller('sidebarController', ['$scope', 'teamFactory', 'userFactory', '$cookies', function ($scope, teamFactory, userFactory, $cookies) {
        $scope.team = {};
        $scope.channels = [];
        $scope.directMessages = [];


        function setTeamInScope (data){
            $scope.team = teamFactory.team
        }

        if ($cookies.get('currentTeamURL')) {
            console.log("Found team URL in cookies: ", $cookies.get('currentTeamURL'))
            teamFactory.findTeam({ url: $cookies.get('currentTeamURL') }, setTeamInScope)
        }







    }])







}