#include <stdio.h>
void main() {
    int n;
    printf("enter the value of n: ");
    scanf("%d", &n);
    for(int i=1; i<=n; i++) {
        
    {for(int j=i; j>=1; j--) {
           printf("%d ",j);
        }
        printf("\n");
    }
}
}