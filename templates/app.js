var app = angular.module('myApp', ['pascalprecht.translate']);

app.config(function ($translateProvider) {

  	$translateProvider.useStaticFilesLoader({
        files: [
        {
          prefix: 'translate/',
          suffix: '.translate.json'
        },
        {
          prefix: 'translate/identical/',
          suffix: '.translate.json'
        }
        ]
      });
      
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters').preferredLanguage('zh');
});

app.run(['$rootScope', function($rootScope) {
    $rootScope.lang = 'en';
}]);

app.controller('Ctrl', function ($scope, $rootScope, $translate) {
	$scope.message = "message01";
    $scope.i = 0;
	$scope.changeLanguage = function () {
        $scope.i += 1;
        if (($scope.i%2)==0) {
            $rootScope.lang = 'en';
        }
        else {
            $rootScope.lang = 'zh';
        }
        $translate.use($rootScope.lang);
    };
});