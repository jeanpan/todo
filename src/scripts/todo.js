var todoApp = angular.module('todoApp', []);

todoApp
    .controller('TodoController', function($scope, $http) {
        'use strict';
        // get data from mongodb. 
        $http.get('https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn')
            .success(function(data, status, headers, config) {

                $scope.todos = [];
                $scope.olds = [];

                angular.forEach(data, function(todo) {
                    if (!todo.done) {
                        $scope.todos.push(todo);
                    } else {
                        $scope.olds.push(todo);
                    }
                });

                $scope.addTodo = function() {
                    $http.post('https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn', {text: $scope.todoText, done: false})
                        .success(function(data, status, headers, config) {
                            $scope.todos.push({text: $scope.todoText, done: false});
                            $scope.todoText = '';
                        })
                        .error(function(data, status, headers, config) {
                            console.log('Add new todo fail ...');
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

                    angular.forEach(todos, function(todo) {
                        if (todo.done) {
                            var query = 'https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn&q={"text":"' + todo.text + '"}';
                            $http({
                                method: 'PUT',
                                url: query,
                                data: JSON.stringify({'$set' : {'done': true}}),
                                headers: { 'Content-Type': 'application/json' }
                            })
                            .success(function(data, status, headers, config) {
                                var index = $scope.todos.indexOf(todo);
                                $scope.olds.push(todo);
                                $scope.todos.splice(index, 1);
                            })
                            .error(function(data, status, headers, config) {
                                console.log('Update archive error ...');
                            });
                        }
                    });
                };

                // done move to todo.
                $scope.undo = function() {
                    var olds = $scope.olds;

                    angular.forEach(olds, function(old) {
                        if (!old.done) {
                            var query = 'https://api.mongolab.com/api/1/databases/demo/collections/todos?apiKey=7UXlLmyjPYorBQW2Owxe6hKNI5Xl1iRn&q={"text":"' + old.text + '"}';
                            $http({
                                method: 'PUT',
                                url: query,
                                data: JSON.stringify({'$set' : {'done': false}}),
                                headers: { 'Content-Type': 'application/json' }
                            })
                            .success(function(data, status, headers, config) {
                                var index = $scope.olds.indexOf(old);
                                $scope.todos.push(old);
                                $scope.olds.splice(index, 1);
                            })
                            .error(function(data, status, headers, config) {
                                console.log('Update undo error ...');
                            });
                        }
                    });
                };

            })
            .error(function(data, status, headers, config){
                console.log('Get data error ...');
            });
    });