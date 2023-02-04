---
title: 哈希和位
date: 2021-6-22
tags:
  - Algorithm
---

## 设计哈希

### 设计哈希集合

力扣 705：[设计哈希集合](https://leetcode.cn/problems/design-hashset/)

设计哈希集合，即 set，与上同理，更简单，使用`vector<int> set[]`进行储存

```c
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
```

### 设计哈希映射

力扣 706：[设计哈希映射](https://leetcode.cn/problems/design-hashmap/)

设计哈希表，即 map，使用`vector<pair<int,int>> map[]`的结构，即二维数组进行储存，冲突解决使用简单的除余法，即通过`key%LEN`来确定数据所在的桶

```c
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
```

## 字符串哈希

### 单词规律

力扣 290：[单词规律](https://leetcode.cn/problems/word-pattern/?envType=study-plan&id=shu-ju-jie-gou-ji-chu)

使用 hashmap 双射实现一一对应，这里单词模式匹配必须是一个字母匹配一个字符串，二者一一对应，不能`[a, nmsl], [b, nmsl]`

```c
class Solution {
public:
    bool wordPattern(string pattern, string s) {
        map<char, string> chToStr;
        map<string, char> strToCh;
        int n = s.length();
        int index = 0;
        for(int i = 0; i < n; i++){
            int j = i+1;
            char cur = pattern[index];
            while(j < n && s[j] != ' '){
                j++;
            }
            string temp = s.substr(i, j-i);
            if(strToCh.count(temp) && strToCh[temp] != cur){
                return false;
            }
            if(chToStr.count(cur) && chToStr[cur] != temp){
                return false;
            }
            chToStr[cur] = temp;
            strToCh[temp] = cur;
            index++;
            i = j;
        }
        if(index != pattern.length()){
            return false;
        }
        return true;
    }
};
```

### 根据字符出现频率排序

力扣 451：[根据字符出现频率排序](https://leetcode.cn/problems/sort-characters-by-frequency/)

- 排序 pair 数组，使用 lambda 表达式

```c
class Solution {
public:
    string frequencySort(string s) {
        map<char, int> m;
        for(int i = 0; i < s.size(); i++){
            m[s[i]]++;
        }
        vector<pair<char,int>> v;
        for(auto& it: m){
            v.push_back(pair<char, int> (it.first, it.second));
        }
        
        // lambda 函数作为参数传入
        sort(v.begin(), v.end(), [](pair<char,int> p1, pair<char,int> p2){
            return p1.second > p2.second;
        });
        
        string res = "";
        for(int i = 0; i < v.size(); i++){
            for(int j = 0; j < v[i].second; j++){
                res += v[i].first;
            }
        }
        return res;
    }
};
```



## 链表哈希

### 环形链表 II

力扣 142：[环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

返回链表中产生环的首个节点

```c
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
       set<ListNode*> s;
       while(head){
           if(s.count(head)){
               return head;
           }
           s.insert(head);
           head = head->next;
       } 
       return NULL;
    }
};
```

## 图哈希

### 找到小镇的法官

力扣 997：[找到小镇的法官](https://leetcode.cn/problems/find-the-town-judge/)

- 使用哈希集合、哈希表统计有向图信息

~~~c
class Solution {
public:
    int findJudge(int n, vector<vector<int>>& trust) {
        set<int> s;
        map<int, int> m;
        for(int i = 0; i < trust.size(); i++){
            if(!s.count(trust[i][0])) { s.insert(trust[i][0]); }
            m[trust[i][1]]++;
        }
        for(int i = 1; i <= n; i++){
            if(!s.count(i)){
                if(m[i]==n-1){
                    return i;
                }
            }
        }
        return -1;
    }
};
~~~

### 可以到达所有点的最少点数目

力扣 1557：[以到达所有点的最少点数目](https://leetcode.cn/problems/minimum-number-of-vertices-to-reach-all-nodes/)

- 返回最小的点集，通过该点集可以遍历图中所有节点
- 即找入度为 0 的节点的集合

```c
class Solution {
public:
    vector<int> findSmallestSetOfVertices(int n, vector<vector<int>>& edges) {
        set<int> s;
        for(auto& edge: edges){
            s.insert(edge[1]);
        }
        vector<int> res;
        for(int i = 0; i < n; i++){
            if(!s.count(i)){
                res.push_back(i);
            }
        }
        return res;
    }
};
```

### 直线上最多的点数

[直线上最多的点数](https://leetcode.cn/problems/max-points-on-a-line/)

## 位运算

[数字范围按位与](https://leetcode.cn/problems/bitwise-and-of-numbers-range/)
