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

## 一些示例

### 关于 stl

map 的错误用法

~~~c
if(m[5] == NULL){
    m[5] = 1;
}
~~~

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

### 结构体指针

升序合并链表

~~~c
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
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode* head = new ListNode(-1);
        ListNode* p = head;
        while(list1 != NULL && list2 != NULL){
            if(list1->val <= list2->val){
                p->next = new ListNode(list1->val);
                list1 = list1->next;
            } else {
                p->next = new ListNode(list2->val);
                list2 = list2->next;
            }
            p = p->next;
        }
        while(list1 != NULL){
            p->next = new ListNode(list1->val);
            p = p->next;
            list1 = list1->next;
        }
        while(list2 != NULL){
            p->next = new ListNode(list2->val);
            p = p->next;
            list2 = list2->next;
        }

        return head->next;
    }
};
~~~

这里第一步初始化 head 是必须的，不可以这样，不知为何

~~~c
ListNode* head;
~~~

使用 new ListNode() 的方式构造指针

### 递归程序设计

> 老是忘递归，记录一下

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



## 其他库

### algorithm

最大值、最小值函数

~~~c
res = max(prices[i]-pre, res);
~~~

### string

遍历 string

~~~c
for(int i = 0; i < str.size(); i++){
    cout << str[i] << endl;
}
~~~
