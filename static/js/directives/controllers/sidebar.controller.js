groceryApp.controller('sidebarController', ['$scope', $scope => {

    $scope.toggleSidebar = function(){
        
        if(document.getElementById('sideBar').className == "col-md-3 trans-div-green"){
            
            document.getElementById('sideBar').className = "col-md-1 trans-div-green sideBarClosed";
            document.getElementById('mainView').className = "col-md-11 trans-div-store";
            document.getElementById('buttonDiv').className = "";
            document.getElementById('cartButtonRow').className = "row justify-content-center"; 
            document.getElementById('sideBarContent').style.display = "none";
            document.getElementById('totalCheckoutRow').style.display = "none";
            document.getElementById('cartTextDiv').style.display = "none"; 
            
        }
        else{
            
            document.getElementById('sideBar').className = "col-md-3 trans-div-green";
            document.getElementById('cartButtonRow').className = "row"; 
            document.getElementById('mainView').className = "col-md-9 trans-div-store";
            document.getElementById('buttonDiv').className = "col-md-2";
            document.getElementById('sideBar').style.width = "";
            document.getElementById('mainView').style.width = "";
            document.getElementById('sideBarContent').style.display = "block";
            document.getElementById('totalCheckoutRow').style.display = "block";
            document.getElementById('cartTextDiv').style.display = "block";  

            
        }
    }

}]);