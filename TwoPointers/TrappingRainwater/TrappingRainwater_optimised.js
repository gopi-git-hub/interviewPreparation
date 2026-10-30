/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let water =0;
    let left=0,right=height.length-1;
    let leftMax=height[left],rightMax=height[right];
    while(left<right){
        if(leftMax<rightMax){
            left++;
            leftMax=Math.max(leftMax,height[left]);
            water+=leftMax-height[left];
        }else{
            right--;
            rightMax=Math.max(rightMax,height[right]);
            water+=rightMax-height[right];
        }
        
    }
    return water
};

console.log(trap([4,2,0,3,2,5]))