groceryApp

    .config(['$routeProvider','$locationProvider', ($routeProvider,$locationProvider) => {
        $routeProvider.when('/products/product/:product',{
            templateUrl: 'templates/product.html'
    }).when('/products',{
        templateUrl: 'templates/products.html'
    }).when('/checkouterr',{
        template: '<checkout></checkout>'            
    }).when('/checkout',{
        template: '<checkout></checkout>'
    }).otherwise('/products');
        }]
    );
