---
title: 操作系统实验
date: 2022-11-20
tags:
  - C/C++

---

## PCB 调度模拟

### 定义及初始化

头文件引入；结构体及内函数定义

```c
#include <iostream>
using namespace std;
#include <vector>
#include <map>
#include <set>
#include <stack>
#include <deque>
#include <algorithm>
#include <string> 

struct PCB {
	int id; // 标识 
	int priority; // 优先级 
	int cpu_time; // 已占用的 cpu 时间 
	int all_time; // 还需要占用的 cpu 时间 
	int start_block; // 经过多少个时间片后进入阻塞态 
	int block_time; //  阻塞的时间片 
	int state; // 进程状态，执行完 -1 、阻塞 0、就绪 1
	
	PCB() {}
	
	PCB(int i, int p, int c, int a, int sb, int bt, int s){
		id = i;
		priority = p;
		cpu_time = c;
		all_time = a;
		start_block = sb;
		block_time = bt;
		state = s;
	} 
	
	void print_priority(){
		cout << id << '[' << priority << ']'; 
	}
	
	void print(){
		cout << id << '\t'
			 << priority << "\t\t"
			 << cpu_time << "\t\t"
			 << all_time << "\t\t"
			 << start_block << "\t\t"
			 << block_time << "\t\t";
		if(state == -1){
			cout << "end\n";
		} else if(state == 0){
			cout << "block\n";
		} else if(state == 1){
			cout << "ready\n";
		}
	}
};
```

定义全局变量

```c
deque<PCB> queue; // 执行顺序表 
vector<int> index; // 下标映射，因为表需要从0按序打印，而队列是根据优先级排列，即 index[0] 是 PCB-0 在 queue 中的下标 
int ready_count = 0; // 就绪进程数
int block_count = 0; // 阻塞进程数
int end_count = 0; // 完成进程数
int slice_count = 0; // 总时间片使用数
```

初始化

```c
// 初始化 table 
void init(){
	PCB p0(0,9,2,1,0,0,0), p1(1,38,3,0,-1,0,-1), p2(2,30,0,6,-1,0,1),
		p3(3,29,0,3,-1,0,1), p4(4,0,0,4,-1,0,1);
		
	queue.push_back(p0);
	queue.push_back(p1);
	queue.push_back(p2);
	queue.push_back(p3);
	queue.push_back(p4);
	
	for(int i = 0; i < queue.size(); i++){
		index.push_back(i);
	}
	
	set_sequence();
	update_index();
}
```

### 优先级调度算法

优先级排序

```c
// PCB 排序 
bool PCB_sort(PCB p1, PCB p2){
	if(p1.state != p2.state){
		return p1.state > p2.state;
	}
	return p1.priority > p2.priority;
}


// 调整 queue 中 PCB 优先顺序 
void sort_queue(){
	sort(queue.begin(), queue.end(), PCB_sort);
	ready_count = 0; block_count = 0; end_count = 0;
	for(int i = 0; i < queue.size(); i++){
		if(queue[i].state == 1){
			ready_count++;
		} else if(queue[i].state == 0){
			block_count++;
		} else if(queue[i].state == -1){
			end_count++;
		}		
	}
}
```

主逻辑实现

- 更新优先级队列，按照优先级排序
  - 就绪 > 阻塞 > 终止
  - 同一状态下，优先级权重高的优先
- 进程状态更新
  - 当前运行进程状态更新
  - 就绪进程状态更新
  - 阻塞进程状态更新
- 实现 PCB ID 和其在优先队列中下标的映射：为了方便按 ID 顺序输出

