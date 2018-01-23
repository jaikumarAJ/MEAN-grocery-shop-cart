groceryApp.directive('checkout', () => {

    return {
        
        templateUrl : 'templates/checkout.html',

    }
})


.directive('sideBar', () => {

    return {

        templateUrl: 'templates/sidebar.html',
        scope: {

            cart : '='

        }
    }

});