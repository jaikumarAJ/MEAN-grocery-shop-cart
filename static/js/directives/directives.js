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

})


.directive('headerLogo', () => {

    return {

        templateUrl: 'templates/headerlogo.html',
        replace:true

    }
});