```c
// 设置执行队列顺序，若第一个进程也执行完，说明所有进程执行完，返回 false 
int set_sequence(){
	sort_queue();
	PCB cur = queue.front();
	if(cur.state == -1){
		return 0;
	}
	return 1;
}
	
void use(PCB& p){
	p.priority -= 3;
	p.cpu_time++;
	p.all_time--;
	// 若执行完，直接置为 -1 ，不进行后续判断 
	if(p.all_time <= 0){
		p.state = -1;
	} else { // 若未执行完，判断是否阻塞 
		if(p.start_block > 0){
			p.start_block--;
		}
		if(p.start_block == 0){
			p.state = 0;
		}
	}	
}

void ready_use(PCB& p){
	p.priority++;
}

void block_use(PCB& p){
	p.block_time--;
	if(p.block_time <= 0){
		p.state = 1;
	}
}


void update_index(){
	for(int i = 0; i < queue.size(); i++){
		//cout << queue[i].id << endl;
		index[queue[i].id] = i;
	}
}


void use(){
	use(queue[0]);
	for(int i = 1; i < ready_count; i++){
		ready_use(queue[i]);
	}
	for(int i = ready_count; i < ready_count + block_count; i++){
		block_use(queue[i]);
	}
}
```

### 辅助功能及主函数

打印输出

```c
void print_colume(){
	cout << "ID\tPriority\tCPU Time\tAll Time\tStart Block\tBlock Time\tState" << endl;
	cout << "---------------------------------------------------------------------------------------------\n";
}

// 打印当前所有进程状态 
void print_table(int flag){
	cout << "System CPU Time: " << slice_count << endl; // 使用时间片 
	
	cout << "Running Process: ";
	if(flag){
		queue[0].print_priority(); 		// 本次运行 PCB 
	}
	cout << endl;
	
	// 就绪队列 
	cout << "Ready Queue: ";  
	for(int i = 1; i < ready_count; i++){
		queue[i].print_priority();
		cout << "->";
	}
	cout << "null" << endl;
	
	// 阻塞队列 
	cout << "Block Queue: ";  
	for(int i = ready_count; i < ready_count + block_count; i++){
		queue[i].print_priority();
		cout << "->";
	}
	cout << "null" << endl;

	// 完成队列 	
	cout << "End Queue: ";  
	for(int i = ready_count + block_count; i < queue.size(); i++){
		queue[i].print_priority();
		cout << "->";
	}
	cout << "null" << endl;
	
	cout << "=============================================================================================\n";
	print_colume();
	for(int i = 0; i < queue.size(); i++){
		//cout << index[i] << endl;
		queue[index[i]].print();
	}
	cout << "=============================================================================================\n";
} 
```

运行一个时间片：返回是否全部运行结束

```c
int run(){
	int flag = set_sequence();	
	update_index();
	print_table(flag);
	if(flag) { use(); slice_count++; }
	return flag;
}
```

主函数

```c
int main(){
	init();
	while(run()) {}
    return 0;
}
```

## 内存块分配 / 回收模拟

### 定义及初始化

定义结构体，使用双向链表链接内存块

```c
#include <iostream>
using namespace std;
#include <vector>
#include <map>
#include <set>
#include <stack>
#include <deque>
#include <string>
#include <algorithm>

#define SIZE 640

struct block{
	int id; // id 为 0 表示空闲 
	int begin;
	int end;
	int size;
	int state; // 1 表示已分配 
	block *pre;
	block *next;
	
	block(int id, int size){
		this->id = id;
		begin = 0;
		end = size;
		this->size = size;
		state = 0;
		next = NULL;
	}
	
	block(int id, int size, int begin, int end){
		this->id = id;
		this->size = size;
		this->begin = begin;
		this->end = end;
		state = 0;
		next = NULL;
	}
};
```

定义全局变量

```c
int c; // 操作轮次 
block* table; // 内存块表 
deque<pair<int, int> > work; // 工作序列 
```

初始化

```c
// 初始化内存块表以及工作表	
void init(){
	c = 0;
	table = new block(0,-1);
	table->state = -1;
	table->next = new block(0, SIZE);
	table->next->pre = table;
	work.push_back(make_pair(1,130));
	work.push_back(make_pair(2,60));
	work.push_back(make_pair(3,100));
	work.push_back(make_pair(2,-1));
	work.push_back(make_pair(4,200));
	work.push_back(make_pair(3,-1));
	work.push_back(make_pair(1,-1));
	work.push_back(make_pair(5,140));
	work.push_back(make_pair(6,60));
	work.push_back(make_pair(7,50));
	work.push_back(make_pair(6,-1));
}
```

### 链表操作

删除节点

```c
// 删除内存块指针 
void delete_spare(block* s){
	delete(s);
	s = NULL;
	delete(s);
}
```

