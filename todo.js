var todoApp = angular.module('todoApp', []);

todoApp
    .controller('TodoController', function($scope, $http) {
        'use strict';
        // get data from mongodb. 
        $http.get('https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn')
            .success(function(data, status, headers, config){

                $scope.todos = [];
                $scope.olds = [];
                //$scope.todos = data;

                angular.forEach(data, function(todo){
                    if (!todo.done) {
                        $scope.todos.push(todo);
                    } else {
                        $scope.olds.push(todo);
                    }
                });

                $scope.addTodo = function() {
                    //$scope.todos.push({text: $scope.todoText, done: false});
                    //$scope.todoText = '';                    
                    
                    $http.post('https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn', {text: $scope.todoText, done: false})
                        .success(function(data, status, headers, config) {
                            $scope.todos.push({text: $scope.todoText, done: false});
                            $scope.todoText = '';
                            //$scope.todos = data;
                        })
                        .error(function(data, status, headers, config) {
                            console.log('add new todo fail ...');
                        });                    
                };

                $scope.remaining = function() {
                    var count = 0;
                    angular.forEach($scope.todos, function(todo) {
                        count += todo.done ? 0 : 1;
                    });
                    return count;
                };
                // todo move to done.
                $scope.archive = function() {
                    var todos = $scope.todos;
                    //var oldTodos = $scope.todos;
                    //$scope.olds = [];
                    //$scope.todos = [];
                    angular.forEach(todos, function(todo) {
                        if (!todo.done) {
                            $scope.todos.push(todo);
                        } else {
                            // update db data.
                            var update = 'https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn&q={"text":"' + todo.text + '"}';
                            $http({
                                method: 'PUT',
                                url: update,
                                data: JSON.stringify({"$set" : {"done": true}}),
                                headers: { 'Content-Type': 'application/json' }
                            })
                            .success(function(data, status, headers, config) {
                                console.log(data);
                            })
                            .error(function(data, status, headers, config) {
                                console.log('error');
                            });
                            
                            $scope.olds.push(todo);                            
                        }
                    });
                    console.log($scope.old);
                };

                // done move to todo.
                $scope.undo = function() {
                    var olds = $scope.olds;

                    angular.forEach(olds, function(old) {
                        console.log(old);
                        if (!old.done) {
                            $scope.todos.push(old);
                            //$
                            //console.log()
                        }
                    });

                };

            })
            .error(function(data, status, headers, config){
                console.log('get data error!');
            });
    });