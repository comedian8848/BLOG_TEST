---
title: Search
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

## 深度优先搜索

> Deep First Search
> 
> 深度优先搜索一定是递归捏

### 递增顺序搜索树

力扣 897：[递增顺序搜索树](https://leetcode.cn/problems/increasing-order-search-tree/)

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

private:
    TreeNode* pre = new TreeNode();
    TreeNode* head = new TreeNode();
public:
    void inorder(TreeNode* node)
    {
        //当当前指针不为空
        if(node == nullptr)
        {
            return;
        }
        inorder(node->left);
        //令pre的右指针指向当前节点
        pre->right = node;
        //令当前节点的左指针为空
        node->left = nullptr;
        //令pre为当前指针，即下一步的前驱
        pre = node;
        inorder(node->right);
    }

    //寻找最左节点：即新生成链表的表头
    void findHead(TreeNode* root)
    {
        TreeNode* p = root;
        while(p->left != nullptr)
        {
            p = p->left;
        }
        head = p;
    }

    TreeNode* increasingBST(TreeNode* root)
    {
        findHead(root);
        inorder(root);
        return head;
    }
};
```

### 二叉搜索树的范围和

力扣 938：[二叉搜索树的范围和](https://leetcode.cn/problems/range-sum-of-bst/)

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
private:
    int res = 0;

public:
    void inorder(TreeNode* root, int low, int high)
    {
        if(root == nullptr)
        {
            return;
        }
        inorder(root->left, low, high);
        if(root->val >= low && root->val <= high)
        {
            res += root->val;
        }
        inorder(root->right, low, high);
    }


    int rangeSumBST(TreeNode* root, int low, int high) 
    {
        inorder(root, low, high);
        return res;
    }
};
```

### 二叉树的中序遍历

力扣 94：[二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

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

    private List<Integer> list = new ArrayList<>();

    public List<Integer> inorderTraversal(TreeNode root) {
        if(root!=null && root.left!=null)
            inorderTraversal(root.left);
        if(root!=null)
            list.add(root.val);
        if(root!=null && root.right!=null)
            inorderTraversal(root.right);
        return list;
    }
}
```

### 二叉树的最近祖先

力扣 236：[二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

> 递归，深度优先搜索
> 
> 明确 root “是 q 和 p 公共祖先” 的条件：(l&&r) || ((root==p||root==q)&&(l||r)
> 
> l：指左子树为 p 或 q 的祖先；r：指右子树为 p 或 q 的祖先

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {

    private TreeNode res;

    public boolean dfs(TreeNode root, TreeNode p, TreeNode q){
        if(root==null){
            return false;
        }
        boolean l = dfs(root.left, p, q);
        boolean r = dfs(root.right, p, q);
        if((l&&r) || ((root==p||root==q)&&(l||r))){
            res = root;
        }
        if(l || r || root==p || root==q){
            return true;
        }
        return false;
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        dfs(root, p, q);
        return res;
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

    public void dfs(TreeNode root, int targetSum){
        if(root == null){
            return;
        }
        if(root.left == null && root.right == null && root.val == targetSum){
            flag = true;
        }
        int newTarget = targetSum - root.val;
        dfs(root.left, newTarget);
        dfs(root.right, newTarget);
    }

    public boolean hasPathSum(TreeNode root, int targetSum) {
        dfs(root, targetSum);
        return flag;
    }
}
```

### 连接词

