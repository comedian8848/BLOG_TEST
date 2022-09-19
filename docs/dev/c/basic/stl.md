---
title: C++ STL
date: 2022-9-17
tags:
  - C/C++
---

## 接口

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
for(iter = _map.begin(); iter != _map.end(); iter++) {
    cout << iter->first << " : " << iter->second << endl;
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

## 示例

map 的错误用法

~~~c
if(m[5] == NULL){
    m[5] = 1;
}
~~~

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

## 其他库

算术库

~~~c
#include <algorithm>
~~~

最大值、最小值函数

```c
res = max(prices[i]-pre, res);
```



