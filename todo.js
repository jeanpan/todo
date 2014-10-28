var todoApp = angular.module('todoApp', []);

todoApp
    .controller('TodoController', function($scope, $http) {
        'use strict';
        // get data from mongodb. 
        $http.get('https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn')
            .success(function(data, status, headers, config){

                $scope.todos = data;

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

                $scope.archive = function() {
                    var oldTodos = $scope.todos;
                    $scope.old = [];
                    $scope.todos = [];
                    angular.forEach(oldTodos, function(todo) {
                        if (!todo.done) {
                            $scope.todos.push(todo);
                        } else {
                            console.log(todo.text);
                            /*
                            var update = 'https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn&q={"text":' + todo.text + '}';
                            console.log(update);
                            $http.post(update, { "$set" : {"done": true}})
                                .success(function(data, status, headers, config) {
                                    console.log(data);
                                })
                                .error(function(data, status, headers, config) {
                                    console.log('update data fail');
                                });
                            */
                            $scope.old.push(todo);                            
                        }
                    });
                    console.log($scope.old);
                };

            })
            .error(function(data, status, headers, config){
                console.log('get data error!');
            });
    });