---
title: 朴素算法
date: 2021-6-22
tags:
  - Algorithm
---

## 模拟

### 杨辉三角

力扣 119：[杨辉三角 II](https://leetcode.cn/problems/pascals-triangle-ii/)

杨辉三角正常来说模拟更简单，但我选择用数学全排列解
$$
C_m^n = \frac{m\times(m-1)\times......\times(m-n+1)}{n!}
$$
第 m 行实际上就是
$$
[C_m^1, C_m^2,...,C_m^{m-1}, C_m^m]
$$
为了避免计算超出边界，利用上一次的计算结果迭代计算，其实还可以改进，因为前后半部分一模一样，时间复杂度可以降低到 O(n/2)

```c
class Solution {
public:
    vector<int> getRow(int rowIndex) {
        vector<int> res;
        res.push_back(1);
        for(int i = 0; i < rowIndex; i++){
            res.push_back((long)res[i]*(rowIndex-i)/(i+1));  
        }
        return res;
    }
};
```

### 螺旋矩阵

力扣 54：[螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

哈卵题目，麻烦死了，边界规定好

```c
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> res(n, vector<int> (n));
        int num = 1, tar = n*n;
        //上下左右边界
        int l = 0, t = 0, b = n-1, r = n-1;
        while(num <= tar){
            for(int i = l; i <= r; i++){
                res[t][i] = num++;
            }
            t++;
            for(int i = t; i <= b; i++){
                res[i][r] = num++;
            }
            r--;
            for(int i = r; i >= l; i--){
                res[b][i] = num++;
            }
            b--;
            for(int i = b; i >= t; i--){
                res[i][l] = num++;
            }
            l++;
        }
        return res;
    }
}; 
```

### 字符串相加 & 乘

力扣 415：[字符串相加](https://leetcode.cn/problems/add-strings/?envType=study-plan&id=shu-ju-jie-gou-ji-chu)

力扣 43：[字符串相乘](https://leetcode.cn/problems/multiply-strings/?envType=study-plan&id=shu-ju-jie-gou-ji-chu)

模拟加法、乘法，逐位计算，涉及到很多字符、字符串到数字的相互转换

```c
class Solution {
public:
    string multiply(string num1, string num2) {
        int m = num1.length(), n = num2.length();
        if(m == 1 && num1[0] == '0'){
            return "0";
        }
        if(n == 1 && num2[0] == '0'){
            return "0";
        }
        string res;

        for(int i = 1; i <= m; i++){
            string row;
            int cur = num1[m-i]-'0';
            int flag = 0;
            //cout << cur << endl;
            for(int j = 1; j <= n; j++){
                int fac = num2[n-j]-'0';
                int ans = cur * fac + flag;
                //cout << ans << endl;
                if(ans >= 10){
                    flag = ans/10;
                    ans = ans%10;  
                } else {
                    flag = 0;
                }
                //cout << ans << endl;
                row = to_string(ans) + row;
                //cout << row << endl;
            }
            if(flag){
                row = to_string(flag) + row;
            }
            for(int k = 1; k < i; k++){
                //cout << row << endl;
                row = row + "0";
            }
            if(i == 1){
                res = row;
            } else {
                res = addStrings(res, row);
            }
        }
        return res;
    }

    string addStrings(string num1, string num2) {
        int m = num1.size(), n = num2.size();
        int index = 1, flag = 0;
        int length = n>m ? n:m;
        string ans(length, ' ');
        while(index <= m && index <= n){
            int cur = (num1[m-index]-'0') + (num2[n-index]-'0');
            if(flag){
                cur++;
                flag = false;
            }
            if(cur >= 10){
                flag = true;
                ans[length-index] = (cur-10)+'0';
            } else {
                ans[length-index] = cur+'0';
            }
            index++;
        }
        while(index <= m){
            int cur = num1[m-index]-'0';
            if(flag){
                cur++;
                flag = false;
            }
            if(cur >= 10){
                flag = true;
                ans[length-index] = (cur-10)+'0';
            } else {
                ans[length-index] = cur+'0';
            }
            index++;
        }
        while(index <= n){
            int cur = num2[n-index]-'0';
            if(flag){
                cur++;
                flag = false;
            }
            if(cur >= 10){
                flag = true;
                ans[length-index] = (cur-10)+'0';
            } else {
                ans[length-index] = cur+'0';
            }
            index++;
        }
        if(flag){
            ans = "1" + ans;
        }
        return ans;
    }
};
```

### 两数相加

力扣 2：[两数相加](https://leetcode.cn/problems/add-two-numbers/)

用链表模拟加法过程

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
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        int flag = 0;
        ListNode *head = new ListNode(-1);
        ListNode *p = head, *p1 = l1, *p2 = l2;
        while(p1 && p2){
            int cur = p1->val + p2->val + flag;
            if(cur >= 10){
                flag = 1;
            } else {
                flag = 0;
            }
            p->next = new ListNode(cur%10);
            p = p->next;
            p1 = p1->next;
            p2 = p2->next;
        }
        while(p1){
            int cur = p1->val + flag;
            if(cur >= 10){
                flag = 1;
            } else {
                flag = 0;
            }
            p->next = new ListNode(cur%10);
            p = p->next;
            p1 = p1->next;
        }
        while(p2){
            int cur = p2->val + flag;
            if(cur >= 10){
                flag = 1;
            } else {
                flag = 0;
            }
            p->next = new ListNode(cur%10);
            p = p->next;
            p2 = p2->next;
        }
        if(flag){
            p->next = new ListNode(1);
        }
        return head->next;
    }
};
```

### 找出游戏的获胜者

力扣 1823：[找出游戏的获胜者](https://leetcode.cn/problems/find-the-winner-of-the-circular-game/)

- 模拟游戏过程，count 记录全局遍历次数

~~~c
class Solution {
public:
    int findTheWinner(int n, int k) {
        vector<int> vec;
        for(int i = 1; i <= n; i++){
            vec.push_back(i);
        }
        int count = 1;
        while(vec.size() > 1){
            for(int i = 0; i < vec.size(); count++){
                if(count % k == 0){
                    vec.erase(vec.begin()+i);
                } else {
                    i++;
                }
            }
        }
        return vec[0];
    }
};
~~~

### 二叉树的锯齿形层序遍历

力扣 103：[二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)

- 模拟遍历过程
- 记录行数奇偶，偶数正序，奇数 reverse()

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
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if(!root){ return res; }
        vector<TreeNode*> nodes;
        nodes.push_back(root);
        int count = 0;
        while(!nodes.empty()){
            int n = nodes.size();
            cout << nodes[0]->val << " ";
            vector<int> row;
            for(int i = 0; i < n; i++){
                TreeNode* cur = nodes[i];
                if(cur->left) { nodes.push_back(cur->left); }
                if(cur->right) { nodes.push_back(cur->right); }
                row.push_back(cur->val);
            }
            nodes.erase(nodes.begin(), nodes.begin()+n);
            if(count % 2 == 0) { res.push_back(row); }
            else { reverse(row.begin(), row.end()); res.push_back(row); }
            count++;
        }
        return res;
    }
};
~~~

## 单调栈

### 下一个更大元素 Ⅰ

[496. 下一个更大元素 I - 力扣（Leetcode）](https://leetcode.cn/problems/next-greater-element-i/)

从`num2`中找到第一个比`nums[i], 0<=i<=size`大的元素，记为`res[i]`，返回`res`数组

从后往前遍历，记当前值为 val，去掉栈中小于 val 的元素，因为是从前向后看找**第一个**比 val 大的元素，比当前小的元素会被大元素挡住，根本看不到，试着模拟这一过程，**就像站队，矮的在后面会被高的挡住**

这样去掉小的元素后，栈顶元素即为比当前值大的第一个元素值，若栈空，说明没有元素比当前值大，记为 -1，用一个`map<当前值, 大于当前值的第一个元素值`记录这一结果，按照 num1 的顺序构造 res 并返回

```c
class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        map<int, int> reco;
        stack<int> stk;
        int n = nums1.size(), m = nums2.size();
        for(int i = 1; i <= m; i++){
            // 从后往前遍历
            int cur = nums2[m-i];
            while(!stk.empty() && stk.top() < cur){
                stk.pop();
            }
            reco[cur] = stk.empty() ? -1:stk.top();
            stk.push(cur);
        }
        vector<int> res;
        for(int i = 0; i < n; i++){
            res.push_back(reco[nums1[i]]);
        }
        return res;
    }
};
```

## 摩尔投票法

### 多数元素

力扣 169：[多数元素](https://leetcode.cn/problems/majority-element/)

找出数组中出现次数大于 n/2 的数

- 每遇到相同的数，count+1，每遇到不同的数，count-1
- 当 count = 0，切换选举人为当前元素并重置票数为 1
- 将数视作两类，即数量为 n/2 的数（计做 x）和其他数，x 因为超过 n/2 个，总会被切换为候选人，且其 count 会被其他数不断 -1，但最终一定会 >= 1，即 card 最终会被保留为 x

```c
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int count = 1, card = nums[0];
        for(int i = 1; i < nums.size(); i++){
            if(count == 0){
                card = nums[i];
                count = 1;
                continue;
            }
            if(card == nums[i]){
                count++;
            } else {
                count--;
            }
        }
        return card;
    }
};
```

229、多数元素 II

找出数组中数量大于 n/3 的数
