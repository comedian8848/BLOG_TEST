---
title: 多指针
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

### 重排链表

力扣 143：[重排链表](https://leetcode.cn/problems/reorder-list/)

将链表 1 —> 2 —> 3 —> ... —> n-1 —> n 原地修改为 1 —> n —> 2 —> n-1 —> ... —> n/2

- 找到中点并分割为两个链表

- 翻转第二个链表

- 交叉合并两个链表

```cf
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(NULL) {}
    ListNode(int x) : val(x), next(NULL) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    void reorderList(ListNode* head) {
        if(!head || !head->next){
            return;
        }
        //print(head);
        ListNode* mid = splitMiddleNode(head);
        ListNode* tail = reverseList(mid);
        //print(head);
        //print(tail);
        mergeList(head, tail);
        //print(head);
    }

    ListNode* splitMiddleNode(ListNode* head) {
        ListNode* pre;
        ListNode* fast = head;
        ListNode* slow = head;
        while(fast && fast->next){
            pre = slow;
            slow = slow->next;
            fast = fast->next->next;
        }
        pre->next = NULL;
        return slow;
    }    

    ListNode* reverseList(ListNode* head) {
        //print(head);
        if(!head || !head->next){
            return head;
        }
        ListNode* rtn = reverseList(head->next);
        head->next->next = head;
        head->next = NULL;
        return rtn;
    }

    void mergeList(ListNode* l1, ListNode* l2){
        int count = 0;
        while(l1 && l2){
            if(count % 2 == 0){
                ListNode* temp = l1->next;    
                l1->next = l2;
                l1 = temp;
            } else {
                ListNode* temp = l2->next;
                l2->next = l1;
                l2 = temp;
            }
            count++;
        }
        if(l1){
            l2->next = l1;
        }
    }

    void print(ListNode* head){
        while(head){
            cout << head->val << " ";
            head = head->next;
        }
        cout << endl;
    }
};

int main(){

    Solution s;
    ListNode* head = new ListNode(1);
    //head->next = new ListNode(2);
    //head->next->next = new ListNode(3);
    //head->next->next->next = new ListNode(4);

    s.reorderList(head); 
    return 0;
}
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

### 从前序与中序遍历序列构造二叉树

力扣 105：[从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

- 通过双指针规范子树范围

```c
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        return build(preorder, 0, inorder, 0, preorder.size());
    }

    TreeNode* build(vector<int>& preorder, int index, vector<int> inorder, int left, int right){
        if(left >= right){
            return NULL;
        }
        TreeNode* root = new TreeNode(preorder[index]);
        int pos = find(inorder.begin(), inorder.end(), root->val) - inorder.begin();
        int length = pos-left;
        root->left = build(preorder, index+1, inorder, left, pos);
        root->right = build(preorder, index+length+1, inorder, pos+1, right);
        return root;
    }
};
```

## 位运算

[数字范围按位与](https://leetcode.cn/problems/bitwise-and-of-numbers-range/)

