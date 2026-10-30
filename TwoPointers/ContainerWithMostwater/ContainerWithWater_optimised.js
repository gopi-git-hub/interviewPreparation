/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let n=height.length;
    let left=0,right=n-1;
    let maxArea=0
    while(left<=right){
        let width=right-left;
        let minHeight=Math.min(height[left],height[right]);
        let area=width*minHeight;
        maxArea=Math.max(maxArea,area);
        if(height[left]<height[right]){
            left++;
        }else{
            right--;
        }

    }
    return maxArea
};

console.log(maxArea([1,2,1,1,3]))