# polymial.js
A JS library to process polynomials.
--
Polynomials are represented by arrays, in ascending powers.
Functions:
`poly_add()`
Takes any number of arguments, returns their sum.
```
poly_add([1,3],[1,2,1])
//[2,5,1]
```

`poly_mul()`
Takes any number of arguments, returns their product.

`poly_div()`
Takes two arguments, the numerator and the denominator, returns an array with the quotient and remainder.

`poly_toString()`
Takes a polynomial (array), and optionally a decending powers flag. Returns the polymial expression as a string.

`poly_degree()`
Takes a polymial, returns its degree.

`poly_differentiate()`
Takes a polymial, returns its derivative.
