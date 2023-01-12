---
title: 数据结构实现
date: 2021-8-24
tags:
  - Datastruct
  - C/C++
---

> 是手撸的哦

## 顺序表

### 单向链表

力扣 707：[设计链表](https://leetcode.cn/problems/design-linked-list/)

```c
struct Node{
    int val;
    Node* next;
    Node() : val(0), next(nullptr) {}
    Node(int x) : val(x), next(nullptr) {}
    Node(int x, Node *next) : val(x), next(next) {}
};

class MyLinkedList {
public:

    Node* head;
    
    int length;

    MyLinkedList() {
        head = new Node(-1);
        length = 0;
    }

    Node* getNode(int index){
        Node* p = head->next;
        while(index > 0){
            p = p->next;
            index--;
        }
        return p;
    }
    
    int get(int index) {
        if(index >= length || index < 0){
            return -1;
        }
        return getNode(index)->val;
    }
    
    void addAtHead(int val) {
        Node* node = new Node(val, head->next);
        head->next = node;
        length++;
    }
    
    void addAtTail(int val) {
        Node* p = head;
        while(p->next){
        	p = p->next;
		}
        p->next = new Node(val);
        length++;
    }
    
    void addAtIndex(int index, int val) {
        if(index > length){
            return;
        } else if(index <= 0){
            addAtHead(val);
        } else if(index == length){
            addAtTail(val);
        } else {
            Node* node = getNode(index-1);
            Node* newNode = new Node(val, node->next);
            node->next = newNode;
            length++;
        }
    }
    
    void deleteAtIndex(int index) {
        if(index >= length || index < 0){
            return;
        }
        if(index == 0){
        	head->next = head->next->next;
        	length--;
        	return;
		}
        Node* pre = getNode(index-1);
        Node* cur = pre->next;
        Node* next = pre->next->next;
        pre->next = next;
        delete(cur);
        length--;
    }
};

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * MyLinkedList* obj = new MyLinkedList();
 * int param_1 = obj->get(index);
 * obj->addAtHead(val);
 * obj->addAtTail(val);
 * obj->addAtIndex(index,val);
 * obj->deleteAtIndex(index);
 */
```

## 栈和队列

### 栈的链表实现

```c
#include <iostream>
using namespace;

struct LinkedNode {
    int val = 0;
    LinkedNode* next = nullptr;
    LinkedNode() {};
    LinkedNode(int val){
        this->val = val;
    }
    int getVal(){
        return val;
    }
};

class Stack{

private:
    int length = 0;
    LinkedNode* top = new LinkedNode();

public:
    Stack() {};
    bool empty();
    void push(int val);
    void clear();
    int pop();
    int peek();
    int size();
};
```

```c
#include "Stack.h"

void Stack::push(int val) {
    LinkedNode* node = new LinkedNode(val);
    node->next = top->next;
    top->next = node;
    length++;
}

void Stack::clear() {
    top = new LinkedNode();
    length = 0;
}

int Stack::pop() {
    if (empty()) {
        cout << "The Stack Is Empty" << endl;
        return -1;
    }
    LinkedNode* temp = top->next;
    int res =temp->getVal();
    top->next = temp->next;
    free(temp);
    length--;
    return res;
}

int Stack::peek() {
    if (empty()) {
        cout << "The Stack Is Empty" << endl;
        return -1;
    }
    return top->next->getVal();
}

bool Stack::empty() {
    if (length == 0) {
        return true;
    }
    return false;
}

int Stack::size() {
    return length;
}
```

### 栈的数组实现

力扣 155：[最小栈](https://leetcode.cn/problems/min-stack/)

```c
class MinStack {
public:

    vector<int> stack;

    int min;

    MinStack() {
        min = INT_MAX;
    }

    void push(int val) {
        stack.push_back(val);
        if(val < min){
            min = val;
        }
    }

    void pop() {
        int index = stack.size()-1;
        int top = stack[index];
        stack.erase(stack.begin()+index);
        if(min == top){
            min = *min_element(stack.begin(), stack.end());
        }
        if(stack.size() == 0){
            min = INT_MAX;
        }
    }

    int top() {
        return stack[stack.size()-1];
    }

    int getMin() {
        return min;
    }
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack* obj = new MinStack();
 * obj->push(val);
 * obj->pop();
 * int param_3 = obj->top();
 * int param_4 = obj->getMin();
 */
```

### 队列的链表实现

```c
#include <iostream>
using namespace;

struct DLinkedNode {
    int val = 0;
    DLinkedNode* next = nullptr;
    DLinkedNode* prev = nullptr;
    DLinkedNode() {};
    DLinkedNode(int val){
        this->val = val;
    }
    int getVal() {
        return val;
    }
};

class Deque{

private:
    int length = 0;
    DLinkedNode* head;
    DLinkedNode* tail;

public:
    Deque();
    void offer(int val);
    void offerFirst(int val);
    int peek();
    int peekLast();
    int poll();
    int pollLast();
    int size();
    bool empty();
};
```

```c
#include "Deque.h"

int Deque::size() {
    return length;
}

Deque::Deque() {
    head = new DLinkedNode();
    tail = new DLinkedNode();
    head->next = tail;
    tail->prev = head;
}

//入队，插入到队尾
void Deque::offer(int val) {
    DLinkedNode* node = new DLinkedNode(val);
    DLinkedNode* next = head->next;
    node->prev = head;
    node->next = next;
    head->next = node;
    next->prev = node;    
    length++;
}

//入队，插入到队首
void Deque::offerFirst(int val) {
    DLinkedNode* node = new DLinkedNode(val);
    DLinkedNode* prev = tail->prev;
    node->prev = prev;
    node->next = tail;
    tail->prev = node;
    prev->next = node;
    length++;
}

//检索队首
int Deque::peek() {
    if (length == 0) {
        cout << "The Deque Is Empty" << endl;
        return -1;
    }
    return tail->prev->getVal();
}

//检索队尾
int Deque::peekLast() {
    if (length == 0) {
        cout << "The Deque Is Empty" << endl;
        return -1;
    }
    return head->next->getVal();
}

int Deque::poll() {
    if (length == 0) {
        cout << "The Deque Is Empty" << endl;
        return -1;
    }
    DLinkedNode* temp = tail->prev;
    int res = temp->getVal();
    temp->prev->next = tail;
    tail->prev = temp->prev;
    free(temp);
    length--;
    return res;
}

int Deque::pollLast() {
    if (length == 0) {
        cout << "The Deque Is Empty" << endl;
        return -1;
    }
    DLinkedNode* temp = head->next;
    int res = temp->getVal();
    temp->next->prev = head;
    head->next = temp->next;
    free(temp);
    length--;
    return res;
}


bool Deque::empty() {
    if (length == 0) {
        return true;
    }
    return false;
}
```

## 树和图

### 二叉树

```c
#include <stdio.h>
#include <malloc.h>
#include <iostream>
using namespace std;


struct node{
    char val;
    node* l;
    node* r;
};

node* node_new(){
    node* n = new node();
    n->l = NULL;
    n->r = NULL;
    return n;
}

void tree_del(node* root){
    if(root->l != NULL){
        tree_del(root->l);
    }
    if(root->r != NULL){
        tree_del(root->r);
    }
    free(root);
}


//前序遍历 
void preorder_traversal(node* root){
    if(root->val == '#'){
        return;
    }
    cout << root->val;
    preorder_traversal(root->l);
    preorder_traversal(root->r);
}

//中序遍历 
void inorder_traversal(node* root){
    if(root->val == '#'){
        return;
    }
    inorder_traversal(root->l);
    cout << root->val;
    inorder_traversal(root->r);
}

//后序遍历 
void postorder_traversal(node* root){
    if(root->val == '#'){
        return;
    }
    postorder_traversal(root->l);
    postorder_traversal(root->r);
    cout << root->val;
}


void traversal(node* root){
    if(root->val == '#'){
        return;
    }
    preorder_traversal(root);
    cout << endl;
    inorder_traversal(root);
    cout << endl;
    postorder_traversal(root);
    cout << endl;
}



//用于记录字符数组下标位置 
static int pos = 0;
//中序构造 
void node_add(node* root, char* vals){
    //cout << vals[pos] << endl;
    root->val = vals[pos];
    if(vals[pos++] == '#'){
        //cout << "hahaha" << endl; 
        return;
    }
    root->l = node_new(); 
    node_add(root->l, vals);
    root->r = node_new();
    node_add(root->r, vals);    
}

void tree_build(node* root, char* vals){
    node_add(root, vals);
    pos = 0;
}


//求叶子个数 
int leaf(node* root){
    if(root->val == '#'){
        return 0;
    }

    if(root->l->val == '#' && root->r->val == '#'){
        return 1;
    }

    int n1 = 0, n2 = 0;
    n1 = leaf(root->l);
    n2 = leaf(root->r);

    return n1+n2;
}
```

### 字典树

> 也叫前缀树

力扣 208：[实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/)

```java
class Trie {

    private Trie[] children;
    private boolean isEnd;

    public Trie() {
        children = new Trie[26];
        isEnd = false;
    }

    public void insert(String word) {
        Trie p = this;
        for(int i = 0; i < word.length(); i++){
            char c = word.charAt(i);
            int index = c-'a';
            if(p.children[index] == null){
                p.children[index] = new Trie();
            }
            p = p.children[index];
        }
        p.isEnd = true;
    }

    private Trie searchPrefix(String prefix){
        Trie p = this;
        for(int i = 0; i < prefix.length(); i++){
            char c = prefix.charAt(i);
            int index = c-'a';
            if(p.children[index] == null){
                return null;
            }
            p = p.children[index];
        }
        return p;
    }

    public boolean search(String word) {
        Trie n = searchPrefix(word);
        if(n == null || n.isEnd == false){
            return false;
        }
        return true;
    }

    public boolean startsWith(String prefix) {
        if(searchPrefix(prefix) == null){
            return false;
        }
        return true;
    }
}
```

### 无向图

自己乱写的无向图

```c
#include <iostream>
using namespace std;
#define MAX 100

struct node{
    char val;
    int size;
    node** bro;
};

node* node_build(char v){
    node* n = new node();
    n->val = v;
    n->size = 0;
    n->bro = new node*[MAX]; 
    return n;
}

void node_del(node* v){
    /*for(int i = 0; i < v->size; i++){
        delete(v->bro[i]);
    }*/
    delete(v);
}

void node_add(node* n, node* v){
    n->bro[n->size++] = v;
    v->bro[v->size++] = n;
} 

node** map_build(int m, int n){
    char* tops = new char[m];
    cin >> tops;
    node** nodes = new node*[m];
    for(int i = 0; i < m; i++){
        nodes[i] = node_build(tops[i]);
    }
    delete(tops);
    char* connect = new char[2];
    for(int j = 0; j < n; j++){
        cin >> connect;
        node* v1 = NULL;
        node* v2 = NULL;
        for(int t = 0; t < m; t++){
            if(nodes[t]->val == connect[0]){
                v1 = nodes[t];
            }
            if(nodes[t]->val == connect[1]){
                v2 = nodes[t];
            }
        }
        node_add(v1, v2);
    }

    return nodes;
}



int main(){
    //输入顶点个数，边个数 
    int m, n;
    cin >> m >> n;
    node** map = map_build(m, n);

    for(int i = 0; i < m; i++){
        if(i != m-1)    { cout << map[i]->size << " "; }
        else            { cout << map[i]->size; }        
        delete map[i];
    }
    delete(map);

    return 0;
}
```

网上的邻接表构造无向图

```c
#include<iostream>
using namespace std;


typedef struct ENode{ //表结点 
    char data;
    struct ENode* next; 
} ENode;


typedef struct VNode{  //头结点 
    char data;
    ENode* fistedges;
} VNode, vertex[20];


typedef struct{
    vertex v;
    int numNode,numedges;
} Graph;


int find(Graph G, char c) { //找到对应弧 
    for(int i = 0; i < G.numNode; i++)
    {
        if(G.v[i].data == c)
            return i;
     } 
    return -1;
}


void Create(Graph G) {
    cin >> G.numNode >> G.numedges;

    for(int i = 0; i < G.numNode; i++) {    //保存顶点 
        char a;
        cin >> a;
        G.v[i].data = a; 
        G.v[i].fistedges = NULL;
    }

    for(int i = 0; i < G.numedges; i++) {    //保存边 
        char a, b;
        cin >> a >> b;
        int p = find(G, a);
        int q = find(G, b);
        ENode* pre = new ENode();

         //将b接在表头a的后面    
        pre = G.v[p].fistedges;
        if(pre == NULL){
            ENode* qre = new ENode();
            qre->data = b;
            qre->next = NULL;
            G.v[p].fistedges = qre; 
        } else {
            while(pre->next != NULL) {
                pre = pre->next;
            }
            ENode* qre = new ENode();
            qre->data = b;
            qre->next = NULL;
            pre->next = qre;            
        }
        //将a接到表头b的后面
        pre = G.v[q].fistedges;
        if(pre == NULL) {
            ENode* qre = new ENode();
            qre->data = a;
            qre->next = NULL;
            G.v[q].fistedges = qre; 
        } else {
            while(pre->next != NULL) {
                pre = pre->next;
            }
            ENode* qre = new ENode();
            qre->data = a;
            qre->next = NULL;
            pre->next = qre;            
        }
    }
    //输出各个顶点的度
    for(int i = 0; i < G.numNode; i++) {
        int s = 0;
        for(ENode* p = G.v[i].fistedges; p != NULL; p = p->next) {
            s++;
        }
        if(i == 0)
            cout << s;
        else
            cout << " " << s;
     }
}

int main() {
    Graph G;
    Create(G);
    return 0;
}
```
