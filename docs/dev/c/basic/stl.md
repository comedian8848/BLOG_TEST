---
title: C++ STL
date: 2022-9-17
tags:
  - C/C++
---

## STL 接口

> 数组和指针这种东西真是太繁琐复杂了，个人愚见，在C++里就尽量使用STL，并且可以用模板的非类型形参来解决这种灵活处理不固定行列数矩阵的函数，Effective C++里面应该有介绍，并且有对这种模板的优化

### map

- 通过 m[i] = j 插入键值对

~~~c
map<int, int> _map;
_map[9] = 10;
~~~

- 通过 if(m.count(i)) 判断键 i 是否存，因为只有 1/0

~~~c
if(_map.count(9)){
    cout << "9 exist, the value is" << _map[9] << endl;
}
~~~

- 遍历：使用元素指针遍历

~~~c
map<int, int>::iterator iter;
for(iter = _map.begin(); iter != _map.end(); iter++) {
    cout << iter->first << " : " << iter->second << endl;
}

for(auto it: _map){
    cout << it.first << " : " << it.second << endl;
}
~~~

### set

- 通过 insert() 函数插入值

~~~c
set <int> _set;
set.insert(7)
~~~

- 通过 count() 判断是否存在

~~~c
if(_set.count(4)){
    cout << "dead" << endl;
}
~~~

### vector

- push_back() 向后插入

~~~c
vector<int> vec;
vec.push_back(1);
vec.push_back(4);
vec.push_back(7);
~~~

- erase() 删除元素

~~~c
// 删除下标为 1 的元素
vec.erase(vec.begin()+1);
~~~

- back() 返回末尾元素

~~~c
// 合并区间
// sort() 排序的是每个 vector 的首地址元素，也就是 vec[0]
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
~~~

- 初始化固定大小 vector

~~~c
vector<int> vec(n);

vector<vector<int>> matrix(n, vector<int> (n));
~~~

### stack

- top()：返回一个栈顶元素的引用，类型为 T&。如果栈为空，返回值未定义
- push(const T& obj)：可以将对象副本压入栈顶。这是通过调用底层容器的 push_back() 函数完成的
- push(T&& obj)：以移动对象的方式将对象压入栈顶。这是通过调用底层容器的有右值引用参数的 push_back() 函数完成的
- pop()：弹出栈顶元素，**无返回**
- size()：返回栈中元素的个数
- empty()：在栈中没有元素的情况下返回 true

### deque

> 在处理首部元素时效率远大于 vector

- push_back(elem)：在容器尾部添加一个数据
- push_front(elem)：在容器头部插入一个数据
- pop_back()：删除容器最后一个数据
- pop_front()：删除容器第一个数据
- front()：返回第一个元素
- back()：返回末尾元素

### pair

> 配合 map 或 vector 使用

- 创建 pair

~~~c
pair<int,int> p (1,1);
    
pair p = make_pair('h', 9);
~~~

- vector+pair 实现 map

~~~c
vector<pair<int,int>> map;
~~~

- map 插入键值对

~~~c
map.insert(pair<int,int>(1,2));

map.insert(make_pair(1,2));
~~~

## 一些示例

### vector 和数组

使用`vector<int>`标记代替 bool 数组进行标记，使用`bool row[m], col[n]`在寻址时会报错，说你没初始化，在 c 中，bool 值就是用 int 值实现，所以二者之间可以相互赋值

- 以下是使用 stl 库避免繁琐的指针数组的一个成功案例：将二维矩阵中为 0 元素的所在行、列元素均置零

~~~c
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        vector<int> row(m), col(n);
        for(int i = 0; i < m; i++){
            for(int j = 0; j < n; j++){
                if(matrix[i][j] == 0){
                    row[i] = true;
                    col[j] = true;
                }
            }
        }
        for(int i = 0; i < m; i++){
            for(int j = 0; j < n; j++){
                if(row[i] || col[j]){
                    matrix[i][j] = 0;
                }
            }
        }
    }
};
~~~

当然，在知道数组范围的时候，使用数组也是可以的，这里注意数组的初始化语句

- 此为判断九宫格数独游戏是否有解的函数

~~~c
class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        // 数组定义和初始化
        int row[9][9] = {{0}}, col[9][9] = {{0}};
        int block[3][3][9] = {{{0}}};
        // ---------分割一下-------- //
        for(int i = 0; i < 9; i++){
            for(int j = 0; j < 9; j++){
                char c = board[i][j];
                int k = c-'1';
                if(c != '.'){
                    if(row[i][k] || col[k][j] || block[i/3][j/3][k]){
                        return false;
                    }
                    row[i][k] = true; 
                    col[k][j] = true;
                    block[i/3][j/3][k] = true;
                }
            }
        }
        return true;
    }
};
~~~

### 递归程序设计

> 树相关

构造结构体/类指针

~~~c
ListNode* head = new ListNode(-1); // 必须这样初始化，不能直接 ListNode* head;
~~~

