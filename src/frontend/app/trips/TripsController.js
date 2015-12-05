'use strict';

(function () {
    var app = angular.module('app');
    
    app.controller('TripsController', function($scope, RepositoryFactory, resolveEntity) {
        /* happens as the page loads */
        $scope.resolveEntity = resolveEntity;
        
        var TripTypesRepository = new RepositoryFactory({
            endpoint: 'list_trips/list_triptypes',
            retrieveItems: function(data) {
                return data._items;
            }
        });
        
        var TripsRepository = new RepositoryFactory({
            endpoint: 'list_trips',
            retrieveItems: function(data) {
                return data._items;
            }
        });
        
        TripTypesRepository.readAll().then(function(triptypes) {
            $scope.triptypes = triptypes;
            TripsRepository.readAll().then(function(trips) {
                $scope.trips = trips;
            });
        });
        
        $scope.tripsGridOptions = {
            data:  'trips',
            enableCellSelection: false,
            enableCellEdit: true,
            keepLastSelected: false,
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: true,
            enableColumnResize: true,
            enableColumnReordering: true,
            showFilter: false,
            rowHeight: 40,
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'Trip Number',
                    enableCellEdit: false,
                    width: '180px'
                },
                {
                    field: 'tripname',
                    displayName: 'Trip Name'
                },
                {
                    field: 'triptypeid',
                    displayName: 'Category',
                    cellTemplate: 'app/trips/partials/tripTypeGridCell.html',
                    editableCellTemplate: 'app/trips/partials/tripTypeGridCellEditor.html'
                },
                {
                    field: '',
                    displayName: 'Operations',
                    cellTemplate: 'app/trips/partials/operationsGridCell.html',
                    enableCellEdit: false,
                    sortable: false
                }
            ]
        };
        
        //   **==  FrontEnd Operations ==**  //
        $scope.createTrip = function(newTrip) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            if (newTrip.tripname.length > 0) {
                TripsRepository.createOne(newTrip).then(function () {
                    TripsRepository.readAll().then(function (trips) {
                        $scope.trips = trips;
                    });
                });
            }
        };
        
        $scope.updateTrip = function(trip) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            TripsRepository.updateOne(trip);
        };
        
        $scope.deleteTrip = function(trip) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            TripsRepository.deleteOne(trip).then(function () {
                TripsRepository.readAll().then(function (trips) {
                    $scope.trips = trips;
                });
            });
        };
        
        $scope.stopEditingTripType = function () {
            $scope.$broadcast('ngGridEventEndCellEdit');
        };
        
        $scope.$on('ngGridEventRows', function(newRows) {
            $scope.$broadcast('ngGridEventEndCellEdit');
        });
        
    });
    
}) ();
