---
title: 同步
date: 2022-10-24
tags:
  - OperatingSystem
---

> 同步和互斥，极重要的概念，参考 [JUC 编程](https://northboat-docs.netlify.app/dev/java/juc/lock.html)

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

- 不符合**空闲让进**（资源空闲，应接受任何一个请求）的规则：若 p1 不执行，即使资源空闲，p2 也不能进入临界区

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

如果 p0、p1 并发执行，若执行`while(flags[0])`后，下一条指令为`while(flags[1])`，在 p0 中尚未上锁，p1 将测试成功，进程 p0、p1 就会同时进入临界区，违反**忙则等待**（只能同时一个进程进入同一个资源临界区，其余等待）准则

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

若 p0、p1 并发执行，连续上锁，则会出现死锁，且实际上临界资源并未被占用，违反了**空闲让进和有限等待**（等待时间必须有限）准则

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

### 锁操作

解锁：锁变量设置为开启状态

加锁

- 流程：读取内存锁变量的值，已加锁返回失败信息，未加锁上锁后返回成功信息
- 问题：操作控制不当，可能导致多个进程均加锁成功
  - 单核状态下，并发进程，进程一读取内存锁变量后，发生中断，进程二也读取内存锁变量，均读到开锁，同时进入临界区
  - 多核状态下，并行执行，同时读取同一个锁变量，同时修改锁变量为上锁状态，均返回成功
- 常见解决方法
  - 单核环境：关中断；TS 指令读取内存锁变量值；读、判断、修改锁三个操作作为一个原子操作
  - 多核状态：swap 交换指令

### 锁类型

互斥锁：最基本的同步方式，用于保护临界区，保证任何时刻仅有一个进程执行临界区代码，各进程串行进入临界区，效率低

乐观锁：读直接进行，写前判断锁状态

悲观锁：操作数据就上锁

## 信号量

信号量（semaphore）是常用且有效的同步机制，由“信号量”和“PV操作”两部分组成，用于解决 n 个进程的临界区互斥使用、进程同步、实现前驱关系等

### 信号量类型

1、整型信号量：表示可用资源数量，除初始化之外，仅能通过以下两个原子操作读写

P 操作：wait(S)，对信号量进行减一操作

```c
void wait(semaphore S){
    while(s <= 0){}
    S = S-1;
}
```

V 操作：signal(S)，对信号量进行加一操作

```c
void(semaphore S){
    S = S+1;
}
```

缺点：wait 操作可能导致忙等；不遵循“让权等待”准则

让权等待：当进程无法进入临界区时，主动释放资源，放弃进入

2、记录型信号量：结构体，又一个整型变量 value 和一个进程链表 L 构成

value 大于 0，表示资源有 value 个；小于 0，说明阻塞队列中有 -value 个进程

定义

```c
typedef struct{
    int value;
    linkProcess L;
}semaphore;

semaphore S;
```

P 操作：sait(S)，减一

```c
void wait(semaphore S){
    S.value = S.value-1;
    // 小于 0 说明无空闲资源（原先最大 value 为 0，即无资源），将进程加入就绪队列，阻塞
    if(S.value < 0){
        block(S.L);
    }
}
```

V 操作：signal(S)，加一

```c
void signal(semaphore S){
    S.value = S.value+1;
    // 如果 value <= 0，说明原先 value 至多为 -1，队列中至少有一个等待进程，对其进行唤醒
    if(S.value <= 0){
        wakeup(S, L)
    }
}
```

特点：遵循让权等待策略；存在多个进程等待访问同一临界资源情况

3、AND 型信号量：可以处理多个并发进程共享多个临界资源的情况

4、信号量集：原子操作中对 S 的加减，一次可以进行多个数量，既表示一次加减资源的数量，也表示多种资源

### 信号量应用

实现进程互斥：为临界资源设置互斥信号量

```c
semaphore mutex = 1;
void P(semaphore S){
    while(1){
        // 互斥，则自我阻塞，等待
        wait(mutex);
        critical section; //临界区
        signal(mutex);
    }
}
```

实现进程同步：设 P1，P2并发执行，P1 消费 A，产生 B，P2 消费 B，产生 A

```c
int A = 0, B = n;
void P1(){
    wait(A);
    make_b();
    signal(B);
}

void P2(){
    wait(B);
    make_a();
    signal(A);
}
```

实现前驱关系：设 P1、P2 种有语句 S2、S2，希望在执行 S1 后再执行 S2

```c
semaphore S = 0;
void P1(){
    S1();
    signal(S);
}

void P2(){
    wait(S);
    S2();
}

void main(){
    P1();
    P2();
}
```

## 管程和条件变量

信号量机制是一种方便有效的同步机制，但存在不便之处

- 同步操作分散：同步操作分散于各个进程，各个进程使用自己独立的信号量
- 易读性差：是否正确需要分析整个系统或并发程序

为使同步机制更有效，采用面向对象思想，封装！用共享数据结构表示共享资源

### 管程

管程，将信号量及其操作原语封装在一个对象内部，一个管程定义了一个数据结构和并发进程在该数据结构上执行的一组操作（包括同步机制）

- 其实就相当于一个 JAVA 类，内部需要共享的资源使用 synchronized 修饰的函数对外提供接口，或使用 ReentrantLock 锁对各函数/资源进行相互制约，实现同步

管程属于 OS 内核的资源管理程序，被请求和释放资源的程序所调用，每次仅允许一个进程进入管程，执行管程内的过程，从而实现进程互斥

一个管程由以下几部分组成

- 管程名称
- 管程内的共享数据
- 一组操作过程
- 共享数据的初始化语句

管程的特点

- 进程对系统资源的使用通过管程间接进行
- 模块化：可单独编译
- 抽象化：既包含数据，也   包含过程
- 隐蔽性：数据只能由管程的过程访问，但过程可以由外部进程调用；管程内的数据和过程对外部透明

管程和进程的对比：程序和线程有待总结

| 管程                                     | 进程                                                       |
| ---------------------------------------- | ---------------------------------------------------------- |
| 公共数据结构，如消息队列                 | 私有数据结构 PCB                                           |
| 主要为同步操作和初始化操作               | 由顺序执行程序执行有关操作                                 |
| 主要解决共享资源的互斥使用               | 主要实现系统的并发性                                       |
| 被动工作                                 | 通过调用管程中的函数对共享数据结构实施操作，为主动工作方式 |
| 管程不能与其调用者并发执行               | 进程间能并发执行                                           |
| 操作系统的一个资源管理模块，以供进程调用 | 具有动态性，存在生命周期                                   |

### 条件变量

实现进程同步必须设置同步工具，如 wait() 和 signal()，即 PV 操作，在管程中，同样如此

并且由于管程封装了不止一种系统资源，当其中一种被某一进程占用，若不采用任何处理，使用管程中其他临界资源的进程将被拦在管程外，造成浪费

于是我们在管程内部维护一系列条件变量，每个条件变量有自己单独的一套 wait() / signal() 操作，外部进程发起请求时，找到到某个具体的临界资源，如 x，调用 x.wait() / x.signal() 对其进行同步，而 x 的 PV 操作对另一临界资源 y 不产生影响，如此在管程中封装并分隔不同的临界资源

## 经典同步问题

多道程序环境下，进程同步引起的一些列问题，常考大题

### 生产者 - 消费者问题

> 资源有限，对资源生产消耗的同步互斥

生产者和消费者

- 输入时：输入进程是生产者，计算进程是消费者
- 输出时：计算进程是生产者，输出进程是消费者

假设和信号量设置

- 假设：生产者 - 消费者共享有 n 个缓冲区的公共缓冲池
- 信号量设置
  - 互斥信号量：设置 mutex 信号量用于公共缓冲池的互斥使用
  - 同步信号量：设置 empty 表示空缓冲区个数；full 表示已占用缓冲区个数

规则

- 公共缓冲池不满，生产者可将消息放入缓冲池
- 缓冲池不空，消费者就可从缓冲池取出消息

实现方法

1、记录型信号量：结构体的记录形式（最常用）

```c
int in = 0, out = 0; // 公共变量，生产和消费 下一个 产品的存放的下标
message buffer[n], inM, outM; // 产品缓冲池、生产出的产品、使用掉的产品
semaphore mutex = 1, empty = n, full = 0; // 控制信息：互斥信号量和同步信号量

// 生产者
void procedurer(){
    do{
        inM = produce_message(); // 生产一个产品并赋值给 inM
        wait(empty); // empty>0 表示有空池
        wait(mutex); // mutex>0 表示有访权
        buffer[in] = inM; // 往缓冲池下标为 in 的位置加入产品 inM
        in = (in+1) % n; // 更新下标位置
        signal(mutex); // 释放控制权
        signal(full); // 令已占用缓冲区 +1
    }while(1);
}

void consumer(){
    do{
        wait(full); // full > 0 才可以取消息
        wait(mutex); // 检查访问权
        outM = buffer[out];
        out = (out+1) % n; // n 为缓冲池大小
        signal(mutex); // 释放访问权
        signal(empty); // 空缓冲 +1
        consume_message(outM); // 消费产品 outM
    }while(1);
}

void main(){
    procedurer();
    consumer();
}
```

注意：wait() 的顺序不能颠倒，即必须先同步，再互斥，先检查是否有资源，再占用访问权。如果先占用了访问权，如果没有资源，就会忙等，白白占用访问权，不管其余进程是否有资源，都无法消费，有可能导致死锁

2、信号量集：使用 AND 信号量解决问题 —— AND 信号量可以一次处理多个并发进程共享多个临界资源的情况

- Swait(empty, mutex) 代替 wait(empty) 和 wait(mutex)，Swait(full, mutex) 代替 wait(full) 和 wait(mutex)
- Ssignal(empty, mutex) 代替  signal(empty) 和 signal(mutex)，Ssignal(full, mutex) 代替 signal(full) 和 signal(mutex)

```c
int in = 0, out = 0; // 公共变量，生产和消费 下一个 产品的存放的下标
message buffer[n], inM, outM; // 产品缓冲池、生产出的产品、使用掉的产品
semaphore mutex = 1, empty = n, full = 0; // 控制信息：互斥信号量和同步信号量

// 生产者
void procedurer(){
    do{
        inM = produce_message(); // 生产一个产品并赋值给 inM
        Swait(full, mutex) // 检查缓冲池是否满，是否有访权
        buffer[in] = inM; // 往缓冲池下标为 in 的位置加入产品 inM
        in = (in+1) % n; // 更新下标位置
        Ssignal(full, mutex) // 已占有+1，释放访权
    }while(1);
}

void consumer(){
    do{
        Swait(empty, mutex) // 检查缓冲池是否空，是否有访权
        outM = buffer[out];
        out = (out+1) % n; // n 为缓冲池大小
        Swait(empty, mutex) // 消费一个产品-1，释放访权
        consume_message(outM); // 消费产品 outM
    }while(1);
}

void main(){
    procedurer();
    consumer();
}
```

就是把`wait(full/empty)`和`wait(mutex)`访权封装了一下，同理封装了`signal(full/empty)`和`signal(mutex)`

但注意这里封装之后，是先判断再阻塞，即先判断`full/empty`以及`mutex`之后，选择性进入`while`循环等待

3、管程：建立名为 PC 的管程，包含 put 和 get 两个进程用于存取产品，用 count 记录缓冲池中产品数量，用条件变量 condition 记录当前缓冲池的状态（满、空），当调用 Cwait() 阻塞后，进入 condition 的阻塞队列，Csignal() 可唤醒由 Cwait() 阻塞的进程（阻塞队列为空则不用唤醒）

```c
class PC{
private:
    int in = 0, out = 0, count = 0;
    message buffer[n], inM, outM;
    condition notFull, notEmpty;
	semaphore mutex = 1, empty = n, full = 0;
public:
    void put(message m){
        if(count >= n){ // 当缓冲池已占用已满，n 为缓冲池大小
            Cwait(notFull); // 等待不满
        }
        buffer[in] = M;
        in = (in+1) % n;
        count++;
        Csignal(notEmpty); // 放入了一个产品，缓冲池不为空，主动唤醒 Cwait(notEmpty)
    }
    void get(message m){
        if(count <= 0){
            Cwait(notEmpty);
        }
        m = buffer[out];
        out = (out+1) % n;
        count--;
        Csignal(notFull); // 消费了一个产品，缓冲池不满，唤醒 Cwait(notFull)
    }
};

void producer(){
    message inM;
    do{
        inM = produce_message();
        PC.put(inM);
    }while(1);
}

void consumer(){
    message outM;
    do{
        PC.get(outM);
        // 消费产品 outM
    }while(1);
}

void main(){
    producer();
    consumer();
}
```

### 哲学家进餐问题

> 资源固定，对资源使用权的同步互斥

五个哲学家共用一张**圆桌**，左右手各一只筷子，吃饭时需要左右手各拿一只筷子，思考时放下筷子

- 筷子的数量是有限的，共 5 根，不能满足所有哲学家共同进餐，需要互斥限制

信号量设置

```c
semaphore chopStick[5] = {1,1,1,1,1};
void philosopher_i(){
    do{
        wait(chopStick[i]); // 等待左手边筷子并获取使用权，chopStick[i] 由 1变为 0
        wait(chopStick[(i+1)%5]); // 右手边筷子
        // eat
        signal(chopStick[i]); // 归还筷子
        signal(chopStick[(i+1)%5]);
        // think
    }while(1);
}

void main(){
    philosopher_1();
    philosopher_2();
    philosopher_3();
    philosopher_4();
    philosopher_5();
}
```

思考这样一个情况，当五个进程并发（五个哲学家同时在餐桌上），按顺序执行五条命令，均为占用左手边筷子，均会成功，但都会卡在占用右手边筷子的语句，产生死锁

解决办法一：最多只允许 4 位哲学家同时拿左边筷子，对“左手边筷子数量”设置互斥

```c
semaphore chopStick[5] = {1,1,1,1,1}, maxNum = 4;
void philosopher_i(){
    do{
        wait(maxNum); // 检查是否有 4 位哲学家拿起了左手筷子
        wait(chopStick[i]); // 等待左手边筷子并获取使用权，chopStick[i] 由 1变为 0
        wait(chopStick[(i+1)%5]); // 右手边筷子
        // eat
        signal(chopStick[i]); // 归还筷子
        signal(chopStick[(i+1)%5]);
        signal(maxNum);
        // think
    }while(1);
}

void main(){
    philosopher_1();
    philosopher_2();
    philosopher_3();
    philosopher_4();
    philosopher_5();
}
```

解决办法二：奇数个哲学家拿左手边筷子，偶数个哲学家拿右手边筷子

```c
semaphore chopStick[5] = {1,1,1,1,1};
void philosopher_i(){
    do{
        if(i % 2 == 0){
            wait(chopStick[(i+1)%5]); // 先拿右手筷子
        	wait(chopStick[i]); // 再拿左手筷子
        } else {
        	wait(chopStick[i]); // 先拿左手筷子
        	wait(chopStick[(i+1)%5]); // 再拿右手筷子
        }

        // eat
        signal(chopStick[i]); // 归还筷子
        signal(chopStick[(i+1)%5]);
        // think
    }while(1);
}

void main(){
    philosopher_1();
    philosopher_2();
    philosopher_3();
    philosopher_4();
    philosopher_5();
}
```

### 读者 - 写者问题

> 共用存储区资源，对内容读写的同步互斥

用信号量实现对共用存储区读写的同步互斥

- 写时不能再写，且不能读
- 读时不能写，但可再读

```c
int readCount = 0; // 记录当前读者数量
semaphore rMutex = 1, wMutex = 1; // 读写信号量

// 读者
void reader(){
    do{
        wait(rMutex); // 拿取进入权限，避免 readCount 的加一操作混乱
        // 如果是第一个读者，要剥夺写权限，若剥夺不了，就等待
        // 如果不是第一个读者，说明有读者在进行读操作，自然不用判断是否有人在写（肯定有人在读）
        if(readCount == 0){
            wait(wMutex);
        }
        readCount++;
        signal(rMutex); // 归还进入权限，允许其他读者进入
        // ... read ... //
        wait(rMutex); // 拿取退出权限
        readCount--;
        signal(rMutex); // 归还退出权限
        // 当 readCount == 0，说明没有读者，唤醒写进程，若无请求则不操作
        if(readCount == 0){
            signal(wMutex);
        }
    }while(1);
}

void writer(){
    do{
        wait(wMutex); // 拿取写权限
        // ... write ... //
        signal(wMutex); // 归还写权限
    }while(1);
}

void main(){
    reader();
    writer();
}
```

为什么明明可以多个进程同时“读”，reader 在最开始和最后还得判断一次 rMutex？因为“读”和“进出”不是一个概念，同一时刻（并行）只允许一个进程“进出”读区域，进入之后立马将“进入”权限返回，开始“读”，此时另一个读进程就可以拿取进入权限也开始“读”，rMutex 实际上是”进出“读临界区的信号量

为什么要这么做？因为在进出时要对 readCount 进行 +1 / -1 操作，这一操作并没有原子性，必须要加一层锁，防止 readCount 因为多进程并发产生混乱

这样会有一个问题，就是这种模式下，读优先，写操作处于绝对的弱势 —— 即使当前读操作完毕，写也不一定能执行，因为这里必须完成一批读操作，直到 readCount == 0 时才会归还写权限

解决办法：增加一个公共信号量 mutex，真有区别吗但是？

```c
int readCount = 0;
semaphore rMutex = 1, wMutex = 1, mutex = 1;

// 读者
void reader(){
    do{
        wait(mutex); // 拿取公共权限
        wait(rMutex); // 拿取读进入权限
        if(readCount == 0){
            wait(wMutex); // 剥夺写权限
        }
        readCount++;
        signal(rMutex); // 归还读进入权限
        signal(mutex); // 归还公共权限
        // ... read ... //
        wait(rMutex); // 拿取读退出权限
        readCount--;
        signal(rMutex); // 归还读退出权限
        if(readCount == 0){
            signal(wMutex); // 唤醒写权限
        }
    }while(1);
}

void writer(){
    do{
        wait(mutex); // 拿取公共权限
        wait(wMutex); // 拿取写权限
        // ... write ... //
        signal(wMutex); // 归还写权限
        signal(mutex); // 归还公共权限
    }while(1);
}

void main(){
    reader();
    writer();
}
```

栗题：一个生产者，两个消费者，生产者负责生产整数，消费者一消费奇数，消费者二消费偶数，利用信号量机制实现 3 个进程的同步与互斥，并用 countOdd() 和 countEven() 函数记录消费的奇偶数个数

- odd：奇数个数
- even：偶数个数
- empty：空缓冲区个数
- mutex：访问权限信号量

```c
semaphore mutex = 1, empty = n, odd = 0, even = 0; // 缓冲区最大值为 n

void P1(){
    do{
        wait(empty); // 检查是否有空缓冲区
        wait(mutex); // 拿取访问权限
        int x = produce();
        put(x); // 将 x 放入缓冲区
        // 增加奇偶数信号量
        if(x % 2 == 0){
            signal(even);
        } else {
            signal(odd);
        }
        signal(mutex);
    }while(1);
}

void P2(){
    do{
        wait(odd);
        wait(mutex);
        getOdd(); // 从缓冲区拿取奇数
        signal(empty); // 空缓冲 +1
        signal(mutex); // 归还控制权
        countOdd();
    }while(1);
}

void P3(){
    do{
        wait(even);
        wait(mutex);
        getEven(); // 从缓冲区拿取奇数
        signal(empty); // 空缓冲 +1
        signal(mutex); // 归还控制权
        countEven();
    }while(1);
}
```

这里的缓冲区可以设计为一个二维数组，其中`buffer[i][0]`存储数据，`buffer[i][1]`标记该位是否有数据（是否为空，1 表示非空），缓冲区大小为 n

```c
vector<vector<int>> buffer(n, vector<int>(2));
```