对称二叉树，判断一个二叉树是否对称

~~~c
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
~~~

路径总和，判断数中是否存在和为 target 的路径，路径指从根节点到叶子节点（递归 dfs）

~~~c
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
~~~

翻转二叉树，将二叉树左右翻转（后序遍历）

~~~c
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
~~~

验证搜索二叉树，被折磨了，其实抓住了是边界问题，但没找准，另外这个 int 的溢出真几把恶心，也不说一声

~~~c
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
~~~

平衡二叉树的最近公共祖先，其实很简单，因为平衡，所以当目标值和当前节点之差异号时，说明在当前节点两侧

~~~c
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
~~~

### 位运算

出现一次的数字，使用异或操作，数字只会出现一次或两次

- 0 ^ a = a
- a ^ a = a
- a ^ a ^ b = b

~~~c
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for(int i = 0; i < nums.size(); i++){
            res ^= nums[i];
        }
        return res;
    }
};
~~~

### 摩尔投票法

找出数组中出现次数大于 n/2 的数

- 每遇到相同的数，count+1，每遇到不同的数，count-1
- 当 count = 0，切换选举人为当前元素并重置票数为 1
- 将数视作两类，即数量为 n/2 的数（计做 x）和其他数，x 因为超过 n/2 个，总会被切换为候选人，且其 count 会被其他数不断 -1，但最终一定会 >= 1，即 card 最终会被保留为 x

~~~c
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
~~~

229、找出数组中数量大于 n/3 的数

### 排序和双指针

三数之和，一年后又忘鸟

- 解决重复问题，固定起始位，利用双指针缩小范围
- 当碰到连续的相同元素直接跳过，避免重复

~~~c
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
~~~

### 设计哈希集合 & 映射

设计哈希映射，即 map，使用`vector<pair<int,int>> map[]`的结构，即二维数组进行储存，冲突解决使用简单的除余法，即通过`key%LEN`来确定数据所在的桶

~~~c
class MyHashMap {

private:
    const static int MAX_LEN = 1000;

    vector<pair<int,int>> map[MAX_LEN];

    int getIndex(int key){
        return key%MAX_LEN;
    }

    int getPos(int key, int index){
        for(int i = 0; i < map[index].size(); i++){
            if(map[index][i].first == key){
                return i;
            }
        }
        return -1;
    }

public:
    MyHashMap() {
    }
    
    void put(int key, int value) {
        int index = getIndex(key);
        int pos = getPos(key, index);
        if(pos == -1){
            map[index].push_back(make_pair(key, value));
        } else {
            map[index][pos].second = value;
        }
    }
    
    int get(int key) {
        int index = getIndex(key);
        int pos = getPos(key, index);
        if(pos == -1){
            return -1;
        }
        return map[index][pos].second;
    }
    
    void remove(int key) {
        int index = getIndex(key);
        int pos = getPos(key, index);
        if(pos >= 0){
            map[index].erase(map[index].begin()+pos);
        }
    }
};
~~~

与上同理，更简单，使用`vector<int> set[]`进行储存

~~~c
class MyHashSet {
private:
    const static int LEN = 1000;

    vector<int> set[LEN];

    int getIndex(int key){
        return key%LEN;
    }

    int getPos(int key, int index){
        for(int i = 0; i < set[index].size(); i++){
            if(set[index][i] == key){
                return i;
            }
        }
        return -1;
    }
public:
    MyHashSet() {
    }
    
    void add(int key) {
        int index = getIndex(key);
        int pos = getPos(key, index);
        if(pos == -1){
            set[index].push_back(key);
        } else {
            set[index][pos] = key;
        }
    }
    
    void remove(int key) {
        int index = getIndex(key);
        int pos = getPos(key, index);
        if(pos >= 0){
            set[index].erase(set[index].begin()+pos);
        }        
    }
    
    bool contains(int key) {
        int index = getIndex(key);
        int pos = getPos(key, index);
        if(pos >= 0){
            return true;
        }   
        return false;
    }
};
~~~

### 模拟

杨辉三角也可以模拟，但我选择用数学全排列解
$$
C_m^n = \frac{m\times(m-1)\times......\times(m-n+1)}{n!}
$$
第 m 行实际上就是
$$
[C_m^1, C_m^2,...,C_m^{m-1}, C_m^m]
$$
为了避免计算超出边界，利用上一次的计算结果迭代计算，其实还可以改进，因为前后半部分一模一样，时间复杂度可以降低到 O(n/2)

~~~c
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
~~~

螺旋矩阵，哈卵题目，麻烦死了

~~~c
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
~~~

## 其他库

### algorithm

最大值、最小值函数

~~~c
res = max(prices[i]-pre, res);
~~~

排序函数，排序一段连续的地址

~~~c
// vec 为 vector
sort(vec.begin(), vec.end());
// arr 为数组
sort(arr, arr+10);
~~~

### string

遍历 string

~~~c
for(int i = 0; i < str.size(); i++){
    cout << str[i] << endl;
}
~~~
