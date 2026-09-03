#include <stdio.h>
void main()
 {
int fact=1,n;

printf("enter a postive integer (0 to 12): ");

scanf("%d", &n);
if (n<0)

{
    printf("Error! Factorial of a negative number doesn't exist.");
}
    
else
{
    for(int i=1; i<=n; i++)
    {
        fact=fact*i;
    }
    printf("Factorial of %d = %d", n, fact);
}
}
