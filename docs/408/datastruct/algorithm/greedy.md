---
title: 贪婪算法
date: 2021-6-22
tags:
  - Algorithm
---

## 排序后贪婪

> 贪心算法，Greedy

### 合并区间

力扣 56：[合并区间](https://leetcode.cn/problems/merge-intervals/)

```c
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        vector<vector<int>> res;
        sort(intervals.begin(), intervals.end());
        for(int i = 0; i < intervals.size(); i++){
            vector<int> cur = intervals[i];
            if(res.empty() || cur[0] > res.back()[1]){
                res.push_back(cur);
            }
            if(cur[1] > res.back()[1]){
                res.back()[1] = cur[1];
            }
        }
        return res;
    }
};
```

### 无重叠区间

力扣 435：[无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/)

```c
class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if(intervals.empty()){
            return 0;
        }
        int n = intervals.size();
        sort(intervals.begin(), intervals.end(), [](const auto& u, const auto& v){
            return u[1]<v[1];
        });
        int ans = 1;
        int right = intervals[0][1];
        for(int i = 1; i < n; i++){
            if(intervals[i][0] >= right){
                ans++;
                right = intervals[i][1];
            }
        }
        return n-ans;
    }
};
```

### 划分字母区间

力扣 763：[划分字母区间](https://leetcode.cn/problems/partition-labels)

```c
class Solution {
public:
    vector<int> partitionLabels(string s) {
        map<char,vector<int>> m;
        for(int i = 0; i < s.length(); i++){
            char cur = s[i];
            if(m.count(cur)){
                m[cur][1] = i;
            } else {
                m[cur] = {i, i};
            }
        }
        vector<vector<int>> vec;
        for(auto v: m){
            vec.push_back(v.second);
        }
        sort(vec.begin(), vec.end());
        vector<vector<int>> merged;
        for(int i = 0; i < vec.size(); i++){
            vector<int> cur = vec[i];
            if(merged.empty() || cur[0] > merged.back()[1]){
                merged.push_back(cur);
            }
            if(cur[1] > merged.back()[1]){
                merged.back()[1] = cur[1];
            }
        }
        vector<int> res;
        for(int i = 0; i < merged.size(); i++){
            res.push_back(merged[i][1]-merged[i][0]+1);
        }
        return res;
    }
};
```

## 硬贪

### 买卖股票的最佳时机

力扣 121：[买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

```c
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int pre = prices[0];
        int res = 0;
        for(int i = 1; i < prices.size(); i++){
            int cur = prices[i];
            if(cur > pre){
                res = max(res, cur-pre);
            } else {
                pre = cur;
            }
        }
        return res;
    }
};
```

### 递增的三元子序列

力扣 334：[递增的三元子序列](https://leetcode.cn/problems/increasing-triplet-subsequence/)

```c
class Solution {
public:
    bool increasingTriplet(vector<int>& nums) {
        int n = nums.size();
        int first = nums[0], second = INT_MAX;
        for(int i = 1; i < n; i++){
            if(nums[i] > second){
                return true;
            } else if(nums[i] > first){
                second = nums[i];
            } else if(nums[i] < first){
                first = nums[i];
            }
        }
        return false;
    }
};
```

文本左右对齐（68）