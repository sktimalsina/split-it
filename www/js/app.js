// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('ExpenseController', function($scope, $http, $ionicModal, $filter){
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";


        var urlHome = "http://projects.suniltimalsina.com";
        $http.get(urlHome + "/fetch.php")
            .success(function(response){
                $scope.Expenses = response;
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
                transaction_id: "0",
                user_id: "001",
                user_name: "Ram Prasad",
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

        //Open our new transaction modal

        $scope.addTransaction = function() {
          $scope.transactionModal.show();
        };

        //Close the new transaction modal
        $scope.closeNewTransaction = function(){
            $scope.transactionModal.hide();
        };

    $scope.Users = [
        {
            id: 123,
            name: 'Ram Prasad'
        },
        {
            id : 007,
            name: 'Shyam prasad'
        }
    ];
    $scope.GetNameFromId = function(searchID){
        console.log('Searching for '+ searchID);

        for(i = 0; i<$scope.Users.length; i++)
        {
            if($scope.Users[i].id === searchID){
                return $scope.Users[i].name;
            }
        }
    };

    $scope.GetCurrentUserID = function(){
        /* TODO : make this to return actual ID*/
        return 007;
    }
  });