合并两个节点：将后者合并到前者，删除后者

```c
// 合并两个内存区间 
void merge(block* s1, block* s2){
	// 扩大 s1 结束位置 
	s1->end = s2->end;
	// 扩容 s1 
	s1->size += s2->size;
	// 新链接s1，将s2剔除 
	s1->next = s2->next;	
	if(s2->next){ s2->next->pre = s1; }
	// 删除节点 s2 
	delete_spare(s2);
}
```

### 分配 / 释放

分配和释放节点

```c
// 为当前任务分配内存块 
void alloc(pair<int, int> cur){
	block* p = table;	
	// 遍历得到可分配的内存块 
	while(p != NULL){
		if(p->state == 0 && p->size >= cur.second){
			break;
		}
		p = p->next;
	}
	if(!p){
		cout << "无剩余空间，分配失败" << endl;
		return; 
	}
	
	// 将状态置为已分配 
	p->id = cur.first;
	p->state = 1;
	int size = p->size - cur.second;
	// 若无剩余空间，直接退出 
	if(size == 0){
		return;
	}
	// 已分配空间的结束位置 
	int end = p->begin + cur.second;
	// 将剩余空间作为空闲分区，创建新节点 
	block* spare = new block(0, size, end, p->end);
	
	// 缩小当前已分配空间大小 
	p->size = cur.second;
	// 重新规定已分配空间结束位置 
	p->end = end;
	
	// 将新的空闲分区链上
	// 先把新节点链上链表 
	spare->next = p->next;
	spare->pre = p;
	// 撤销旧链，链上新节点 
	p->next = spare;
	if(spare->next) { spare->next->pre = spare; }
} 

// 释放编号为 id 的内存块 
void free(int id){
	block* p = table;
	while(p->id != id){
		p = p->next;
	}
	// 将 id 和状态置零，表示可分配 
	p->state = 0;
	p->id = 0;
	// 若前驱也为空闲区间，合并 
	if(p->pre->state == 0) { merge(p->pre, p); }
	// 若后继也为空闲区间，合并 
	if(p->next && p->next->state == 0) { merge(p, p->next); }
}
```

### 最快适应算法

就是从前往后遍历，直接分配和释放

```c
// 最快适应算法 
void first_fit(){
	// 当工作序列不为空 
	while(!work.empty()){
		print_table();
		pair<int, int> cur = work.front();
		// 当为 -1，说明回收 
		if(cur.second == -1){
			free(cur.first);
		} else { // 分配新空间 
			alloc(cur);
		}
		work.pop_front();
		c++;
	}
	print_table();
}
```

### 最佳适应算法

按内存块大小从大到小排序空闲内存块，同时将已分配内存块放在链表末尾

```c
bool sort_block(block* s1, block* s2){
	if(s1->state != s2->state){
		return s1->state < s2->state; // 1 为已占用，优先级很低 
	}	
	return s1->size > s2->size;
}

void sort(){
	vector<block*> vec;
	block* p = table->next;
	while(p){
		vec.push_back(p);
		p = p->next;
	}
	sort(vec.begin(), vec.end(), sort_block);
	p = table;
	for(int i = 0; i < vec.size(); i++){
		p->next = vec[i];
		vec[i]->pre = p;
		p = p->next;
	}
	p->next = NULL;
}
```

最佳适应算法，就是在最快适应算法的基础上加了一条排序指令

```c
void best_fit(){
	// 当工作序列不为空 
	while(!work.empty()){
		sort();
		print_table();
		pair<int, int> cur = work.front();
		// 当为 -1，说明回收 
		if(cur.second == -1){
			free(cur.first);
		} else { // 分配新空间 
			alloc(cur);
		}
		work.pop_front();
		c++;
	}
	sort();
	print_table();
}
```

### 辅助功能及主函数

运行一整个工作序列，接收参数为算法选择

```c
void run(int algorithm){
	switch(algorithm){
		case 1: first_fit(); break;
		case 2: best_fit(); break;
		default: break;
	}
}
```

主函数

```c
int main(){
	init();
	cout << "请选择算法 (1 - 最快适应算法  or  2 - 最佳适应算法): ";
	int num;
	cin >> num;
	run(num); 
    return 0;
}
```

