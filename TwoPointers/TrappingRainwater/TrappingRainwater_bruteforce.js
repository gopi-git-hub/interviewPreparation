/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let n =height.length;
    let totalWater=0;
    for(let i=0;i<n;i++){
        let leftMax=0,rightMax=0;
        for (let j=0;j<=i;j++){
            leftMax=Math.max(leftMax,height[j]);
        }
        for(let j=i;j<n;j++){
            rightMax=Math.max(rightMax,height[j])
        }
        totalWater+=Math.min(leftMax,rightMax)-height[i]
    }
    return totalWater
};


console.log(trap([4,2,0,3,2,5]))