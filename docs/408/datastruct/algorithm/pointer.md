---
title: Pointer
date: 2021-6-22
tags:
  - Algorithm
---

## 快慢指针

### 链表的中间节点

力扣 876：[链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

```c
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        ListNode* fast = head;
        ListNode* slow = head;
        while(fast && fast->next){
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;
    }
};
```

## 双指针

### 三数之和

力扣 15：[三数之和](https://leetcode.cn/problems/3sum/)

排序加双指针

- 解决重复问题，固定起始位，利用双指针缩小范围
- 当碰到连续的相同元素直接跳过，避免重复

```c
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        vector<vector<int>> res;
        for(int i = 0; i < n-2; i++){
            if(nums[i] > 0){
                break;
            }
            if(i>0 && nums[i]==nums[i-1]){
                continue;
            }
            int l = i+1;
            int r = n-1;
            while(l < r){
                int sum = nums[i]+nums[l]+nums[r];
                if(sum < 0){
                    while(l<r && nums[l]==nums[++l]);
                } else if(sum > 0){
                    while(l<r && nums[r]==nums[--r]);
                } else{
                    vector<int> row = {nums[i], nums[l], nums[r]};
                    res.push_back(row);
                    while(l<r && nums[l]==nums[++l]);
                    while(l<r && nums[r]==nums[--r]);
                }
            }
        }
        return res;
    }
};
```