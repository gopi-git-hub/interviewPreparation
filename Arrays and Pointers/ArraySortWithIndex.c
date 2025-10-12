
#include <stdio.h>
#include <stdlib.h>

int ascComparator(const void *a,const void *b){
    return *(int *)a - *(int *)b;
}

int descComparator(const void *a, const void * b){
    return *(int *)b - *(int *)a;
}

int main(){
    int noOfStones,startStone,endStone;
    printf("Enter the number of stones:");
    scanf("%d",&noOfStones);
    int *listOfStones = malloc(noOfStones * sizeof(int));
    printf("Enter the stone number list:");
    
    for(int i=0;i<noOfStones;i++){
        scanf("%d",&listOfStones[i]);
    }
    printf("enter the stone start range that need to be sorted in ascending order:");
    scanf("%d ",&startStone);
    printf("end range:");
    scanf(" %d",&endStone);
    
    int ascStonesArraySize=endStone - startStone+1;
    int descStoneArraySize=noOfStones - ascStonesArraySize;
    
    int *ascArrayBeforeSort = malloc(ascStonesArraySize * sizeof(int));
    int *descArrayBeforeSort = malloc(descStoneArraySize * sizeof(int));
    
    int ascArrayCount=0;
    int descArrayCount=0;
    
    for(int i=0;i<noOfStones;i++){
        if(i>=startStone && i<=endStone){
            ascArrayBeforeSort[ascArrayCount] = listOfStones[i];
            ascArrayCount++;
        }else{
            descArrayBeforeSort[descArrayCount] = listOfStones[i];
            descArrayCount++;
        }
    }
    
    qsort(ascArrayBeforeSort,ascStonesArraySize,sizeof(int),ascComparator);
    qsort(descArrayBeforeSort,descStoneArraySize,sizeof(int),descComparator);
    
    ascArrayCount=0;
    descArrayCount=0;
    
    for(int i=0;i<noOfStones;i++){
        if(i>=startStone && i<=endStone){
           printf("%d ", ascArrayBeforeSort[ascArrayCount]);
            ascArrayCount++;
        }else{
            printf("%d ", descArrayBeforeSort[descArrayCount]);
            descArrayCount++;
        }
    }
    
    return 0;
}