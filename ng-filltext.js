angular.module('ng-filltext', []).
service('filltext', ['$http', function($http) {
    return {
        url:"http://www.filltext.com/",
        create: function(opts, callback) {
            opts.callback = "JSON_CALLBACK";
            opts.rows = opts.rows || 5;
            var config = {};
            config["params"] = opts;
            $http.jsonp(this.url, config)
            .success(function(data,status) {
                callback(data,status);
            }).
            error(function(data,status){
               callback(data,status); 
            });
        }
    }
}]).
directive('filltext', function(filltext) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        link: function($scope, element, attributes) {
           var fields = attributes.fields.split(','); // Mandatory: firstName, lastName, streetAddress etc.
           var titles = attributes.titles ? attributes.titles.split(',') : null; // Opt.
           var rows = attributes.rows ? attributes.rows : 10; //Default 10
           var delay = (attributes.delay && attributes.delay <= 30) ? attributes.delay : null; //Up to 30 secs
           var opt = fields.toObject(fields);
           filltext.create(angular.extend(opt, {delay:delay}, {rows:rows}), function(data) {
            $scope.fields = fields;
            $scope.hds = titles || fields;
            $scope.data = data;
           });
        },
        template: function(element, attributes) {
            var view = attributes.view ? attributes.view : 'Table'; //Table or Card
            if(view=='Table') {
                console.log('rendering as table');
                return '<table><thead><th ng-repeat="h in hds">{{h}}</th></thead><tr ng-repeat="row in data"><td ng-repeat="key in fields">{{row[key]}}</td></tr></table>';
            }
            else {
                return '<div ng-repeat="card in data"><h1>{{card[fields[0]]}} {{card[fields[1]]}}</h1><ul><li ng-repeat="key in fields.slice(2)">{{key}} : {{card[key]}}</li></ul></div>';
            }
        }
                    
    }
});
Array.prototype.toObject = function(keys){
    var obj = {};
    var tmp = this;
    if(keys.length == this.length){
        var c = this.length-1;
        while( c>=0 ){
            obj[ keys[ c ] ] = "{"+tmp[c]+"}";
            c--;
        }
    }
    return obj;
};
