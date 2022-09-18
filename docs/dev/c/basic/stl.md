---
title: C++ STL
date: 2022-9-17
tags:
  - C/C++
---

## 接口

### map

- 通过 m[i] = j 插入键值对

- 通过 if(m.count(i)) 判断键 i 是否存，因为只有 1/0

- 遍历

  ~~~c
  for(iter = _map.begin(); iter != _map.end(); iter++) {
      cout << iter->first << " : " << iter->second << endl;
  }

### set

- 通过 insert() 函数插入值
- 通过 count() 判断是否存在

### vector

- push_back() 向后插入

## 错误示例

~~~c
if(m[5] == NULL){
    m[5] = 1;
}
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

