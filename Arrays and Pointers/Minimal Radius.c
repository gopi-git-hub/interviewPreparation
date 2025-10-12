#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int ascComparator(const void *a, const void *b){
    return *(int *)a - *(int *)b;
}

int main(){

    int noOfPoles;
    printf("Enter the number of Poles\n");
    scanf("%d",&noOfPoles);

    int * xCooridinatesBeforeSort = malloc(noOfPoles * sizeof(int));
    int * yCooridinatesBeforeSort = malloc(noOfPoles * sizeof(int));

    if (xCooridinatesBeforeSort == NULL || yCooridinatesBeforeSort == NULL) {
        printf("Memory allocation failed\n");
        return 1; // Exit if malloc fails
    }

    
    printf("Enter the x-coordinate's\n");

    for(int i=0;i<noOfPoles;i++){
        scanf("%d",&xCooridinatesBeforeSort[i]);
    }

    printf("Enter the y-coordinate's\n");

    for(int i=0;i<noOfPoles;i++){
        scanf("%d",&yCooridinatesBeforeSort[i]);
    }

    qsort(xCooridinatesBeforeSort,noOfPoles,sizeof(int),ascComparator);
    qsort(yCooridinatesBeforeSort,noOfPoles,sizeof(int),ascComparator);

    int longXaxis=xCooridinatesBeforeSort[noOfPoles-1]-xCooridinatesBeforeSort[0];
    int longYaxis=yCooridinatesBeforeSort[noOfPoles-1]-yCooridinatesBeforeSort[0];

    double diameterBeforeSqrt=(longXaxis*longXaxis)+(longYaxis*longYaxis);
    double radius = sqrt(diameterBeforeSqrt)/2;

    printf("The radius of the circle is %.2f",radius);
    free(xCooridinatesBeforeSort);
    free(yCooridinatesBeforeSort);

    return 0;

}