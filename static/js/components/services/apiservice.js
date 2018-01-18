const apiService = ($http) => {


    const getAllProducts = () => {

        return $http.get("/api/getAllProducts");

    }


    const getCart = () => {

        return $http.get("/api/getCart");

    }


    const getCategories = () => {

        return $http.get("api/getCategories");

    }


    const getProduct = id => {

        return $http.get("/api/getProduct/" + id);

    } 


    const addProductToCart = product => {


        return $http.post("api/addProductToCart", {q: product.q, price: product.price, productName: product.productName, productId: product.productId});

    }


    const removeProductFromCart = itemIndex => {

        return $http.post("api/removeProductFromCart", {itemIndex : itemIndex});

    }


    const pay = (details, cart) => {

        return $http.post("api/pay", {details: details, cartDone: cart});

    }



    return {

            addProductToCart: addProductToCart,
            getAllProducts: getAllProducts,
            getCart: getCart,
            getProduct : getProduct,
            removeProductFromCart : removeProductFromCart,
            getCategories: getCategories,
            pay: pay
            
    };

}

app.factory("apiService", apiService);
