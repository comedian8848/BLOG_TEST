---
title: Recursion
date: 2022-9-17
tags:
- C/C++
---

## 链表

构造结构体/类指针

```c
ListNode* head = new ListNode(-1); // 必须这样初始化，不能直接 ListNode* head;
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

### 反转链表

力扣 206：[反转链表](https://leetcode.cn/problems/reverse-linked-list/)

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
    ListNode* reverseList(ListNode* head) {
        if(!head || !head->next){
            return head;
        }
        ListNode* rtn = reverseList(head->next);
        head->next->next = head;
        head->next = NULL;
        return rtn;
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

### K 个一组翻转链表

力扣 25：[K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

- vector 记录组起始节点

- 将每组末尾置空

- 每组翻转

- 链表相接

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
    ListNode* reverseKGroup(ListNode* head, int k) {
        vector<ListNode*> vec;
        int index = 0;
        while(head){
            if(index++ % k == 0){
                vec.push_back(head);
            }
            head = head->next;
        }
        for(int i = 0; i < vec.size(); i++){
            ListNode* tail = vec[i];
            int flag = 0;
            // 将末尾指向空 
            for(int j = 0; j < k-1; j++){
                if(!tail->next){
                    flag = 1;
                    break;
                }
                tail = tail->next;
            }
            tail->next = NULL;
            if(flag){
                continue;
            }
            //print(vec[i]);
            vec[i] = reverseList(vec[i]);
        }
        joinList(vec);
        return vec[0];
    }

    ListNode* reverseList(ListNode* head){
        if(!head || !head->next){
            return head;
        }
        ListNode* rtn = reverseList(head->next);
        head->next->next = head;
        head->next = NULL;
        return rtn;
    }

    void joinList(vector<ListNode*> v){
        for(int i = 0; i < v.size()-1; i++){
            getTail(v[i])->next = v[i+1];
        }
    }

    ListNode* getTail(ListNode* head){
        while(head->next){
            head = head->next;
        }
        return head;
    }
};
```

## 树

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

### 将有序数组转换为二叉搜索树

力扣 108：[将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

- 因为数组有序，且要构造二叉搜索树，数组中间元素一定是根节点
- 据此递归

~~~c
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
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return build(nums, 0, nums.size());
    }

    TreeNode* build(vector<int>& nums, int left, int right){
        if(left >= right){
            return NULL;
        }
        int mid = (left+right) / 2;
        TreeNode* node = new TreeNode(nums[mid]);
        node->left = build(nums, left, mid);
        node->right = build(nums, mid+1, right);
        return node;
    }
};
~~~

### 从前序和中序遍历序列构造二叉树

力扣 106：[从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

- 首先要明确前序、中序遍历序列的结构
  - 前序：根节点 [左子树] [右子树]
  - 中序：[左子树] 根节点 [右子树]
- 在中序遍历中找到根节点，根节点左侧是他的左子树，右侧是他的右子树，可以轻易获得左子树的长度 length
- 定位前序遍历的序列的根节点，我们已知 preorder[0] 是整个树的根节点，此时令 index = 0，很容易得知**根节点的左子树的根节点**就是 preorder[index+1]，在根据根节点在 inorder 中位置 pos，**根节点的右子树的根节点**就是 preorder[index+pos+1] = preorder[index+length]
- 据此递归获取整颗二叉树

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

