#include <stdio.h>
 void main()
 {
 int n,t1,t2,nextTerm;
 printf("enter the number of terms: ");
 scanf("%d", &n);   

 if (n<=0)
 {
        printf("Error! Please enter a positive integer.");

 
 }
 else
 { 
    printf("Fibonacci Series: ");
    t1 = 0;
    t2 = 1; 
 }

    for (int i = 1; i <= n; ++i)
    {
        printf("%d, ", t1);
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
    }
    printf("\n");
 }
 
