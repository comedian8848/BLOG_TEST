---
title: 搜索算法
date: 2021-6-22
tags:
  - Algorithm
---

## 宽度优先搜索

Breadth First Search

### 二叉树的层序遍历

力扣 102：[二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

> 借助队列这一数据结构辅助实现

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> list = new ArrayList<>();
        if(root==null){
            return list;
        }
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while(!q.isEmpty()){
            List<Integer> row = new ArrayList<>();
            //记录该层节点个数
            int n = q.size();
            for(int i = 0; i < n; i++){
                //依次出列
                TreeNode p = q.poll();
                row.add(p.val);
                //依次入列，左——>右
                if(p.left!=null){
                    q.offer(p.left);
                }
                if(p.right!=null){
                    q.offer(p.right);
                }
            }
            list.add(row);
        }
        return list;
    }
}
```

### 路径总和

力扣 112：[路径总和](https://leetcode.cn/problems/path-sum/)

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {

    private boolean flag = false;

    public void bfs(TreeNode root, int targetSum){
        if(root == null){
            return;
        }
        Queue<TreeNode> nodeQue = new LinkedList<>();
        Queue<Integer> valQue = new LinkedList<>();
        nodeQue.offer(root);
        valQue.offer(root.val);
        while(nodeQue.size() != 0){
            TreeNode cur = nodeQue.poll();
            int temp = valQue.poll();
            if(cur.left == null && cur.right == null){
                if(temp == targetSum){
                    flag = true;
                    break;
                }
                continue;
            }
            if(cur.left != null){
                nodeQue.offer(cur.left);
                valQue.offer(temp + cur.left.val);
            }
            if(cur.right != null){
                nodeQue.offer(cur.right);
                valQue.offer(temp + cur.right.val);
            }
        }
    }

    public boolean hasPathSum(TreeNode root, int targetSum) {
        bfs(root, targetSum);
        return flag;
    }
}
```

### 奇偶树

力扣 1609：[奇偶树](https://leetcode.cn/problems/even-odd-tree/)

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public boolean isEvenOddTree(TreeNode root) {
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int level = 0;
        while(!q.isEmpty()){
            int n = q.size();
            if(level % 2 == 0){
                int temp = Integer.MIN_VALUE;
                for(int i = 0; i < n; i++){
                    TreeNode cur = q.poll();
                    int val = cur.val;
                    if(val%2 == 0 || val <= temp){
                        return false;
                    }
                    if(cur.left != null){
                        q.offer(cur.left);
                    }
                    if(cur.right != null){
                        q.offer(cur.right);
                    }
                    temp = val;
                }
            } else {
                int temp = Integer.MAX_VALUE;
                for(int i = 0; i < n; i++){
                    TreeNode cur = q.poll();
                    int val = cur.val;
                    if(val%2 == 1 || val >= temp){
                        return false;
                    }
                    if(cur.left != null){
                        q.offer(cur.left);
                    }
                    if(cur.right != null){
                        q.offer(cur.right);
                    }
                    temp = val;
                }
            }
            level++;
        }
        return true;
    }
}
```

### 二叉树的右视图

力扣 199：[二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

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

    vector<int> res;

    vector<int> rightSideView(TreeNode* root) {
        bfs(root);
        return res;
    }

    void bfs(TreeNode* node){
        if(!node){
            return;
        }
        deque<TreeNode*> queue;
        queue.push_back(node);
        while(!queue.empty()){
            res.push_back(queue.back()->val);
            int n = queue.size();
            for(int i = 0; i < n; i++){
                TreeNode* cur = queue.front();
                if(cur->left) { queue.push_back(cur->left); }
                if(cur->right) { queue.push_back(cur->right); }
                queue.pop_front();
            }
        }        
    }
};
```

和这道题解题方式很像，[117. 填充每个节点的下一个右侧节点指针 II - 力扣（Leetcode）](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/?envType=study-plan&id=suan-fa-ji-chu&plan=algorithms&plan_progress=4g9kt0m)

都是层序遍历，特殊处理每层的最后一个节点

### 二进制矩阵中的最短路径

