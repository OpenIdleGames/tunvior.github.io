function fibonacci(n){
    var a = 1;
    var b = 2;
    
    for(var i = 0; i < n - 2; i++){
        var tmp = a + b;
        a = b;
        b = tmp;
    }
    
    if( n == 1 ) {
        return a; 
    }else{
        return b;
    }
}