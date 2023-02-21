---
title: 模拟算法、哈希算法和位运算
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

### 单调栈

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

### 摩尔投票法

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

## 哈希算法

### 哈希设计

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

> 字符串哈希

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

> 链表哈希

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

> 图哈希

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