力扣 1091：[二进制矩阵中的最短路径 - 力扣（Leetcode）](https://leetcode.cn/problems/shortest-path-in-binary-matrix/description/)

- 层层推进寻找解
- 若用 dfs 很有可能漏掉最优解，因为在遍历到次解时标记了优解被访问

```c
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        if(grid[0][0] == 1){
            return -1;
        }
        int m = grid.size();
        if(m == 1){
            return 1;
        }
        deque<pair<int,int>> queue;
        queue.push_back(make_pair(0, 0));
        grid[0][0] = 1;
        int res = 1;
        while(!queue.empty()){
            int n = queue.size();
            for(int k = 0; k < n; k++){
                pair<int,int> cur = queue.front();
                queue.pop_front();
                int i = cur.first, j = cur.second;
                for(int l = i-1; l <= i+1; l++){
                    for(int r = j-1; r <= j+1; r++){
                        if(l < 0 || l >= m || r < 0 || r >= m){
                            continue;
                        }
                        if(l == m-1 && r == m-1 && !grid[l][r]){
                            return res+1;
                        }
                        if(!grid[l][r]){
                            queue.push_back(make_pair(l, r));
                            grid[l][r] = 1;
                        }
                    }
                }
            }
            res++;
        }
        return -1;
    }
};
```

## 二分搜索

### 二分查找

力扣 704：[二分查找](https://leetcode.cn/problems/binary-search/)

```c
class Solution {
public:
    int search(vector<int>& nums, int target) {
        return binarySearch(nums, target, 0, nums.size()-1);
    }

    int binarySearch(vector<int>& nums, int target, int left, int right){
        if(left > right){
            return -1;
        }
        int mid = (left+right) / 2;
        if(nums[mid] == target){
            return mid;
        }
        if(nums[mid] > target){
            return binarySearch(nums, target, left, mid-1);
        } else {
            return binarySearch(nums, target, mid+1, right);
        }
    }
};
```

### 搜索插入位置

力扣 35：[搜索插入位置](https://leetcode.cn/problems/search-insert-position/)

注意这里的返回条件是 left > right，因为要找到比 target 小的值的下一个位置插入

递归

~~~c
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        return binarySearch(nums, target, 0, nums.size()-1);
    }

    int binarySearch(vector<int>& nums, int target, int left, int right){
        if(left > right){
            return left;
        }
        int mid = left + (right-left)/2;
        if(nums[mid] == target){
            return mid;
        }
        if(nums[mid] < target){
            return binarySearch(nums, target, mid+1, right);
        } else {
            return binarySearch(nums, target, left, mid-1);
        }
    }
};
~~~

迭代

~~~c
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0, right = nums.size()-1;
        while(left <= right){
            int mid = left+(right-left)/2;
            if(nums[mid] == target){
                return mid;
            }
            if(nums[mid] < target){
                left = mid+1;
            }
            if(nums[mid] > target){
                right = mid-1;
            }
        }
        return left;
    }
};
~~~

### 搜索旋转排列数组

力扣 33：[搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

对于两段递增数组，寻找目标元素，且前一段最小值大于第二段最大值，如`[4,5,7,1,2,3]`

- 通过比较 target / nums[mid] 和 nums[0] 判断 target / nums[mid] 在第一段还是第二段
- 若 target 和 mid 在同一段，则正常二分查找
- 若不在同一段，则缩小左/右边界，使之在同一段

```c
class Solution {
public:

    int left, right;

    bool shrink(int cur, int index, int target){
        if(cur == target){
            return true;
        }
        if(cur < target){ left = index+1; }
        else { right = index-1; }
        return false;
    }

    int search(vector<int>& nums, int target) {
        left = 0, right = nums.size()-1;
        int first = nums[0];
        if(first == target){ return 0; }
        while(left <= right){
            int mid = (left+right) / 2;
            if(target > first){
                if(nums[mid] < first){
                    right = mid-1;
                    continue;
                }
                if(shrink(nums[mid], mid, target)){ return mid; }
            } else {
                if(nums[mid] >= first){
                    left = mid+1;
                    continue;
                }
                if(shrink(nums[mid], mid, target)){ return mid; }
            }
        }
        return -1;
    }
};
```

