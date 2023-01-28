---
title: 宽度优先
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

## Dijkstra 算法

BFS 算法的扩展，在广度优先搜索的基础上，加上了一个访问表和距离表

- 访问表：标记节点是否被访问，节点不会被重复访问，每个被访问的节点都认为其距离初始点的最短距离已经被确认
- 距离表：记录当前状态下，每个节点到初始点的距离，无法到达则为 INT_MAX

每一次处理，外层遍历先将当前所有节点中距离初始点最近的节点找出，并将这个距离视作其离初始点的最近距离，标记为已访问`visited[cur] = true, dist[cur] = distance(start, cur)`

内层遍历所有当前节点 cur 能访问到的节点 i（或所有暂未访问过的节点），更新他们距离初始点的最短距离`dist[i] = min(dist[i], dist[cur] + distance(cur, i))`

直到每个节点均被访问，那么所有节点距离初始点的最短长度均被确定，退出算法，得到完整的`dist[]`数组，即为结果

### 网络延迟时间

[743. 网络延迟时间 - 力扣（Leetcode）](https://leetcode.cn/problems/network-delay-time/)

求图中距离起点**加权路径**最长的距离

- 这里为了使脑子想的舒服，`graph[i][j]`即为节点 i 到节点 j 的距离，而节点编号是从 1 开始的，`graph[0]`和`visited[0]`都被浪费

```c
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        int m = n+1;
        vector<int> dist(m, INT_MAX/2);
        // 构造图
        vector<vector<int>> graph(m, vector<int>(m, INT_MAX/2));
        for(auto& edge: times){
            int cur = edge[0], next = edge[1], length = edge[2];
            graph[cur][next] = length;
        }

        // 记录节点是否访问
        vector<int> visited(m, 0);
        // 初始化第一个访问节点
        dist[k] = 0;
        // 开始遍历
        for(int i = 1; i <= n; i++){
            int cur = -1;
            for(int j = 1; j <= n; j++){
                // 忽略已访问节点，对于未访问节点进行比较，找到当前为访问中离初始点最近的点
                if(!visited[j] && (cur == -1 || dist[j] < dist[cur])){
                    cur = j;
                }
            }
            // 找到离初始点最近的一个节点，以此为基础向外扩展，确定各点离初始点的最近距离
            visited[cur] = true;
            for(int j = 1; j <= n; j++){
                if(graph[cur][j] == INT_MAX/2){
                    continue;
                }
                dist[j] = min(dist[j], dist[cur] + graph[cur][j]);
            }

        }
        int res = *max_element(dist.begin()+1, dist.end());
        return res == INT_MAX/2 ? -1 : res;
    }
};
```

### 最小体力消耗路径

[1631. 最小体力消耗路径 - 力扣（Leetcode）](https://leetcode.cn/problems/path-with-minimum-effort/description/)

图中，起点到终点的路径中，记录每个相邻点的距离差（每个点均可以上下左右相邻移动），路径中最大的距离差记为该路径的消耗，找到从起点到终点消耗最小的一条路径并且返回其消耗值大小

很朴素的解法：严格遵守 Dijkstra 算法

- 维护一个数组`dist[m*n]`，记录每个节点的最小的消耗值，初始化所有值为`INT_MAX/2, dist[0] = 0`
- 每一轮找到**消耗值最小且未被访问的节点**，记为当前节点，标记为已访问，进行扩展
- 向四方扩展，扩展规则如下
  - 首先取扩展节点的消耗值和相邻差的较小值，记为扩展结点值
  - 再取当前节点值和扩展结点值的较大值，赋予扩展结点
- 直到终点被访问，退出循环，返回`dist.back()`

```c
class Solution {
private:
    static constexpr int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();   
        int lim = INT_MAX / 2;
        vector<int> visited(m*n, false);
        vector<int> dist(m*n, lim);
        dist[0] = 0;
        while(!visited[m*n-1]){
            int x = -1, y = -1;
            int shortest = lim;
            for(int i = 0; i < m*n; i++){
                if(visited[i]){
                    continue;
                }
                if(dist[i] < shortest){
                    x = i/n; y = i%n;
                    shortest = dist[i];
                }
            }
            if(x == -1 || y == -1){
                break;
            }
            visited[x*n+y] = true;
            for(int i = 0; i < 4; i++){
                int nx = x + dirs[i][0];
                int ny = y + dirs[i][1];
                if(nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx*n+ny]){
                    dist[nx*n+ny] = max(dist[x*n+y],
                                    min(dist[nx*n+ny], abs(heights[nx][ny]-heights[x][y])));
                }
            }
        }
        return dist.back();
    }
};
```

但是这样朴素的 Dijkstra 并不得到认可，因为遍历寻找最小值太慢了，所以要用到优先队列，但是很几把蠢

```c
class Solution {
private:
    static constexpr int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();   
        int lim = INT_MAX / 2;
        vector<int> visited(m*n, false);
        vector<int> dist(m*n, lim);

        auto cmp = [](const vector<int>& a, const vector<int>& b){
            return a[2] > b[2];
        };
        priority_queue<vector<int>, vector<vector<int>>, decltype(cmp)> queue(cmp);
        queue.push({0,0,0});
        
        dist[0] = 0;
        while(!queue.empty()){
            vector<int> cur = queue.top();
            queue.pop();
            int x = cur[0], y = cur[1];
            if(x == -1 || y == -1){ break; }
            visited[x*n+y] = true;
            for(int i = 0; i < 4; i++){
                int nx = x + dirs[i][0];
                int ny = y + dirs[i][1];
                if(nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx*n+ny]
                   && max(dist[x*n+y], abs(heights[nx][ny]-heights[x][y])) < dist[nx*n+ny]){
                    dist[nx*n+ny] = max(dist[x*n+y], abs(heights[nx][ny]-heights[x][y]));
                    queue.push({nx, ny, dist[nx*n+ny]});
                }
            }
        }
        return dist[m*n-1];
    }
};
```

### 概率最大的路径

[1514. 概率最大的路径 - 力扣（Leetcode）](https://leetcode.cn/problems/path-with-maximum-probability/)

普通每轮枚举找到最大权重路径，向下扩展，11/18 超时

```c
class Solution {
public:
    // 判断终点是否可达，BFS
    bool reachable(vector<vector<int>>& edges, int start, int end){
        int n = edges.size();
        vector<int> visited(n, false);
        deque<int> queue;
        queue.push_back(start);
        while(!queue.empty()){
            int cur = queue.front();
            queue.pop_front();
            if(cur == end){
                return true;
            }
            for(int i = 0; i < n; i++){
                if(visited[i]){
                    continue;
                }
                if(edges[i][0] == cur || edges[i][1] == cur){
                    visited[i] = true;
                    int next = edges[i][0] == cur ? edges[i][1] : edges[i][0];
                    queue.push_back(next);
                }
            }
        }
        return false;
    }

    double maxProbability(int n, vector<vector<int>>& edges, vector<double>& succProb, int start, int end) {
        if(!reachable(edges, start, end)){
            return 0;
        }
        int m = edges.size();
        vector<double> dist(n, 0);
        vector<int> visited(n, false);
        dist[start] = 1;
        while(!visited[end]){
            int cur = -1;
            double max = 0;
            // 枚举选取当前最大节点，进行后续扩展
            for(int i = 0; i < n; i++){
                if(visited[i]){
                    continue;
                }
                if(dist[i] > max){
                    max = dist[i];
                    cur = i;
                }
            }
            visited[cur] = true;
            for(int i = 0; i < m; i++){
                if(edges[i][0] == cur || edges[i][1] == cur){
                    int next = edges[i][0] == cur ? edges[i][1] : edges[i][0];
                    dist[next] = dist[next] > dist[cur]*succProb[i] ? dist[next] : dist[cur]*succProb[i];
                }
            }
        }
        return dist[end];
    }
};
```

用优先队列优化了枚举当前扩展的节点的过程，还是过不了 11/18

```c
class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges, vector<double>& succProb, int start, int end) {
        int m = edges.size();

        vector<vector<double>> graph(n, vector<double>(n, 0));
        for(int i = 0; i < m; i++){
            int x = edges[i][0], y = edges[i][1];
            graph[x][y] = succProb[i];
            graph[y][x] = succProb[i];
        }

        static vector<double> dist;
        dist = vector<double>(n, 0);
        dist[start] = 1;
        
        vector<int> visited(n, 0);

        auto cmp = [](const int& a, const int& b){
            return dist[a] < dist[b];
        };
        priority_queue<int, vector<int>, decltype(cmp)> queue(cmp);
        queue.push(start);

        while(!visited[end] && !queue.empty()){
            int cur = queue.top();
            queue.pop();
            if(visited[cur]){
                continue;
            }
            visited[cur] = true;
            vector<double> wights = graph[cur];
            for(int i = 0; i < n; i++){
                if(wights[i] == 0 || visited[i]){
                    continue;
                }
                int next = i;
                dist[next] = max(dist[next], dist[cur]*wights[i]);
                queue.push(next);
            }
        }
        return dist[end];
    }
};
```

