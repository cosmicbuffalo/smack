module.exports = function (app) {

    app.controller('sidebarController', ['$scope', 'teamFactory', 'userFactory','channelFactory', '$cookies', function ($scope, teamFactory, userFactory, channelFactory, $cookies) {
        $scope.team = {};
        $scope.channels = [];
        $scope.directMessages = [];
        $scope.persona = null;
        console.log('jfdklfjdskalfjdaslfjkldsa', $scope.persona)
        $scope.channelType = false;
        $scope.publicOrPrivate = ""
        $scope.publicOrPrivateDesription = "Anyone on your team can view and join this channel"



        function setPersona(data){
            $scope.persona = data
        }

        var personaId = $cookies.get('currentPersonaId')
        
        userFactory.getPersona(personaId, setPersona)

        function setTeamInScope(data) {
            console.log('SET TEAM IN SCOPE DATA', data)
            $scope.team = data
        }

        if ($cookies.get('currentTeamURL')) {
            console.log("Found team URL in cookies: ", $cookies.get('currentTeamURL'))
            teamFactory.findTeam({ url: $cookies.get('currentTeamURL') }, false, false, setTeamInScope)
        }


        $scope.clicked = function (channelObj) {
            channelObj.private = $scope.channelType
            channelObj.personaId = userFactory.personaIdLogin
            channelFactory.createChannel(teamFactory.team._id, channelObj, reloadTeam, modalCloser)

            
        }
        var modalCloser = function () {
            $('#addChannelModal').modal('hide');
    }

        function reloadTeam(){
            console.log("RELOADING TEAMMMMMMM!!!!!")
            teamFactory.getTeam({ url: $cookies.get('currentTeamURL') }, false, false, setTeamInScope)
        }




        var checkboxListener = function(value) {
            $scope.channelType = value
            if ($scope.channelType) {
                $scope.publicOrPrivate = ""
                $scope.publicOrPrivateDesription = "Anyone on your team can view and join this channel"
            } else {

                $scope.publicOrPrivate = "private"
                $scope.publicOrPrivateDesription = "This channel can only be joined or viewed by invite"
            }
            console.log($scope.publicOrPrivate)

        }

        $(document).ready(function () {
            $("#channel-option").change(function () {
                checkboxListener($(this).prop('checked'))

            })
        })


    }])

    $(function () {
        $('#channel-option').bootstrapToggle({
            on: 'Private',
            off: 'Public'
        });
    })





}