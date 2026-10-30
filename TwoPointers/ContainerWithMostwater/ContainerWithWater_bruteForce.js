/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let n= height.length;
    let maxArea=0;
    for(let left =0;left<n-1;left++){
        for(let right=left+1;right<n;right++){
            let width=right-left;
            let minHeight=Math.min(height[left],height[right])
            let area = width*minHeight
            maxArea = Math.max(maxArea,area)
        }
    }
    return maxArea

};

console.log(maxArea([1,8,6,2,5,4,8,3,7]))