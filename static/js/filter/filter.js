groceryApp
    .filter('categoryFilter', function(){
        return function(input,category){
            //input = input || [];
            products= [];
            if(category){
            input.forEach(product => {
                if(product.category == category){
                    products.push(product); 
                }
            });
            return products;
        }
        return input;
    }
});