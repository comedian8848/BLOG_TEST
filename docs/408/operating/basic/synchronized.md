---
title: 同步
date: 2022-10-24
tags:
  - OperatingSystem
---

> 同步和互斥，极重要的概念，参考 JUC 编程

## 同步和互斥的概念

并发是操作系统的基本特征，引入进程/线程使多道程序可以并发，同时带来很复杂的运行环境，各进程之间既同步（合作实现作业），又互斥（资源占用），为了保证多个进程有条不紊工作，引入**同步机制**

各种进程之间相互制约，使并发执行的诸进程能够有效的共享资源和相互合作

- 直接制约：由进程合作引起
- 间接制约：由资源共享引起

互斥和同步是**协调进程执行顺序**的常见方式，均属于低级通信，设计数据量极少

特点：效率低；对用户不透明

### 基本概念

临界资源：一次仅允许一个进程访问的资源，如**打印机、公共变量（全局变量）**，需要互斥访问

临界区：一段代码，访问临界资源的代码段。进入临界区需要加锁，出临界区解锁

互斥：A 访问，其余不能访问

同步：必须等 A、C 执行完毕后，B 才能开始执行

同步机制：实现进程同步/互斥的方法

**同步机制应该遵循的准则**

- 空闲让进：临界区无进程，允许一个请求者执行临界区代码
- 忙则等待：临界区有进程，其余欲进入者需等待
- 有限等待：等待进入临界区的进程，其等待时间必须有限，避免饥饿
- 让权等待：进程无法进入临界区，应立即释放处理机资源

### 硬件实现同步互斥

1、中断：实现互斥最简单的硬件方法

- 关中断：防止之后流程被打断
- 锁测试：锁空闲则上锁，否则继续测试（死循环）
- 进入临界区：执行代码
- 开锁
- 开中断

缺点

- 滥关中断可能导致严重后果
- 长时间关中断限制处理器交叉执行程序的能力
- 多核 CPU 下，在一个处理器上关中断，并不能防止其他处理器访问临界资源

2、TS 指令：借助硬件测试实现互斥

```c
int TS(int *lock){
    int old = *lock;
    *lock = true; // 令临界资源 lock 为 true，上锁
    return old; // 返回上一个 lock 状态
}
```

为每个临界资源设置布尔变量 lock，初值为 false，表示空闲

```c
do{
    while(TS(&lock)) {} // 测试，当 lock 为 true，死循环等待
    critical section; // 临界区
    lock = false; // 解锁
}while(true);
```

等待期间不断测试，始终占用 CPU，不满足让权等待的同步准则

3、swap 指令：对换指令，交换两个 lock 和 key 布尔值的内容，lock 是表示临界资源是否被占用的全局变量，key 为 true

```c
void swap(int *lock, int *key){
    int t = *key;
    *lock = *key;
    *key = t;
}
```

只有当 key 的值被交换成 false，才能进入临界区

```c
do{
    key = true;
    do{
        swap(&lock, &key);
    }while(key != false); // 只有当 lock 的值为 false，交换到 key 时，key 为 false，退出 while 循环
    critical section; // 临界区
    lock = false; // 解锁
}while(true);
```

TS 和 SWAP 的缺点：若临界资源繁忙，其余欲访问的临界区进程只能不断测试，处于**忙等状态**，白白占用 CPU 资源，且无法处理复杂的同步问题

### 软件实现同步互斥

> 一定要会推导并发进程的执行过程，发现同步问题

1、单标志：适用一个全局变量 flag 标记一个临界资源，只有 flag 满足当前进程的规定，才能进入临界区，否则等待

```c
int flag = 1;

//进程 p1
void p1(){
    do{
        while(flag != 1){
            critical section;
            flag = 2;
        }
    }while(1);
}

//进程p2
void p2(){
    do{
        while(flag != 2) {}
        critical section;
        flag = 1;
    }while(1);
}
```

