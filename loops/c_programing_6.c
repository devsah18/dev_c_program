#include <stdio.h>
void main() {
    int n;
    printf("enter the value of n: ");
    scanf("%d", &n);
    for(int i=n; i>=1; i--) {
        //printf("%d\n", i);
    {for(int j=i; j>=1; j--) {
            printf("*");
        }
        printf("\n");
    }
}
}