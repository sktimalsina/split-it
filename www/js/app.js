// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('home', {
            url: '/expenseList',
            templateUrl: 'templates/expenses.html',
            controller: 'ExpenseController'
        });
    $urlRouterProvider.otherwise('/expenseList');
})
.controller('LoginController', function($scope, $location, $ionicHistory){
    $scope.login = function(username, password) {
        window.localStorage.setItem("username", username);
        window.localStorage.setItem("password", password);
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $location.path("/protected");
    }
})
.controller('ExpenseController', function($scope, $http, $ionicModal, $filter, $ionicHistory, $location){
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        //Checking if username and password is saved
        var userName = window.localStorage.getItem("username");
        var userPassword = window.localStorage.getItem("password");

        console.log("Username:"+userName+" , password: "+userPassword);
        if(userPassword === "undefined" || userPassword === null) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            console.log("No password is saved in local storage!");
            $location.path("/login");
        }

        if(userName === "undefined" || userName === null) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            console.log("No username is saved in local storage!");
            $location.path("/login");
        }

        var urlHome = "http://projects.suniltimalsina.com";
        $http.get(urlHome + "/fetch.php")
            .success(function(response){
                $scope.Users = response.users;
                $scope.Expenses = response.data;
            }).
            error(function(response){
                console.log("Error:"+response);
            });

    $scope.transactions = [];

        //Create and load the Modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal){
            $scope.transactionModal = modal;
        }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

        //Called when the form is submitted

        $scope.saveTransaction = function(transaction){
            var newData = {
                user_id: ""+$scope.GetCurrentUserID(),
                user_name: ""+$scope.GetCurrentUserName(),
                paid_to: ""+transaction.paid_to,
                date:  $filter('date')(transaction.date, "yyyy-MM-dd"),
                amount: ""+transaction.amount,
                detail: ""+transaction.detail
            };
            $http.post(urlHome + "/submit.php", newData).
                success(function(data, status, headers, config){
                    console.log('Success data submission! Data:'+data);
                }).
                error(function(data, status, headers, config){
                    console.error('Data submission failed');
                });
            $scope.Expenses.push(newData);
            $scope.transactionModal.hide();
            transaction.user_id = "";
        };

  });

