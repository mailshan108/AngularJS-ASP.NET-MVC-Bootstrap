var app = angular.module('BSFinancialApp', [
    'ngRoute',
     'ngSanitize',
    'ngBootbox',
    'LocalStorageModule',
    'angular-loading-bar',
    'angular-ladda',
    'angularValidator',
    'toastr',
    'datatables',
    'ui.bootstrap',
    'ui.select'
]);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html"
    });

    $routeProvider.when("/inquirylist", {
        controller: "inquiryController",
        templateUrl: "/app/views/inquiry/inquiryList.html"
    });

    $routeProvider.when("/newinquiry", {
        controller: "newInquiryController",
        templateUrl: "/app/views/inquiry/newInquiryView.html"
    });
    $routeProvider.when("/newinquirysucc", {
        templateUrl: "/app/views/inquiry/newInquirySucc.html"
    });

    $routeProvider.when("/inquiry/:id", {
        controller: "singleInquiryController",
        templateUrl: "/app/views/inquiry/singleInquiryView.html"
    });

    $routeProvider.when("/loanlist", {
        controller: "loanController",
        templateUrl: "/app/views/loan/loanList.html"
    });
    $routeProvider.when("/newloan", {
        controller: "editLoanController",
        templateUrl: "/app/views/loan/loanAdd.html",
        resolve: {
            action: function () {
                return "add";
            }
        }
    });

    $routeProvider.when("/editloan/:id", {
        controller: "editLoanController",
        templateUrl: "/app/views/loan/loanAdd.html",
        resolve: {
            action: function () {
                return "edit";
            }
        }
    });

    $routeProvider.when("/applicantlist", {
        controller: "applicantController",
        templateUrl: "/app/views/applicant/applicantList.html"
    });
    $routeProvider.when("/newapplicant", {
        controller: "newApplicantController",
        templateUrl: "/app/views/applicant/applicantAdd.html"
    });

    $routeProvider.when("/editapplicant/:id", {
        controller: "editApplicantController",
        templateUrl: "/app/views/applicant/applicantAdd.html"
    });

    $routeProvider.when("/applicationlist", {
        controller: "applicationController",
        templateUrl: "/app/views/application/applicationList.html"
    });
    $routeProvider.when("/newapplication", {
        controller: "newApplicationController",
        templateUrl: "/app/views/application/applicationAdd.html"
    });

    $routeProvider.when("/editapplication/:id", {
        controller: "editApplicationController",
        templateUrl: "/app/views/application/applicationAdd.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });
});

var serviceBase = 'http://localhost:3242/';
//var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);