力扣 472：[连接词](https://leetcode.cn/problems/concatenated-words/)

```java
public class Solution {
    static class Trie{
        public Trie[] children;
        public boolean isEnd;

        public Trie(){
            children = new Trie[26];
            isEnd = false;
        }
    }
    //字典树
    private Trie trie = new Trie();
    //将单词插入字典树
    public void insert(String word){
        Trie p = trie;
        int n = word.length();
        for(int i = 0; i < n; i++){
            char c = word.charAt(i);
            int index = c-'a';
            if(p.children[index] == null){
                p.children[index] = new Trie();
            }
            p = p.children[index];
        }
        p.isEnd = true;
    }

    public boolean dfs(String word, int start){
        //当已经搜索到最后一位，说明该词被连接而成
        if(word.length() == start){
            return true;
        }
        Trie p = trie;
        for(int i = start; i < word.length(); i++){
            char c = word.charAt(i);
            int index = c-'a';
            if(p.children[index] == null){
                return false;
            }
            p = p.children[index];
            if(p.isEnd){
                //深度优先搜索
                if(dfs(word, i+1)){
                    return true;
                }
            }
        }
        return false;
    }

    public List<String> findAllConcatenatedWordsInADict(String[] words){
        List<String> res = new ArrayList<>();
        Arrays.sort(words, (a, b)-> {
            return a.length()-b.length();
        });
        for(String word: words){
            if(word.length() == 0){
                continue;
            }
            if(dfs(word, 0)){
                res.add(word);
            } else {
                insert(word);
            }
        }
        return res;
    }
}
```

### 猫和老鼠

力扣 913：[猫和老鼠](https://leetcode.cn/problems/cat-and-mouse/)

> 在一场信息公开的游戏中，总有一方有一种方法使之不会输

```java
package com.solution;

import java.util.Arrays;

public class MouseCatGame {

    private static final int catWin = 2;
    private static final int draw = 0;
    private static final int mouseWin = 1;

    private int n;
    private int[][][] dp;
    private int[][] graph;

    public int mouseCatGame(int[][] graph){
        n = graph.length;
        dp = new int[n][n][2*n];
        for(int[][] i: dp){
            for(int[] j: i){
                Arrays.fill(j, -1);
            }
        }
        this.graph = graph;
        return getRes(1, 2, 0);
    }

    public int getRes(int mouse, int cat, int steps){
        if(steps >= 2*n){
            return draw;
        }
        if(dp[mouse][cat][steps] < 0){
            if(mouse == 0){
                dp[mouse][cat][steps] = mouseWin;
            } else if(mouse == cat){
                dp[mouse][cat][steps] = catWin;
            } else{
                getNextRes(mouse, cat, steps);
            }
        }
        return dp[mouse][cat][steps];
    }

    public void getNextRes(int mouse, int cat, int steps){
        int curMove = steps%2 == 0 ? mouse:cat;
        int defaultRes = curMove==mouse ? catWin:mouseWin;
        int res = defaultRes;
        for(int nextStep: graph[curMove]){
            if(curMove == cat && nextStep == 0){
                continue;
            }
            int mouseNextStep = curMove==mouse ? nextStep:mouse;
            int catNextStep = curMove==cat ? nextStep:cat;
            int nextRes = getRes(mouseNextStep, catNextStep, steps+1);
            if(nextRes != defaultRes){
                res = nextRes;
                if(res != draw){
                    break;
                }
            }
        }
        dp[mouse][cat][steps] = res;
    }
}
```

### 最长递增子序列的个数

力扣 673：[最长递增子序列的个数](https://leetcode.cn/problems/number-of-longest-increasing-subsequence/)

> `dp[i]`记录当前位置能构成的最长递增子序列的长度
> 
> 对`dp[i]==maxLength`的位置进行深度优先搜索，找到能构成其最长递增子序列的道路总数，返回条件为`dp[j]==1 && nums[j]<pre`，其中`pre`为上一层的数大小

```java
class Solution {
    private int[] dp;
    private int res;

    public int buildDp(int[] nums){
        res = 0;
        int n = nums.length;
        dp = new int[n];
        dp[0] = 1;
        int maxLength = 1;
        for(int i = 1; i < n; i++){
            int d = 0, j;
            for(j = i-1; j >= 0; j--){
                if(nums[j] < nums[i] && dp[j] > d){
                    d = dp[j];
                }
            }
            dp[i] = d+1;
            maxLength = Math.max(maxLength, dp[i]);
        }
        return maxLength;
    }

    public void dfs(int index, int pre, int[] nums){
        if(dp[index] == 1){
            if(nums[index] < pre){
                res++;
            }
            return;
        }
        for(int i = 0; i < index; i++){
            if(dp[i] == dp[index]-1 && nums[i] < nums[index]){
                dfs(i, nums[index], nums);
            }
        }
    }

    public int findNumberOfLIS(int[] nums){
        int n = nums.length;
        int maxLength = buildDp(nums);
        if(maxLength == 1){
            return n;
        }
        for(int i = 1; i < n; i++){
            if(dp[i] == maxLength){
                dfs(i, maxLength, nums);
            }
        }
        return res;
    }

}
```

### 累加数

力扣 306：[累加数](https://leetcode.cn/problems/additive-number/)

> 外两层循环枚举第一、第二结束点控制变量（`第一结束点+1==第二起始点`）
> 
> 内一层循环枚举第三结束点（`第二结束点+1==第三起始点`）
> 
> 若`pre+cur==next`，向后搜索下一组数，直到`index==n-1`，即第三结束点为串末尾，返回`true`
> 
> 若`pre+cur<next`，跳出本次循环，因为在第三结束点向后移动的过程中，`next`越来越大
> 
> 若`pre+cur>next`，向后循环遍历第三结束点，增大`next`

```java
package com.solution;

public class IsAdditiveNumber {
    public boolean isAdditiveNumber(String nums){
        int n = nums.length();
        char[] charNums = nums.toCharArray();
        for(int i = 0; i < n-1; i++){
            if(charNums[0] == '0' && i > 0){ return false; }
            long pre = Long.parseLong(nums.substring(0, i+1));
            for(int j = i+1; j < n-1; j++){
                if(charNums[i+1] == '0' && j > i+1){
                    continue;
                }
                long cur = Long.parseLong(nums.substring(i+1, j+1));
                if(dfs(nums, pre, cur, n, j)){
                    return true;
                }
            }
        }
        return false;
    }

    public boolean dfs(String nums, long pre, long cur, int length, int index) {
        //退出条件
        if (index == length-1) {
            return true;
        }
        for (int i = index + 1; i < length; i++) {
            if (nums.charAt(index + 1) == '0' && i > index + 1) { return false; }
            long next = Long.parseLong(nums.substring(index + 1, i + 1));
            System.out.println(pre + "+" + cur + " " + next + "  " + i);
            if (next > pre + cur) { return false; }
            if (next == pre + cur) { return dfs(nums, cur, next, length, i); }
        }
        return false;
    }

    public static void main(String[] args) {
        IsAdditiveNumber ian = new IsAdditiveNumber();
        System.out.println(ian.isAdditiveNumber("112358"));
    }
}
```

### 路径总和 II

力扣 113：[路径总和 II](https://leetcode.cn/problems/path-sum-ii/)

- 深度搜索，递归过程

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

    vector<vector<int>> res;

    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        if(!root){
            return res;
        }
        vector<int> vec;
        dfs(root, targetSum, vec);
        return res;
    }

    void dfs(TreeNode* node, int targetSum, vector<int>& fact){
        if(!node->left && !node->right){
            if(node->val == targetSum){
                fact.push_back(node->val);
                res.push_back(fact);
            }
            fact.clear();
        }
        fact.push_back(node->val);
        if(node->left){
            vector<int> left(fact);
            dfs(node->left, targetSum-node->val, left);
        }
        if(node->right){
            vector<int> right(fact);
            dfs(node->right, targetSum-node->val, right);
        }
        fact.clear();
    }
};
```

### 钥匙和房间

力扣 841：[钥匙和房间](https://leetcode.cn/problems/keys-and-rooms/)

- 遍历房间中的钥匙，用 flags[i] 表示第 i 个房间是否被访问过
- 再次访问到直接跳过，未访问到则访问并遍历该房间中的钥匙
- 如果 flags 中存在 false，则说明未遍历完
- 因为整个图只有一个入口，即 rooms[0]，如果从磁入口深度遍历不完，则说明该图无法通过 rooms[0] 到达所有节点

```c
Solution {
public:

    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        vector<int> flags(rooms.size(), 0);
        dfs(rooms, flags, 0);
        for(auto& flag: flags){
            if(!flag){
                return false;
            }
        }
        return true;
    }

    void dfs(vector<vector<int>>& rooms, vector<int>& flags, int index){
        if(flags[index]){
            return;
        }
        vector<int> keys = rooms[index];
        flags[index] = 1;
        for(auto& key: keys){
            dfs(rooms, flags, key);
        }     
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

