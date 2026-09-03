#include <stdio.h>
void main() {
    int n;
    printf("enter the value of n: ");
    scanf("%d", &n);
    for(int i=1; i<=n; i++) {
        //printf("%d\n", i);
    {for(int j=1; j<=i; j++) {
            printf("%d",j);
        }
        printf("\n");
    }
}
}