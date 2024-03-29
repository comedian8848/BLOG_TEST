---
title: 多元函数积分学
date: 2023-3-16
---

## 重积分

### 二重积分

#### 二重积分定义

二重积分定义：以二元函数的定义域为底面，以函数值`z`构成的曲面为顶的曲顶柱体的体积，不管在什么坐标系下，一定要深谙这一原则进行积分

比较定理
$$
若(x,y)\in D,\,f(x,y)\leq g(x,y),\,则\iint_Df(x,y)d\sigma\leq \iint_Dg(x,y)d\sigma
$$
估值定理：其中`S`是定义域`D`的面积，`m,M`分别是`f`在`D`上的最小 / 最大函数值
$$
mS\leq \iint_Df(x,y)d\sigma \leq MS
$$
中值定理
$$
\exist(\xi,\eta)\in D\,,\,使\,f(\xi,\eta)\,S = \iint_Df(x,y)d\sigma
$$

#### 二重积分计算

> 直角坐标系

二重积分计算：我的理解就是，一个反常积分外加一个定积分，首先将切片（也就是面积）积分，然后对切片在某个方向上积分，得到体积

- 对于二重积分，在直角坐标系下，无非只有两种积法，一个横着积，一个竖着积

- 首先是积反常积分，其上下限由穿过的曲线决定，这个曲线仅由另一积分变量表示

  如，从下往上积分依次经过曲线`y=0`和`y+2x=3`，则反常积分的上下限为`0`和`3-2x`，其余复杂曲线同理

- 在具体情况下，积分的先后次序会决定积分的难易程度，要注意区别，当然更多是看经验

- 对于复杂的积分域，可采用分割的方法逐一积分再相加

在被积函数连续时，累次积分的顺序不改变其积分结果

> 极坐标系下积分

极坐标系下积分
$$
\iint_Df(x,y)dxdy = \iint_Df(rcos\theta, rsin\theta)rdrd\theta
$$
很显然，这里的转换涉及到很多，首先是一个积分上下限的转换，对于同样的一块面积`D`，需要用**角度**和**线段长度**进行表示

再就是积分对象的转换

- 在直角坐标系下，先对某一个方向上的切片进行高度积分，再垂直于这一方向积分得到体积

- 在极坐标系中，也是对切片进行积分，切片的底为线段长度`r`，高为函数值`f`，于是第一个反常积分的积分对象为`rf(x,y)`，对线段长度`r`进行积分

  然后再对这一切片在角度范围内“横扫”，得到体积

这一积分常适用于
$$
x^2+y^2\quad \frac{x^2}{a^2}+\frac{y^2}{b^2}
$$
等情况，可以有效简化积分

> 利用被积函数奇偶性进行积分

二重积分的奇偶性比一重要复杂，首先是一个被积域的对称，再是函数值的对称，为什么说是对称，因为要同时考虑关于`x`轴和关于`y`轴的奇偶

发挥一下空间想象力，对称的山和盆地

---

以下数二不做要求

三重积分

曲线积分

曲面积分

多元积分应用

散度与旋度



