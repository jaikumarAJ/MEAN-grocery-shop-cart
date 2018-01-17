groceryApp

    .config(['$routeProvider','$locationProvider', ($routeProvider,$locationProvider) => {
        $routeProvider.when('/products/product/:product',{
            templateUrl: 'templates/product.html'
    }).when('/products',{
        templateUrl: 'templates/products.html'
    }).when('/checkouterr',{
        templateUrl: 'templates/checkout.html'            
    }).when('/checkout',{
        templateUrl : 'templates/checkout.html'
    }).otherwise('/products');
        }]
    );
