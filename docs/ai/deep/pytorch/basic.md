---
title: PyTorch 基础
date: 2023-2-26
---

> 下载安装 pytorch：[pytorch.org](https://pytorch.org/get-started/locally/)

测试安装

```python
from __future__ import print_function
import torch
x = torch.rand(5, 3)
print(x)

import torch
print(torch.cuda.is_available())
```

## 张量 Tensor

### 定义

```python
from __future__ import print_function
import torch

empty_tensor = torch.empty(5,3)
print("empty_tensor:", empty_tensor)

rand_tensor = torch.rand(5,3)
print("rand_tensor:", rand_tensor)

zeros_tensor = torch.zeros(5,3)
print("zeros_tensor:", zeros_tensor)

ones_tensor = torch.ones(5,3)
print("ones_tensor:", ones_tensor)


tensor1 = torch.tensor([2.5, 3])
print("tensor1:", tensor1)

tensor2 = tensor1.new_ones(5, 3, dtype=torch.double)
print("tensor2:", tensor2)

tensor3 = torch.randn_like(tensor2, dtype=torch.float)
print("tensor3:", tensor3)

size = tensor3.size()
print("size:", size)
```

### 操作

矩阵加法

```python
from __future__ import print_function
import torch

tensor1 = torch.ones(5,3)
tensor2 = torch.rand(5,3)

print("tensor1:", tensor1)
print("tensor2:", tensor2)
print("tensor1 + tensor2 =", tensor1 + tensor2)

tensor3 = torch.empty(5,3)
torch.add(tensor1, tensor2, out=tensor3)
print("result = tensor1 + tensor2 =", tensor3)

tensor1.add_(tensor2)
print("tensor1 += tensor2 =", tensor1)
```