只有当进程 p1 执行完毕后，将 flag 赋值为 2，进程 p2 才能进入临界区；同理，只有当 p2 结束后，将 flag 赋值为 1，p1 才能进入临界区

- 不符合**空闲让进**的规则：若 p1 不执行，即使资源空闲，p2 也不能进入临界区

2、多标志、先测试：适用一组全局标记对临界资源上锁，每个标记对应一个进程，只有当所有标记均为 false 时，当前进程才能进入临界区

```c
bool flags[] = {false, false};

//进程 p0
void p0(){
    while(flags[1]){} // 测试进程p1是否占用临界资源
    flags[0] = true; // 上锁
    critical section;
    flags[0] = false; // 解锁
}

//进程 p1
void p1(){
    while(flags[0]){} // 测试进程p0是否占用临界资源
    flags[1] = true; // 上锁
    critical section;
    flags[1] = false; // 解锁
}
```

如果 p0、p1 并发执行，若执行`while(flags[0])`后，下一条指令为`while(flags[1])`，在 p0 中尚未上锁，p1 将测试成功，进程 p0、p1 就会同时进入临界区，违反**忙则等待**准则

3、多标志、后测试

```c
bool flags[] = {false, false};

//进程 p0
void p0(){
    flags[0] = true; // 先上锁
    while(flags[1]){} // 测试进程p1是否占用临界资源
    critical section;
    flags[0] = false; // 解锁
}

//进程 p1
void p1(){
    flags[1] = true; // 先上锁
    while(flags[0]){} // 测试进程p0是否占用临界资源
    critical section;
    flags[1] = false; // 解锁
}
```

若 p0、p1 并发执行，连续上锁，则会出现死锁，且实际上临界资源并未被占用，违反了**空闲让进和有限等待**准则

4、Peterson 算法：在多标志、后测试的基础上再加入一个单标志 turn，当 pi 进程欲进入临界区时，令`flags[i] = true; turn = j`，其中 i 不等于 j，等待条件为`while(flags[j] && turn==j)`

```c
bool flags[] = {false, false};
int turn = 0;

//进程 p0
void p0(){
    flags[0] = true, turn = 1;; // 当前进程上锁
    while(flags[1] && turn == 1){} // 测试进程p1是否占用临界资源
    critical section;
    flags[0] = false; // 解锁
}

//进程 p1
void p1(){
    flags[1] = true, turn = 0;; // 当前进程上锁
    // 测试进程p0是否占用临界资源
    // 测试并发执行时，turn = 0 和等待语句
    while(flags[0] && turn == 0){}
    critical section;
    flags[1] = false; // 解锁
}
```

先上锁的进程一定会先进入临界区，假设第 i 进程最先上锁

- 首先因为先上锁，`flags[i] = true`，其余任意进程的条件一（flags[i]）都会卡住
- 上锁后，只有两种可能，一种是执行 i 进程的测试等待语句，另一种是执行其他进程的上锁语句
  - 若直接执行等待语句，这时其他进程还尚未标记 flags，while 条件不成立，跳过 while，进入临界区
    - 其他进程再上锁，进行测试循环，条件一（flags）和条件二（turn）都会符合，死循环直到 flags[i] 为 false
  - 若执行其他进程的上锁语句，会标记上 flags，但 turn 会被重新赋值为另一值，进程 i 测试语句的条件二将不符合，同样会跳过 while 语句，进入临界区
    - 而其余进程由于条件一（flags）和条件二（自己设的 turn）均满足，将会卡死在测试语句，直到 flags[i] 为 false

完美满足同步的四个准则

## 锁

> 了解

锁是一种同步机制，限制任意时刻只有一个进程进入临界区

### 操作

解锁：锁变量设置为开启状态

加锁

- 流程：读取内存锁变量的值，已加锁返回失败信息，未加锁上锁后返回成功信息
- 问题：操作控制不当，可能导致多个进程均加锁成功
- 常见解决方法：单核环境（关中断）

### 锁类型
