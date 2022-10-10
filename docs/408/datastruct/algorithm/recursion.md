---
title: Recursion
date: 2022-9-17
tags:
- C/C++
---

## 递归程序设计

构造结构体/类指针

```c
ListNode* head = new ListNode(-1); // 必须这样初始化，不能直接 ListNode* head;
```

### 对称二叉树

力扣 101：[对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

判断二叉树是否完全对称

```c
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if(root == NULL){
            return true;
        }
        return dfs(root->left, root->right);
    }

    bool dfs(TreeNode* left, TreeNode* right){
        if(left == NULL && right == NULL){
            return true;
        }
        if(left == NULL || right == NULL){
            return false;
        }
        if(left->val != right->val){
            return false;
        }
        return dfs(left->right, right->left) && dfs(left->left, right->right);
    }
};
```

### 路径总和

力扣 112：[路经总和](https://leetcode.cn/problems/path-sum/)

判断数中是否存在和为 target 的路径，路径指从根节点到叶子节点（递归 dfs）

```c
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if(root == NULL){
            return false;
        }
        if(root->val == targetSum && root->left == NULL && root->right == NULL){
            return true;
        }
        return hasPathSum(root->left, targetSum-root->val) || hasPathSum(root->right, targetSum-root->val);
    }
};
```

### 翻转二叉树

力扣 226：[翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

将二叉树左右翻转（后序遍历）

```c
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        dfsInvert(root);
        return root;
    }

    void dfsInvert(TreeNode* node){
        if(node == NULL){
            return;
        }
        dfsInvert(node->left);
        dfsInvert(node->right);
        TreeNode* temp = node->left;
        node->left = node->right;
        node->right = temp;
    }
};
```

### 验证二叉搜索树

力扣 98：[验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

被折磨了，其实抓住了是边界问题，但没找准，另外这个 int 的溢出真几把恶心，也不说一声

```c
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return dfs(root, LONG_MIN, LONG_MAX);
    }

    bool dfs(TreeNode* node, long min, long max){
        if(node == NULL){
            return true;
        }
        long val = node->val;
        if(val <= min || val >= max){
            return false;
        }
        return dfs(node->left, min, val) && dfs(node->right, val, max);
    }
};
```

### 二叉搜索树的最近公共祖先

力扣 235：[二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)

其实很简单，因为平衡，所以当目标值和当前节点之差异号时，说明在当前节点两侧

```c
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if(!root){
            return NULL;
        }
        if((long)(root->val-p->val)*(long)(root->val-q->val) <= 0){
            return root;
        }
        return p->val < root->val ? lowestCommonAncestor(root->left, p, q) : lowestCommonAncestor(root->right, p, q);
    }
};
```

### 两两交换链表中的节点

力扣 24：[两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

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
    ListNode* swapPairs(ListNode* head) {
        if(!head || !head->next){
            return head;
        }
        ListNode* next = head->next;
        head->next = swapPairs(next->next);
        next->next = head;
        return next;
    }
};
```