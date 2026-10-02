#include <stdio.h>

    float area_circle (float radius) ;
    float circum_circle (float radius); 
    void main() {
        float radius;
        printf("Enter the radius of the circle: ");
        scanf("%f", &radius);
        
        float area = area_circle(radius);
        float circumference = circum_circle(radius);
        
        printf("Area of the circle: %.2f\n", area);
        printf("Circumference of the circle: %.2f\n", circumference);

    }
    float area_circle (float radius) {
        return 3.14159 * radius * radius;
    }
    float circum_circle (float radius) {
        return 2 * 3.14159 * radius;
    }